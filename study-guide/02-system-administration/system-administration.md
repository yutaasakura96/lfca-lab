# System Administration

System Administration is the core competency of System Administration Fundamentals — accounts,
permissions, processes, services, packages, filesystems, scheduling, logs, and boot — and that
domain is 30% of the exam, 1st largest of 6 domains, on the current (2025-09-16) blueprint. The
2025 update did not introduce this competency: its status is reworded. LFS200 reaches only part
of it: of 71 concepts, 9 are FULLY COVERED, 5 PARTIALLY COVERED and 5 MENTIONED ONLY, with 52 NOT
COVERED — 19/71 (27%) that LFS200 touches at all, not deeply
(`research/lfs200-notes/00-course-map.md`). Everything below is written for discrimination: for
each topic, what it is *not* is as load-bearing as what it is.

<a id="s-system-administration-users-and-groups"></a>
## Users and groups

<a id="c-sysadmin.system-administration.user-account"></a>
### User account
*id: `sysadmin.system-administration.user-account` · depth 3 · importance 4 · LFS200: MENTIONED ONLY · sources: man-passwd-5, man-credentials-7*

**What it is** A named identity the system uses to decide what a person or a service may do. The
name is a human convenience recorded in `/etc/passwd`; the numeric UID beside it is what the
kernel actually stores on every file and every process and checks on every access. An account is
not a person and not a login session: it is a row in the account database plus the UID that row
binds to a name.

**Why it matters** Almost every permission, ownership, and privilege question on this exam
resolves to "which identity is this running as," and the answer is always a number. A candidate
who thinks in names will get the file-ownership and account-deletion scenarios wrong, because
the kernel never sees the name.

**How it works** `useradd` writes a new row into `/etc/passwd` and a matching row into
`/etc/shadow`, allocating the next free UID above the `UID_MIN` set in `/etc/login.defs`
(commonly 1000). Whether a home directory is created depends on `-m` and on the `CREATE_HOME`
setting, which is why Debian-family systems usually need `useradd -m` while Red Hat-family
systems create it by default; Debian additionally ships the higher-level interactive `adduser`
wrapper. `usermod` edits an existing row in place. `userdel` removes the row, and only removes
the home directory when given `-r`.

**Key terms** UID; `/etc/login.defs`; `UID_MIN`; account database.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `useradd` | Create an account | `-m` create home, `-s` login shell, `-u` explicit UID, `-r` system account, `-G` supplementary groups | `useradd -m -s /bin/bash alice` | Assuming a home directory is always created — without `-m` (and without `CREATE_HOME`) the account exists with a home path recorded that does not exist on disk |
| `usermod` | Modify an existing account | `-l` new login name, `-d` home, `-s` shell, `-L`/`-U` lock/unlock, `-aG` append groups | `usermod -s /usr/sbin/nologin deploy` | Using `usermod -G` without `-a`, which replaces the entire supplementary group list rather than adding to it |
| `userdel` | Delete an account | `-r` also remove the home directory and mail spool | `userdel -r alice` | Running plain `userdel` and leaving a home directory owned by a now-unassigned numeric UID |
| `id` | Print the UID, primary GID, and all group memberships of an account | `-u` UID only, `-g` primary GID, `-G` all GIDs, `-n` show names | `id alice` | Reading `id` as "who am I logged in as" — with a username argument it reports that account, not the caller |
| `whoami` | Print the username of the current effective UID | (no options needed) | `whoami` | Expecting `whoami` to report the original login name after `sudo` — it reports the *effective* identity, so under `sudo` it prints `root` |

**Traps** Renaming an account with `usermod -l` does not touch a single file: file ownership is
recorded as a UID, and the UID does not change, so ownership follows automatically and nothing
needs re-chowning. The mirror image is the real hazard — deleting an account leaves its files
owned by a numeric UID with no name, and the next account created can be allocated that same UID
and silently inherit every one of those files.

**What the exam may test** Choosing between `useradd`, `usermod`, and `userdel` for a stated
need; knowing that `-r` is what deletes a home directory; and distinguishing `whoami` (effective
identity now) from `id` (full credential picture, for any named account).

*Not to be confused with [group](system-administration.md#cmp-sysadmin.system-administration.group).*
*Not to be confused with [service account](system-administration.md#cmp-sysadmin.system-administration.service-account).*
*Not to be confused with [UID and GID](system-administration.md#cmp-sysadmin.system-administration.uid-and-gid).*

<a id="c-sysadmin.system-administration.group"></a>
### Group
*id: `sysadmin.system-administration.group` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man-group-5, man-credentials-7*

**What it is** A named collection of users with its own numeric GID, so that a permission can be
granted once to a group instead of repeated per account. A group is not a role and not a
privilege level: it grants nothing by itself. It becomes meaningful only when a file's group
class, a `sudoers` rule, or a device node names it.

**Why it matters** Group membership is the standard answer to "how do several people share write
access to one directory without making it world-writable," and it is the mechanism behind the
`wheel`/`sudo` administrative groups the exam likes to reference. Getting membership management
wrong is also the single most destructive routine mistake in this competency.

**How it works** `groupadd` creates a row in `/etc/group`; `groupdel` removes it, and refuses if
the group is still some user's primary group. Membership is recorded in two different places: a
user's *primary* group lives in the fourth field of their `/etc/passwd` row, while *supplementary*
membership lives in the comma-separated member list of the `/etc/group` row. `groups` prints the
names a user belongs to across both.

**Key terms** GID; supplementary membership; `/etc/group`; primary group.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `groupadd` | Create a group | `-g` explicit GID, `-r` system group | `groupadd -r deploy` | Assuming creating a group grants anything — it grants nothing until something references the GID |
| `groupdel` | Delete a group | (no options needed) | `groupdel deploy` | Expecting it to succeed while the group is still a user's primary group; it refuses |
| `groups` | Print the groups a user belongs to | (username optional) | `groups alice` | Running it immediately after adding a membership and believing nothing happened — an existing session's credentials are fixed at login and do not update |
| `usermod -aG` | Append supplementary group membership | `-a` must accompany `-G`; comma-separated list, no spaces | `usermod -aG docker alice` | Writing `usermod -G docker alice` — without `-a` this replaces every supplementary group the user had |

**Traps** Group membership is baked into a process's credential set when the session starts. Add
a user to a group and their currently-open shell still does not have it; they must log out and
back in (or start a new session) before `id` reflects it. A question describing "I added them to
the group but they still get permission denied" is usually testing this, not a permissions error.

**What the exam may test** The `-aG` versus `-G` distinction; where primary and supplementary
membership are each recorded; and why a newly granted membership does not take effect in an
existing session.

*Not to be confused with [primary vs supplementary group](system-administration.md#cmp-sysadmin.system-administration.primary-vs-supplementary-group).*

<a id="cmp-sysadmin.system-administration.group"></a>
#### Not to be confused with: Group vs User account
*compares: `sysadmin.system-administration.group`, `sysadmin.system-administration.user-account`*

| | Group | User account |
| --- | --- | --- |
| What it names | A collection identified by a GID | An identity identified by a UID |
| Can own a file | Yes — the file's group class | Yes — the file's owner class |
| Can log in | No — a group is never an authentication subject | Yes, if it has a usable shell and password |
| Recorded in | `/etc/group` (plus the primary GID in `/etc/passwd`) | `/etc/passwd` and `/etc/shadow` |
| Created by | `groupadd` | `useradd` |

The separating axis is whether the thing can authenticate: a user account is something the system
logs in and runs processes as; a group is only ever a label those processes carry so that
permissions can be granted to many accounts at once.

<a id="c-sysadmin.system-administration.uid-and-gid"></a>
### UID and GID
*id: `sysadmin.system-administration.uid-and-gid` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man-credentials-7, man-passwd-5*

**What it is** The numeric user and group identifiers the kernel stores and checks. Usernames and
group names exist only for humans and for the tools that translate them; every ownership field in
an inode and every credential on a process is a number. UID 0 is root, and it is the *number*,
not the string `root`, that confers the privilege.

**Why it matters** This is the fact that makes several other topics behave the way they do: why
renaming a user does not orphan their files, why deleting a user can hand their files to a
stranger, why a UID 0 account called anything at all is still root, and why the same UID means
different people on two machines that were provisioned independently.

**How it works** `credentials(7)` describes a process as carrying real, effective, and saved
set-user-IDs (and the group equivalents), plus a supplementary group list. Permission checks use
the *effective* IDs; the real ID records who started the process. Conventionally UIDs below
`UID_MIN` (typically 1000) are reserved for the system, and 65534 is `nobody`, but those are
distribution conventions enforced by `useradd`, not by the kernel — only 0 is special to the
kernel.

**Key terms** real vs effective UID; `UID_MIN`; UID 0; supplementary group list.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `id` | Show the numeric credentials of an account or the caller | `-u` effective UID, `-ru` real UID, `-G` all GIDs, `-n` names instead of numbers | `id -u` | Reading `id -u` under `sudo` as the invoking user — it prints 0, because the effective UID is now root's |

**Traps** Creating a second account whose UID is 0 makes it fully root, regardless of its name;
"root" is a convention for the name of UID 0, not the source of the privilege. Equally, two
systems that each created `alice` locally can have given her different UIDs, so an archive or an
NFS export copied between them can appear to be owned by an unrelated account — the name matched,
the number did not.

**What the exam may test** That UID 0 defines privilege; that ownership is stored numerically;
and reading `id` output to separate the primary GID from the supplementary group list.

<a id="cmp-sysadmin.system-administration.uid-and-gid"></a>
#### Not to be confused with: UID and GID vs User account
*compares: `sysadmin.system-administration.uid-and-gid`, `sysadmin.system-administration.user-account`*

| | UID and GID | User account |
| --- | --- | --- |
| What it is | The numeric identifier the kernel enforces on | The named database entry a human administers |
| Where it is stored | In inodes, in process credentials, in archives | In `/etc/passwd`, `/etc/shadow`, `/etc/group` |
| Survives a rename | Yes — unchanged, so file ownership follows | The name changes; nothing else does |
| Survives account deletion | Yes — files keep the bare number | No — the row is gone |
| What confers root | Being UID 0 | Nothing about the name, including being called `root` |

The separating axis is who the identifier is for: the account is the human-facing record, the
UID/GID pair is the machine-facing identity, and every enforcement decision is made on the
number.

<a id="c-sysadmin.system-administration.primary-vs-supplementary-group"></a>
### Primary vs supplementary group
*id: `sysadmin.system-administration.primary-vs-supplementary-group` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man-credentials-7, man-group-5, man-inode-7*

**What it is** Every user has exactly one primary group — the GID recorded in the fourth field of
their `/etc/passwd` row — and any number of supplementary groups listed against them in
`/etc/group`. Both are checked for access. Only the primary group is applied as the owning group
of a file the user creates.

**Why it matters** This asymmetry is the whole topic. Adding someone to a shared project group
lets them *read and write* existing files immediately (after re-login), but files they create
still come out owned by their own primary group, so the next teammate cannot write to them. That
is the failure the SGID bit on a directory exists to fix.

**How it works** At login, the system sets the process's effective GID from the primary group and
loads the supplementary group list from `/etc/group`. A permission check consults the effective
GID and the supplementary list together. File creation consults only the effective GID — unless
the parent directory carries SGID, in which case the new file inherits the directory's group
instead.

**Key terms** effective GID; supplementary list; group inheritance; SGID directory.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `id` | Show primary GID separately from the supplementary list | `-g` primary GID only, `-G` every GID | `id -gn alice` | Reading the first entry of `id -G` output as "the primary group" — use `-g`, which reports it unambiguously |
| `groups` | List every group name, primary and supplementary together | (username optional) | `groups` | Using it to answer "which group will their new files belong to" — it does not distinguish primary from supplementary |
| `usermod -g` | Change the primary group | Takes one group name or GID | `usermod -g developers alice` | Confusing lowercase `-g` (primary) with uppercase `-G` (supplementary) — they edit different fields in different files |
| `usermod -aG` | Add supplementary groups, keeping existing ones | `-a` is only valid with `-G` | `usermod -aG developers,docker alice` | Omitting `-a`, which silently drops every supplementary group not named on the command line |

**Traps** `usermod -G` without `-a` replaces the entire supplementary list. Run
`usermod -G docker alice` on a user who was in `sudo`, `adm`, and `developers` and they are now in
`docker` and nothing else — no warning, no confirmation. This is the destructive classic of the
whole competency. The second trap is the case-sensitivity of `-g` versus `-G`: they are not
variants of the same option.

**What the exam may test** Which group a newly created file belongs to; the `-g`/`-G`/`-aG`
distinction; and recognising the shared-directory scenario where SGID, not group membership, is
the missing piece.

<a id="cmp-sysadmin.system-administration.primary-vs-supplementary-group"></a>
#### Not to be confused with: Primary vs supplementary group vs Group
*compares: `sysadmin.system-administration.primary-vs-supplementary-group`, `sysadmin.system-administration.group`*

| | Primary vs supplementary group | Group |
| --- | --- | --- |
| What it names | The two *kinds* of membership a user holds | The named GID collection itself |
| How many per user | Exactly one primary; any number of supplementary | A group has any number of members |
| Recorded where | Primary in `/etc/passwd` field 4; supplementary in `/etc/group` field 4 | The group's own row in `/etc/group` |
| Effect on a newly created file | Only the primary group is applied | None by itself |
| Changed with | `usermod -g` versus `usermod -aG` | `groupadd` / `groupdel` |

The separating axis is that "group" is the object and "primary versus supplementary" is the kind
of link between a user and that object — and only the primary link decides what group a new file
gets.

<a id="c-sysadmin.system-administration.etc-passwd"></a>
### /etc/passwd
*id: `sysadmin.system-administration.etc-passwd` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man-passwd-5*

**What it is** The world-readable account database. Seven colon-separated fields per line, in
order: username, password placeholder, UID, primary GID, comment/GECOS, home directory, login
shell. Despite the file's name it holds no passwords — the placeholder `x` means "the hash is in
`/etc/shadow`."

**Why it matters** The field count and their order are direct recall items, and the placeholder is
exactly the field candidates forget when counting to seven. The file's world-readability is also
the reason `/etc/shadow` exists at all: every process on the system needs to map UIDs to names,
so the mapping cannot be secret, so the hashes had to move.

**How it works** Any process can read `/etc/passwd`; only root can write it. `getent passwd`
queries the whole Name Service Switch stack rather than the file alone, so on a system joined to
LDAP or Active Directory it returns network accounts that `grep` over the file would miss. An
empty second field means no password is required — a serious misconfiguration, not merely an
unusual one.

**Key terms** GECOS; placeholder `x`; NSS; seven fields.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `getent passwd` | Look up account entries through NSS, not just the local file | Append a username or UID to query one entry | `getent passwd alice` | Using `grep alice /etc/passwd` instead and concluding a directory-service account does not exist |

**Traps** Counting the fields as six by forgetting the password placeholder is the standard error.
The other is assuming world-readable means harmless to edit: it is readable by everyone and
writable by root only, and a malformed line can lock accounts out.

**What the exam may test** Naming the seventh field (login shell) or the fourth (primary GID) from
a sample line; explaining what `x` means; and choosing `getent` over reading the file directly.

*Not to be confused with [/etc/group](system-administration.md#cmp-sysadmin.system-administration.etc-group).*

<a id="cmp-sysadmin.system-administration.etc-passwd"></a>
#### Not to be confused with: /etc/passwd vs /etc/shadow
*compares: `sysadmin.system-administration.etc-passwd`, `sysadmin.system-administration.etc-shadow`*

| | /etc/passwd | /etc/shadow |
| --- | --- | --- |
| Fields | 7 | 9 |
| Holds password hashes | No — only the placeholder `x` | Yes |
| Readable by | Everyone | Debian-family: root and the `shadow` group (0640 root:shadow). Red Hat-family: nobody but root, via the root override (0000 root:root) |
| Holds ageing policy | No | Yes — minimum age, maximum age, warning, inactivity, expiry |
| Why it exists in this form | UID-to-name mapping must be readable by every process | Hashes must not be, so they were split out |

The separating axis is secrecy: `/etc/passwd` holds what every process must be able to read, and
`/etc/shadow` holds everything that had to be taken out of it because it must not be.

<a id="c-sysadmin.system-administration.etc-shadow"></a>
### /etc/shadow
*id: `sysadmin.system-administration.etc-shadow` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man-shadow-5, fedora-setup-spec*

**What it is** The shadowed password file: nine colon-separated fields per line holding the
password hash and the ageing policy — login name, encrypted password, date of last change,
minimum age, maximum age, warning period, inactivity period, expiration date, and a reserved
field. It is never world-readable, which is the entire point of its existence.

**Why it matters** "Where is the password hash stored" and "which file holds account expiry" are
both direct questions, and both answers are this file, not `/etc/passwd`. The permissions are also
distribution-specific in a way that a single memorised octal number gets wrong.

**How it works** Exact permissions differ by family. Debian-family systems ship `/etc/shadow` as
`0640 root:shadow`, so members of the `shadow` group can read it and helper binaries can be SGID
`shadow` rather than SUID root. Red Hat-family systems ship it `0000 root:root` — no permission
bits at all — relying on the fact that root bypasses permission checks anyway. Dates are stored
as whole days since 1970-01-01, not as timestamps, which is why a value of `0` in the
last-change field means "must change at next login."

**Key terms** nine fields; days since epoch; `shadow` group; locked hash (`!` prefix).

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `chage` | Read or change the ageing fields of `/etc/shadow` | `-l` list, `-M` maximum days, `-m` minimum days, `-W` warning days, `-E` account expiry date, `-d 0` force change at next login | `chage -l alice` | Confusing `-E` (the account expiry date, field 8) with `-M` (the password's maximum age, field 5) — one disables the account, the other only forces a new password |

**Traps** Locking an account and expiring a password are different operations on different fields.
`usermod -L` (or `passwd -l`) prefixes the stored hash with `!` so no password can match, leaving
key-based SSH login still working; `chage -E` sets an expiry date that disables the account
outright. Neither is the same as setting the login shell to `nologin`.

**What the exam may test** Which file holds hashes and ageing; the difference between locking an
account, expiring a password, and disabling a shell; and that the file's mode is
`0640 root:shadow` on Debian-family systems but `0000 root:root` on Red Hat-family ones.

*Not to be confused with [/etc/passwd](system-administration.md#cmp-sysadmin.system-administration.etc-passwd).*

<a id="c-sysadmin.system-administration.etc-group"></a>
### /etc/group
*id: `sysadmin.system-administration.etc-group` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man-group-5*

**What it is** The group database. Four colon-separated fields per line: group name, password
placeholder, GID, and the comma-separated list of *supplementary* members. Like `/etc/passwd` it
is world-readable and root-writable.

**Why it matters** Four fields against `/etc/passwd`'s seven is a straightforward recall
discrimination, and the fourth field is a genuine conceptual trap: a user whose primary group is
`developers` does not appear in the `developers` line of `/etc/group` at all.

**How it works** The member list records supplementary membership only. Primary membership is
recorded on the *user's* side, in field four of their `/etc/passwd` row, so the two databases must
be read together to answer "who is in this group." `getent group` resolves through NSS, picking up
directory-service groups that reading the file alone would miss. A rarely used `/etc/gshadow`
holds group passwords and administrator lists, keeping any hash out of the world-readable file
for the same reason `/etc/shadow` exists.

**Key terms** four fields; supplementary member list; `/etc/gshadow`; GID.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `getent group` | Look up group entries through NSS | Append a group name or GID to query one entry | `getent group developers` | Treating the returned member list as complete — users whose *primary* group this is will not be listed there |

**Traps** The member list is not the membership. Answering "who is in `developers`" from
`getent group developers` alone omits everyone who has it as their primary group; the complete
answer needs the `/etc/passwd` primary GIDs as well.

**What the exam may test** The four fields and their order; that field four is supplementary
membership only; and the contrast with `/etc/passwd`'s seven fields.

<a id="cmp-sysadmin.system-administration.etc-group"></a>
#### Not to be confused with: /etc/group vs /etc/passwd
*compares: `sysadmin.system-administration.etc-group`, `sysadmin.system-administration.etc-passwd`*

| | /etc/group | /etc/passwd |
| --- | --- | --- |
| Fields | 4 | 7 |
| Row describes | One group | One user account |
| Numeric id in it | GID (field 3) | UID (field 3) and primary GID (field 4) |
| Membership recorded | Supplementary members, field 4 | The user's own primary group, field 4 |
| Companion secret file | `/etc/gshadow` | `/etc/shadow` |

The separating axis is what a row is *about*: one row per group versus one row per account — and
because primary membership is stored on the account's row, neither file answers "who is in this
group" on its own.

<a id="c-sysadmin.system-administration.login-shell"></a>
### Login shell
*id: `sysadmin.system-administration.login-shell` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man-passwd-5, man-nologin-8*

**What it is** The program named in the seventh field of an account's `/etc/passwd` row, started
when that account logs in. Setting it to `/usr/sbin/nologin` is the standard way to make an
account that can own files and run a daemon but cannot be logged into interactively.

**Why it matters** "How do I stop this account being used to log in" has three plausible answers —
change the shell, lock the password, set an expiry date — and they do different things. The exam
tests which one matches the stated requirement.

**How it works** `nologin` prints a refusal message and exits with a non-zero status; if
`/etc/nologin.txt` exists, its contents are printed instead of the default message. `/bin/false`
achieves a similar effect by exiting 1 silently, with no message. `chsh` changes the field, and
for a non-root user the new shell must be listed in `/etc/shells` — root is exempt from that
restriction.

**Key terms** `/etc/shells`; `/usr/sbin/nologin`; `/bin/false`; `/etc/nologin.txt`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `chsh` | Change an account's login shell | `-s` the new shell, `-l` list the shells in `/etc/shells` | `chsh -s /usr/sbin/nologin deploy` | Expecting an unprivileged user to be able to set any path — non-root users may only choose a shell listed in `/etc/shells` |

**Traps** A `nologin` shell is not an account lock. The password hash is untouched, so anything
that authenticates without needing a shell can still work — the account's `cron` jobs continue to
run (cron uses `/bin/sh` unless told otherwise), and services with their own session handling may
still accept it. Conversely, locking the password with `usermod -L` leaves SSH public-key login
working, because no password is consulted. Only a combination, or an expiry date, closes both.

**What the exam may test** Matching a stated goal ("must own files but never log in", "must be
disabled entirely on a date") to the right mechanism, and knowing which field of `/etc/passwd` the
shell lives in.

<a id="c-sysadmin.system-administration.service-account"></a>
### Service account
*id: `sysadmin.system-administration.service-account` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man-passwd-5, man-nologin-8*

**What it is** An unprivileged account that exists so a daemon has an identity to run as, rather
than so a human has one to log in as. It normally has a system UID below `UID_MIN`, a `nologin`
shell, no usable password, and ownership only of the files its service genuinely needs.

**Why it matters** This is the concrete form of least privilege in day-to-day administration: a
web server compromised while running as `www-data` can damage what `www-data` owns, whereas the
same compromise while running as root damages everything. Exam scenarios describe the compromise
and ask what limited the blast radius.

**How it works** The account is created with `useradd -r` (a system UID, and no ageing policy), a
shell of `/usr/sbin/nologin`, and a locked password. The service's unit file or init script names
it, and the daemon drops to that identity — either by being started as it, or by starting as root
to bind a privileged port and then setting its UID down. Nothing about a low UID is enforced by
the kernel; the restriction comes from what the account is permitted to own and do.

**Key terms** system UID; `useradd -r`; privilege dropping; `nologin`.

**Traps** "Service account" describes purpose, not power. It is not automatically unprivileged —
an account created for a service and given UID 0, or added to a group with broad write access, is
exactly as dangerous as any other privileged identity. Equally, it is not a different *kind* of
object from a user account: it is an ordinary row in `/etc/passwd` used with a different intent.

**What the exam may test** Recognising a described account (system UID, `nologin` shell, no
password, owns one application's data) as a service account, and explaining why running a daemon
under one rather than root is a least-privilege control.

<a id="cmp-sysadmin.system-administration.service-account"></a>
#### Not to be confused with: Service account vs User account
*compares: `sysadmin.system-administration.service-account`, `sysadmin.system-administration.user-account`*

| | Service account | User account |
| --- | --- | --- |
| Exists for | A daemon to run as | A person to log in as |
| Typical login shell | `/usr/sbin/nologin` or `/bin/false` | An interactive shell such as `/bin/bash` |
| Typical UID range | Below `UID_MIN` (system range) | At or above `UID_MIN`, commonly 1000+ |
| Password | Locked or absent | Set, with an ageing policy |
| Kernel-level difference | None — both are rows in `/etc/passwd` with a UID | None |

The separating axis is intent, expressed through configuration: the kernel cannot tell the two
apart, so "service account" is a claim about how the account is set up and used, never about a
special account type.

<a id="c-sysadmin.system-administration.password-policy-and-ageing"></a>
### Password policy and ageing
*id: `sysadmin.system-administration.password-policy-and-ageing` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man-shadow-5*

**What it is** The rules governing when a password must change and when an account stops working:
minimum age, maximum age, warning period, inactivity period, and account expiry date — fields
four through eight of the account's `/etc/shadow` row.

**Why it matters** Ageing and complexity are two different subsystems that candidates routinely
merge. Everything time-based is in `/etc/shadow` and set with `chage`; everything about how
*strong* a password must be is enforced by PAM at the moment the password is set, and is nowhere
in `/etc/shadow` at all.

**How it works** `/etc/login.defs` supplies the defaults (`PASS_MAX_DAYS`, `PASS_MIN_DAYS`,
`PASS_WARN_AGE`) applied to accounts as they are created; changing it does not retroactively
alter existing accounts. `chage` edits an existing account's fields directly. Minimum age exists
to stop a user cycling straight back to their old password; inactivity is a grace period after
expiry during which login still works but forces a change; account expiry disables the account
regardless of the password.

**Key terms** `/etc/login.defs`; minimum age; inactivity period; PAM `pam_pwquality`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `chage` | Read or set an account's ageing fields | `-l` list current settings, `-M` maximum age in days, `-m` minimum age, `-W` warning days, `-I` inactivity days, `-E` account expiry date | `chage -M 90 -W 7 alice` | Editing `/etc/login.defs` and expecting existing accounts to change — those defaults apply only at creation time |
| `passwd -e` | Expire the password immediately, forcing a change at next login | `-l` lock, `-u` unlock, `-S` status | `passwd -e alice` | Reading `-e` as "disable the account" — it forces a password change, it does not deny login |

**Traps** Password *complexity* rules are not ageing rules. Length, character classes, and
dictionary checks come from PAM (typically `pam_pwquality`, configured under `/etc/security/` and
the PAM stack), and no `chage` option touches them. A question that asks how to require a
16-character password is not answered by anything in `/etc/shadow`.

**What the exam may test** Mapping a stated policy ("must change every 90 days", "warn a week
ahead", "cannot change twice in one day", "account stops working on 31 December") to the specific
`chage` option, and separating ageing from complexity enforcement.

#### Scenario

A contractor's account must be handed over. First, the identity: `id contractor` reports UID 1043
and shows `developers` only as a supplementary group, so files they create are still owned by
their own primary group — which explains why the team cannot write to anything in the shared
directory. Second, the handover: the account must stop being interactive but must keep owning its
files, so `chsh -s /usr/sbin/nologin contractor` changes field seven while leaving every UID 1043
inode exactly as it was. Third, the deadline: `chage -E 2026-09-30 contractor` disables the
account on a date, which `passwd -e` would not have done — that only forces a password change.
Finally, nobody runs `userdel` yet: deleting the row would leave the files owned by a bare 1043
that the next `useradd` could hand to someone else.

#### Knowledge check

1. What is the one-sentence difference between `usermod -g` and `usermod -aG`?
   `-g` sets the single primary group (recorded in `/etc/passwd`); `-aG` appends supplementary
   groups (recorded in `/etc/group`).
2. A user is added to a group but still gets permission denied in the shell they already had open.
   Why, and what is the fix?
   Group membership is fixed in a process's credentials at session start; they must start a new
   session (log out and back in) before `id` shows it.
3. How many fields does `/etc/passwd` have, how many does `/etc/group` have, and how many does
   `/etc/shadow` have?
   Seven, four, and nine respectively.
4. What are `/etc/shadow`'s permissions, and why is a single answer wrong?
   They are distribution-specific: `0640 root:shadow` on Debian-family systems, `0000 root:root`
   on Red Hat-family ones, where root's bypass of permission checks makes any bits unnecessary.
5. An account must own its application's files but must never be logged into. Which field changes,
   and why is that not the same as locking the password?
   The seventh field of `/etc/passwd`, set to `/usr/sbin/nologin`. Locking the password leaves
   SSH key login working; a `nologin` shell leaves the password hash valid for anything that does
   not need a shell, such as the account's `cron` jobs.
6. A policy requires 16-character passwords with mixed character classes. Which `chage` option
   sets that?
   None — complexity is enforced by PAM when the password is set; `chage` only edits the
   time-based ageing fields in `/etc/shadow`.

<a id="s-system-administration-permissions"></a>
## Permissions

<a id="c-sysadmin.system-administration.read-write-execute-permissions"></a>
### Read, write, execute permissions
*id: `sysadmin.system-administration.read-write-execute-permissions` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man-inode-7, man-chmod-1*

**What it is** The three permission bits — read (4), write (2), execute (1) — stored per class in
the inode's mode. Their names describe what they do to a *file*. On a *directory* the same three
bits mean something quite different, and that difference is the most commonly missed part of the
topic.

**Why it matters** Almost every "why can't they open this file" scenario is really a question
about the directories on the path to it. A user can hold `rw-` on a file and still be unable to
touch it, because a directory above it denies traversal; a user can hold no permission on a file
at all and still delete it, because they can write to the directory that names it.

**How it works** On a file: read means the contents may be read, write means the contents may be
modified, execute means the file may be run as a program. On a directory: read means the *list of
names* may be read, write means entries may be created, renamed, and deleted, and execute (also
called the search bit) means the directory may be traversed to reach what is inside it. Deleting a
file therefore requires write on its *parent directory*, not write on the file — the file's own
permissions are irrelevant to whether its name can be unlinked.

**Key terms** search/traverse bit; mode; `r--` versus `--x` on a directory; unlink.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ls -l` | Show the ten-character mode string for each entry | `-d` show the directory itself rather than its contents, `-a` include dotfiles, `-n` numeric owner/group | `ls -ld /tmp` | Running `ls -l /tmp` to inspect `/tmp`'s own permissions — without `-d` it lists the contents instead |
| `chmod` | Change the mode bits | `-R` recurse, symbolic or numeric mode | `chmod 640 report.txt` | Applying a file's mode recursively to a tree, stripping the execute bit that directories need to be traversable |

**Traps** `chmod -R 644` on a directory tree is the canonical self-inflicted outage: every
directory loses its execute bit and becomes untraversable, so nothing inside can be reached even
though every file's own bits look correct. Read without execute on a directory lets you see the
names and nothing else; execute without read lets you open a known path but not list it.

**What the exam may test** What each bit means on a directory as opposed to a file; which
permission is required to delete a file (write on the parent directory); and why a recursive
numeric `chmod` breaks a tree.

<a id="c-sysadmin.system-administration.owner-group-other"></a>
### Owner, group, other
*id: `sysadmin.system-administration.owner-group-other` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man-inode-7, man-chmod-1*

**What it is** The three permission classes a file's mode is divided into: the owning user (`u`),
the owning group (`g`), and everyone else (`o`). The kernel picks exactly one class per access
check and applies only that class's bits.

**Why it matters** The check is first-match-wins, not cumulative, and that is counter-intuitive
enough to be a reliable exam distinction. A file that is `r--rw-rw-` owned by `alice` is
*unwritable by alice* — her class is owner, owner has read only, and the more generous group and
other bits are never consulted on her behalf.

**How it works** On access, the kernel compares the process's effective UID to the file's owner:
if they match, the owner triad decides, full stop. Otherwise it compares the effective GID and
the supplementary group list to the file's group: if any matches, the group triad decides.
Otherwise the other triad decides. Root skips the whole procedure. The ten-character `ls -l`
string presents this as a type character followed by the three triads in that order.

**Key terms** class/triad; first match wins; effective UID; deny-by-narrowing.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ls -l` | Show owner, group, and the three triads | `-n` show numeric UID/GID instead of names, `-d` the directory itself | `ls -l /etc/shadow` | Reading the triads as cumulative — the owner does not also get the group's permissions |

**Traps** Removing a permission from `other` does not restrict the owner or the group, and adding
a permission to `other` does not help a user whose narrower class already matched. This is how a
file can be readable by "everyone except the person who owns it," which looks like a bug and is
not.

**What the exam may test** Given a mode string and a named accessor, deciding which triad applies
and therefore whether access succeeds — particularly the case where an earlier, more restrictive
class matches first.

<a id="c-sysadmin.system-administration.symbolic-vs-numeric-chmod"></a>
### Symbolic vs numeric chmod
*id: `sysadmin.system-administration.symbolic-vs-numeric-chmod` · depth 5 · importance 4 · LFS200: NOT COVERED · sources: man-chmod-1, man-inode-7*

**What it is** Two notations for the same operation. Symbolic mode (`u+x`, `go-w`, `a=r`)
expresses a *change* relative to whatever the file already has. Numeric mode (`755`, `0644`,
`2770`) expresses the complete resulting bit pattern and replaces what was there.

**Why it matters** The two are not interchangeable in effect, only in reach. Symbolic mode can add
one bit without disturbing the others; numeric mode always rewrites all nine (and, given four
digits, the three special bits too). A question that says "add execute for the owner without
changing anything else" has exactly one safe answer, and it is not an octal number.

**How it works** A symbolic mode is `[ugoa...][[-+=][perms...]...]`, with multiple clauses
separated by commas. `+` adds the named bits, `-` removes them, and `=` sets them and clears the
unmentioned ones — except that a directory's unmentioned set-user-ID and set-group-ID bits are not
affected by `=`. If no class letter is given, the effect is as if `a` were given, but bits set in
the umask are not affected. A numeric mode is one to four octal digits with omitted digits assumed
to be leading zeros: the first digit is setuid (4), setgid (2) and sticky (1); the second, third,
and fourth are the owner, group, and other triads, each summing read (4), write (2), execute (1).

**Key terms** relative versus absolute; clause; the `X` bit; leading special-bit digit.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `chmod` | Change file mode bits, symbolically or numerically | `-R` recursive, `--reference=RFILE` copy another file's mode, `-c` report only changes, `-v` verbose | `chmod u+x deploy.sh` | Reaching for `chmod 755` when only one bit needed adding, and silently rewriting the other eight |

**Traps** `chmod 644` is `chmod 0644`: because omitted digits are assumed to be leading zeros, a
three-digit mode clears setuid, setgid, and sticky on a regular file. Directories are the
exception worth memorising — `chmod` preserves a directory's set-user-ID and set-group-ID bits
unless told otherwise, and clearing them numerically requires an explicit leading zero (`00755`),
a leading minus (`-6000`), or a leading equals (`=755`). The second trap is `X` versus `x`:
`chmod -R a+X` adds execute only where it is a directory or execute is already set for some user,
which is precisely the safe recursive operation that `a+x` is not.

**Symptoms and diagnostic order** A script that "stopped being executable" after a bulk permission
change, or an SUID helper that suddenly runs unprivileged, both point at a numeric `chmod` having
overwritten more than intended. Check in this order: `ls -l` the file to read the current ten
characters; compare against the intended mode digit by digit, remembering the invisible leading
zero; check whether the special-bit position was the thing lost (an `s` where you now see `x`);
and if a whole tree is affected, look for a `-R` with a three-digit numeric mode, which strips
directory traversal as a side effect. Repair with symbolic mode (`chmod -R u+rwX,go+rX`), not with
another numeric sweep.

**Syntax worth memorising**

```
chmod u+x file             # add execute for the owner only, change nothing else
chmod go-w file            # remove write for group and other
chmod a=r file             # set exactly read for everyone, clear the rest
chmod u=rwx,go=rx dir      # two clauses, comma-separated, no spaces
chmod 755 script.sh        # rwxr-xr-x, and clears any setuid/setgid/sticky bit
chmod 4755 /usr/bin/tool   # leading 4 = setuid, then rwxr-xr-x
chmod 2775 /srv/shared     # leading 2 = setgid, the shared-directory pattern
chmod 1777 /tmp            # leading 1 = sticky, the world-writable-but-safe pattern
chmod -R a+X /srv/site     # add execute only to directories and already-executable files
```

**What the exam may test** Converting between `rwxr-x---` and `750` in both directions; choosing
symbolic mode when the requirement says "without affecting other permissions"; and knowing that
the leading octal digit carries the special bits.

<a id="cmp-sysadmin.system-administration.symbolic-vs-numeric-chmod"></a>
#### Not to be confused with: Symbolic vs numeric chmod vs Reading ls -l output vs umask
*compares: `sysadmin.system-administration.symbolic-vs-numeric-chmod`, `linux.command-line.reading-ls-l-output`, `sysadmin.system-administration.umask`*

| | Symbolic vs numeric chmod | Reading ls -l output | umask |
| --- | --- | --- | --- |
| What it does | Changes an existing file's mode | Displays an existing file's mode | Restricts the mode of files created from now on |
| Acts on | A named file or directory | Nothing — it only reports | The calling process and its children |
| Direction of the octal | The bits you want to *have* | Rendered as `rwx` letters, not octal | The bits you want to *remove* |
| Typical value | `755`, `u+x` | `-rwxr-xr-x` | `022` |
| Affects files that already exist | Yes | No | No |

The separating axis is tense: `ls -l` reports the present, `chmod` rewrites the present, and
`umask` constrains the future — which is why `umask 022` and `chmod 022` look similar and do
almost opposite things.

<a id="c-sysadmin.system-administration.chown-and-chgrp"></a>
### chown and chgrp
*id: `sysadmin.system-administration.chown-and-chgrp` · depth 3 · importance 4 · LFS200: MENTIONED ONLY · sources: man-chown-2*

**What it is** The commands that change which user owns a file and which group it belongs to.
`chown` can change both; `chgrp` changes only the group. Changing ownership is a separate
operation from changing permissions, and only a privileged process may give a file away to
another user.

**Why it matters** Ownership decides *which* permission triad applies, so a wrong owner makes a
correct mode useless. It is also the standard fix after files are restored from a backup or
copied as root into a user's home directory, where everything arrives owned by root.

**How it works** `chown(2)` restricts the operation: only a process with the `CAP_CHOWN`
capability — root, in practice — may change a file's owner. An unprivileged owner may change the
file's *group*, but only to a group they themselves belong to. As a safety measure, a successful
ownership change clears the set-user-ID and set-group-ID bits on an executable, so a SUID binary
cannot be handed to another user with its privilege intact.

**Key terms** `CAP_CHOWN`; `user:group` syntax; `--reference`; SUID clearing.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `chown` | Change the owning user, and optionally the group | `user:group` sets both, `:group` sets group only, `-R` recursive, `--reference=RFILE` copy from another file, `-h` act on a symlink itself | `chown -R alice:developers /srv/app` | Expecting an ordinary user to be able to give their own file to someone else — only a privileged process may change the owner |
| `chgrp` | Change only the owning group | `-R` recursive, `--reference=RFILE` | `chgrp developers report.txt` | Changing a file's group to one the caller does not belong to — an unprivileged user may only assign a group they are a member of |

**Traps** `chown alice file` and `chown alice: file` are not the same: the bare form changes only
the user, while the trailing colon also sets the group to `alice`'s login group. And `chown -R`
through a tree containing symlinks follows or ignores them depending on `-h`, `-L` and `-P` — the
default does not dereference symlinks encountered during traversal.

**What the exam may test** Who is allowed to perform each operation; the `user:group`, `user:`,
and `:group` syntax variants; and that ownership, not permission, is what selects the triad.

<a id="c-sysadmin.system-administration.umask"></a>
### umask
*id: `sysadmin.system-administration.umask` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man-umask-2*

**What it is** A per-process mask of permission bits that are *removed* from the mode requested
when a file or directory is created. It subtracts; it never sets. A umask of `022` cannot make a
file executable — it can only prevent bits from appearing.

**Why it matters** It is routinely confused with `chmod` because both are written in octal and
both are three digits. They point in opposite directions: `chmod 644` means "end up with 644",
`umask 644` means "remove read/write from everyone but the owner's read/write", producing far more
restrictive results than the same digits in `chmod`.

**How it works** `umask(2)` sets the calling process's file mode creation mask; the resulting mode
is the mode the creating program asked for, ANDed with the complement of the mask. Programs
conventionally request `0666` for a regular file and `0777` for a directory, and let the umask
narrow it — which is why a umask of `022` yields `644` files and `755` directories, and why new
files are never executable regardless of the mask. The mask is inherited by child processes, so
setting it in a shell affects everything that shell launches; the shell builtin with no argument
prints the current value.

**Key terms** creation mask; inheritance; `0666`/`0777` base modes; `-S` symbolic display.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `umask` | Print or set the shell's file creation mask | no argument prints the octal value, `-S` prints it symbolically, an octal argument sets it | `umask 027` | Reading the octal as the resulting permissions rather than the bits withheld — `umask 077` produces `600` files, not `077` |

**Traps** The umask cannot grant. A umask of `000` still produces non-executable regular files,
because the base mode programs request is `0666`, not `0777`. And because the mask is a per-process
property, setting it interactively does not change files created by an already-running daemon or by
a `cron` job started from a different environment.

**What the exam may test** Computing the resulting mode for a stated umask (022, 027, 077) for
both a file and a directory, and recognising that umask affects only newly created objects, never
existing ones.

*Not to be confused with [symbolic vs numeric chmod](system-administration.md#cmp-sysadmin.system-administration.symbolic-vs-numeric-chmod).*

<a id="c-sysadmin.system-administration.suid"></a>
### SUID
*id: `sysadmin.system-administration.suid` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man-inode-7*

**What it is** The set-user-ID bit (`S_ISUID`, octal 4000). On an executable it makes the process
run with the *file owner's* effective UID rather than the caller's. This is how an ordinary user
running `passwd` manages to write into `/etc/shadow`, a file they cannot open themselves.

**Why it matters** SUID is the standard textbook example of controlled privilege escalation, and
also the standard audit target: any SUID-root binary is a potential path to full root, so
enumerating them is a routine security check the exam can describe.

**How it works** When the kernel executes a file with the set-user-ID bit, the new process's
effective UID becomes the file's owner. The real UID still records who launched it, which is how
the program can tell who it is acting for. In `ls -l` the bit appears as `s` in the owner triad's
execute position — lowercase `s` when execute is also set, uppercase `S` when it is not, which
signals a bit that will never take effect.

**Key terms** effective versus real UID; `S_ISUID`; `04000`; `s` in the owner triad.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `chmod u+s` | Set the set-user-ID bit on an executable | equivalent numeric form is a leading `4`, e.g. `chmod 4755` | `chmod u+s /usr/local/bin/tool` | Setting it on a shell script and expecting it to work — Linux ignores set-user-ID on interpreted scripts |
| `find / -perm -4000` | List every file with the set-user-ID bit set | `-perm -4000` means "at least these bits"; add `-type f` to skip directories, `2>/dev/null` to silence unreadable paths | `find / -perm -4000 -type f` | Writing `-perm 4000` without the leading minus, which matches only files whose mode is *exactly* 4000 and finds essentially nothing |

**Traps** Linux ignores the set-user-ID bit on scripts — the kernel refuses to grant privilege to
an interpreter reading a file it has not verified — so `chmod u+s script.sh` sets a bit that does
nothing. On a *directory*, set-user-ID has no defined meaning on Linux at all; only set-group-ID
and the sticky bit have directory semantics.

**What the exam may test** Why `passwd` can modify `/etc/shadow`; reading `s` versus `S` in an
`ls -l` mode string; and the correct `find` expression for auditing SUID binaries.

*Not to be confused with [SGID](system-administration.md#cmp-sysadmin.system-administration.sgid).*

<a id="c-sysadmin.system-administration.sgid"></a>
### SGID
*id: `sysadmin.system-administration.sgid` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man-inode-7*

**What it is** The set-group-ID bit (`S_ISGID`, octal 2000). It has two entirely different
meanings depending on what it is set on. On an executable it runs the process with the file's
group privileges. On a directory it makes newly created entries inherit the *directory's* group
instead of the creator's primary group — and new subdirectories inherit the bit itself.

**Why it matters** The directory behaviour is the one that matters operationally: it is the
standard way to build a shared team folder where everything created stays writable by the team,
and it is the missing piece in the "I added them to the group but new files still are not
shared" scenario.

**How it works** `inode(7)` records that on a directory the bit selects BSD group semantics:
files created there inherit the group ID of the directory rather than the effective group ID of
the creating process, and directories created there also get the bit set, so the behaviour
propagates down the tree. Combined with a group-writable mode, `chmod 2770 /srv/shared` gives a
directory where every member of the owning group can create files that every other member can
edit. A third, unrelated meaning exists: on a file without the group execute bit, set-group-ID
indicates mandatory file/record locking.

**Key terms** group inheritance; BSD semantics; `2770`; `s` in the group triad.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `chmod g+s` | Set the set-group-ID bit | numeric equivalent is a leading `2`, e.g. `chmod 2775` | `chmod g+s /srv/shared` | Setting it and expecting *existing* files in the directory to change group — inheritance applies only to entries created afterwards |

**Traps** SGID on a directory changes the group of new files, not their permission bits: a
teammate still needs group write on those files, which is what the umask decides. So a shared
directory usually needs both `chmod 2770` on the directory and a umask of `002` in the members'
sessions, or the inherited group will own files nobody else can write.

**What the exam may test** The file-versus-directory split in what the bit means; the shared-folder
recipe; and recognising `drwxrws---` in `ls -l` output as an SGID directory.

<a id="cmp-sysadmin.system-administration.sgid"></a>
#### Not to be confused with: SGID vs sticky bit vs SUID
*compares: `sysadmin.system-administration.sgid`, `sysadmin.system-administration.sticky-bit`, `sysadmin.system-administration.suid`*

| | SGID | Sticky bit | SUID |
| --- | --- | --- | --- |
| Octal value | 2000 | 1000 | 4000 |
| Symbolic form | `g+s` | `+t` | `u+s` |
| Effect on an executable | Runs with the file's group | No effect on Linux (historically a text-segment hint) | Runs with the file's owner |
| Effect on a directory | New entries inherit the directory's group; new subdirectories inherit the bit | Only the file's owner, the directory's owner, or a privileged process may rename or delete an entry | No defined meaning on Linux |
| Appears in `ls -l` as | `s` in the group triad | `t` in the other triad | `s` in the owner triad |
| Canonical example | `/srv/shared` team folder | `/tmp` | `/usr/bin/passwd` |

The separating axis is which question each bit answers: SUID and SGID answer "whose privileges
does this run with," while the sticky bit answers "who may remove an entry from this directory" —
and only SGID has a genuinely useful meaning in both the file and directory cases.

<a id="c-sysadmin.system-administration.sticky-bit"></a>
### Sticky bit
*id: `sysadmin.system-administration.sticky-bit` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man-inode-7, fhs-3-0*

**What it is** `S_ISVTX`, octal 1000, also called the restricted deletion flag. On a directory it
means a file inside can be renamed or deleted only by the owner of the file, by the owner of the
directory, or by a privileged process. It is what makes `/tmp` safe to leave world-writable.

**Why it matters** Without it, write permission on a directory is enough to delete anything in it,
regardless of who owns the file — so a shared scratch directory would let any user destroy any
other user's work. The bit narrows directory write from "may remove any entry" to "may remove your
own entries."

**How it works** The directory keeps mode `1777`: everyone may create entries, but the unlink and
rename operations additionally check ownership against `inode(7)`'s three-way rule — the file's
owner, the directory's owner, or a privileged process. Note all three: a candidate who remembers
only "the file's owner" will mark a correct option wrong, because the directory owner and root can
also remove the entry. The FHS is the reason this shows up on `/tmp` specifically: `/tmp` must be
available to every program and every user.

**Key terms** restricted deletion flag; `S_ISVTX`; `1777`; `t` versus `T`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `chmod +t` | Set the sticky bit on a directory | numeric equivalent is a leading `1`, e.g. `chmod 1777` | `chmod +t /srv/scratch` | Setting it on a regular file and expecting protection — on Linux the bit has no effect on files |

**Traps** `ls -ld /tmp` shows `drwxrwxrwt`: the trailing `t` replaces the other class's execute
character. A capital `T` means the sticky bit is set while other-execute is *not*, which on a
directory makes it untraversable by anyone outside the owner and group — usually a mistake. And
the bit restricts deletion and renaming only; it does not stop anyone with write permission on the
file itself from overwriting the contents in place.

**What the exam may test** Why `/tmp` is world-writable yet safe; the exact three parties who may
still delete an entry; and reading `drwxrwxrwt` correctly.

*Not to be confused with [SGID](system-administration.md#cmp-sysadmin.system-administration.sgid).*

<a id="c-sysadmin.system-administration.root-and-least-privilege"></a>
### Root and least privilege
*id: `sysadmin.system-administration.root-and-least-privilege` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man-credentials-7, sudo-man-sudo*

**What it is** Root is UID 0, the identity for which the kernel's ordinary permission checks are
bypassed. Least privilege is the operating principle that follows from that: grant the smallest
privilege that accomplishes the task, for the shortest time, rather than working as root because
it is convenient.

**Why it matters** Every permission control in this competency is defeated by a process running as
root, so "which of these designs limits the damage" questions come down to whether root was needed
at all. Least privilege is also the reasoning behind service accounts, `sudo` policies scoped to
specific commands, and group-based sharing instead of world-writable files.

**How it works** Because root bypasses the mode check, `chmod 000` on a file is no obstacle to it —
which is exactly why Red Hat-family systems can ship `/etc/shadow` with no permission bits at all
and still have it work. Practical least privilege therefore never relies on removing root's
access; it relies on not running as root: a daemon under a dedicated service account, an
administrator with a `sudoers` rule permitting one command, a container process that never holds
UID 0 in the first place.

**Key terms** UID 0; permission bypass; capabilities; blast radius.

**Traps** Least privilege is not "use `sudo` instead of `su`." Running `sudo -i` and staying in a
root shell all afternoon is the same privilege level as logging in as root; the principle is about
how much authority is held and for how long, not about which command was used to obtain it. Nor
is root the same thing as kernel mode — a root process is still an ordinary user-space process
that simply skips permission checks.

**What the exam may test** Identifying which of several described arrangements grants the least
privilege sufficient for a task, and recognising that root's power comes from being UID 0 rather
than from any group membership or file permission.

*Not to be confused with [sudo vs su](system-administration.md#cmp-sysadmin.system-administration.sudo-vs-su).*

<a id="c-sysadmin.system-administration.sudo-vs-su"></a>
### sudo vs su
*id: `sysadmin.system-administration.sudo-vs-su` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: sudo-man-sudo, man-su-1*

**What it is** Two ways to act as another user. `sudo` runs one command as a target user (root by
default) under a policy in `/etc/sudoers`, authenticating with the *caller's own* password, and
logging what was run. `su` substitutes the user and group ID for a whole shell, authenticating
with the *target account's* password.

**Why it matters** The exam's interest is the audit trail, not the convenience. `sudo` records who
ran what, and can be scoped to individual commands; `su` hands over a shell and everything after
that is anonymous within that shell. That difference is why shared root passwords are discouraged
and why Debian-family installers lock the root password entirely.

**How it works** `sudo` consults the sudoers policy, prompts for the invoking user's password by
default, caches that authentication briefly, logs the command through syslog, and executes it as
the target user. `su` with no user defaults to root; for backward compatibility it does *not*
change the current directory and sets only `HOME` and `SHELL` (plus `USER` and `LOGNAME` when the
target is not root), which is why `su -` (`--login`) is recommended instead — it starts a genuine
login shell with the target's full environment and home directory.

**Key terms** sudoers policy; caller's password versus target's password; login shell; audit log.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `sudo` | Run a single command as another user under policy | `-u` target user (default root), `-l` list what you may run, `-k` invalidate the cached authentication, `-v` refresh it | `sudo systemctl restart nginx` | Assuming it asks for the root password — by default it asks for your own |
| `su` | Substitute user and start a shell as them | `-`/`-l`/`--login` full login shell, `-c` run one command, `-s` shell to use | `su - alice` | Running plain `su` and inheriting a mixed environment: the current directory is kept and most variables are not reset |
| `sudo -i` | Start a root login shell through sudo, with root's environment and home | contrast with `sudo -s`, which starts a shell without simulating a full login | `sudo -i` | Treating it as safer than `su -` — the privilege held is identical; only the authentication and the log entry differ |

**Traps** On a default Debian or Ubuntu install, root's password is locked, so `su` to root simply
fails no matter what is typed — the answer is `sudo -i`, not a forgotten password. And `sudo -i`
versus `sudo -s` matters: `-i` simulates an initial login (root's environment, root's home,
root's shell startup files), while `-s` runs a shell that keeps much of the invoking user's
environment.

**What the exam may test** Whose password each command wants; which of the two produces a
per-command audit record; and what `su` without `-` fails to reset.

<a id="cmp-sysadmin.system-administration.sudo-vs-su"></a>
#### Not to be confused with: sudo vs su vs Root and least privilege
*compares: `sysadmin.system-administration.sudo-vs-su`, `sysadmin.system-administration.root-and-least-privilege`*

| | sudo vs su | Root and least privilege |
| --- | --- | --- |
| What it names | Two specific commands for changing identity | A principle about how much authority to hold |
| Password required | `sudo`: the caller's own. `su`: the target account's | Not applicable |
| Granularity | `sudo`: one command per policy rule. `su`: a whole shell | The design goal that granularity serves |
| Audit trail | `sudo` logs each command; `su` logs only the switch | The reason the audit trail is wanted |
| Satisfied by using `sudo` | — | No: an all-afternoon `sudo -i` shell violates it just as much as `su -` |

The separating axis is mechanism versus principle: `sudo` and `su` are two tools for becoming
another identity, while least privilege is the rule that decides whether you should have become
one at all — and choosing `sudo` does not by itself satisfy it.

<a id="c-sysadmin.system-administration.etc-sudoers-and-visudo"></a>
### /etc/sudoers and visudo
*id: `sysadmin.system-administration.etc-sudoers-and-visudo` · depth 5 · importance 4 · LFS200: NOT COVERED · sources: sudo-man-visudo, sudo-man-sudo*

**What it is** `/etc/sudoers` is the policy file that decides who may run what, as whom, on which
hosts. `visudo` is the editor wrapper that exists because a syntax error in that file can lock
every administrator out of privilege escalation on the machine at once.

**Why it matters** This is one of the few configuration files an entry-level exam expects you to
read a line of and interpret, and the "edit it with `vi` directly" mistake is exactly what
`visudo` was written to prevent. Both the syntax and the reason for the tool are examinable.

**How it works** `visudo` locks `sudoers` against simultaneous edits, runs an editor, then parses
the result and refuses to install it if there is a syntax error — printing the offending line
number and offering to re-edit. Which editor it runs is decided by two sudoers settings: `editor`
holds a colon-separated list of permitted editors, and `env_editor` controls whether
`SUDO_EDITOR`, `VISUAL`, or `EDITOR` from the environment may be used at all. `-c` checks a file
without editing it, and `-f` edits a different file with the same safety, which is how a drop-in
under `/etc/sudoers.d/` should be created. Modern `sudoers` files pull that directory in with an
`@includedir /etc/sudoers.d` line (older versions wrote `#includedir`, which is a directive, not a
comment).

**Key terms** `@includedir`; `/etc/sudoers.d`; `NOPASSWD`; runas specification.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `visudo` | Safely edit and validate a sudoers file | `-c` check syntax only, `-f FILE` edit a specific file such as a drop-in, `-s` strict checking | `visudo -c` | Editing `/etc/sudoers` with a plain editor and installing a file that no longer parses — after which no `sudo` command works, including the one that would fix it |

**Traps** A file that fails to parse is not partially applied: `sudo` refuses the whole policy, so
every rule stops working, not just the broken line. Recovery needs a root shell obtained some
other way (single-user mode, a rescue boot, an already-open root session). The second trap is
`NOPASSWD` scope: `alice ALL=(ALL) NOPASSWD: ALL` is not "convenient", it is unrestricted root
with no authentication — the tag belongs on a specific command path, not on `ALL`.

**Symptoms and diagnostic order** "`sudo` stopped working for everyone" after a change is almost
always a parse failure. Diagnose in this order: from any surviving root session run `visudo -c` to
see whether the file parses and which line is at fault; if the main file is clean, check every
drop-in under `/etc/sudoers.d/` — `visudo -c` validates included files too, and a file whose name
contains a dot or ends in `~` is silently ignored, which produces the opposite symptom of a rule
that appears present but has no effect. If no root session survives, boot to a rescue target and
repair the file there. For "one user cannot run one command," start instead with `sudo -l` as that
user, which prints the policy actually in force for them.

**Syntax worth memorising**

```
# user  host = (runas_user:runas_group)  command_list
alice   ALL = (ALL:ALL) ALL                     # full sudo, password required
%wheel  ALL = (ALL) ALL                         # a group rule: % prefixes a group name
deploy  ALL = (root) NOPASSWD: /bin/systemctl restart nginx
Defaults timestamp_timeout=5                    # minutes the cached authentication lasts
@includedir /etc/sudoers.d
```

**What the exam may test** Why `visudo` rather than a plain editor; reading a rule to say who may
run what as whom; recognising `%` as the group prefix; and knowing that `NOPASSWD: ALL` grants
unauthenticated root.

#### Scenario

A team asks for a shared directory under `/srv/project` that all three of them can write to. The
first attempt is `chmod 777`, which works and is wrong: anyone on the box can delete anything.
The correct build is `chgrp developers /srv/project`, then `chmod 2770 /srv/project` — the leading
`2` is SGID, so files created inside inherit the `developers` group rather than each creator's
primary group, and `770` keeps everyone else out entirely. A member reports that their colleague
still cannot edit a file they created: the group was inherited correctly, but their umask of `022`
stripped group write, so `umask 002` is the missing half. Separately, one member wants to restart
the application without a root shell; rather than adding them to `wheel`, a `visudo`-edited rule
grants exactly `/bin/systemctl restart app` as root. And `/srv/project` deliberately does *not*
get the sticky bit that `/tmp` has — here the team is meant to be able to tidy up each other's
files.

#### Knowledge check

1. A file is `-r--rw-rw-` and owned by `alice`, who is in the owning group. Can `alice` write to
   it?
   No. The owner class matches first and grants read only; the more permissive group and other
   bits are never consulted for her.
2. What permission is required to delete a file, and on what?
   Write (and execute) on the parent directory. The file's own permission bits do not control
   whether its name can be unlinked.
3. Name the three parties who may still delete a file from a sticky-bit directory.
   The file's owner, the directory's owner, and a privileged process.
4. `umask 077` is in effect. What mode does a newly created regular file get, and a new directory?
   `600` and `700` — the base modes programs request are `0666` and `0777`, narrowed by the mask.
5. Why does `chmod u+s script.sh` not make a shell script run as its owner?
   Linux ignores the set-user-ID bit on interpreted scripts; only compiled executables honour it.
6. `sudo` prompts for a password. Whose is it, and how does that differ from `su`?
   Your own, by default. `su` asks for the *target* account's password instead.

<a id="s-system-administration-processes"></a>
## Processes

<a id="c-sysadmin.system-administration.process"></a>
### Process
*id: `sysadmin.system-administration.process` · depth 3 · importance 4 · LFS200: FULLY COVERED · sources: man-credentials-7, man-proc-5*

**What it is** A running instance of a program: a PID, an address space, a set of open file
descriptors, and a credential set (real and effective UID and GID plus the supplementary group
list). A program is a file on disk; a process is what exists once that file has been executed, and
one program can be running as many separate processes at once.

**Why it matters** Ownership and permissions are enforced against a process's credentials, not
against the file it came from, so "which identity is this running as" is a process question. It is
also the unit signals are sent to, the unit the scheduler considers, and the unit `ps` reports on.

**How it works** Each process appears as a numbered directory under `/proc`, where the kernel
exposes its command line, environment, open descriptors, and status as readable files — this is
what `ps` and `top` actually read. A process is created when an existing process forks and the
child executes a new program, so every process except PID 1 has a parent. Its credentials are
inherited from that parent, unless the executed file carries SUID or SGID.

**Key terms** PID; address space; file descriptor; `/proc/<pid>`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ps` | Take a one-off snapshot of processes | `-ef` every process, full format (UNIX style); `aux` every process with CPU and memory (BSD style); `-u USER` filter by user; `-o` choose columns | `ps aux` | Expecting bare `ps` to list everything — with no options it shows only processes belonging to the current user and attached to the current terminal |
| `top` | Show a continuously refreshed, sorted view of processes | `-b` batch mode for scripts, `-n` number of iterations, `-u` filter by user; interactively `P` sorts by CPU and `M` by memory | `top -b -n 1` | Reading the first `%CPU` figures as meaningful — the initial iteration is measured since boot, not since the last refresh |

**Traps** `ps` and `top` answer different questions: `ps` is a snapshot at one instant, `top` is a
sampled rate over an interval. A process that consumes 100% of a core in short bursts can look
idle in `ps` and busy in `top`, and neither reading is wrong. Note also that the two `ps` option
styles are not interchangeable: `ps -aux` is not `ps aux`, and the leading dash changes how the
arguments are parsed.

**What the exam may test** Choosing `ps -ef`/`ps aux` when a full system listing is wanted;
recognising that a process's identity comes from its credentials rather than from the file on
disk; and knowing that `/proc` is where this information lives.

*Not to be confused with [daemon](system-administration.md#cmp-sysadmin.system-administration.daemon).*

<a id="cmp-sysadmin.system-administration.process"></a>
#### Not to be confused with: Process vs Service vs Zombie and orphan processes
*compares: `sysadmin.system-administration.process`, `sysadmin.system-administration.service`, `sysadmin.system-administration.zombie-and-orphan-processes`*

| | Process | Service | Zombie and orphan processes |
| --- | --- | --- | --- |
| What it is | One running instance of a program | A managed facility the init system starts, supervises and restarts | Two abnormal process states |
| Who starts it | Anyone, by executing a program | The init system, from a unit definition | Nobody — they are outcomes, not things you launch |
| Survives logout | Only if detached from the terminal | Yes, by design | A zombie persists until reaped; an orphan is re-parented to PID 1 |
| Managed with | `ps`, `kill`, `nice` | `systemctl start`, `stop`, `enable` | Neither: a zombie is fixed by fixing (or killing) its parent |
| Consumes CPU or memory | Yes | Yes, through its processes | A zombie holds only a process-table entry, no memory |

The separating axis is management: a process is the raw kernel object, a service is a process (or
group of them) wrapped in a supervision policy, and zombies and orphans are what the object looks
like when the parent-child relationship has broken down.

<a id="c-sysadmin.system-administration.pid-and-ppid"></a>
### PID and PPID
*id: `sysadmin.system-administration.pid-and-ppid` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man-credentials-7, man-proc-5, systemd-1*

**What it is** The process ID uniquely identifies a running process; the parent process ID names
the process that created it. Together they form the process tree, whose root is PID 1 — the init
system, which the kernel starts first and which becomes the ancestor of everything else.

**Why it matters** PID 1's special status explains two separate exam facts: that `systemd` (or
another init) runs as PID 1, and that orphaned processes are re-parented to PID 1 rather than
being killed. The parent link is also what makes zombies possible and what `pstree`-style
troubleshooting relies on.

**How it works** The kernel allocates PIDs sequentially up to `/proc/sys/kernel/pid_max` and then
wraps, reusing numbers of processes that have exited — so a PID identifies a process only while
that process lives. `ps -ef` prints PID and PPID side by side, making the parentage explicit.
Inside a container, PID namespaces mean the containerised process sees itself as PID 1 while the
host sees an ordinary high-numbered PID: the same process, two different numbers.

**Key terms** process tree; PID 1; `pid_max`; PID namespace.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ps -ef` | List every process in full format, including the PPID column | `-e` all processes, `-f` full listing; add `--forest` for a tree view | `ps -ef` | Confusing the `PID` and `PPID` columns and signalling the parent instead of the child |
| `pgrep` | Find PIDs by name or attribute | `-f` match against the whole command line rather than the process name, `-u` restrict to a user, `-l` also print the name, `-a` print the full command line | `pgrep -u www-data nginx` | Expecting a bare pattern to match arguments — without `-f`, `pgrep` matches only the process name, so `pgrep myscript.py` finds nothing when the process is really `python3` |

**Traps** PIDs are reused. A PID recorded in a stale file and later signalled may belong to an
entirely unrelated process, which is why service managers track processes by cgroup rather than by
a PID file. And "PID 1" is namespace-relative: seeing PID 1 inside a container does not mean you
are looking at the host's init.

**What the exam may test** That PID 1 is the init system and the ancestor of all processes; how to
read a parent-child relationship out of `ps -ef`; and the `pgrep -f` distinction when the target is
an interpreted script.

<a id="c-sysadmin.system-administration.foreground-and-background-jobs"></a>
### Foreground and background jobs
*id: `sysadmin.system-administration.foreground-and-background-jobs` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man-signal-7*

**What it is** Shell job control: the shell's ability to run more than one command from a single
terminal and move each between foreground (holding the terminal) and background (running while
the prompt returns). A job is a shell-level concept — a pipeline the shell tracks — not a kernel
object; the kernel only knows processes and process groups.

**Why it matters** Every long-running task started over SSH raises the same question: what happens
to it when the connection drops. The answer depends on whether the job is merely backgrounded
(still the terminal's child, still reachable by SIGHUP) or genuinely detached.

**How it works** Appending `&` starts a pipeline in the background and prints its job number and
PID. Ctrl-Z sends SIGTSTP to the foreground job, suspending it; `bg` then sends SIGCONT and lets it
continue in the background, while `fg` brings it back and reattaches the terminal. Jobs are named
by `%1`, `%2`, and so on. When a terminal closes, the kernel sends SIGHUP to its foreground process
group, and most shells pass it on to their background jobs too — which is what kills them.

**Key terms** job specification (`%1`); SIGTSTP; SIGHUP on hangup; process group.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `jobs` | List the current shell's jobs | `-l` also show PIDs, `-r` running only, `-s` stopped only | `jobs -l` | Expecting to see another terminal's jobs — the job table belongs to one shell instance only |
| `bg` | Resume a stopped job in the background | takes a job spec such as `%1`; defaults to the most recent | `bg %1` | Using it on a job that is running rather than stopped — `bg` resumes, it does not detach |
| `fg` | Bring a job to the foreground | takes a job spec such as `%1` | `fg %2` | Assuming `fg` can reach a job from a different shell session |
| `nohup` | Run a command immune to SIGHUP so it survives logout | output goes to `nohup.out` when standard output is a terminal; combine with `&` to background it as well | `nohup ./long-job.sh &` | Using `nohup` without `&` and wondering why the terminal is still blocked — `nohup` prevents the hangup signal, it does not background anything |

**Traps** `&` and `nohup` solve different halves of the same problem: `&` returns the prompt,
`nohup` survives the hangup. A job started with `&` alone is still attached to the shell and is
usually killed when the SSH session ends. `disown` is the third option — it removes the job from
the shell's table so no SIGHUP is forwarded — but unlike `nohup` it must be applied to an
already-running job and does not redirect output.

**What the exam may test** Which key sequence suspends a foreground job (Ctrl-Z, not Ctrl-C);
what `bg` and `fg` each do to a suspended job; and which mechanism keeps a task alive after logout.

<a id="c-sysadmin.system-administration.signals"></a>
### Signals
*id: `sysadmin.system-administration.signals` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man-signal-7*

**What it is** Asynchronous notifications delivered to a process by the kernel, by another
process, or by a terminal keystroke. Most can be caught by a handler, blocked, or ignored. Two
cannot: SIGKILL and SIGSTOP are always enforced by the kernel and never reach the program.

**Why it matters** The SIGTERM/SIGKILL distinction is the classic beginner error the exam is built
to catch. SIGTERM asks a process to shut down and lets it flush buffers, close files, and remove
its lock; SIGKILL removes it from the scheduler immediately, with no chance to clean up, leaving
half-written files and stale locks behind.

**How it works** `kill` sends SIGTERM (15) by default; a signal can be named or numbered
(`kill -TERM`, `kill -15`, `kill -9`). The numbers that matter here are stable across
architectures: SIGHUP 1, SIGINT 2 (Ctrl-C), SIGQUIT 3, SIGKILL 9, SIGTERM 15. SIGSTOP, SIGTSTP and
SIGCONT are the job-control signals, and their numbers do vary by architecture, so name them
rather than numbering them. A well-behaved daemon installs a SIGTERM handler to shut down cleanly
and often uses SIGHUP as "re-read your configuration."

**Key terms** catchable versus uncatchable; SIGTERM (15); SIGKILL (9); SIGHUP as reload.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `kill` | Send a signal to a process by PID | default signal is SIGTERM; `-l` list signal names; `-s NAME` or `-NUMBER` choose one | `kill 4821` | Believing `kill` always terminates — it sends a signal, and which signal decides what happens |
| `kill -9` | Send SIGKILL, which cannot be caught, blocked, or ignored | none — the point of SIGKILL is that it takes no cooperation | `kill -9 4821` | Reaching for it first, so the process never gets to flush data or release its lock file |
| `killall` | Signal every process whose *name* matches exactly | `-i` confirm each, `-u USER` restrict by owner, `-s` choose the signal | `killall nginx` | Passing a path or a partial name — the match is against the command name, so `killall /usr/sbin/nginx` matches nothing |
| `pkill` | Signal processes selected by pattern and attribute | `-f` match the full command line, `-u` by user, `-x` require an exact match, `-e` echo what was killed | `pkill -u deploy -f 'python3 worker'` | Forgetting that the pattern is a substring by default, so `pkill ssh` can also kill `sshd` |

**Traps** SIGKILL cannot fix a process stuck in uninterruptible sleep (state `D` in `ps`), because
the process is waiting inside the kernel on I/O and is not in a position to be reaped — the
apparent "kill -9 did nothing" case is almost always this, or a zombie, which is already dead. The
other trap is `pkill` versus `killall`: `pkill` matches patterns and will happily match more than
you meant; `killall` requires the exact command name.

**What the exam may test** Which signal is default for `kill`; that SIGKILL and SIGSTOP cannot be
caught; the recommended order (SIGTERM, wait, then SIGKILL); and the difference in matching between
`killall` and `pkill`.

*Not to be confused with [process priority and nice](system-administration.md#cmp-sysadmin.system-administration.process-priority-and-nice).*

<a id="c-sysadmin.system-administration.process-priority-and-nice"></a>
### Process priority and nice
*id: `sysadmin.system-administration.process-priority-and-nice` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man-setpriority-2*

**What it is** The nice value is a scheduling bias, from -20 (greediest, scheduled most
aggressively) through 0 (the default) to 19 (runs only when nothing else wants the CPU). Higher
nice means lower priority — the name is literal: a nice process is nice to its neighbours.

**Why it matters** It is the standard answer to "a batch job is starving an interactive service"
and, just as importantly, to "why can't I speed my job up" — the asymmetry in who may move the
value in which direction is the examinable part.

**How it works** Raising your own nice value (making a process less demanding) is always permitted.
Lowering it requires privilege: root or `CAP_SYS_NICE`, unless the administrator has raised the
process's `RLIMIT_NICE` resource limit, which by default allows no reduction at all. Note that
nice is a *bias*, not a reservation: a niced-down process still runs when the CPU is otherwise
idle, and nice has no effect at all on a machine that is not CPU-bound — it does nothing for
memory pressure or I/O waits.

**Key terms** nice value; `RLIMIT_NICE`; `CAP_SYS_NICE`; scheduling bias.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `nice` | Start a new command with an adjusted nice value | `-n N` the adjustment; with no option the increment is 10 | `nice -n 19 ./reindex.sh` | Expecting a negative value to work unprivileged — `nice -n -5` needs root or a raised `RLIMIT_NICE` |
| `renice` | Change the nice value of processes that are already running | `-p` by PID, `-u` by user, `-g` by process group; `--relative` for a delta | `renice -n 10 -p 4821` | Reading the number as an increment: in this implementation `-n` sets an *absolute* nice value unless `POSIXLY_CORRECT` is set or `--relative` is given |

**Traps** `nice` and `renice` take the same-looking number and mean different things by it. `nice
-n 10 cmd` adds 10 to the *current* nice value when starting a new command; `renice -n 10 -p PID`
sets the running process's nice value *to* 10. An unprivileged user also cannot undo their own
change: having raised a process's nice value, they cannot lower it again without privilege.

**What the exam may test** The direction of the scale (-20 highest priority, 19 lowest); who may
lower a nice value; and that renicing does not help when the bottleneck is memory or I/O rather
than CPU.

<a id="cmp-sysadmin.system-administration.process-priority-and-nice"></a>
#### Not to be confused with: Process priority and nice vs Signals
*compares: `sysadmin.system-administration.process-priority-and-nice`, `sysadmin.system-administration.signals`*

| | Process priority and nice | Signals |
| --- | --- | --- |
| What it changes | How much CPU time a process is scheduled for | Whether and how a process continues to run at all |
| Reversible by the sender | Only with privilege, once raised | SIGSTOP is undone by SIGCONT; SIGKILL is not undone by anything |
| Can the process refuse | It is never consulted | Yes, for every signal except SIGKILL and SIGSTOP |
| Right answer for | "This batch job is starving the database" | "This process must stop now" |
| Command | `nice`, `renice` | `kill`, `pkill`, `killall` |

The separating axis is continuous versus discrete: nice tunes how much CPU a process gets while it
keeps running, whereas a signal is a one-off event that asks it to stop, pause, resume, or reload.

<a id="c-sysadmin.system-administration.daemon"></a>
### Daemon
*id: `sysadmin.system-administration.daemon` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: systemd-1, man-proc-5*

**What it is** A long-running background process with no controlling terminal, usually started at
boot and expected to keep running until the system stops. The trailing `d` in `sshd`, `crond`,
`systemd-journald` is the naming convention.

**Why it matters** "Daemon" describes how a process runs; "service" describes how it is managed.
The exam presents them as interchangeable and they are not, so a question that names one is
testing whether you can say what the other adds.

**How it works** Classically a daemon detached itself: fork, let the parent exit, call `setsid()`
to leave the terminal session, close inherited descriptors, and re-parent to PID 1. Under systemd
most daemons no longer do this — the manager creates the environment for them and supervises the
process it started directly, which is why unit files are commonly written with `Type=simple` and
why a daemon that forks needlessly can confuse its own supervisor.

**Key terms** controlling terminal; `setsid()`; double fork; `Type=simple`.

**Traps** Not every background process is a daemon: a job you started with `&` is still attached
to your terminal session and dies with it. And not every daemon is a service in the systemd sense —
a program can detach itself perfectly well without any unit file, in which case nothing supervises
it, nothing restarts it, and nothing brings it back at boot.

**What the exam may test** Recognising a described process (no terminal, started at boot, runs
continuously) as a daemon, and separating that description from the management layer a service
adds on top of it.

<a id="cmp-sysadmin.system-administration.daemon"></a>
#### Not to be confused with: Daemon vs Process
*compares: `sysadmin.system-administration.daemon`, `sysadmin.system-administration.process`*

| | Daemon | Process |
| --- | --- | --- |
| Scope of the term | A subset: processes that run detached in the background | Every running instance of a program, foreground or background |
| Controlling terminal | None | Usually one, unless deliberately detached |
| Lifetime | Boot to shutdown | Anything from milliseconds to indefinite |
| Started by | The init system, or by self-detaching at startup | Anyone executing a program |
| Naming convention | Often ends in `d` | None |

The separating axis is set membership: every daemon is a process, but a process is only a daemon
once it has detached from a terminal and settled into a long-running background role.

#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `sysadmin.system-administration.zombie-and-orphan-processes` | Zombie and orphan processes | A zombie has already exited but its parent has not read its exit status, so its process-table entry lingers; an orphan is still running but its parent died, so it is re-parented to PID 1. | Both are routinely mistaken for ordinary runaway processes. A zombie (`Z` or `defunct` in `ps`) cannot be killed because it is already dead — you signal the *parent* so it reaps, or let PID 1 reap it when the parent exits — and it consumes no CPU or memory, only a table slot. [Not to be confused with process](system-administration.md#cmp-sysadmin.system-administration.process). |

#### Scenario

A nightly report job is pinning a core and the database has gone sluggish. `top` shows the job at
the head of the list; `ps -ef` gives its PID and, in the PPID column, the shell that launched it.
The right first move is not `kill -9`: `renice -n 15 -p 4821` sets an absolute nice value on the
job that lets the database win the CPU without losing the report's work. If it must actually stop, `kill`
sends SIGTERM and gives it a chance to close its output file; only if it is still there a minute
later does `kill -9` become appropriate. Afterwards `ps` shows a `defunct` entry with the old PID —
a zombie, not a survivor: it holds no memory, and it disappears when its parent reaps it or, if the
parent has exited too, when PID 1 adopts and reaps it. The report is then rescheduled to run under
`nohup ... &` so a dropped SSH session cannot SIGHUP it mid-run.

#### Knowledge check

1. What signal does `kill` send by default, and which two signals can never be caught?
   SIGTERM (15) by default; SIGKILL (9) and SIGSTOP can never be caught, blocked, or ignored.
2. Why is `kill -9` the wrong first choice?
   It gives the process no opportunity to flush buffers, close files, or release locks — SIGTERM
   asks for an orderly shutdown, SIGKILL removes the process outright.
3. What is the one-sentence difference between a daemon and a service?
   A daemon is a process that runs detached in the background; a service is that process wrapped
   in an init system's supervision policy.
4. A user runs `nice -n -5 ./job` and gets an error. Why?
   Lowering a nice value requires root or `CAP_SYS_NICE`, unless `RLIMIT_NICE` has been raised —
   which by default it has not. Raising the value would have been allowed.
5. `ps` shows a process as `defunct`. What is it, and does `kill -9` clear it?
   A zombie: it has already exited and is waiting to be reaped. `kill -9` does nothing to it;
   signal the parent so it reaps, or let PID 1 reap it once the parent exits.
6. A job started with `&` dies when the SSH session closes. What does `nohup` change, and what
   does it not?
   `nohup` makes the command immune to SIGHUP so it survives the hangup; it does not put the job
   in the background, which still requires `&`.

<a id="s-system-administration-services-and-init"></a>
## Services and init

<a id="c-sysadmin.system-administration.service"></a>
### Service
*id: `sysadmin.system-administration.service` · depth 3 · importance 4 · LFS200: FULLY COVERED · sources: systemd-unit-5, systemd-systemctl-1*

**What it is** A facility the system manages rather than merely runs: something with a definition
saying how to start it, what it depends on, what to do when it exits, and whether it should come
back at boot. A bare process you launch by hand has none of that.

**Why it matters** Every "why did this not come back after the reboot" and "why does this keep
dying" question turns on the management layer. The process is the same either way; the difference
is whether anything is watching it.

**How it works** On a systemd system a service is described by a `.service` unit: `ExecStart`
names the command, `User=` the identity it runs as, `Restart=` the policy when it exits,
`After=`/`Requires=` its ordering and dependencies, and `[Install] WantedBy=` the target that
should pull it in at boot. The manager starts the process, tracks every process it forks using a
cgroup rather than a PID file, captures its standard output into the journal, and applies the
restart policy when it stops.

**Key terms** unit; `ExecStart`; `Restart=`; cgroup tracking.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `systemctl` | The control interface for units and the manager | `status`, `start`, `stop`, `restart`, `reload`, `enable`, `disable`, `mask`, `is-active`, `is-enabled` | `systemctl status nginx` | Confusing `restart` (stop then start the process) with `reload` (tell the running process to re-read its own configuration) — and `mask` with `disable` |

**Traps** `systemctl disable` only removes the boot-time symlink; the unit can still be started
manually or pulled in as another unit's dependency. `systemctl mask` links the unit to
`/dev/null`, after which it cannot be started at all, by anyone, until it is unmasked. A scenario
that says "it must never start under any circumstances" is asking for `mask`, not `disable`.

**What the exam may test** Distinguishing service from process; the `restart`/`reload` and
`disable`/`mask` pairs; and recognising that restart policy and boot-time activation are
properties of the unit definition, not of the program.

*Not to be confused with [process](system-administration.md#cmp-sysadmin.system-administration.process).*

<a id="c-sysadmin.system-administration.systemd"></a>
### systemd
*id: `sysadmin.system-administration.systemd` · depth 3 · importance 4 · LFS200: FULLY COVERED · sources: systemd-1*

**What it is** The init system and service manager used by most modern distributions. It is the
first user-space process the kernel starts, runs as PID 1 for the life of the machine, and is the
ancestor and supervisor of everything else — including the logging, device, and mount subsystems
that were separate daemons under earlier init systems.

**Why it matters** Nearly every service, log, timer, and boot question on this exam assumes
systemd, and its scope is broader than "the thing that starts daemons": `journald`, `logind`,
`systemd-timers`, and unit-managed mounts are all part of the same project, which is why the
answers to logging and scheduling questions keep coming back to it.

**How it works** systemd starts units in dependency order, activating them in parallel wherever
the declared ordering allows, rather than running scripts one after another as SysV init did. It
tracks each service's processes in a cgroup, so a daemon that forks cannot escape supervision.
Boot converges on `default.target`, which pulls in everything that target wants.

**Key terms** PID 1; unit; parallel activation; cgroup.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `systemctl` | Query and control the manager and its units | `list-units`, `list-unit-files`, `daemon-reload`, `--failed` to show units that failed | `systemctl --failed` | Reading `systemctl status` output's "enabled/disabled" line as whether the service is *running* — it reports boot-time activation, and "active/inactive" reports running state |
| `systemd-analyze` | Report boot performance | no argument prints total startup time split into firmware, loader, kernel and userspace; `blame` ranks units by initialisation time; `critical-chain` shows the ordering chain | `systemd-analyze` | Treating `blame`'s slowest unit as the cause of a slow boot — a slow unit that nothing waits for does not delay anything; `critical-chain` is the one that shows what actually held boot up |

**Traps** systemd is not the same thing as `systemctl`: systemd is the manager process (PID 1),
`systemctl` is the client you type commands into. It is also not the only init system — several
distributions ship alternatives — so a question about `runlevel`-era behaviour is asking about
SysV init, not about systemd's compatibility shims.

**What the exam may test** That systemd runs as PID 1; that it supervises services rather than
merely launching them; and separating the manager from the `systemctl` command used to drive it.

*Not to be confused with [runlevel](system-administration.md#cmp-sysadmin.system-administration.runlevel).*

<a id="c-sysadmin.system-administration.unit-and-unit-file"></a>
### Unit and unit file
*id: `sysadmin.system-administration.unit-and-unit-file` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: systemd-unit-5*

**What it is** A unit is systemd's object of management, and the unit file is the INI-style text
file that declares how it behaves. The suffix names the type: `.service` for a process,
`.socket` for a listening socket, `.timer` for a schedule, `.mount` for a filesystem, `.target`
for a grouping, plus `.path`, `.device`, `.swap`, `.slice` and `.scope`.

**Why it matters** The suffix is not decoration — `nginx.service` and `nginx.socket` are different
units with different behaviour, and a `systemctl` command with no suffix defaults to `.service`,
which is why some commands appear to silently target the wrong thing.

**How it works** Unit files are read from three directories with increasing precedence:
`/usr/lib/systemd/system` for distribution-shipped units, `/run/systemd/system` for runtime
units, and `/etc/systemd/system` for administrator overrides, which win. Rather than editing a
vendor file in place — where the next package update overwrites it — the supported approach is a
drop-in: a small file under `/etc/systemd/system/<unit>.d/override.conf` containing only the
directives being changed. A unit file has `[Unit]`, a type-specific section such as `[Service]`,
and `[Install]`, and only what is under `[Install]` has any effect on `enable`.

**Key terms** drop-in override; `[Unit]`/`[Service]`/`[Install]`; precedence; unit suffix.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `systemctl cat` | Print the effective unit file plus every drop-in, with each file's path as a comment | takes a unit name | `systemctl cat nginx.service` | Reading only `/usr/lib/systemd/system/…` and missing an `/etc` override or a drop-in that changes the behaviour |
| `systemctl list-units` | List units the manager currently has loaded | `--all` include inactive, `--type=service` filter, `--state=failed`; contrast `list-unit-files`, which lists installed files and their enablement | `systemctl list-units --type=service` | Expecting it to list every unit installed on the system — it lists loaded units only; use `list-unit-files` for the full inventory |

**Traps** Editing a vendor unit file under `/usr/lib/systemd/system` works until the package is
updated, at which point the change disappears. And a unit with no `[Install]` section cannot be
enabled at all — `systemctl enable` on it reports that it has no installation configuration, which
is correct behaviour and not an error to work around.

**What the exam may test** Naming a unit type from its suffix; knowing that `/etc/systemd/system`
overrides `/usr/lib/systemd/system`; and choosing `systemctl cat` to see what is actually in
effect.

<a id="c-sysadmin.system-administration.systemctl-start-vs-enable"></a>
### systemctl start vs enable
*id: `sysadmin.system-administration.systemctl-start-vs-enable` · depth 5 · importance 4 · LFS200: FULLY COVERED · sources: systemd-systemctl-1*

**What it is** Two orthogonal operations. `start` acts on the running system right now and does
nothing about the next boot. `enable` acts on the next boot and does nothing to the running
system. Neither implies the other, and that independence is the whole topic.

**Why it matters** This is among the most commonly tested distinctions in the competency and one
of the most common real outages: a service configured and started by hand works perfectly for
months, the machine reboots for an unrelated reason, and the service is simply not there. Nothing
was broken — it was never enabled.

**How it works** `start` tells the manager to activate the unit immediately. `enable` reads the
unit's `[Install]` section and creates a symlink in the wanted target's `.wants` directory — for
example `/etc/systemd/system/multi-user.target.wants/nginx.service` pointing at the unit file — so
that when that target is reached at boot, the unit is pulled in. `disable` removes the symlink;
`stop` deactivates the running instance. Because the two states are independent, all four
combinations are possible, and `systemctl is-active` and `systemctl is-enabled` report them
separately.

**Key terms** `[Install]`; `.wants` symlink; `is-active` versus `is-enabled`; `--now`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `systemctl start` | Activate a unit immediately | no persistence; pair with `stop` | `systemctl start nginx` | Assuming a successful start means the service will return after a reboot |
| `systemctl enable` | Create the boot-time symlink from the unit's `[Install]` section | `--now` also starts it; `disable` reverses it | `systemctl enable nginx` | Assuming `enable` starts the service now — it does not, so the machine can be "configured" while nothing is actually running |
| `systemctl enable --now` | Enable and start in one step | equivalent to `enable` followed by `start`; `disable --now` is the reverse | `systemctl enable --now nginx` | Forgetting it exists and doing only half the job |

**Traps** `enable` can succeed while the service is broken, because it only creates a symlink and
never executes `ExecStart`; the first evidence of the failure is at boot. Conversely `start` can
succeed on a unit that will never come back, because nothing about starting consults `[Install]`.
And `systemctl status` shows both facts on separate lines — `Loaded: … enabled` is the boot state,
`Active: active (running)` is the current state — which is exactly the pair candidates conflate.

**Symptoms and diagnostic order** "The service is gone after a reboot" is diagnosed in this order:
`systemctl is-enabled <unit>` — if it reports `disabled`, that is the whole answer, and
`enable --now` fixes it. If it reports `enabled`, the unit was pulled in but failed, so
`systemctl status <unit>` and then `journalctl -u <unit> -b` show why. If it reports `static`, the
unit has no `[Install]` section and is only ever pulled in by another unit, so the fix belongs in
whatever should be depending on it. If it reports `masked`, someone linked it to `/dev/null` and
`unmask` is required before anything else will work. The mirror-image symptom — "I enabled it and
nothing happened" — is not a fault at all: `enable` was never going to start it.

**Syntax worth memorising**

```
systemctl start nginx          # now, not at boot
systemctl enable nginx         # at boot, not now
systemctl enable --now nginx   # both
systemctl disable --now nginx  # neither
systemctl is-active nginx      # running state:  active | inactive | failed
systemctl is-enabled nginx     # boot state:     enabled | disabled | static | masked
systemctl mask nginx           # cannot be started at all, even manually
```

**What the exam may test** Which command a stated requirement needs ("survive a reboot",
"take effect immediately", "both"); that the two states are independent; and that `is-enabled`
rather than `is-active` answers the boot-persistence question.

<a id="c-sysadmin.system-administration.systemd-target"></a>
### systemd target
*id: `sysadmin.system-administration.systemd-target` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: systemd-special-7, systemd-systemctl-1*

**What it is** A unit type that groups other units to represent a system state. `multi-user.target`
is a fully booted non-graphical system, `graphical.target` pulls that in and adds a display
manager, `rescue.target` is a minimal single-user state, and `emergency.target` is more minimal
still. Targets replaced runlevels and are not merely renamed versions of them.

**Why it matters** The boot's destination, and every "boot into a minimal state to fix something"
scenario, is expressed as a target. The structural difference from runlevels — targets can be
active simultaneously, runlevels could not — is also directly examinable.

**How it works** `default.target` is a symlink naming where boot converges; `systemctl get-default`
reads it and `set-default` rewrites it. Units declare `WantedBy=multi-user.target` in their
`[Install]` section, and enabling them creates the symlink that makes the target pull them in.
`systemctl isolate` switches to a target immediately, starting what it wants and stopping every
unit that is not part of it — which on a running server is disruptive and is precisely what makes
it a useful exam distractor.

**Key terms** `default.target`; `WantedBy=`; `isolate`; `rescue.target`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `systemctl get-default` | Print the target the system boots into | pair with `set-default <target>` to change it | `systemctl get-default` | Confusing it with `systemctl is-system-running`, which reports current state rather than the boot destination |
| `systemctl isolate` | Switch to a target now, stopping units not wanted by it | takes a target name; `rescue.target` and `emergency.target` are the usual arguments | `systemctl isolate multi-user.target` | Using `isolate` when only a permanent change was wanted — it changes the running system but not the default, and it stops running services in the process |

**Traps** `set-default` and `isolate` answer different questions: `set-default graphical.target`
changes where the *next* boot goes and does nothing now; `isolate graphical.target` changes the
running system and does nothing about next boot. Also, several targets are active at once in
normal operation — `graphical.target` does not replace `multi-user.target`, it pulls it in.

**What the exam may test** Naming the target for a described state; the `get-default`/`set-default`
versus `isolate` distinction; and knowing that targets compose rather than exclude one another.

*Not to be confused with [runlevel](system-administration.md#cmp-sysadmin.system-administration.runlevel).*

<a id="c-sysadmin.system-administration.runlevel"></a>
### Runlevel
*id: `sysadmin.system-administration.runlevel` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: systemd-special-7*

**What it is** SysV init's notion of system state, numbered 0 to 6: 0 halt, 1 single-user, 3
full multi-user without graphics, 5 multi-user with a graphical login, 6 reboot (2 and 4 were
site-defined). Exactly one runlevel was active at a time. On a systemd system runlevels survive
only as an approximate compatibility mapping.

**Why it matters** The numbers are still the shorthand the exam and the kernel command line use,
and the mapping to targets is a direct recall item. Knowing that the mapping is approximate — not
a rename — is what separates a correct answer from a plausible one.

**How it works** systemd documents the mapping as: 0 to `poweroff.target`, 1 to `rescue.target`,
2, 3 and 4 all to `multi-user.target`, 5 to `graphical.target`, and 6 to `reboot.target`. Note
that three runlevels collapse onto one target, which is why the mapping cannot be reversed
cleanly. The `runlevel` command prints the previous and current runlevel separated by a space,
printing `N` where one cannot be determined — so a freshly booted graphical system typically
reports `N 5`.

**Key terms** SysV init; `N 5`; approximate mapping; `/etc/inittab` (historical).

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `runlevel` | Print the previous and current SysV runlevel | no options beyond `--help`; reads the utmp database | `runlevel` | Reading the two characters as a range or as a single value — the first is the *previous* runlevel and `N` means "none recorded" |

**Traps** Runlevels are mutually exclusive and targets are not, so the mapping loses information
in both directions: several targets can be active simultaneously, and runlevels 2, 3 and 4 all
answer to the same target. Runlevels should not be used in new configuration; they persist mainly
as a shorthand on the kernel command line, where `1` still selects `rescue.target`.

**What the exam may test** The number-to-target mapping, especially 3 and 5; that runlevel 0 is
halt and 6 is reboot (not the reverse); and that systemd's support for them is a compatibility
layer rather than the real mechanism.

<a id="cmp-sysadmin.system-administration.runlevel"></a>
#### Not to be confused with: Runlevel vs systemd vs systemd target
*compares: `sysadmin.system-administration.runlevel`, `sysadmin.system-administration.systemd`, `sysadmin.system-administration.systemd-target`*

| | Runlevel | systemd | systemd target |
| --- | --- | --- | --- |
| What it is | A numbered SysV init system state | The init system and service manager itself | A unit that groups other units into a state |
| How many active at once | Exactly one | Not applicable — it is the manager, not a state | Several, composed together |
| Identified by | A digit, 0-6 | Being PID 1 | A name ending in `.target` |
| Set with | `init N` (historical) | Not applicable | `systemctl isolate`, `systemctl set-default` |
| Status today | A compatibility shim; do not use in new work | The mechanism in use | The mechanism in use |

The separating axis is layer: systemd is the manager, a target is the state that manager converges
on, and a runlevel is the older, mutually exclusive notion of state that targets replaced — which
is why the number-to-target mapping is approximate rather than a translation.

<a id="c-sysadmin.system-administration.daemon-reload"></a>
### daemon-reload
*id: `sysadmin.system-administration.daemon-reload` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: systemd-systemctl-1*

**What it is** The command that makes systemd re-read unit files from disk and rebuild its
in-memory dependency graph. Until it runs, the manager continues to act on the unit definitions it
loaded earlier, whatever the files now say.

**Why it matters** Editing a unit and then restarting the service is the natural sequence and it is
wrong: the restart uses the old definition, the change appears not to have worked, and the usual
next step is to edit something else that was never the problem.

**How it works** systemd caches parsed unit files. `systemctl daemon-reload` rescans the unit
directories, applies precedence and drop-ins, and rebuilds the dependency graph — without
restarting any running service, so the new definition applies to the *next* activation. Adding a
new unit file, deleting one, or editing an existing one all require it. `systemctl edit` runs it
automatically after saving a drop-in, which is one reason to prefer it over editing files by hand.

**Key terms** in-memory unit cache; dependency graph; drop-in; `systemctl edit`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `systemctl daemon-reload` | Re-read all unit files and rebuild the dependency graph | takes no unit argument — it is a manager-wide operation | `systemctl daemon-reload` | Confusing it with `systemctl reload <unit>`, which asks one running service to re-read its own configuration file and does nothing about unit definitions |

**Traps** Three similarly named operations do three different things. `systemctl daemon-reload`
re-reads *unit files*. `systemctl reload nginx` tells *nginx* to re-read `nginx.conf`.
`systemctl restart nginx` stops and starts the process. A question describing an edited unit file
needs the first; a question describing an edited application config needs the second.

**What the exam may test** Recognising that an edited unit file has no effect until
`daemon-reload`; and separating manager-level reload from service-level reload and restart.

#### Scenario

A new application ships a unit file dropped into `/etc/systemd/system/report.service`.
`systemctl start report` fails with "Unit report.service not found" — the manager has not rescanned
the directory, so `systemctl daemon-reload` comes first. It then starts, and `systemctl status`
shows `Active: active (running)` alongside `Loaded: … disabled`. That second word is the one that
matters: after the next reboot the service will be absent, because nothing has created the
`multi-user.target.wants` symlink. `systemctl enable --now report` fixes both halves at once. A
week later the team edits the unit to add `Restart=on-failure` and runs `systemctl restart report`;
nothing changes, because the manager is still acting on the cached definition — `daemon-reload`
again, then restart. Finally, someone proposes `systemctl isolate multi-user.target` to "drop the
GUI"; on a running server that stops every unit the target does not want, which is not what was
asked for — `systemctl set-default multi-user.target` and a reboot is.

#### Knowledge check

1. What is the one-sentence difference between `systemctl start` and `systemctl enable`?
   `start` activates the unit now and says nothing about boot; `enable` creates the boot-time
   symlink and does not start anything.
2. A service runs fine but disappears after a reboot. Which single command diagnoses it, and what
   answer confirms the cause?
   `systemctl is-enabled <unit>`; a reply of `disabled` is the whole explanation.
3. What is the difference between `disable` and `mask`?
   `disable` removes the boot-time symlink but the unit can still be started manually or as a
   dependency; `mask` links it to `/dev/null` so it cannot be started at all.
4. Which runlevels map to `multi-user.target`, and which maps to `graphical.target`?
   Runlevels 2, 3 and 4 all map to `multi-user.target`; runlevel 5 maps to `graphical.target`.
5. A unit file was edited and the service restarted, but the change had no effect. Why?
   systemd is still using its cached copy of the unit file; `systemctl daemon-reload` must run
   before the restart.
6. Where should an administrator change a distribution-shipped unit, and why not in place?
   In a drop-in under `/etc/systemd/system/<unit>.d/override.conf` (or via `systemctl edit`),
   because `/etc` takes precedence and an edit to the vendor file under `/usr/lib` is overwritten
   by the next package update.

<a id="s-system-administration-package-management"></a>
## Package management

<a id="c-sysadmin.system-administration.package"></a>
### Package
*id: `sysadmin.system-administration.package` · depth 3 · importance 4 · LFS200: FULLY COVERED · sources: debian-dpkg-1, man-rpm-8*

**What it is** A single distributable archive bundling compiled software with the metadata needed
to install it: a name and version, the list of packages it depends on, the list of files it will
place on the filesystem, and scripts run before and after installation. `.deb` and `.rpm` are the
two formats an LFCA candidate needs to recognise.

**Why it matters** The metadata is the reason a package is not just a tarball. It is what lets the
system know which files belong to which package, refuse an installation whose dependencies are
absent, and remove software cleanly later — none of which is possible with software copied into
place by hand.

**How it works** Installing a package registers it in a local database (dpkg's status database, or
the RPM database), so the system can afterwards answer "which package owns this file," "what
version is installed," and "what would removing this break." That database, not the archive, is
what the query commands read. A package is a *file*; where it is fetched from is a separate
concept.

**Key terms** package metadata; dependency list; local package database; `.deb`/`.rpm`.

**Traps** A package is not the software's source, and it is not the repository it came from. It is
also not a container image: an image bundles an entire userland and its own filesystem, whereas a
package installs files into an existing system and relies on that system's shared libraries.

**What the exam may test** What the metadata inside a package is for; that installation is
recorded in a local database; and separating the package (an artefact) from the repository (a
place) and the package manager (a tool).

<a id="cmp-sysadmin.system-administration.package"></a>
#### Not to be confused with: Package vs Language package managers vs Repository
*compares: `sysadmin.system-administration.package`, `devops.devops-basics.language-package-managers`, `sysadmin.system-administration.repository`*

| | Package | Language package managers | Repository |
| --- | --- | --- | --- |
| What it is | One installable archive plus its metadata | Tools such as npm, pip and Maven that resolve an application's own libraries | A server-hosted collection of packages |
| Scope of what it installs | System-wide software owned by the distribution | Libraries for one project or one language runtime | Nothing — it is a source, not an installer |
| Recorded where | The system package database | A project manifest and lock file | Client-side in `/etc/apt/sources.list.d/` or `/etc/yum.repos.d/` |
| Who resolves dependencies | The OS package manager, using the package's metadata | The language tool, using the manifest | Not applicable |
| Typical example | `nginx_1.24-1_amd64.deb` | `npm install express` | `deb http://deb.debian.org/debian stable main` |

The separating axis is scope of ownership: an OS package installs files the distribution is
responsible for, a language package manager installs libraries one application is responsible for,
and a repository is only the place either kind of artefact is fetched from.

<a id="c-sysadmin.system-administration.repository"></a>
### Repository
*id: `sysadmin.system-administration.repository` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: debian-apt-8, dnf-command-ref*

**What it is** A server-hosted collection of packages, published with an index the package manager
downloads so it can search, compare versions, and resolve dependencies without fetching every
package first. The client's list of repositories is local configuration; the packages themselves
are remote.

**Why it matters** Almost every installation failure that is not a dependency problem is a
repository problem: an index that has not been refreshed, a repository that is not configured, or
a third-party repository whose signing key is missing. Knowing where the configuration lives is
half of the diagnosis.

**How it works** Debian-family systems list repositories in `/etc/apt/sources.list` and files
under `/etc/apt/sources.list.d/`; Red Hat-family systems use `.repo` files under
`/etc/yum.repos.d/`. The manager downloads the index — the package list with versions, dependencies
and checksums — and caches it locally. Repository metadata and packages are cryptographically
signed, and the client verifies them against a stored key, which is why adding a third-party
repository always involves importing its key as a separate step.

**Key terms** index/metadata; `sources.list.d`; `.repo` file; GPG signing key.

**Traps** The locally cached index is a snapshot, not a live view. A package released an hour ago
is invisible until the index is refreshed, which is why "no installation candidate" so often means
"stale index" rather than "the package does not exist." Enabling extra repositories is also not
free: mixing repositories from different distribution versions is the standard route to an
unresolvable dependency tree.

**What the exam may test** Where repository configuration lives on each family; that the index is
cached client-side; and why an unsigned or unkeyed repository is refused.

*Not to be confused with [package](system-administration.md#cmp-sysadmin.system-administration.package).*

<a id="c-sysadmin.system-administration.dependency"></a>
### Dependency
*id: `sysadmin.system-administration.dependency` · depth 2 · importance 4 · LFS200: PARTIALLY COVERED · sources: debian-apt-8, debian-dpkg-1*

**What it is** A package that another package requires in order to work — usually a shared library
or a helper binary. Dependencies are declared in the package's metadata, so the manager can work
out the full set that must be installed before the requested package can be configured.

**Why it matters** Dependency resolution is the single feature that separates a repository-aware
tool (`apt`, `dnf`) from a single-package tool (`dpkg`, `rpm`), and it is the reason installing
one small utility can pull in a dozen other packages. A broken dependency tree — half-configured
packages, a held-back version, an unsatisfiable requirement from a mismatched third-party
repository — is a recognisable failure symptom rather than a mysterious one.

**How it works** The manager reads the requested package's declared dependencies, resolves them
recursively against the cached repository index, and orders the installation so that every
requirement is present before the package that needs it is configured. Reverse dependencies work
the same way in the other direction, which is how removal knows what else would break. A
dependency is not the same as a *recommended* or *suggested* package: only a hard dependency
blocks installation.

**Key terms** transitive dependency; reverse dependency; recommends versus depends; unresolvable
tree.

<a id="c-sysadmin.system-administration.apt-and-dpkg"></a>
### apt and dpkg
*id: `sysadmin.system-administration.apt-and-dpkg` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: debian-apt-8, debian-dpkg-1*

**What it is** The Debian-family pair, one layer above the other. `dpkg` is the low-level tool that
installs, removes, and queries a single `.deb` file already on disk, and it does not resolve
dependencies. `apt` is the high-level tool that talks to repositories, resolves dependencies, and
then drives `dpkg` to do the actual work.

**Why it matters** The division of labour is the examinable point, and it is also the everyday
diagnosis: `dpkg -i` on a package with unmet dependencies leaves the system in a half-configured
state that only an `apt` invocation can clean up.

**How it works** `apt update` refreshes the cached repository indexes; `apt install` resolves
what is needed and downloads it; `dpkg` unpacks each archive and runs its maintainer scripts. The
package database `dpkg` maintains is what `dpkg -l` and `dpkg -L` query, which is why those
commands report on *installed* packages rather than on what is available. Installing a local file
with dependency resolution is possible — `apt install ./package.deb` — and is generally preferable
to `dpkg -i` for exactly that reason.

**Key terms** low-level versus high-level; maintainer scripts; half-configured state;
`apt install ./file.deb`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `apt install` | Resolve dependencies and install from configured repositories | `-y` assume yes, `--no-install-recommends` skip recommended packages, `--reinstall` | `apt install nginx` | Running it without a prior `apt update` on a long-idle machine and installing from a stale index |
| `apt update` | Refresh the cached repository indexes | `--allow-releaseinfo-change` when a release's metadata changed | `apt update` | Believing it upgrades anything — it downloads index files only |
| `apt upgrade` | Install newer versions of installed packages | `-y`; contrast `apt full-upgrade`, which may remove packages to complete the upgrade | `apt upgrade` | Expecting it to handle an upgrade that requires removing a package — plain `upgrade` will hold that package back instead |
| `dpkg -i` | Install a single local `.deb` with no dependency resolution | `--force-*` overrides that usually make things worse | `dpkg -i ./tool_1.0_amd64.deb` | Using it for a package with unmet dependencies, leaving it unpacked but unconfigured until `apt --fix-broken install` repairs it |
| `dpkg -l` | List installed packages and their state | takes an optional glob pattern; the two-letter state column shows `ii` for installed and configured | `dpkg -l 'nginx*'` | Reading it as "packages available" — it lists the local database, not the repositories |
| `dpkg -L` | List the files a named installed package placed on the system | pairs with `dpkg -S <path>`, which answers the reverse question | `dpkg -L nginx` | Passing a `.deb` filename instead of a package name — `-L` queries the installed database, not an archive |

**Traps** `dpkg` and `apt` fail in different ways for the same underlying problem. `dpkg -i` with
missing dependencies exits with an error and leaves the package unpacked-but-unconfigured, which
then blocks other operations until `apt --fix-broken install` (or `apt -f install`) resolves it.
And `dpkg -L` versus `dpkg -S` is a direction question: `-L` goes package to files, `-S` goes file
to package.

**What the exam may test** Which of the two tools resolves dependencies; what `dpkg -i` does when
they are missing; and choosing between `dpkg -L` and `dpkg -S` from a stated need.

<a id="cmp-sysadmin.system-administration.apt-and-dpkg"></a>
#### Not to be confused with: apt and dpkg vs dnf, yum and rpm
*compares: `sysadmin.system-administration.apt-and-dpkg`, `sysadmin.system-administration.dnf-yum-and-rpm`*

| | apt and dpkg | dnf, yum and rpm |
| --- | --- | --- |
| Family | Debian, Ubuntu, Linux Mint | RHEL, Fedora, CentOS Stream, Rocky Linux |
| Package format | `.deb` | `.rpm` |
| High-level, repository-aware tool | `apt` (and `apt-get`) | `dnf`; `yum` is the older name, kept as a compatibility alias |
| Low-level, single-file tool | `dpkg` | `rpm` |
| Refresh the index | `apt update`, as an explicit step | `dnf` refreshes metadata automatically when it has expired |
| Install a named package | `apt install nginx` | `dnf install nginx` |
| Repository configuration | `/etc/apt/sources.list`, `/etc/apt/sources.list.d/` | `.repo` files in `/etc/yum.repos.d/` |
| List a package's files | `dpkg -L nginx` | `rpm -ql nginx` |

The separating axis is family, not capability: both columns have the same two-layer design — a
repository-aware resolver on top of a single-package installer — so a question naming one tool is
usually asking which layer it sits at, and only then which family it belongs to.

<a id="c-sysadmin.system-administration.dnf-yum-and-rpm"></a>
### dnf, yum and rpm
*id: `sysadmin.system-administration.dnf-yum-and-rpm` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: dnf-command-ref, man-rpm-8*

**What it is** The Red Hat-family equivalents, with the same two-layer split. `rpm` handles a
single local `.rpm` file and queries the RPM database; `dnf` talks to repositories and resolves
dependencies. `yum` is the previous generation of the high-level tool, retained on current systems
as a compatibility name for `dnf`.

**Why it matters** Mapping a distribution to its package manager is a pure recall item the exam
tests directly, and the `yum`/`dnf` relationship is the one candidates most often get backwards —
`dnf` is the successor, not a variant.

**How it works** `dnf install` resolves against the repositories configured in `/etc/yum.repos.d/`,
downloads what is needed, and hands the packages to the RPM layer. `rpm` queries the installed
package database with `-q` and its sub-options, and can install a single file with `-i` (or upgrade
with `-U`) without any dependency resolution at all. Transactions are recorded, so `dnf history`
can list and even undo a previous operation — a facility `apt` has no direct equivalent for.

**Key terms** RPM database; `/etc/yum.repos.d/`; `dnf history`; query sub-options.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `dnf install` | Resolve dependencies and install from configured repositories | `-y` assume yes, `--enablerepo`/`--disablerepo` for one transaction, `--nogpgcheck` (rarely appropriate) | `dnf install nginx` | Reaching for `yum` on a modern system and assuming it is a different tool — it is the same tool under its old name |
| `rpm -q` | Query the database of *installed* packages | `-a` all installed, `-i` package information, `-f PATH` which package owns a file, `-p` query an uninstalled `.rpm` file instead | `rpm -q nginx` | Pointing it at a downloaded `.rpm` file without `-p` — without that option it looks the name up in the installed database and reports "not installed" |
| `rpm -ql` | List the files an installed package placed on the system | combine with `-p` to list the contents of an `.rpm` file that is not installed | `rpm -ql nginx` | Confusing it with `rpm -qf`, which answers the opposite question: which package owns a given file |

**Traps** `rpm` does not resolve dependencies, so `rpm -i` on a package with unmet requirements
fails outright rather than half-installing — the opposite failure mode from `dpkg -i`, which
unpacks first and leaves the package unconfigured. And `rpm -q` defaults to the installed
database: querying a file on disk needs `-p`.

**What the exam may test** Matching family to tool; which of `rpm` and `dnf` resolves dependencies;
and the `-q`, `-ql`, `-qf`, `-qp` query directions.

*Not to be confused with [apt and dpkg](system-administration.md#cmp-sysadmin.system-administration.apt-and-dpkg).*

<a id="c-sysadmin.system-administration.update-vs-upgrade"></a>
### update vs upgrade
*id: `sysadmin.system-administration.update-vs-upgrade` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: debian-apt-8*

**What it is** On Debian-family systems these are two different operations whose names actively
mislead. `apt update` refreshes the local copy of the repository indexes and installs nothing.
`apt upgrade` installs newer versions of packages already on the system. The word "update" does
not update any software.

**Why it matters** The naming is the trap, and it is compounded across families: on Red Hat
systems `dnf update` *is* an upgrade — it is an alias for `dnf upgrade` — so the same verb means
opposite things depending on which distribution the question describes.

**How it works** `apt update` downloads the package lists named in the repository configuration and
rewrites the local cache; nothing on the system changes. `apt upgrade` then compares installed
versions against that cache and installs newer ones. It will install new packages when a
dependency requires it, but it will never remove an installed package; if an upgrade would need a
removal, that package is held back and reported. `apt full-upgrade` is the variant permitted to
remove packages in order to complete the upgrade.

**Key terms** index refresh; held-back package; `full-upgrade`; `dnf update` as an alias.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `apt update` | Refresh the cached repository indexes only | no package argument; failures here are network, key, or configuration problems, not package problems | `apt update` | Running it alone and believing the system is now patched |
| `apt upgrade` | Install newer versions of already-installed packages | `-y` assume yes; `apt full-upgrade` when removals are acceptable; `apt list --upgradable` to preview | `apt upgrade` | Ignoring "the following packages have been kept back" — those are the upgrades that needed a removal and were skipped |

**Traps** Running `apt upgrade` without a preceding `apt update` upgrades against whatever index
was last cached, so on a machine that has been idle it can report that everything is current when
it is months behind. And "kept back" is not an error message to scroll past: it means specific
packages were deliberately not upgraded, and only `full-upgrade` (or a targeted `install`) will
move them.

**What the exam may test** Which of the two downloads package lists and which installs software;
the required order; and that `dnf update` on a Red Hat system means something different from
`apt update` on a Debian one.

<a id="c-sysadmin.system-administration.patch-management"></a>
### Patch management
*id: `sysadmin.system-administration.patch-management` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: debian-apt-8, dnf-command-ref*

**What it is** The disciplined practice around updates rather than the command that applies them:
knowing what is installed, tracking which advisories affect it, testing patches before they reach
production, applying them on a schedule inside a maintenance window, and being able to roll back.

**Why it matters** The exam distinguishes the practice from the mechanism. Anyone can run
`apt upgrade`; patch management is what makes that safe to do on a fleet — an inventory, a
severity-driven priority, a staging environment, and a documented rollback path.

**How it works** An inventory establishes what versions are running. Vendor advisories and CVE
feeds establish what is vulnerable, and severity establishes the order. Patches are applied first
to a test or staging tier, then to production in stages, inside an agreed window, with a rollback
plan — a snapshot, a previous package version, or on Red Hat systems a `dnf history undo`. Security
updates are commonly automated separately from feature updates, because their risk calculus is
different: `unattended-upgrades` on Debian-family systems and `dnf-automatic` on Red Hat-family
ones exist for exactly that split.

**Key terms** inventory; CVE and advisory severity; staged rollout; maintenance window; rollback.

**Traps** Patch management is not "keep everything at the latest version." Applying every update
the moment it appears is a change-management failure, not diligence — untested changes on
production are how a patch causes the outage it was meant to prevent. Equally it is not only about
the OS: firmware, container base images, and language-level dependencies each need their own
track, and none of them are covered by `apt upgrade`.

**What the exam may test** Recognising the practice (inventory, test, schedule, roll back) as
distinct from running an update command, and identifying which step is missing from a described
process.

*Not to be confused with [patch cadence](best-practices.md#cmp-sysadmin.best-practices.patch-cadence).*

#### Scenario

An administrator is asked to install a monitoring agent shipped as a `.deb` from the vendor's
website. `dpkg -i agent_2.1_amd64.deb` fails: the agent needs a library that is not installed, and
`dpkg` does not resolve dependencies, so the package is now unpacked but unconfigured and blocks
further operations. `apt --fix-broken install` pulls the missing library from the configured
repositories and completes the configuration — or, better, `apt install ./agent_2.1_amd64.deb`
would have done the whole thing correctly in one step. Reviewing the same machine, `apt upgrade`
reports twelve upgrades and three packages "kept back": those three need a removal to proceed and
plain `upgrade` refuses to remove anything. Before running `apt full-upgrade` the administrator
checks the change window, applies it on the staging host first, and confirms `apt update` ran
beforehand — otherwise the comparison was against a stale index and the "twelve upgrades" figure
means nothing.

#### Knowledge check

1. What does `apt update` actually change on the system?
   Only the locally cached repository indexes. It installs and upgrades nothing.
2. What is the two-layer relationship in each family, and which layer resolves dependencies?
   `apt` over `dpkg` on Debian-family systems and `dnf` over `rpm` on Red Hat-family ones; the
   high-level tool (`apt`, `dnf`) resolves dependencies, the low-level one does not.
3. What happens when `dpkg -i` is given a package with unmet dependencies, and how does `rpm -i`
   differ?
   `dpkg -i` unpacks it and leaves it unconfigured, blocking later operations until
   `apt --fix-broken install` repairs it; `rpm -i` refuses the installation outright.
4. `yum` and `dnf` — what is the relationship?
   `dnf` is the successor; on current Red Hat-family systems `yum` is kept as a compatibility name
   for the same tool.
5. `apt upgrade` reports packages "kept back." What does that mean and what moves them?
   The upgrade would have required removing an installed package, which plain `upgrade` never
   does; `apt full-upgrade` is permitted to remove packages to complete the upgrade.
6. What separates patch management from running an update command?
   Inventory, severity-driven prioritisation, testing in a staging tier, a scheduled window, and a
   rollback plan — the command is only the last step.

<a id="s-system-administration-filesystem"></a>
## Filesystem

<a id="c-sysadmin.system-administration.filesystem-hierarchy-standard"></a>
### Filesystem Hierarchy Standard
*id: `sysadmin.system-administration.filesystem-hierarchy-standard` · depth 3 · importance 4 · LFS200: MENTIONED ONLY · sources: fhs-3-0*

**What it is** The specification that defines the purpose of each top-level directory on a Linux
system: what `/etc`, `/var`, `/usr`, `/tmp`, `/opt` and the rest are for, and what may and may not
be placed in them. It is a convention about *layout*, not about how bytes are stored on a disk.

**Why it matters** It is the reason a candidate can be dropped onto an unfamiliar distribution and
still know where configuration lives. Exam questions phrased as "where would you look for X" are
FHS questions, and they are answerable without knowing anything about the machine.

**How it works** The standard classifies each directory along two axes: shareable versus
unshareable (can it be exported to another host) and static versus variable (does it change during
normal operation). `/usr` is shareable and static; `/etc` is unshareable and static; `/var` is
unshareable and variable. That is the reasoning behind rules that otherwise look arbitrary — such
as `/etc` containing no binaries, and `/usr` being mountable read-only. Distributions follow it
closely enough that the layout is portable, while retaining freedom in the details: many modern
systems have merged `/bin`, `/sbin` and `/lib` into symlinks pointing under `/usr`.

**Key terms** shareable versus unshareable; static versus variable; `/usr/local`; merged-`/usr`.

**Traps** The FHS is not a filesystem, and "Filesystem Hierarchy Standard" names neither ext4 nor
XFS nor any other on-disk format. It says nothing about journaling, block size, or maximum file
size — those belong to the filesystem *type*, an entirely separate concept that shares the word.
The second trap is `/opt` versus `/usr/local`: `/opt` is for self-contained third-party packages
that keep their own directory tree, while `/usr/local` is for software the local administrator
builds and installs into the normal hierarchy.

**What the exam may test** Naming the directory for a described purpose (configuration, logs,
user data, third-party add-on software); and separating the hierarchy standard from the on-disk
filesystem type.

<a id="cmp-sysadmin.system-administration.filesystem-hierarchy-standard"></a>
#### Not to be confused with: Filesystem Hierarchy Standard vs Filesystem type
*compares: `sysadmin.system-administration.filesystem-hierarchy-standard`, `sysadmin.system-administration.filesystem-type`*

| | Filesystem Hierarchy Standard | Filesystem type |
| --- | --- | --- |
| What it defines | Which directory means what, across distributions | How data and metadata are laid out on a device |
| Governed by | A published convention distributions choose to follow | The kernel driver that implements the format |
| Examples | `/etc`, `/var`, `/usr`, `/srv` | ext4, XFS, Btrfs, vFAT, NTFS |
| Determines journaling or maximum file size | No | Yes |
| Chosen when | Never — it is the same everywhere | At `mkfs` time, per filesystem |

The separating axis is naming versus formatting: the FHS tells you what a path *means*, and the
filesystem type tells you how the bytes behind that path are actually stored.

<a id="c-sysadmin.system-administration.etc"></a>
### /etc
*id: `sysadmin.system-administration.etc` · depth 2 · importance 4 · LFS200: NOT COVERED · sources: fhs-3-0*

**What it is** Host-specific system configuration. By convention its contents are editable text
files, and the FHS is explicit that no binaries may be placed there — `/etc` holds the settings, not
the programs that read them.

**Why it matters** Nearly every configuration file this competency names lives here:
`/etc/passwd`, `/etc/shadow`, `/etc/group`, `/etc/fstab`, `/etc/sudoers`, `/etc/crontab`,
`/etc/systemd/system`, `/etc/apt/sources.list`. "Where is this configured" is almost always
answered by a path beginning `/etc`, and the classification "host-specific" is why `/etc` is never
shared between machines the way `/usr` can be.

**How it works** Because `/etc` is unshareable and static, it is the natural place for
administrator overrides, and several subsystems use that deliberately: unit files in
`/etc/systemd/system` outrank vendor units in `/usr/lib/systemd/system`, and drop-in directories
such as `/etc/sudoers.d/` and `/etc/apt/sources.list.d/` let local additions sit beside
package-owned files without conflicting with them. Package managers treat `/etc` files as
configuration and try not to overwrite local edits on upgrade.

**Key terms** host-specific; unshareable and static; drop-in directory; configuration override.

<a id="c-sysadmin.system-administration.var"></a>
### /var
*id: `sysadmin.system-administration.var` · depth 2 · importance 4 · LFS200: NOT COVERED · sources: fhs-3-0*

**What it is** Variable data: everything that grows or changes while the system runs. Logs in
`/var/log`, mail and print queues in `/var/spool`, package manager caches in `/var/cache`, database
files and application state in `/var/lib`, and runtime-created temporary files in `/var/tmp`.

**Why it matters** A full `/var` is one of the most common causes of service failure on a Linux
box, and it fails in a characteristic way: services that cannot write their logs or their state
files stop or refuse to start, while the rest of the system keeps working, so the symptom points
away from the cause. Log rotation exists precisely to stop this happening.

**How it works** `/var` is unshareable and variable, so it is frequently given its own partition or
logical volume — which contains the damage when it fills, since the root filesystem stays writable.
`/var/tmp` differs from `/tmp` in exactly one important way: data in `/var/tmp` is expected to be
preserved across reboots, while `/tmp` is not. `/var/lib` is where the dpkg and RPM databases
themselves live, which is why losing `/var` loses the system's record of what is installed.

**Key terms** `/var/log`; `/var/spool`; `/var/lib`; separate partition.

<a id="c-sysadmin.system-administration.home"></a>
### /home
*id: `sysadmin.system-administration.home` · depth 2 · importance 4 · LFS200: FULLY COVERED · sources: fhs-3-0, man-hier-7*

**What it is** The directory beneath which regular users' personal home directories usually live —
`/home/alice`, `/home/bob` — each being that user's default working directory at login and the
value of their `$HOME`. `hier(7)` notes that the exact structure beneath `/home` is a local
administration decision, so site layouts that group users into subdirectories are equally
conformant.

**Why it matters** The superuser is the exception, and it is the exception the exam asks about.
Root's home directory is `/root`, a separate optional directory kept outside `/home` — not
`/home/root`. The FHS's stated rationale is that if root's home directory were not stored on the
root partition, the system would need a fallback default in case that location could not be found,
which is exactly the risk `/home` carries when it is mounted from a separate partition that fails
to come up.

**How it works** A user's home path is recorded in the sixth field of their `/etc/passwd` row, and
nothing requires it to be under `/home` — service accounts routinely have homes such as
`/var/lib/postgresql` or none at all. `useradd -m` creates the directory and populates it from
`/etc/skel`. Because `/home` is so often a separate partition or a network mount, a failure to
mount it leaves ordinary users logging into an empty or non-existent directory while root, whose
home is on the root partition, is unaffected — the separation that the FHS rationale describes.

**Key terms** `$HOME`; `/etc/skel`; `/root`; separate partition.

*Not to be confused with [root directory vs /root vs home](../01-linux-fundamentals/command-line.md#cmp-linux.command-line.root-directory-vs-root-vs-home).*

<a id="c-sysadmin.system-administration.usr"></a>
### /usr
*id: `sysadmin.system-administration.usr` · depth 2 · importance 4 · LFS200: FULLY COVERED · sources: fhs-3-0*

**What it is** The second major hierarchy: shareable, read-only user-land programs and data
installed by the distribution. `/usr/bin` and `/usr/sbin` hold executables, `/usr/lib` shared
libraries, `/usr/share` architecture-independent data such as documentation and locale files, and
`/usr/local` the parallel tree reserved for software the local administrator installs.

**Why it matters** "Read-only and shareable" is the classification that makes the rest make sense:
nothing under `/usr` should change during normal operation, so anything that does change belongs
in `/var`, and anything host-specific belongs in `/etc`. It is also why `/usr/local` exists as a
separate subtree — so locally built software cannot be overwritten by a package update.

**How it works** On merged-`/usr` systems, which is now most of them, `/bin`, `/sbin` and `/lib`
are symlinks into `/usr`, so `/bin/ls` and `/usr/bin/ls` are the same file. Package managers own
everything under `/usr` except `/usr/local`, which they leave alone; that division is why software
compiled from source conventionally installs into `/usr/local/bin` rather than `/usr/bin`.

**Key terms** shareable and static; `/usr/local`; `/usr/share`; merged-`/usr`.

<a id="c-sysadmin.system-administration.tmp"></a>
### /tmp
*id: `sysadmin.system-administration.tmp` · depth 2 · importance 4 · LFS200: MENTIONED ONLY · sources: fhs-3-0, man-inode-7*

**What it is** World-writable temporary space available to every program and every user. The FHS is
explicit that programs must not assume anything in `/tmp` is preserved between invocations, and on
most systems it is cleared on reboot or aged out by a cleanup service.

**Why it matters** It is the standard worked example of the sticky bit: mode `1777` makes it
writable by everyone while restricting deletion and renaming of an entry to the file's owner, the
directory's owner, or a privileged process. Without that bit, world-writable would mean anyone
could delete anyone's work.

**How it works** `ls -ld /tmp` shows `drwxrwxrwt`, the trailing `t` marking the restricted deletion
flag. Many distributions mount `/tmp` as a `tmpfs` — memory-backed storage that never touches a
disk and is empty after every boot — which makes it fast but means a large temporary file consumes
RAM. `/var/tmp` is the counterpart for temporary data that must survive a reboot.

**Key terms** `1777`; sticky bit; `tmpfs`; `/var/tmp`.

<a id="c-sysadmin.system-administration.proc-and-sys"></a>
### /proc and /sys
*id: `sysadmin.system-administration.proc-and-sys` · depth 3 · importance 4 · LFS200: MENTIONED ONLY · sources: man-proc-5, fhs-3-0*

**What it is** Two virtual filesystems that expose kernel state as files. `/proc` holds one
numbered directory per running process plus system-wide entries such as `/proc/cpuinfo`,
`/proc/meminfo` and `/proc/mounts`. `/sys` (sysfs) exposes the kernel's device model — buses,
devices, drivers and their attributes. Neither occupies any space on a disk.

**Why it matters** This is where the "everything is a file" principle becomes practical: `ps`,
`top`, `free` and `uptime` are all reading `/proc` and formatting it. It is also where runtime
kernel tuning happens, through writable entries under `/proc/sys` — the same values `sysctl`
manipulates.

**How it works** Reading a path under `/proc` causes the kernel to generate the contents on
demand, which is why the files report a size of zero yet return data, and why their contents change
between two consecutive reads. `/proc/<pid>/` exposes one process's command line, environment,
open file descriptors and status. `/proc/sys/` is the tunable branch: writing to
`/proc/sys/vm/swappiness` changes the running kernel immediately, and `/etc/sysctl.d/` is where the
same setting is recorded so it survives a reboot.

**Key terms** procfs; sysfs; `/proc/sys`; generated on read.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `cat /proc/cpuinfo` | Read the kernel's per-processor information directly | related paths: `/proc/meminfo`, `/proc/mounts`, `/proc/swaps`, `/proc/uptime` | `cat /proc/cpuinfo` | Trusting the reported file size — entries under `/proc` are generated on read and appear as zero bytes to `ls -l` |

**Traps** Changes written under `/proc/sys` apply to the running kernel and are lost at the next
boot; making them persistent requires `/etc/sysctl.conf` or a file under `/etc/sysctl.d/`. And
`/proc` is not a place to store anything: it is a window onto kernel state, so a file cannot be
created there.

**What the exam may test** That `/proc` and `/sys` consume no disk space; which one exposes
process information and which the device model; and that runtime tuning under `/proc/sys` is not
persistent by itself.

*Not to be confused with [/dev](system-administration.md#cmp-sysadmin.system-administration.dev).*

<a id="c-sysadmin.system-administration.dev"></a>
### /dev
*id: `sysadmin.system-administration.dev` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: fhs-3-0*

**What it is** The directory of device nodes: special files that stand for hardware and for
pseudo-devices. `/dev/sda` and `/dev/nvme0n1` are whole disks, `/dev/sda1` a partition,
`/dev/tty1` a terminal, and `/dev/null`, `/dev/zero`, `/dev/random` and `/dev/urandom` are
pseudo-devices with no hardware behind them at all.

**Why it matters** Every storage command in this section takes a `/dev` path as its argument, and
naming the wrong one is destructive rather than merely wrong: `mkfs` on `/dev/sda` instead of
`/dev/sda1` formats the whole disk, partition table included.

**How it works** A device node is identified not by its filename but by a type (block or
character) and a major/minor number pair that tells the kernel which driver to route the operation
to. Block devices are addressed in fixed-size blocks and are what filesystems sit on; character
devices are byte streams, such as terminals. `/dev` is populated automatically at boot by
`devtmpfs` and maintained by `udev`, which is also what creates the stable-by-identity symlinks
under `/dev/disk/by-uuid/` and `/dev/disk/by-label/`.

**Key terms** block versus character device; major/minor number; `udev`; `/dev/disk/by-uuid`.

**Traps** Kernel device names are not stable across reboots: which physical disk becomes `/dev/sda`
depends on enumeration order, which is why `/etc/fstab` should reference a UUID rather than a
device node. And `/dev/null` is not a general-purpose discard for everything — it discards data
written to it and returns end-of-file when read, whereas `/dev/zero` returns an endless stream of
zero bytes.

**What the exam may test** Distinguishing a whole-disk node from a partition node; recognising
`/dev/null` and `/dev/zero` by behaviour; and knowing why UUIDs are preferred over `/dev/sdX`
names in configuration.

<a id="cmp-sysadmin.system-administration.dev"></a>
#### Not to be confused with: /dev vs /proc and /sys
*compares: `sysadmin.system-administration.dev`, `sysadmin.system-administration.proc-and-sys`*

| | /dev | /proc and /sys |
| --- | --- | --- |
| What the entries are | Device nodes: handles for reading and writing a device | Generated text: a view of kernel and process state |
| What you do with them | Perform I/O — format, mount, read a stream | Read information, and write tunables under `/proc/sys` |
| Populated by | `devtmpfs` and `udev` | The kernel itself, on demand |
| Identified by | Major and minor numbers, plus a driver | A path that maps to an internal kernel structure |
| Typical entry | `/dev/sda1`, `/dev/null` | `/proc/cpuinfo`, `/proc/1234/status`, `/sys/class/net` |

The separating axis is purpose: `/dev` gives you a handle to *operate* a device, while `/proc` and
`/sys` give you a view to *inspect* the kernel — which is why you format `/dev/sda1` and read
`/proc/cpuinfo`, and never the reverse.

<a id="c-sysadmin.system-administration.filesystem-type"></a>
### Filesystem type
*id: `sysadmin.system-administration.filesystem-type` · depth 3 · importance 4 · LFS200: PARTIALLY COVERED · sources: man-mount-8, man-fstab-5*

**What it is** The on-disk format a filesystem is written in, and therefore the kernel driver
needed to read it. ext4 is the long-standing Linux default; XFS is the default on Red Hat
Enterprise Linux; Btrfs adds copy-on-write snapshots; vFAT and NTFS exist mainly for
interoperability with removable media and Windows.

**Why it matters** The type determines capability, not just naming: whether the filesystem
journals, how large a single file may be, whether it can be grown or shrunk online, and — for
vFAT — whether it can record Unix ownership and permissions at all. A question about copying files
to a USB stick and losing their modes is a filesystem-type question.

**How it works** A type is chosen once, at creation time, by `mkfs`, and is recorded in the
filesystem's superblock along with a UUID and an optional label. `blkid` reads that superblock and
reports the type, UUID and label without mounting anything, which is how `mount` and `/etc/fstab`
can identify a device by UUID rather than by an unstable kernel name. Journaling — a feature of
ext4 and XFS, absent from vFAT — records intended metadata changes before they are made, so an
interrupted write can be replayed or discarded instead of leaving the structure inconsistent.

**Key terms** superblock; UUID and label; journaling; copy-on-write.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `mkfs` | Create a filesystem on a device | `-t TYPE` selects the format; the frontend is deprecated in favour of the type-specific `mkfs.ext4`, `mkfs.xfs` builders it dispatches to | `mkfs -t ext4 /dev/sdb1` | Naming the whole disk (`/dev/sdb`) instead of the partition (`/dev/sdb1`) and destroying the partition table with it |
| `blkid` | Report the type, UUID and label of block devices | `-s TYPE` or `-s UUID` to print one field, `-o value` for bare output | `blkid /dev/sdb1` | Expecting it to report anything about a device that has no filesystem on it yet — an unformatted partition has no superblock to read |

**Traps** XFS can be grown while mounted but cannot be shrunk at all; ext4 can be shrunk, but only
while unmounted. A plan that says "we will resize it later" is only safe once the type is known.
And vFAT stores no ownership or permission bits, so files copied onto it come back with whatever
the mount options dictate rather than what they had — a data-loss surprise that looks like a
`chmod` failure.

**What the exam may test** Matching a requirement (journaling, snapshots, Windows
interoperability, no Unix permissions) to a filesystem type; and knowing that the type is fixed at
`mkfs` time rather than at mount time.

*Not to be confused with [Filesystem Hierarchy Standard](system-administration.md#cmp-sysadmin.system-administration.filesystem-hierarchy-standard).*

<a id="c-sysadmin.system-administration.mounting"></a>
### Mounting
*id: `sysadmin.system-administration.mounting` · depth 3 · importance 4 · LFS200: PARTIALLY COVERED · sources: man-mount-8*

**What it is** Attaching a filesystem into the single unified directory tree at a chosen directory,
the mount point, so its contents appear at that path. Linux has no drive letters: a second disk
does not become `D:`, it becomes whatever directory it is mounted on.

**Why it matters** The single-tree model is what makes "is `/var` full" a different question from
"is the disk full" — `/var` may be its own filesystem with its own free space, or it may be part of
the root filesystem, and only the mount table says which. Every capacity and permission question
about a path depends on knowing which filesystem that path actually lands on.

**How it works** `mount` attaches a device (named directly, or by `UUID=` or `LABEL=`) at a mount
point, optionally with options such as `ro`, `noexec`, `nosuid` or `nodev`. `umount` detaches it,
and fails with "target is busy" while any process holds a file open or has its working directory
inside — `lsof` or `fuser` names the offender. `findmnt` presents the current mount table as a
tree, reading the kernel's own view rather than the file `/etc/fstab`, which is only the intended
configuration.

**Key terms** mount point; mount options; busy target; `findmnt`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `mount` | Attach a filesystem, or with no arguments list what is mounted | `-t TYPE`, `-o` options, `-a` everything in `/etc/fstab`, `--bind` remount an existing tree elsewhere, `-r` read-only | `mount /dev/sdb1 /mnt/data` | Mounting onto a non-empty directory: the existing contents are hidden, not merged or deleted, and reappear on unmount |
| `umount` | Detach a mounted filesystem | takes the device or the mount point; `-l` lazy detach, `-f` force (for unreachable network mounts) | `umount /mnt/data` | Spelling it `unmount`, and — more substantively — using `-l` to paper over a busy filesystem instead of finding the process holding it |
| `findmnt` | Show the kernel's current mount table as a tree | `-t TYPE` filter by type, `--target PATH` show which filesystem a path is on, `-D` show space like `df` | `findmnt --target /var/log` | Reading `/etc/fstab` to answer "what is mounted right now" — that file states intent, not current state |

**Traps** Mounting over a directory that already contains files hides them for as long as the
mount lasts. Disk space "disappearing" after a mount, or a directory that mysteriously looks empty,
is usually this rather than deletion. The reverse also bites: writing into a mount point *before*
the filesystem is mounted leaves data underneath it that becomes invisible and still consumes space
on the parent filesystem.

**What the exam may test** That Linux uses one tree rather than drive letters; the mount options
that make a filesystem read-only or non-executable; and how to determine which filesystem a given
path is on.

<a id="cmp-sysadmin.system-administration.mounting"></a>
#### Not to be confused with: Mounting vs Partition
*compares: `sysadmin.system-administration.mounting`, `sysadmin.system-administration.partition`*

| | Mounting | Partition |
| --- | --- | --- |
| What it is | Attaching a filesystem into the directory tree | A subdivision of a block device |
| Layer | Runtime — it can be undone with one command | On-disk — recorded in the partition table |
| Persistence | Lost at reboot unless declared in `/etc/fstab` | Survives reboots and reinstalls until rewritten |
| Created or changed by | `mount`, `umount` | `fdisk`, `parted`, `gdisk` |
| Visible in | `findmnt`, `df`, `/proc/mounts` | `lsblk`, `fdisk -l`, `/proc/partitions` |
| Can exist without the other | Yes — a network share or `tmpfs` is mounted with no partition behind it | Yes — a partition can exist unformatted and unmounted |

The separating axis is where each one lives: a partition is a durable division of the hardware,
while a mount is a runtime statement about where a filesystem currently appears in the tree — which
is why a disk can be partitioned and formatted and still be entirely absent from `df`.

<a id="c-sysadmin.system-administration.etc-fstab"></a>
### /etc/fstab
*id: `sysadmin.system-administration.etc-fstab` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man-fstab-5, man-mount-8*

**What it is** The file system table: one line per filesystem the system should mount at boot,
with six whitespace-separated fields — device, mount point, type, options, dump flag, and
filesystem-check pass number. It records intent; the kernel's mount table records reality.

**Why it matters** A malformed or wrong entry here does not fail quietly. A device that cannot be
found at boot leaves systemd waiting on the mount and then dropping into emergency mode, with no
network and a root password prompt — a machine that was working an hour ago and now will not boot,
because of one line in a text file.

**How it works** Each line names a device, preferably as `UUID=` or `LABEL=` rather than
`/dev/sdX`, since kernel device names depend on enumeration order. The options field carries
`defaults`, `ro`, `noexec`, `nosuid`, `noauto` (do not mount at boot) and `nofail` (continue
booting if the device is absent). The fifth field is the `dump` flag, almost always `0`. The sixth
is the `fsck` pass order: `1` for the root filesystem, `2` for other filesystems to be checked
after it, `0` to skip the check entirely. `mount -a` applies the file to the running system, which
is how an entry should be validated before rebooting on it.

**Key terms** six fields; `UUID=`; `nofail`; fsck pass order.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `mount -a` | Mount everything in `/etc/fstab` that is not marked `noauto` | pairs with `findmnt --verify` to check the file's syntax without mounting | `mount -a` | Editing `/etc/fstab` and rebooting without testing — `mount -a` surfaces the error while a shell is still available |

**Traps** The fields are positional and unlabelled, so a missing options field silently shifts the
dump and pass numbers into the wrong columns. A pass number of `1` on anything other than the root
filesystem, or `2` on the root filesystem, produces a boot-time check order that is wrong rather
than merely unusual. And `nofail` is the option that turns "the machine will not boot" into "the
mount is simply absent" for a removable or network device.

**What the exam may test** Naming the six fields in order; why UUIDs are preferred to device names;
and that `mount -a` is the safe way to validate a change before a reboot depends on it.

<a id="c-sysadmin.system-administration.partition"></a>
### Partition
*id: `sysadmin.system-administration.partition` · depth 3 · importance 4 · LFS200: FULLY COVERED · sources: man-mount-8*

**What it is** A subdivision of a block device, recorded in a partition table at the start of the
disk. A partition is a region of space; it holds a filesystem only once one has been created on it,
and it is reachable only once that filesystem has been mounted.

**Why it matters** Separating `/var` or `/home` onto their own partitions is the standard defence
against a runaway log or a user filling the disk: the damage is contained to one filesystem while
the root filesystem stays writable. Reading a device tree correctly — whole disk versus partition —
is also what stops a formatting command being aimed at the wrong target.

**How it works** Two partition-table formats matter. MBR is the older scheme, limited to four
primary partitions (one of which can be an extended partition containing logical ones) and to
disks of about 2 TiB. GPT is the UEFI-era replacement, with a large partition count, support for
much bigger disks, and a backup copy of the table at the end of the device. `lsblk` presents the
device tree with whole disks as parents and partitions as children; `fdisk -l` reports the
partition table itself, including its type.

**Key terms** MBR versus GPT; primary/extended/logical; partition table; block device tree.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `lsblk` | List block devices as a tree | `-f` show filesystem type, label, UUID and mount point; `-o` choose columns | `lsblk -f` | Acting on a parent row (`sda`) when the child row (`sda1`) was meant — the indentation is the only thing distinguishing them |
| `fdisk -l` | Print the partition table of every device, or of one named device | `-l` list only; without it `fdisk` enters interactive edit mode | `fdisk -l /dev/sda` | Running `fdisk` without `-l` on a production disk and landing in the interactive editor |

**Traps** A partition with no filesystem is invisible to `df` and cannot be mounted, so "the disk
does not show up" often means "it was never formatted." And on a GPT disk, a UEFI system needs an
EFI System Partition formatted as FAT — an exception to the rule that Linux partitions carry Linux
filesystems.

**What the exam may test** The MBR limits (four primary partitions, roughly 2 TiB) against GPT;
reading `lsblk`'s hierarchy; and the sequence partition, then `mkfs`, then mount.

*Not to be confused with [mounting](system-administration.md#cmp-sysadmin.system-administration.mounting).*

<a id="c-sysadmin.system-administration.inode"></a>
### inode
*id: `sysadmin.system-administration.inode` · depth 3 · importance 4 · LFS200: FULLY COVERED · sources: man-inode-7*

**What it is** The on-disk structure holding everything the filesystem knows about a file *except*
its name: type, permission bits, owner UID and group GID, size, timestamps, link count, and the
pointers to the data blocks. The name lives in a directory entry, which is simply a mapping from a
name to an inode number.

**Why it matters** Separating the name from the inode explains a cluster of otherwise puzzling
behaviours: why several names can refer to one file, why deleting a name does not necessarily free
the space, why permissions follow the file rather than the path, and why a filesystem can report
free space and still refuse to create a file.

**How it works** The number of inodes is normally fixed when the filesystem is created, so a
filesystem full of tiny files can exhaust its inode table while gigabytes of data blocks remain
free. `df -i` reports that table's usage, and the symptom is a "No space left on device" error from
a filesystem that `df -h` says is half empty. Each inode carries a link count; the data blocks are
released only when that count reaches zero *and* no process still holds the file open.

**Key terms** inode number; link count; directory entry; inode exhaustion.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `df -i` | Report inode usage per filesystem rather than block usage | pairs with `df -h` for the block view | `df -i` | Skipping it when a filesystem reports "no space left" while showing free capacity — inode exhaustion is invisible to `df -h` |
| `ls -i` | Print each entry's inode number | combine with `-l` to see the link count in the same listing | `ls -li` | Assuming two files with the same size are the same file — the inode number is what proves it |

**Traps** "Disk full but `df` shows space" is the inode-exhaustion classic, and the fix is deleting
files rather than adding capacity, since the inode count is fixed at `mkfs` time and cannot be
grown on ext4. The second trap is timestamps: `ls -l` shows the modification time, which lives in
the inode along with the access and status-change times — but the inode carries no creation time
that standard tools expose.

**What the exam may test** What an inode does and does not store (the filename is not in it);
diagnosing inode exhaustion with `df -i`; and using `ls -i` to establish that two names are one
file.

*Not to be confused with [hard link vs symbolic link](system-administration.md#cmp-sysadmin.system-administration.hard-link-vs-symbolic-link).*

<a id="c-sysadmin.system-administration.hard-link-vs-symbolic-link"></a>
### Hard link vs symbolic link
*id: `sysadmin.system-administration.hard-link-vs-symbolic-link` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man-inode-7*

**What it is** A hard link is an additional directory entry pointing at an existing inode: another
name for the same file, indistinguishable from the original. A symbolic link is a small file of its
own, with its own inode, whose contents are a path — a signpost, which becomes a dangling one if
the target moves or is deleted.

**Why it matters** Their failure modes are opposite, and that is what the exam tests. Delete the
"original" of a hard-linked file and nothing is lost, because the inode's link count merely drops
by one. Delete the target of a symlink and the symlink survives while pointing at nothing.

**How it works** `ln` creates a hard link, incrementing the inode's link count; `ln -s` creates a
symlink. Because a hard link is a reference to an inode number, and inode numbers are meaningful
only within one filesystem, hard links cannot cross filesystem boundaries — and ordinary users
cannot create hard links to directories, which would allow cycles in the tree. A symlink has none
of those restrictions: it holds a path string, so it may cross filesystems, point at a directory,
or point at something that does not exist yet.

**Key terms** link count; dangling symlink; cross-filesystem restriction; `ls -l` arrow.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ln` | Create a hard link — a second name for the same inode | `-f` replace an existing target name; the source must be on the same filesystem | `ln data.csv data-backup.csv` | Expecting it to work across filesystems, or to a directory — both are refused |
| `ln -s` | Create a symbolic link containing a path | `-r` make the stored path relative, `-f` replace an existing link, `-n` treat an existing link to a directory as a file | `ln -s /opt/app/current /usr/local/bin/app` | Creating a link with a relative target from the wrong working directory — the path is stored verbatim and resolved from the *link's* location, not from where you were standing |

**Traps** `ls -l` distinguishes them plainly: a symlink's mode string starts with `l` and the entry
shows `name -> target`, while a hard link looks exactly like an ordinary file — only the link count
column (the number after the permissions) betrays it. Copying also differs: `cp` follows a symlink
and copies the target's contents by default, so a backup of a directory full of symlinks can be
much larger than expected.

**What the exam may test** Which kind can cross a filesystem; which can dangle; what happens to
each when the original name is deleted; and reading `ls -l` to tell them apart.

<a id="cmp-sysadmin.system-administration.hard-link-vs-symbolic-link"></a>
#### Not to be confused with: Hard link vs symbolic link vs inode
*compares: `sysadmin.system-administration.hard-link-vs-symbolic-link`, `sysadmin.system-administration.inode`*

| | Hard link vs symbolic link | inode |
| --- | --- | --- |
| What it names | Two ways of creating a second reference to a file | The structure holding one file's metadata and block pointers |
| Relationship | A hard link is another name for the same inode; a symlink is a separate inode holding a path | The thing being referred to |
| Created by | `ln` and `ln -s` | Implicitly, whenever a file is created |
| Effect on link count | A hard link increments it; a symlink does not | The count is one of its fields |
| Can cross filesystems | Symlink yes, hard link no | Inode numbers are unique only within one filesystem |

The separating axis is object versus reference: the inode *is* the file, and hard and symbolic
links are the two mechanisms for pointing at it — one by inode number, one by path — which is why
only the path-based one can dangle.

<a id="c-sysadmin.system-administration.disk-usage-vs-free-space"></a>
### Disk usage vs free space
*id: `sysadmin.system-administration.disk-usage-vs-free-space` · depth 4 · importance 4 · LFS200: NOT COVERED · sources: man-mount-8, man-inode-7*

**What it is** Two different measurements that are routinely expected to agree and often do not.
`df` reports each mounted filesystem's total, used and available space from the filesystem's own
accounting. `du` walks a directory tree and adds up the space its files occupy. They answer
different questions, from different sources.

**Why it matters** "The disk is full but I cannot find the large files" is a standard
troubleshooting scenario, and its usual explanation — a deleted file still held open by a running
process — is invisible to `du` by construction, because the file has no name left for `du` to walk
to.

**How it works** `df` asks the filesystem how many blocks are allocated, which includes blocks
belonging to files that have been unlinked but are still open, blocks under a directory that a
mount is currently hiding, and the reserve that ext filesystems set aside for root (5% by default).
`du` walks names: it cannot see an unlinked file, cannot see anything beneath a mount point it does
not descend into, counts a hard-linked file only once, and silently skips directories the caller
cannot read. Every one of those is a reason for the two numbers to differ legitimately.

**Key terms** unlinked-but-open file; reserved blocks; hidden mount point; `lsof +L1`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `df -h` | Report free and used space per mounted filesystem in human-readable units | `-i` inode usage instead of blocks, `-T` show the filesystem type, `-x`/`-t` exclude or restrict by type | `df -h` | Reading one line as "the disk" — each row is a filesystem, and a full `/var` says nothing about `/` |
| `du -sh` | Summarise the total size of a directory tree | `-s` summary only, `-h` human-readable, `-x` stay on one filesystem, `--max-depth=1` per-child totals | `du -sh /var/log` | Running it as an unprivileged user over system directories and getting a total that silently omits everything unreadable |

**Traps** `du` under-reports relative to `df` far more often than the reverse, and each cause has a
different fix. A deleted-but-open file is released by restarting the holding process, not by
deleting anything else. Data hidden beneath a mount point is only reachable by unmounting.
Reserved blocks are recovered by lowering the reserve, not by finding files. Treating all three as
"something is eating the disk" leads to deleting the wrong things.

**Symptoms and diagnostic order** Work outward from the cheapest check. First `df -h` to identify
*which* filesystem is full, since the alarm rarely names it. Then `df -i` on that filesystem: if
inodes are at 100% while blocks are not, this is inode exhaustion and the answer is many small
files, not one big one. Then `du -sh` with `-x` from the filesystem's mount point downward,
descending into the largest child each time, to locate the tree responsible. If `du`'s total is far
below what `df` reports, stop looking for files and check the three structural causes: `lsof +L1`
(or `lsof | grep deleted`) for unlinked files still held open — restarting that process frees the
space immediately; a mount hiding data underneath, checked by temporarily unmounting or by
comparing `du` with the filesystem unmounted; and the root reserve, visible as a gap between `df`'s
"used + available" and its "total".

**What the exam may test** Why `df` and `du` disagree; that the classic cause is a deleted file
held open by a process; and the correct first command when a filesystem reports full.

<a id="c-sysadmin.system-administration.swap"></a>
### Swap
*id: `sysadmin.system-administration.swap` · depth 3 · importance 4 · LFS200: PARTIALLY COVERED · sources: man-fstab-5, man-proc-5*

**What it is** Disk space the kernel uses to hold memory pages that do not currently fit in RAM,
either as a dedicated partition or as a file. It extends the address space available to processes;
it does not extend memory in any sense that makes the system faster.

**Why it matters** Swap usage is a diagnostic signal, and reading it wrongly sends troubleshooting
in the wrong direction. Some swap in use is normal — the kernel pages out genuinely idle memory to
free RAM for cache. Sustained, active swapping is the symptom of a memory shortage, and the answer
is more RAM or less workload, not more swap.

**How it works** Under memory pressure the kernel evicts the least recently used anonymous pages to
swap and reads them back on demand, at disk latency rather than memory latency. The
`vm.swappiness` tunable (default 60, exposed at `/proc/sys/vm/swappiness`) biases how readily it
prefers evicting anonymous pages over dropping page cache. Swap space is created with `mkswap`,
activated with `swapon`, and made persistent by an `/etc/fstab` line whose type field is `swap` and
whose mount point field is `none`. Hibernation additionally requires swap at least the size of
RAM, which is the one case where sizing rules still matter.

**Key terms** anonymous pages; thrashing; `vm.swappiness`; `/proc/swaps`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `swapon` | Activate swap space, or list what is active | `--show` tabular list of active swap areas, `-a` activate everything in `/etc/fstab`, `--priority` when several areas exist | `swapon --show` | Running `swapon` on a device that has not been prepared with `mkswap` — there is no swap signature for it to activate |
| `free` | Report memory and swap usage | `-h` human-readable, `-s N` repeat every N seconds, `-w` separate the buffers and cache columns | `free -h` | Reading a non-zero "Swap used" figure as a live problem — pages swapped out during an earlier spike stay there until touched again |

**Traps** Swap in use and swapping in progress are different things. A machine can show gigabytes
of swap used and be completely healthy, because those pages were evicted hours ago and nothing has
needed them since; what indicates trouble is a high rate of swap-in and swap-out now. Disabling
swap entirely does not remove memory pressure — it converts a slow system into one where the
kernel's out-of-memory killer terminates a process instead.

**What the exam may test** That heavy swapping indicates insufficient RAM rather than insufficient
swap; how to see what swap is active; and that swap is disk-backed and therefore orders of
magnitude slower than RAM.

<a id="c-sysadmin.system-administration.raid-levels"></a>
### RAID levels
*id: `sysadmin.system-administration.raid-levels` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man-proc-5*

**What it is** Schemes for combining several physical drives into one logical device, trading
capacity for redundancy or for speed. RAID 0 stripes data across drives with no redundancy at all;
RAID 1 mirrors it; RAID 5 stripes with distributed parity; RAID 10 stripes across mirrored pairs.

**Why it matters** The numbers are direct recall, and the single most important claim in the topic
is a negative one: RAID is not a backup. It protects against a *drive* failing, and against nothing
else — not accidental deletion, not a bad write propagated instantly to every member, not
ransomware, not the loss of the machine or the site.

**How it works** RAID 0 needs at least two drives, gives the sum of their capacity, and loses
everything if any one fails — it increases the chance of data loss rather than reducing it. RAID 1
needs at least two, gives the capacity of one, and survives until the last member fails. RAID 5
needs at least three, gives the capacity of all but one, and survives exactly one drive failure;
RAID 6 uses double parity, needs at least four, and survives two. RAID 10 needs at least four,
gives half the raw capacity, and combines mirroring's redundancy with striping's throughput. On
Linux, software RAID is managed with `mdadm` and its state is readable at `/proc/mdstat`.

**Key terms** striping; mirroring; parity; rebuild window; `/proc/mdstat`.

**Traps** RAID 0's name invites the assumption that it is the simplest kind of redundancy; it is
the opposite, and a two-drive RAID 0 is roughly twice as likely to fail as a single drive. The
second trap is the rebuild window: after a failure, a RAID 5 array is running with no redundancy at
all until the replacement finishes rebuilding, and a second failure during that period loses
everything — which is the argument for RAID 6 or RAID 10 on large arrays.

**What the exam may test** Matching a level to a stated requirement (maximum capacity, survive one
drive failure, survive two, best write throughput with redundancy); the minimum drive counts; and
that RAID never substitutes for backups.

*Not to be confused with [backup](disaster-recovery.md#cmp-sysadmin.disaster-recovery.backup).*

#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `sysadmin.system-administration.lvm` | LVM | Logical Volume Management: physical volumes are pooled into a volume group, from which logical volumes are carved out and can later be grown or moved across devices. | Recognition-level for LFCA: know the three-layer vocabulary (PV, VG, LV) and its one selling point over bare partitions — a logical volume can be resized and can span several disks, which a partition cannot. `pvs`, `vgs` and `lvs` summarise each layer. |

#### Scenario

An alert says the application host is out of disk. `df -h` shows `/` at 62% and `/var` at 100%, so
only one filesystem is affected — `/var` is a separate partition, which is why the application is
failing while the shell still works. `df -i` on `/var` shows inodes at 11%, ruling out inode
exhaustion. `du -sh -x /var/*` points at `/var/log`, but its total is 3 GB against the 40 GB `df`
reports as used — so the space is not in any file `du` can see. `lsof +L1` finds a log file that was
deleted by hand last week and is still open by the running service: the blocks stay allocated until
the descriptor closes, and restarting the service returns them immediately. The durable fix is log
rotation rather than manual deletion. Finally, the team asks whether the mirrored disks mean this
could not have been a data-loss event: no — RAID 1 would have survived a drive failure, but it
mirrors a deletion just as faithfully as a write.

#### Knowledge check

1. What is stored in an inode, and what is not?
   Type, permissions, owner UID and group GID, size, timestamps, link count and block pointers.
   The filename is not — it lives in a directory entry that maps a name to an inode number.
2. `df -h` shows free space but writes fail with "No space left on device." What is the first
   check?
   `df -i` — the filesystem has probably exhausted its inode table, whose size was fixed at
   `mkfs` time.
3. `du` totals 3 GB where `df` reports 40 GB used on the same filesystem. Name the most likely
   cause and its fix.
   A deleted file still held open by a running process; the blocks are freed when the process
   closes the descriptor, so restart it. `lsof +L1` finds it.
4. Which kind of link can cross a filesystem boundary, and which one dangles when its target is
   deleted?
   A symbolic link does both — it stores a path, so it may cross filesystems and may dangle. A
   hard link can do neither: it refers to an inode number, valid only within one filesystem.
5. Name the six fields of an `/etc/fstab` line in order.
   Device, mount point, filesystem type, mount options, dump flag, and fsck pass order.
6. Why is RAID 5 not a backup, and what does the rebuild window add to the argument?
   RAID protects only against a drive failing — a deletion, corruption or ransomware write is
   mirrored or parity-protected just as faithfully. During a rebuild after one failure the array
   has no redundancy left, so a second failure in that period loses everything.
7. A server shows 4 GB of swap in use. Is that a problem?
   Not by itself. Pages evicted during an earlier spike remain in swap until they are needed
   again; what indicates memory pressure is a sustained rate of swapping in and out now.

<a id="s-system-administration-scheduled-tasks"></a>
## Scheduled tasks

<a id="c-sysadmin.system-administration.cron"></a>
### cron
*id: `sysadmin.system-administration.cron` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man-crontab-5*

**What it is** The traditional time-based job scheduler: a daemon that wakes once a minute, checks
every crontab for entries whose time specification matches, and runs the ones that do. Each user
may have their own crontab; the system has its own in `/etc/crontab` and `/etc/cron.d/`.

**Why it matters** Cron is the default answer to "run this every night," and its failure modes are
so consistent that the exam can describe them without naming cron at all: a job that works when
typed by hand and does nothing on schedule is a cron environment problem nine times out of ten.

**How it works** A user crontab is edited through `crontab -e` rather than by opening a file,
because the command validates the syntax and installs the result into the spool directory the
daemon watches — editing the spool file directly can leave the daemon unaware of the change.
System crontabs differ in format: entries in `/etc/crontab` and `/etc/cron.d/` carry an extra field
naming the user to run as, between the time fields and the command. The `/etc/cron.daily`,
`.weekly` and `.monthly` directories hold scripts rather than crontab lines, run on that cadence by
the system crontab.

**Key terms** crontab spool; `/etc/cron.d/`; the extra user field; `anacron`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `crontab -e` | Edit the invoking user's crontab, with a syntax check before installing | `-u USER` edit another user's (root only); the editor comes from `VISUAL` or `EDITOR` | `crontab -e` | Editing the spool file under `/var/spool/cron/` directly and bypassing the validation the command performs |
| `crontab -l` | Print the invoking user's crontab | `-u USER` for another user's | `crontab -l` | Assuming it shows every scheduled job on the system — it shows one user's crontab, not `/etc/crontab`, `/etc/cron.d/`, or anyone else's |

**Traps** `crontab -r` removes the crontab outright, with no confirmation and no backup, and it sits
one key away from `-e` and `-l` on the keyboard. Separately, a job that never runs on a laptop or
any machine that is off overnight is not broken: plain cron simply skips a scheduled time that
passes while the machine is down, which is what `anacron` exists to compensate for.

**What the exam may test** Which command edits versus lists a crontab; the extra user field in
system crontabs; and that cron does not catch up on runs missed while the machine was off.

<a id="cmp-sysadmin.system-administration.cron"></a>
#### Not to be confused with: cron vs systemd timer
*compares: `sysadmin.system-administration.cron`, `sysadmin.system-administration.systemd-timer`*

| | cron | systemd timer |
| --- | --- | --- |
| Where the schedule lives | A crontab line with five time fields | A `.timer` unit with `OnCalendar=` or `OnBootSec=` |
| What runs | A command line, executed by `/bin/sh` | A separate `.service` unit |
| Output and logging | Mailed to the user; otherwise easily lost | Captured into the journal, queryable with `journalctl -u` |
| Catches up after downtime | No — a missed time is simply skipped (`anacron` compensates separately) | Yes, with `Persistent=true` |
| Dependencies and ordering | None | Full unit dependencies: `After=`, `Requires=`, and so on |
| Inspecting what is scheduled | `crontab -l`, per user, plus the system files | `systemctl list-timers`, one system-wide view |

The separating axis is integration: cron is a standalone scheduler that hands a command to a shell,
while a timer is a unit that activates another unit — which is what gives it logging, dependency
ordering, and catch-up behaviour that cron has to borrow from other tools.

<a id="c-sysadmin.system-administration.crontab-syntax"></a>
### crontab syntax
*id: `sysadmin.system-administration.crontab-syntax` · depth 5 · importance 4 · LFS200: NOT COVERED · sources: man-crontab-5*

**What it is** Five time-and-date fields followed by the command: minute (0-59), hour (0-23), day
of month (1-31), month (1-12 or names), and day of week (0-7, where both 0 and 7 mean Sunday, or
names). Everything after the fifth field, to the end of the line, is the command.

**Why it matters** This is one of the few syntaxes an entry-level exam expects to be read
accurately, and two of its rules are genuinely counter-intuitive: the way the two day fields
combine, and how little of your environment the job inherits.

**How it works** A field may be `*` for "first-last", a list (`1,15`), a range (`8-11`, inclusive),
or a step applied to a range or asterisk (`*/2`). Steps are evaluated only within the field they
are attached to, so `*/35` in the minute field runs at minute 0 and minute 35, not every 35
minutes. The day fields combine with OR, not AND: if *both* day of month and day of week are
restricted — neither is `*` — the command runs when *either* matches. `30 4 1,15 * 5` therefore
runs at 04:30 on the 1st and the 15th **and** every Friday.

**Key terms** step value; the day-field OR rule; `%` as newline; minimal environment.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `crontab -e` | Install a crontab through the syntax-checking editor path | `crontab -T FILE` tests a file's syntax without installing it | `crontab -e` | Putting a comment at the end of a command line — comments are not allowed on the same line as a cron command or an environment setting, and become part of the command |

**Traps** The environment a cron job runs in is not your shell's. cron sets `SHELL` to `/bin/sh`
and takes `LOGNAME` and `HOME` from the owner's `/etc/passwd` line; it does not source
`~/.bashrc`, `~/.profile`, or `/etc/profile`, and `PATH` is whatever short default the daemon
supplies rather than yours. That single fact explains the majority of "works interactively, fails
under cron" reports, and the fix is to use absolute paths or to set `PATH` explicitly at the top of
the crontab. The second trap is `%`: an unescaped percent sign in the command is turned into a
newline, and everything after the first one is fed to the command as standard input — so a `date`
format string like `+%Y-%m-%d` must be written `\%Y-\%m-\%d` or quoted through a script.

**Symptoms and diagnostic order** "The cron job did not run" and "the cron job ran and failed" are
different investigations, and the first step separates them: check the log — `journalctl -u cron`
(or `crond`, depending on the distribution) shows an entry each time the daemon executes a command,
so a missing entry means the schedule never matched and a present entry means the command itself
failed. If it never matched, re-read the five fields, paying attention to the day-field OR rule and
to steps being field-local. If it ran and failed, assume the environment: run the command with
`env -i /bin/sh -c '...'` to reproduce the bare environment, replace every bare command name with
an absolute path, and redirect both streams to a file (`>> /tmp/job.log 2>&1`) so the next failure
leaves evidence instead of an email nobody reads. Only then look at the script itself. If the
machine is not on continuously, check whether the scheduled time passed while it was powered off,
in which case nothing is broken and `anacron` or a `Persistent=true` timer is the right answer.

**Syntax worth memorising**

```
# ┌ minute (0-59)
# │ ┌ hour (0-23)
# │ │ ┌ day of month (1-31)
# │ │ │ ┌ month (1-12 or jan-dec)
# │ │ │ │ ┌ day of week (0-7, 0 and 7 are Sunday, or sun-sat)
# │ │ │ │ │
  0 3 * * *   /usr/local/bin/backup.sh      # 03:00 every day
  */15 * * * * /usr/local/bin/poll.sh        # every 15 minutes
  0 4 1,15 * 5 /usr/local/bin/report.sh      # 04:00 on the 1st and 15th AND every Friday
  0 22 * * 1-5 /usr/local/bin/close.sh       # 22:00, Monday to Friday
  @reboot      /usr/local/bin/warmcache.sh   # once after each boot
PATH=/usr/local/bin:/usr/bin:/bin            # set it explicitly; cron's default is minimal
MAILTO=ops@example.com                       # where job output is mailed; MAILTO="" silences it
```

**What the exam may test** Reading a five-field specification and stating when it fires; the
day-of-month/day-of-week OR rule; and diagnosing a job that works by hand but not under cron as an
environment and `PATH` problem.

<a id="c-sysadmin.system-administration.systemd-timer"></a>
### systemd timer
*id: `sysadmin.system-administration.systemd-timer` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: systemd-timer-5, systemd-journald-8*

**What it is** A `.timer` unit that activates another unit on a schedule. It is systemd's
alternative to cron, and it differs in kind rather than in syntax: a timer does not run a command,
it starts a service, and everything systemd offers that service — dependency ordering, resource
limits, an identity, and journal capture of its output — applies automatically.

**Why it matters** The advantages are the examinable content: output that is logged and queryable
rather than mailed, the ability to catch up on runs missed while the machine was off, and one
system-wide view of everything scheduled.

**How it works** A timer unit is paired by name with a service unit — `backup.timer` activates
`backup.service` unless `Unit=` says otherwise. `OnCalendar=` gives a wall-clock schedule in
systemd's own calendar syntax (`daily`, `Mon *-*-* 04:00:00`), while `OnBootSec=` and
`OnUnitActiveSec=` express delays relative to boot or to the previous run. `Persistent=true` records
the last run on disk so a schedule missed while the machine was down fires once at the next boot.
Like any unit, a timer must be enabled to survive a reboot — enabling the *timer*, not the service
it triggers.

**Key terms** `OnCalendar=`; `Persistent=true`; paired service unit; `systemd-analyze calendar`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `systemctl list-timers` | Show every timer with its next and last activation | `--all` include inactive timers; `systemd-analyze calendar 'Mon *-*-* 04:00:00'` validates an expression before it is deployed | `systemctl list-timers` | Reading an empty NEXT column as a broken timer when the unit is simply not enabled |

**Traps** Enabling the service instead of the timer is the standard mistake: `systemctl enable
backup.service` makes the job run at every boot, which is not a schedule at all — the timer is what
must be enabled. And a `.timer` with no matching `.service` (or `Unit=`) silently has nothing to
activate.

**What the exam may test** What a timer activates; which of the pair must be enabled; and the
advantages over cron — journal logging, dependency handling, and catch-up with `Persistent=true`.

*Not to be confused with [cron](system-administration.md#cmp-sysadmin.system-administration.cron).*

#### Scenario

A backup script runs perfectly when the administrator types it and produces nothing at 03:00. The
crontab line reads `0 3 * * * backup.sh`. Two faults: the command is a bare name, and cron's `PATH`
is a short default that does not include `/usr/local/bin`, so the shell cron starts cannot find it;
and there is no redirection, so the error went into a mail nobody reads. Rewriting it as
`0 3 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1` fixes both. A second line,
`0 4 1,15 * 5 report.sh`, is doing something nobody intended — with both day fields restricted, it
fires on the 1st and 15th *and* every Friday. The team then moves the job to a systemd timer:
`backup.timer` with `OnCalendar=daily` and `Persistent=true`, paired with `backup.service`, and
`systemctl enable --now backup.timer` — the timer, not the service. Now the output lands in the
journal and a run missed while the machine was down is made up at the next boot.

#### Knowledge check

1. In `30 4 1,15 * 5`, when does the command run?
   At 04:30 on the 1st and 15th of each month, *and* at 04:30 every Friday — when both day fields
   are restricted, they combine with OR.
2. A script works when typed but fails silently under cron. What is the first thing to suspect?
   The environment: cron does not source your shell startup files, sets `SHELL` to `/bin/sh`, and
   supplies a minimal `PATH`, so bare command names are not found. Use absolute paths.
3. Which unit must be enabled for a systemd timer to survive a reboot?
   The `.timer` unit. Enabling the paired `.service` instead makes it run at every boot rather than
   on a schedule.
4. Name two things a systemd timer gives you that plain cron does not.
   Output captured in the journal (queryable with `journalctl -u`), and catch-up of missed runs
   with `Persistent=true`. Dependency ordering is a third.
5. Why should a crontab be edited with `crontab -e` rather than by opening the spool file?
   `crontab -e` validates the syntax before installing it and ensures the daemon picks up the
   change; editing the spool file directly bypasses both.

<a id="s-system-administration-logging"></a>
## Logging

<a id="c-sysadmin.system-administration.var-log"></a>
### /var/log
*id: `sysadmin.system-administration.var-log` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: fhs-3-0*

**What it is** The conventional directory for plain-text log files, plus per-application
subdirectories such as `/var/log/nginx/`. The exact filenames are family-specific: Debian-family
systems write general messages to `/var/log/syslog` and authentication events to
`/var/log/auth.log`, while Red Hat-family systems use `/var/log/messages` and `/var/log/secure`.

**Why it matters** "Where would you look" questions expect the right filename for the family in the
scenario, and getting `auth.log` and `secure` the wrong way round is a pure recall failure. `/var`
filling up is also, more often than not, `/var/log` filling up.

**How it works** Files here are written by a syslog daemon such as `rsyslog`, or directly by
applications that manage their own logs. They are ordinary text, so the whole text toolkit applies —
`grep`, `tail`, `less`, `awk` — and rotated copies are kept alongside them, usually compressed, as
`syslog.1`, `syslog.2.gz` and so on. On a systemd system the journal is a separate store and is not
one of these files; `/var/log/journal/` holds it in binary form.

**Key terms** `auth.log` versus `secure`; `rsyslog`; rotated copies; binary journal.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `tail -f` | Follow a log file as it grows | `-n N` start N lines back; `-F` follows the *name*, reopening the file after rotation, where `-f` stays with the original inode | `tail -f /var/log/syslog` | Leaving `tail -f` running across a log rotation and seeing nothing more — the file it holds open has been renamed away; `tail -F` is what survives rotation |
| `less` | Page through a log with search and navigation | `+F` follow like `tail -f` but with Ctrl-C to return to browsing, `+G` start at the end, `/pattern` to search | `less /var/log/syslog` | Reaching for `cat` on a multi-gigabyte log; `less` reads incrementally rather than loading the whole file |

**Traps** Reading a rotated log needs the right tool: `syslog.1` is plain text but `syslog.2.gz` is
compressed, so `grep` finds nothing in it and `zgrep`, `zless` or `zcat` is required. And on a
systemd system, an application's messages may exist only in the journal, so an empty
`/var/log/messages` does not mean nothing was logged.

**What the exam may test** The Debian and Red Hat filenames for general and authentication logs;
choosing `tail -F` over `tail -f` across rotation; and knowing that the journal is separate from
these files.

<a id="c-sysadmin.system-administration.syslog-and-severity-levels"></a>
### syslog and severity levels
*id: `sysadmin.system-administration.syslog-and-severity-levels` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: rfc-5424*

**What it is** The long-standing protocol and message format for system logging, together with its
eight severity levels: Emergency 0, Alert 1, Critical 2, Error 3, Warning 4, Notice 5,
Informational 6, and Debug 7. Every message also carries a facility identifying its source
subsystem — `kern`, `auth`, `authpriv`, `daemon`, `mail`, `cron`, and `local0` through `local7`.

**Why it matters** The numbering runs the opposite way from intuition: the most severe level has
the lowest number. Any question about filtering to "errors and above" is testing whether you know
that "above" means numerically *lower*, and the same inverted scale is what `journalctl -p` uses.

**How it works** Facility and severity are encoded together into a single priority value, computed
as facility multiplied by 8 plus severity, which is what appears at the start of a syslog message.
Filtering rules — in `rsyslog` configuration, or in a `journalctl` query — select on those two
dimensions, which is how authentication messages can be routed to one file and everything else to
another. Syslog is also a network protocol, traditionally carried over UDP port 514, which is what
allows a fleet to forward its logs to a central collector.

**Key terms** facility; severity; priority value; central log server.

**Traps** Severity is a claim by the program that emitted the message, not an assessment by the
logging system: a badly behaved application logging routine chatter at Error level will flood a
filter tuned to catch real problems. And filtering at severity 3 captures 3, 2, 1 and 0 — errors,
critical, alert and emergency — not "only errors."

**What the exam may test** The order of the eight levels and that 0 is most severe; what a facility
identifies; and that filtering to a level includes everything more severe than it.

*Not to be confused with [journald](system-administration.md#cmp-sysadmin.system-administration.journald).*

<a id="c-sysadmin.system-administration.journald"></a>
### journald
*id: `sysadmin.system-administration.journald` · depth 4 · importance 4 · LFS200: NOT COVERED · sources: systemd-journald-8*

**What it is** systemd's logging service. It collects messages from the kernel, from syslog calls,
from services' standard output and standard error, and from its own API, and stores them in a
structured binary journal with indexed metadata — which unit, which PID, which UID, which boot —
attached to every entry. `journalctl` is the only supported way to read it.

**Why it matters** Because the store is binary and indexed, the questions it answers are different
from what a text log can answer: "everything this unit logged during the previous boot at error
severity or worse" is one query rather than a pipeline of `grep` across rotated files. Knowing the
four or five options that express those queries is the practical content of the topic.

**How it works** Every entry carries fields such as `_SYSTEMD_UNIT`, `_PID`, `_UID`, `PRIORITY`
and a boot ID, and `journalctl`'s options are filters over those fields. Storage location decides
persistence: with the default configuration the journal is persistent only if `/var/log/journal`
exists, and otherwise lives in `/run/log/journal`, which is memory-backed and discarded at every
reboot. Retention is bounded by size rather than by rotation — `SystemMaxUse=` in
`journald.conf` — and `journalctl --vacuum-size=` or `--vacuum-time=` prunes it manually.

**Key terms** structured fields; boot ID; `Storage=`; `/var/log/journal`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `journalctl -u` | Show entries for one unit | takes a unit name or a pattern; combine freely with the other filters | `journalctl -u nginx.service` | Omitting the unit and paging the entire journal to find one service's messages |
| `journalctl -f` | Follow the journal, printing new entries as they arrive | pairs with `-u` to follow one unit | `journalctl -f -u nginx.service` | Using `tail -f` on `/var/log/journal/` — the files are binary and cannot be read as text |
| `journalctl -p err` | Filter by priority, using the syslog level names or numbers 0-7 | a single level shows that level *and everything more severe*; a range is written `FROM..TO`, e.g. `-p warning..err` | `journalctl -p err -b` | Expecting `-p err` to show only errors — it also shows crit, alert and emerg, because those are more severe |
| `journalctl -b` | Restrict output to one boot | no argument means the current boot; `-b -1` the previous one, `--list-boots` shows what is retained | `journalctl -b -1 -p err` | Assuming previous boots are always available — they are not if the journal is volatile, which it is unless `/var/log/journal` exists |

**Traps** The journal's default persistence is the trap that costs the most: on a system where
`/var/log/journal` was never created, everything logged before the last reboot is gone, so the
first `journalctl -b -1` after a crash returns nothing and looks like a tool failure rather than a
configuration one. The second is that the journal and `/var/log`'s text files are separate stores
with separate retention: `logrotate` does not manage the journal, and `SystemMaxUse=` does not
manage `rsyslog`'s files.

**Symptoms and diagnostic order** For "the service will not start," the sequence is
`systemctl status <unit>` for the last few lines and the exit status, then
`journalctl -u <unit> -b` for everything that unit logged this boot, then `journalctl -p err -b` to
widen to any error from any unit at the same moment — a dependency that failed first is often the
real cause. For "the machine rebooted unexpectedly," start with `journalctl --list-boots` to
confirm the previous boot is even retained, then `journalctl -b -1 -e` to read the end of it; if
nothing is retained, that itself is the finding, and enabling persistent storage is the first
remediation. For a problem happening now, `journalctl -f -u <unit>` while reproducing it beats any
amount of reading after the fact. `journalctl -k` narrows to kernel messages when hardware or a
driver is suspected.

**What the exam may test** That the journal is binary and read only through `journalctl`; what
`-u`, `-f`, `-p` and `-b` each filter on; that a priority filter includes everything more severe;
and that persistence across reboots depends on `/var/log/journal` existing.

<a id="cmp-sysadmin.system-administration.journald"></a>
#### Not to be confused with: journald vs Monitoring and alerting vs syslog and severity levels
*compares: `sysadmin.system-administration.journald`, `sysadmin.best-practices.monitoring-and-alerting`, `sysadmin.system-administration.syslog-and-severity-levels`*

| | journald | Monitoring and alerting | syslog and severity levels |
| --- | --- | --- | --- |
| What it is | A local structured log store on one host | A continuous practice of collecting signals and notifying humans | A message format and severity scale |
| Scope | One machine | A fleet, over time | A wire format, wherever it is carried |
| Who reads it | A person running `journalctl`, after the fact | A system, continuously, against thresholds | Whatever daemon or collector receives the message |
| Notifies anyone | No | Yes — that is the alerting half | No |
| Retention model | Size-bounded local store | A time-series or log platform with its own retention | None — the protocol only transports |

The separating axis is who is watching: journald and syslog record what happened for someone who
comes looking, whereas monitoring and alerting is the layer that watches continuously and
interrupts a human — so no amount of good logging is a substitute for it.

<a id="c-sysadmin.system-administration.log-rotation"></a>
### Log rotation
*id: `sysadmin.system-administration.log-rotation` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man-logrotate-8, systemd-journald-8*

**What it is** The practice of renaming a log file aside on a schedule or at a size threshold,
starting a fresh one, compressing older generations, and deleting the oldest — so that logs have a
bounded total size instead of growing until the filesystem fills.

**Why it matters** A full `/var` from unbounded logs is one of the most common self-inflicted
outages, and manual deletion is the wrong fix: removing a file a daemon still has open frees no
space at all until the daemon closes it, which is exactly the `df`/`du` discrepancy described
earlier in this file.

**How it works** `logrotate` reads `/etc/logrotate.conf` and the per-package fragments in
`/etc/logrotate.d/`, and is normally run once a day — as a cron job, or by `logrotate.timer` on
systemd systems. Directives control frequency (`daily`, `weekly`, `size 100M`), how many
generations to keep (`rotate 7`), compression (`compress`, `delaycompress`), and what to do about
the writing process: `create` makes a fresh file and relies on a `postrotate` script to signal the
daemon to reopen it, while `copytruncate` copies the contents aside and truncates the original in
place for daemons that cannot be signalled. State is tracked in `/var/lib/logrotate.status`, which
is why the tool refuses to rotate the same log twice in one day unless forced. The systemd journal
is not managed by `logrotate` at all: it bounds itself by size through `SystemMaxUse=`.

**Key terms** `/etc/logrotate.d/`; `copytruncate`; `postrotate`; `logrotate.timer`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `logrotate` | Rotate logs according to a configuration file | `-d` debug: show what would happen and change nothing, `-f` force rotation even when not due, `-v` verbose, `-s` alternate state file | `logrotate -d /etc/logrotate.d/nginx` | Testing with `-f` instead of `-d` and performing a real rotation while trying to check the configuration |

**Traps** Without `copytruncate` or a working `postrotate` signal, a daemon keeps writing to the
renamed file through its open descriptor: the new log stays empty, the old one keeps growing under
its new name, and after the retention window it is deleted while still held open — so the space is
never released until the daemon restarts. `copytruncate` avoids that but has its own cost: anything
written between the copy and the truncate is lost.

**What the exam may test** Why log rotation exists; where per-application configuration lives; the
`copytruncate` versus signal-the-daemon choice; and that the journal has its own separate
size-based retention.

#### Scenario

A web server stops accepting requests and `df -h` shows `/var` at 100%. `/var/log/app/app.log` is
28 GB — the package shipped no `/etc/logrotate.d/` fragment, so nothing has ever rotated it.
Deleting it looks like a fix and is not: the daemon holds the descriptor open, so `df` still
reports the space as used until the service restarts. The correct sequence is to add a logrotate
fragment with `rotate 7`, `compress` and a `postrotate` signal, test it with `logrotate -d`, then
restart the service once to release the deleted inode. While investigating, the administrator wants
the errors from the failed window: the application logs to the journal too, so
`journalctl -u app -b -p err` narrows to this boot at error severity and worse — remembering that
`-p err` also includes crit, alert and emerg, because the syslog scale counts downward toward
severity 0.

#### Knowledge check

1. Which files hold general and authentication messages on Debian-family and on Red Hat-family
   systems?
   Debian-family: `/var/log/syslog` and `/var/log/auth.log`. Red Hat-family:
   `/var/log/messages` and `/var/log/secure`.
2. `journalctl -p err` — what does it show, and what does it not?
   Everything at severity `err` (3) and more severe: err, crit, alert and emerg. It does not show
   warnings, notices, info or debug.
3. `journalctl -b -1` returns nothing after a crash. What is the most likely explanation?
   The journal is volatile: without `/var/log/journal` it lives in memory under `/run` and is
   discarded at every reboot, so no previous boot is retained.
4. Deleting a huge log file frees no space according to `df`. Why?
   A process still holds the file open, so its blocks are not released until the descriptor is
   closed — restart the service, and use rotation rather than deletion in future.
5. What is the difference between `copytruncate` and a `postrotate` signal?
   `copytruncate` copies the log aside and truncates the original in place, so a daemon that
   cannot be signalled keeps writing to the same inode — at the cost of losing whatever is written
   between the copy and the truncate. A `postrotate` script instead tells the daemon to reopen its
   log after the rename.
6. Which log store does `logrotate` not manage?
   The systemd journal, which bounds itself by size through `SystemMaxUse=` in `journald.conf`.

<a id="s-system-administration-boot"></a>
## Boot

<a id="c-sysadmin.system-administration.boot-process"></a>
### Boot process
*id: `sysadmin.system-administration.boot-process` · depth 3 · importance 4 · LFS200: PARTIALLY COVERED · sources: systemd-1, systemd-special-7*

**What it is** The ordered handover from firmware to a running system: firmware (BIOS or UEFI)
initialises the hardware and finds a boot device; the bootloader loads the kernel and an initial
RAM filesystem; the kernel initialises itself and mounts the real root filesystem; it starts PID 1;
and the init system activates units until the default target is reached.

**Why it matters** Knowing the order is what makes a boot failure diagnosable, because the stage
that fails determines where to look. A failure before the bootloader menu is firmware or disk; a
failure between the menu and the kernel messages is the bootloader or the kernel image; a failure
after the kernel starts printing but before a login prompt is the initramfs, the root filesystem,
or an init unit.

**How it works** The initramfs stage exists because the kernel must be able to read the real root
filesystem before it can load the drivers stored on it — so a small compressed archive with just
enough modules is loaded into memory alongside the kernel, mounts the root filesystem, and hands
over. Once PID 1 starts, activation is dependency-driven and parallel rather than sequential, which
is why "the boot is slow" is answered by the ordering chain rather than by the slowest unit.

**Key terms** firmware; initramfs; PID 1; `default.target`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `systemd-analyze blame` | List units ranked by how long each took to initialise | related: `systemd-analyze` alone for the total split by phase, `critical-chain` for the ordering chain that actually delayed boot | `systemd-analyze blame` | Attacking the slowest unit in the list when nothing was waiting on it — `critical-chain` identifies what actually held boot up |

**Traps** `blame` measures duration, not delay. A unit that takes 30 seconds while the rest of the
boot proceeds in parallel around it costs nothing; a unit that takes two seconds while everything
else waits for it costs two seconds of boot time. Note also that the firmware phase happens before
anything Linux can measure, so a machine that spends a minute before the bootloader menu has a
firmware problem that `systemd-analyze` will never show.

**What the exam may test** Putting the five stages in order; identifying which stage a described
symptom belongs to; and knowing what the initramfs is for.

<a id="cmp-sysadmin.system-administration.boot-process"></a>
#### Not to be confused with: Boot process vs Bootloader and GRUB
*compares: `sysadmin.system-administration.boot-process`, `sysadmin.system-administration.bootloader-and-grub`*

| | Boot process | Bootloader and GRUB |
| --- | --- | --- |
| What it names | The whole ordered sequence, firmware through to the default target | One stage within that sequence |
| Begins and ends | Power-on to a running, fully activated system | After the firmware selects a boot device; ends when the kernel takes over |
| Diagnosed with | `systemd-analyze`, journal from the previous boot, console messages | The GRUB menu, `/etc/default/grub`, the generated `grub.cfg` |
| Failure symptom | Depends entirely on which stage failed | No menu, or a menu that cannot load the kernel |

The separating axis is scope: the boot process is the whole chain and the bootloader is one link in
it — so identifying which link broke is what turns "it will not boot" into a specific repair.

<a id="c-sysadmin.system-administration.bios-vs-uefi"></a>
### BIOS vs UEFI
*id: `sysadmin.system-administration.bios-vs-uefi` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: systemd-1, fhs-3-0*

**What it is** The two generations of platform firmware. Legacy BIOS reads a small block of boot
code from the first sector of a disk and executes it. UEFI understands filesystems: it reads an EFI
executable from a dedicated FAT-formatted EFI System Partition and runs that, keeping its list of
boot entries in the firmware's own non-volatile memory.

**Why it matters** The differences are a recall cluster the exam can test directly, and they have
practical consequences: GPT partitioning, disks beyond about 2 TiB, more than four primary
partitions, and Secure Boot all belong to the UEFI column.

**How it works** BIOS boots from the Master Boot Record — 512 bytes at the very start of the disk,
holding both boot code and the partition table, which is why the MBR scheme caps out at four
primary partitions and roughly 2 TiB. UEFI drops that constraint by putting its bootloaders in
files on the EFI System Partition, typically mounted at `/boot/efi`, and pairs naturally with GPT.
Secure Boot is a UEFI feature that verifies the signature of each executable in the chain before
running it, which is why an unsigned kernel module or a custom kernel may need enrolling or
disabling Secure Boot.

**Key terms** EFI System Partition; GPT; Secure Boot; Master Boot Record.

**Traps** UEFI and Secure Boot are not the same thing: Secure Boot is one optional UEFI feature and
can be turned off while UEFI booting continues normally. And "UEFI" is not a bootloader — the
firmware loads GRUB (or another EFI executable); it does not replace it.

**What the exam may test** Which features belong to UEFI rather than BIOS; what the EFI System
Partition is and how it is formatted; and separating Secure Boot from UEFI itself.

<a id="cmp-sysadmin.system-administration.bios-vs-uefi"></a>
#### Not to be confused with: BIOS vs UEFI vs Bootloader and GRUB
*compares: `sysadmin.system-administration.bios-vs-uefi`, `sysadmin.system-administration.bootloader-and-grub`*

| | BIOS vs UEFI | Bootloader and GRUB |
| --- | --- | --- |
| What it is | The platform firmware, stored on the motherboard | Software on the disk that the firmware loads |
| Supplied by | The hardware vendor | The Linux distribution |
| Configured through | A setup screen at power-on, and NVRAM boot entries | `/etc/default/grub` and the generated `grub.cfg` |
| Chooses | Which device (or EFI entry) to boot from | Which kernel and which parameters to boot with |
| Runs when | First, before anything on the disk | Second, once the firmware hands over |

The separating axis is who owns the code: the firmware belongs to the machine and picks a boot
device, while the bootloader belongs to the installed system and picks a kernel — which is why a
machine that never reaches a GRUB menu has a firmware or disk problem, not a GRUB problem.

<a id="c-sysadmin.system-administration.bootloader-and-grub"></a>
### Bootloader and GRUB
*id: `sysadmin.system-administration.bootloader-and-grub` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: fhs-3-0*

**What it is** The stage that loads a kernel into memory, loads the matching initramfs alongside
it, passes it a command line of parameters, and transfers control. GRUB is the common
implementation on Linux, and its menu is where a different kernel version or a recovery entry is
selected.

**Why it matters** Kernel parameters are set here, which makes the bootloader the entry point for
several recovery scenarios: appending `single` or `systemd.unit=rescue.target` to boot into a
minimal state, or booting a previous kernel after an upgrade broke the current one.

**How it works** GRUB's runtime configuration is `/boot/grub/grub.cfg` (`/boot/grub2/grub.cfg` on
Red Hat-family systems), and it is *generated*, not hand-written — edits to it are lost the next
time it is rebuilt. The inputs are `/etc/default/grub` for settings such as the default entry,
timeout and default kernel command line, and the scripts in `/etc/grub.d/` for the entries
themselves. Debian-family systems regenerate it with the `update-grub` wrapper; Red Hat-family
systems call `grub2-mkconfig -o /boot/grub2/grub.cfg` directly. Editing an entry from the menu with
`e` applies only to that one boot, which is the safe way to test a parameter.

**Key terms** `grub.cfg` is generated; `/etc/default/grub`; kernel command line; one-shot menu
edit.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `update-grub` | Regenerate `grub.cfg` from `/etc/default/grub` and `/etc/grub.d/` on Debian-family systems | it is a wrapper for `grub-mkconfig -o /boot/grub/grub.cfg`; Red Hat-family systems use `grub2-mkconfig` instead | `update-grub` | Editing `/boot/grub/grub.cfg` by hand and losing the change at the next kernel update, which regenerates the file |

**Traps** Changing `/etc/default/grub` has no effect until the configuration is regenerated — the
same "edited the source, did not rebuild the artefact" shape as editing a systemd unit without
`daemon-reload`. And `update-grub` does not exist on Red Hat-family systems; reaching for it there
is a family mix-up the exam can present directly.

**What the exam may test** That `grub.cfg` is generated rather than edited; where the settings that
feed it live; the family split between `update-grub` and `grub2-mkconfig`; and that kernel
parameters are supplied by the bootloader.

*Not to be confused with [BIOS vs UEFI](system-administration.md#cmp-sysadmin.system-administration.bios-vs-uefi).*
*Not to be confused with [boot process](system-administration.md#cmp-sysadmin.system-administration.boot-process).*

<a id="c-sysadmin.system-administration.kernel"></a>
### Kernel
*id: `sysadmin.system-administration.kernel` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man-credentials-7, man-proc-5*

**What it is** The privileged core of the operating system: it schedules processes onto CPUs,
manages memory, drives hardware through drivers, provides the filesystem and network stacks, and
enforces every permission decision described elsewhere in this competency. Everything else on the
system is user space asking it for things.

**Why it matters** All the enforcement in this file happens here. Permission bits, UIDs, signals,
and process isolation are not conventions that cooperating programs honour — they are checks the
kernel makes, which is why root's ability to bypass them is a property of the kernel rather than of
any file.

**How it works** Several kernel versions can be installed at once: each has its image in `/boot` as
`vmlinuz-<version>` with a matching initramfs, and its modules under `/lib/modules/<version>/`. The
bootloader menu is what selects between them, which is what makes booting a previous kernel a
first-line recovery step after a bad upgrade. A newly installed kernel is not in use until the
machine reboots, so `uname -r` after an upgrade reports the running version, not the newest
installed one.

**Key terms** `vmlinuz`; `/lib/modules`; running versus installed kernel; user space.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `uname -r` | Print the release of the *running* kernel | `-a` everything, `-m` machine architecture, `-s` kernel name | `uname -r` | Reading it as the distribution version — it reports the kernel only; `cat /etc/os-release` reports the distribution |

**Traps** "Which version of Linux is this" is ambiguous between the kernel release (`uname -r`) and
the distribution release (`/etc/os-release`), and the exam presents both as plausible answers to
the same question. The other trap is upgrade timing: installing a kernel package changes what is on
disk, not what is running, and `uname -r` will keep reporting the old version until the reboot.

**What the exam may test** Which command reports the running kernel version as opposed to the
distribution; that multiple kernels can be installed and selected at boot; and that the kernel is
what enforces permissions rather than merely describing them.

#### Scenario

A server does not come back after a kernel upgrade and a reboot. Locating the failure by stage
comes first. The GRUB menu appears, so firmware and the bootloader are fine; the kernel prints
messages and then stops before any login prompt, which puts the fault after the kernel starts and
before the init system finishes — the initramfs, the root filesystem, or a unit. Selecting the
previous kernel from the GRUB menu boots successfully, which narrows it to the new kernel's
initramfs or modules and gets the machine back into service. From there, `uname -r` confirms which
kernel is actually running (the old one, whatever is newest on disk), `journalctl -b -1` reads the
failed boot if the journal is persistent, and `systemd-analyze blame` is checked only after the
system is healthy again. To make the previous kernel the standing default, `/etc/default/grub` is
edited and then `update-grub` regenerates `grub.cfg` — editing the generated file directly would be
undone by the next kernel package update.

#### Knowledge check

1. Put the boot stages in order.
   Firmware (BIOS or UEFI), bootloader, kernel plus initramfs, PID 1 (the init system), then units
   until the default target is reached.
2. What is the initramfs for?
   It provides a temporary in-memory root filesystem containing the drivers the kernel needs in
   order to mount the real root filesystem.
3. Name three things UEFI provides that legacy BIOS does not.
   An EFI System Partition holding bootloaders as files, GPT partitioning with support for disks
   beyond about 2 TiB and more than four primary partitions, and Secure Boot.
4. Why should `/boot/grub/grub.cfg` not be edited directly?
   It is generated from `/etc/default/grub` and `/etc/grub.d/`, and is rewritten by
   `update-grub` (or `grub2-mkconfig`) at the next kernel update, discarding any hand edit.
5. A kernel package was installed an hour ago. What does `uname -r` report?
   The kernel that is currently running — the previously booted one. The newly installed kernel
   takes effect only after a reboot.
6. `systemd-analyze blame` names a unit that took 40 seconds. Is that the cause of a slow boot?
   Not necessarily. `blame` ranks duration, not delay; `systemd-analyze critical-chain` shows the
   ordering chain that actually held boot up.
