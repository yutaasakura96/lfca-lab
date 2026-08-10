# Troubleshooting

Troubleshooting is the diagnostic half of System Administration Fundamentals: a method for
moving from a reported symptom to an identified cause, plus the specific fault patterns a
Linux administrator meets most often. Its domain carries 30% of the exam — 1st largest of 6
domains on the current (2025-09-16) blueprint — and the competency's 2025 status is
unchanged. LFS200 does not reach it at all: all 15 concepts are NOT COVERED, 0 of 15 (0%)
touched even partially (`research/lfs200-notes/00-course-map.md`), so every topic below is
sourced independently against primary documentation, except four concepts whose only
authoritative references are paywalled and which carry an explicit no-primary-source marker.
Eight of the fifteen are depth-4 diagnostics, which is why each of those ends with an ordered
symptom walk that says what every outcome rules *out*, not merely what to run next.

<a id="s-troubleshooting-method"></a>
## Method

<a id="c-sysadmin.troubleshooting.structured-troubleshooting-method"></a>
### Structured troubleshooting method
*id: `sysadmin.troubleshooting.structured-troubleshooting-method` · depth 4 · importance 4 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** An ordered procedure, not a toolbox: identify the problem, establish a theory
of probable cause, test that theory, plan and implement a fix, verify full functionality,
then document what happened. The value is in the ordering. A candidate who knows every
command in this file and applies them in an arbitrary sequence will still, typically, fix
symptoms rather than causes and be unable to say afterwards which action worked.

**Why it matters** Any exam question phrased "what should you do FIRST" is testing this
ordering and nothing else. The distractors in such a question are usually all *legitimate
troubleshooting actions* — they are simply steps that belong later. Reading the question as
"which of these is a good idea" produces a defensible wrong answer every time; reading it as
"which of these is earliest in the sequence" produces the intended one.

**How it works** Each step gates the next, and in most descriptions of the practice the gate
is what makes the step meaningful. Identification establishes what the symptom actually is,
who sees it, and when it started — before any cause is proposed. A theory is a falsifiable
statement about a cause, which is why testing it comes next and implementing a fix does not.
Implementation follows a plan, and typically changes one thing at a time, because two
simultaneous changes leave the eventual outcome unattributable. Verification is a separate
step from implementation: the fix is not confirmed by the absence of complaints but by
re-running the trigger. Documentation closes the loop, so the next occurrence starts from
evidence rather than from scratch.

**Key terms** theory of probable cause; falsifiable test; one change at a time; verification;
post-fix documentation.

**Traps** "Reboot it" is not a step in this method — it is an untargeted implementation
applied before any theory exists, and it commonly destroys the evidence (running processes,
the kernel ring buffer on some systems, the reproduction case) that identification needed.
Equally, a symptom that stops after a change is not a verified fix: verification means
deliberately re-triggering the fault and observing that it no longer occurs. And
documentation is a numbered step in most statements of the method, not a courtesy performed
if time allows.

**What the exam may test** Placing a described action in the sequence. Given "you have
confirmed the service fails only for one user on one host," the next step is to form a theory
about what is specific to that user or host — not to restart the service, not to escalate,
and not to edit a config file. Expect at least one item where the tempting answer is a real
diagnostic command that belongs two steps later.

**Symptoms and diagnostic order** The "symptom" here is the state of the investigation
itself, and each outcome eliminates a class of next action.

1. You cannot state the symptom precisely (who, what command, since when). You are still in
   identification. This rules out proposing any theory: an imprecise symptom cannot falsify
   one, and it rules out verification later, because there is nothing definite to re-test.
2. You have a precise symptom but cannot reproduce it. Typically this rules out proceeding to
   implementation — a fix applied now can never be verified — and points back at
   identification: widen the observation window, or find the conditions the reporter had and
   you do not.
3. Your theory's test comes back negative. This rules out that cause specifically, and rules
   out implementing the fix you had already planned for it. Return to theory formation with
   one candidate eliminated; do not apply the fix anyway "to see."
4. Your test is positive and the fix works. This rules out nothing yet. If more than one
   thing changed, the attribution is unsafe; back out the extras and confirm which single
   change carried the result.
5. The symptom is gone but you cannot say why. This rules out closure. An unexplained
   recovery predicts recurrence, and in most practice it is treated as an open problem with a
   workaround, not a resolved one.

<a id="cmp-sysadmin.troubleshooting.structured-troubleshooting-method"></a>
#### Not to be confused with: Structured troubleshooting method vs Narrowing scope
*compares: `sysadmin.troubleshooting.structured-troubleshooting-method`, `sysadmin.troubleshooting.narrowing-scope`*

| | Structured troubleshooting method | Narrowing scope |
| --- | --- | --- |
| What it names | The whole ordered procedure, identification through documentation | One technique used inside that procedure's early steps |
| What it produces | A sequence of gated steps ending in a verified, documented fix | A smaller set of candidate causes |
| Answers "what do I do first" | Yes — the ordering *is* the answer | No — it is one of the things done first, not the rule that says so |
| Applies to every fault | Yes, as a discipline | Only where the blast radius is not already known |
| Can be completed on its own | Yes, that is the point | No — it ends with a reduced candidate set, not a fix |

The separating axis is scope of the term: the method is the entire ordered procedure;
narrowing scope is a single technique performed inside its first two steps.

<a id="c-sysadmin.troubleshooting.narrowing-scope"></a>
### Narrowing scope
*id: `sysadmin.troubleshooting.narrowing-scope` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** Establishing the blast radius before proposing a cause: does the fault affect
one user, one host, one network segment, or everything? Each answer, in most practice,
eliminates whole categories of cause outright rather than ranking them.

**Why it matters** It is the cheapest possible filter. If one user on one host fails and a
second user on the same host succeeds, every host-wide explanation — the service is down, the
disk is full, the package is missing — is eliminated in a single test, and the remaining
candidates are all user-specific: credentials, group membership, quota, shell environment,
home-directory permissions. Conversely, if every host in a rack fails identically,
user-specific and host-specific causes are eliminated together and only shared
infrastructure remains.

**How it works** Scope is established by contrast, not by observation of the failure alone. A
single failing data point has no scope; you need at least one deliberately chosen comparison
case that differs in exactly one dimension — same command as a different user, same user on a
different host, same host from a different network. The dimension that flips the outcome is
where the cause lives.

**Key terms** blast radius; comparison case; one dimension at a time; shared dependency.

**Traps** Reproducing only from your own account, on your own workstation, establishes no
scope at all — it adds a second observation that differs in several dimensions at once, so no
category can be eliminated. Assuming "it's down" from one report is the same error in the
other direction. And a fault that appears host-wide can still be user-scoped if every affected
user shares one group, one quota, or one home-directory server.

**What the exam may test** Which single additional check most reduces the candidate set.
Given "user A cannot reach the application," the highest-value next action is having user B
try the same thing from the same place, or user A try it from elsewhere — not opening the
application's log, which is a later step and does not discriminate between causes.

*Not to be confused with [structured troubleshooting method](troubleshooting.md#cmp-sysadmin.troubleshooting.structured-troubleshooting-method).*

<a id="c-sysadmin.troubleshooting.change-correlation"></a>
### Change correlation
*id: `sysadmin.troubleshooting.change-correlation` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: nist-sp-800-128*

**What it is** Asking what changed, and when, on the working assumption that a system which
ran correctly yesterday and fails today was altered rather than spontaneously degraded. It is
a prioritisation heuristic for generating theories, not a proof of cause.

**Why it matters** It reorders the candidate list before any of it is tested. A deployment,
a package upgrade, a certificate rotation, or a firewall rule pushed an hour before the first
report is a far stronger first theory than any structural explanation, and testing it is
usually cheap — configuration change control exists precisely so that this question has a
recorded answer (NIST SP 800-128 frames documented, controlled configuration changes as the
mechanism that makes a system's current state and its deviations knowable).

**How it works** The evidence is on the system, not in memory. Package manager history
(`/var/log/dpkg.log`, `dnf history`), configuration management run records, deployment
pipelines, file modification times, version control history, and `journalctl --since` around
the first report each answer a slice of "what changed." Correlating the change timeline
against the symptom timeline is the whole technique: a change *after* the first symptom is
eliminated, not confirmed.

**Key terms** change window; configuration change control; modification time; correlation
versus causation.

**Traps** "Nothing changed" is almost never literally true, and treating it as an answer ends
the investigation early. Certificates expire, log files grow into a full filesystem, scheduled
jobs run, DNS records reach their TTL, unattended upgrades apply patches, and a token rotates
— all changes nobody performed deliberately. The second trap is latency between change and
symptom: a configuration file edited on Monday takes effect at Thursday's restart, so the
symptom's start time points at the restart, not at the edit. The third is confusing
correlation with causation: rolling back a coincidental change that happened in the same hour
can appear to fix the fault while the real cause remains.

**What the exam may test** Whether a scenario's "we changed nothing" is accepted at face
value, and whether the candidate can name the passive changes that produce a fault with no
human action — expiry, growth, scheduled execution, cache and TTL expiry, automatic updates.

<a id="c-sysadmin.troubleshooting.reproducing-the-fault"></a>
### Reproducing the fault
*id: `sysadmin.troubleshooting.reproducing-the-fault` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** Establishing that you can trigger the fault on demand, with a known command,
as a known user, on a known host. Reproduction is not diagnosis and it is not a fix; it is
the precondition that makes verification of a later fix possible at all.

**Why it matters** Without a reproduction case, "fixed" degenerates into "has not happened
recently," which for any intermittent fault is indistinguishable from luck. With one, the fix
is confirmed by running the same trigger and getting a different result. In most descriptions
of the practice, failure to reproduce is itself treated as evidence rather than as a dead
end: it narrows the cause toward conditions you have not replicated — time of day, load,
cache state, a particular backend behind a load balancer, or something in the reporter's own
environment.

**How it works** Reduce the report to an exact trigger: the literal command line, the account
that ran it, the host, the working directory, the inputs, and the observed error text
verbatim. Then run it under those conditions and shrink it — remove arguments and steps until
the smallest thing that still fails remains. That minimal case is what gets tested against
each theory.

**Key terms** minimal reproduction; trigger conditions; intermittent fault; verification
precondition.

**Traps** Reproducing as `root` when the report came from an unprivileged user typically
makes a permission fault vanish, because the superuser is exempt from the ordinary mode
checks — the test then "passes" and the real cause is eliminated from consideration
incorrectly. Reproducing on a different host, or through a load balancer that may route you
to a healthy node, fails the same way. And declaring an intermittent fault fixed after one
successful run is not verification; the fault's own base rate has to be accounted for.

**What the exam may test** What reproduction actually buys — the ability to verify — and the
recognition that a failed reproduction attempt as the wrong user, or on the wrong host, is
not evidence that the fault is absent.

<a id="c-sysadmin.troubleshooting.checking-logs-first"></a>
### Checking logs first
*id: `sysadmin.troubleshooting.checking-logs-first` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man-journalctl*

**What it is** Consulting the systemd journal and `/var/log` early, on the basis that the
system usually recorded the cause at the moment it happened, in the failing component's own
words, with a timestamp. Logs are prior evidence; every command elsewhere in this file is a
live observation taken after the fact.

**Why it matters** The daemon's own error line ("address already in use", "permission denied
opening /etc/app/key.pem", "syntax error at line 42") names the cause directly and skips
several rounds of theory-and-test. It also carries the one thing live inspection cannot
recover: *when* the fault started, which is what change correlation needs.

**How it works** On systemd systems `journalctl` reads the binary journal, which holds
structured records from units, the kernel, and syslog-compatible sources together;
`journalctl -u <unit>` restricts output to one unit, and `-b` restricts it to the current
boot. `journalctl -p err` filters by syslog priority, and because a single level selects that
level *and every more severe one*, `err` (3) also yields `crit` (2), `alert` (1), and `emerg`
(0). Plain text logs under `/var/log` — written by rsyslog or by applications directly — are
read with ordinary text tools, and `tail -f` follows one as it grows, which is how you watch
a reproduction attempt produce its own log lines in real time.

**Key terms** systemd journal; syslog priority; unit filter; current boot; log rotation.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `journalctl -u` | Show journal records for one systemd unit | takes a unit name or glob pattern; combine with `-b` for this boot only | `journalctl -u sshd.service -b` | Omitting `-b`, so the output opens on the oldest retained record and the recent failure is many pages away |
| `journalctl -p err` | Filter by syslog priority | priorities `0`/`emerg` to `7`/`debug`; a range is written `FROM..TO` | `journalctl -u nginx -p err -b` | Reading it as "only error-level messages" — a single level shows that level and every more severe one |
| `tail -f` | Follow a text log as data is appended | `-f` follows the descriptor; `-F` follows the name and retries | `tail -f /var/log/syslog` | Leaving `tail -f` running across a log rotation: it keeps holding the renamed file and silently goes quiet |

**Traps** `journalctl` does not read `/var/log/*.log`, and `tail -f` does not read the
journal — a system without persistent journal storage loses its journal at reboot while
`/var/log` survives, and a system with journald only has no text files to tail. Journal access
is privileged: an unprivileged user typically sees only their own user units unless they
belong to `systemd-journal` or `adm`. And a unit name is required by `-u` — `journalctl -u`
with no argument is not "all units," it is a usage error.

**What the exam may test** Choosing the command that shows this unit's errors from this boot,
and knowing that `-p err` is inclusive upward in severity rather than an exact-level filter.

<a id="c-sysadmin.troubleshooting.exit-status"></a>
### Exit status
*id: `sysadmin.troubleshooting.exit-status` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: bash-exit-status*

**What it is** The integer a command returns when it terminates. Zero means success and any
non-zero value means failure — the inverse of the usual programming intuition that 1 is true.
Bash exposes the status of the most recently executed foreground pipeline in `$?`.

**Why it matters** Exit status, not output, is how scripts, `systemd`, CI pipelines, and
`&&`/`||` chains detect failure. A command that prints a scary message to stderr and exits 0
is a success as far as every automated caller is concerned, and a silent command that exits 1
is a failure that a human reading the terminal will miss entirely. Several specific values are
themselves diagnostic.

**How it works** The status is the value returned by `waitpid`, in the range 0-255. Bash
assigns specific meanings above 125: a command that could not be found returns 127; a command
found but not executable returns 126; a command killed by fatal signal N yields 128+N, so 137
is 128+9 (SIGKILL — the OOM killer's signature) and 143 is 128+15 (SIGTERM, an ordinary stop).
Shell builtins return 2 for incorrect usage. A pipeline's status is that of its *last*
command unless `set -o pipefail` is enabled, in which case it is the rightmost non-zero one;
the `PIPESTATUS` array holds each element's status individually.

**Key terms** `$?`; 126 and 127; 128+N; `pipefail`; `PIPESTATUS`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `echo $?` | Print the exit status of the most recent foreground pipeline | none — `$?` is a shell parameter, not an option | `echo $?` | Running it twice: the second invocation reports the status of the first `echo`, which is almost always 0, destroying the evidence |

**Traps** `$?` is overwritten by every foreground command, including the `echo` that displays
it — capture it into a variable first if you need it twice. A non-zero status is not
necessarily an error condition: `grep` exits 1 to mean "no lines matched" and `[ ]` exits 1 to
mean "false," both entirely normal. In a pipeline such as `somecmd | tee log`, the default
status is `tee`'s, so a failing `somecmd` is invisible without `pipefail` or `PIPESTATUS`.

**What the exam may test** Reading a specific value: 127 as "command not found" (a PATH or
typo problem), 126 as "found but not executable" (a missing execute bit or a
`noexec`-mounted filesystem), 137 as "killed by SIGKILL" pointing at the OOM killer or a
forced stop, and 0 as success even when the command printed something alarming.

<a id="c-sysadmin.troubleshooting.using-documentation"></a>
### Using documentation
*id: `sysadmin.troubleshooting.using-documentation` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: man-apropos*

**What it is** Resolving "which option does what" against the system's own documentation —
manual pages, `--help`, the GNU `info` manuals, and the package documentation under
`/usr/share/doc` — rather than against recollection.

**Why it matters** Options differ between implementations and versions of the same command
name, and the documentation installed on the machine describes the binary installed on the
machine. That is exactly the case where memory is least reliable and the cost of being wrong
is highest, because a mistaken option on a destructive command executes silently.

**How it works** Manual pages are organised into numbered sections, and the same name can
appear in several: section 1 is user commands, 5 is file formats and configuration files, 8 is
system administration commands. `man 5 crontab` documents the crontab file's syntax while
`man 1 crontab` documents the command that edits it — different pages, different content,
same name. When the name is unknown, `apropos` searches the short one-line descriptions of
every page for a keyword; `man -k` is the equivalent spelling of the same search. `info`
displays the GNU Texinfo manuals, which for the GNU coreutils are often substantially fuller
than the corresponding man page.

**Key terms** manual section; whatis database; `mandb`; Texinfo.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `man` | Display a manual page | a leading section number selects the section; `-a` shows every matching page | `man 5 resolv.conf` | Omitting the section and reading the section-1 command page when the question is about the file format in section 5 |
| `man -k` | Search page names and short descriptions for a keyword | approximately equivalent to `apropos`; `-K` searches full page text instead | `man -k "load average"` | Expecting it to search page bodies — it searches the one-line descriptions only |
| `apropos` | Search the manual page names and descriptions | `-e` exact keyword, `-w` wildcards, `-r` regular expression | `apropos journal` | "nothing appropriate" on a minimal or container image, where the index database has never been built by `mandb` |
| `info` | Read the GNU Texinfo manual for a program | `-k` look up a string in the indices of all manuals, `-a` use all matching manuals | `info coreutils` | Assuming `info` and `man` show the same text — for GNU tools the Texinfo manual is frequently the more complete of the two |

**Traps** Shell builtins have no manual page of their own: `man cd` fails while the command
works, because `cd` is implemented by the shell — `help cd` in bash is the documentation.
`--help` reflects the installed binary and can legitimately disagree with an older man page
shipped by a different package. And `apropos`/`man -k` depend on an index database that is
rebuilt by `mandb`; an empty result means "not indexed" at least as often as "not installed."

**What the exam may test** Choosing the correct manual section for a question about a
configuration file rather than a command, and distinguishing keyword search (`man -k`,
`apropos`) from direct page lookup (`man`).

<a id="c-sysadmin.troubleshooting.escalation"></a>
### Escalation
*id: `sysadmin.troubleshooting.escalation` · depth 3 · importance 4 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** Transferring a problem to someone with the authority, access, or expertise to
continue — together with the evidence gathered so far. Escalation is a handover of a
partially-investigated problem, not an announcement that the problem exists.

**Why it matters** Two distinct limits force it, and they are commonly confused. The first is
competence: the cause lies in a system you do not understand well enough to change safely.
The second is authority: the fix requires deleting data, restarting a production database,
opening a firewall, or changing something inside another team's change window — actions that
are typically out of bounds regardless of whether you know how to perform them. The second
limit is the one candidates under-weight, because technically capable people tend to read
"escalate" as an admission of incompetence.

**How it works** In most implementations of this practice, escalation is time-boxed in
advance ("if this is not identified within 30 minutes, hand it to the platform team") so that
the decision is not made under pressure. The handover typically carries the exact symptom and
its first occurrence, the established scope, what changed recently, the theories already
tested and eliminated, current business impact, and any workaround in place. After handing
over, you stop changing the system: two people making simultaneous changes to one host
invalidates both investigations.

**Key terms** authority boundary; time-boxing; handover evidence; single owner.

**Traps** Escalating with "it's broken, can you look" discards every elimination already
made, and the receiving engineer usually repeats them. Continuing to poke at the system after
escalating is worse than not escalating at all. And escalation is not the same thing as
declaring an incident or raising severity — one changes who owns the problem, the other
changes how urgently the organisation responds; a scenario can call for either, both, or
neither.

**What the exam may test** Recognising an authority boundary rather than a knowledge boundary
as the trigger — the candidate who *could* restart the production database but is not
permitted to should escalate — and naming what must accompany the handover.

#### Scenario

A ticket says "the reporting job is failing." Identification first: the exact command, run by
the `reports` service account on `app02`, since about 02:00. Narrow the scope — the same
command as a different account on `app02` succeeds, which eliminates every host-wide
explanation and points at something specific to that account. Reproduce it deliberately as
`reports` rather than as `root`, because reproducing as the superuser would bypass the mode
checks and make a permission fault disappear. Then ask what changed: `journalctl --since
"02:00"` and the package log both show an unattended upgrade in that window, which is a strong
first theory even though nobody performed it. `journalctl -u reports.service -b -p err` gives
the daemon's own error line, and `echo $?` after re-running the job by hand shows 126 — found
but not executable — narrowing to the execute bit or a `noexec` mount rather than to the
upgrade at all. Reading `man 5` for the relevant configuration file settles the option's
meaning without guessing. The remedy turns out to require a mount option change inside another
team's change window, so the correct final step is escalation with the whole chain of
eliminations attached, not a unilateral remount.

#### Knowledge check

1. A question asks what you should do FIRST, and every option is a reasonable troubleshooting
   action. What is it actually testing?
   The ordering of the method, not the merit of each action — the distractors are legitimate
   steps that belong later in the sequence.
2. One user reports a failure. What single additional observation most reduces the candidate
   causes, and why?
   A deliberately chosen comparison case differing in exactly one dimension — the same
   command as another user, or the same user on another host. A single failing observation
   has no scope, so no category of cause can be eliminated from it.
3. The team insists nothing changed. Name three changes that occur with no human action.
   Certificate or token expiry, logs growing until a filesystem fills, scheduled jobs and
   unattended upgrades running, DNS records reaching their TTL — any three.
4. Why is reproducing a reported fault as `root` usually invalid?
   The superuser is exempt from ordinary permission checks, so a permission fault will not
   reproduce and gets wrongly eliminated as a cause.
5. `journalctl -p err` is described as showing errors. What exactly does it show?
   Priority `err` (3) and every more severe priority — `crit`, `alert`, and `emerg` — not
   only level 3.
6. A command exits 126 and another exits 127. What distinguishes them?
   127 means the command was not found at all (PATH or a typo); 126 means it was found but
   could not be executed (missing execute bit, or a `noexec` filesystem).
7. You know how to restart the production database and are confident that is the fix, but
   your role does not permit it. Is escalating the right call?
   Yes — the limit is authority, not competence, and both are valid triggers. The handover
   carries the symptom, scope, recent changes, tested theories, impact, and any workaround.

<a id="s-troubleshooting-common-faults"></a>
## Common faults

<a id="c-sysadmin.troubleshooting.service-will-not-start"></a>
### Service will not start
*id: `sysadmin.troubleshooting.service-will-not-start` · depth 4 · importance 4 · LFS200: NOT COVERED · sources: man-systemctl, man-journalctl, man-ss*

**What it is** A unit that is not running — which is several distinct states, not one.
`inactive (dead)` means it was never started or was stopped cleanly. `failed` means it ran and
terminated badly. `activating` means it is still starting, or stuck doing so. `active
(exited)` means a oneshot unit ran to completion successfully, which is not a fault at all.
Separately, *enabled* and *active* are independent: a unit can be enabled and currently
failed, or active but disabled and therefore absent after the next reboot.

**Why it matters** The state name tells you which half of the problem you are in. `failed`
means systemd started the process and the process died — the cause is inside the application
or its configuration. `inactive` means the process was never launched, so the application's
own configuration is irrelevant and the cause is in the unit, its dependencies, or the fact
that nothing asked for it.

**How it works** `systemctl status <unit>` reports the load state (is the unit file found and
parsed), the active state and sub-state, the main PID, the exit code or signal of the last
run, and a tail of the unit's journal. That tail is deliberately short — by default it shows
ten lines and ellipsizes each to the terminal width, changed with `--lines` and `--full` — so
it is a summary, not the log. `journalctl -u <unit> -b` is the log. The typical causes are a
configuration syntax error the daemon rejects at startup, a listening port already bound by
another process (found with `ss -tulpn`), a permissions or path problem on a key or data
directory, a failed dependency, and a unit file edited on disk without a subsequent
`systemctl daemon-reload`, which leaves systemd running the old definition.

**Key terms** load state; active state and sub-state; `Result:`; `daemon-reload`; oneshot.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `systemctl status` | Show a unit's runtime state and a short journal tail | `--full` stops line truncation, `--lines=N` widens the tail | `systemctl status nginx.service` | Treating the ten-line tail as the whole log; it is a summary of the *current* invocation only |
| `journalctl -u` | Read the full journal for that unit | `-b` this boot, `-p err` errors and above | `journalctl -u nginx.service -b` | Searching without `-u` and drowning the daemon's one error line in system-wide output |
| `ss -tulpn` | List listening TCP and UDP sockets with ports and owning processes, numerically | `-t` TCP, `-u` UDP, `-l` listening only, `-p` process, `-n` no name resolution | `ss -tulpn \| grep :8080` | Running it unprivileged: `-p` can only name processes you own, so the conflicting listener shows a blank process column |

**Traps** `systemctl start` returning without error does not mean the service is running — a
forking or notify-type daemon that exits a moment later leaves `start` apparently successful
and the unit `failed` seconds afterwards, which is why the next command is always `status`.
`systemctl status` shows only the current or most recent invocation, so a service that has
restart-looped many times shows one attempt; the journal shows all of them. And an edited unit
file has no effect until `systemctl daemon-reload`, which produces the confusing result that
the file on disk is correct and the behaviour is not.

**What the exam may test** Mapping a described symptom to the right first command, and
distinguishing `failed` (the process ran and died — read its log) from `inactive` (it never
ran — check enablement, dependencies, and whether anything triggers it) from `active
(exited)` (a oneshot that completed normally, and is not broken).

**Symptoms and diagnostic order**

1. `systemctl status <unit>` reports `Unit ... could not be found` or `Loaded: not-found`.
   This rules out every application-level cause — configuration, ports, permissions — because
   no process was ever launched. The fault is a wrong unit name, a unit file in the wrong
   directory, or a missing `daemon-reload`.
2. `Active: failed (Result: exit-code)` with a non-zero status. The process started and exited
   under its own control. This rules out systemd never having tried, and rules out signals and
   OOM kills, which report `Result: signal` and the `oom-kill` failure state instead. Read the
   unit's journal for the daemon's own message.
3. `Result: signal` with SIGKILL, or the `oom-kill` state. This rules out a configuration
   syntax error — a rejected config produces an ordinary non-zero exit, not a kill — and
   moves the investigation to memory exhaustion.
4. `journalctl -u <unit> -b` shows "address already in use". This rules out configuration
   syntax and permissions; `ss -tulpn` names the process already holding the port, which is
   frequently a previous instance of the same daemon that never exited.
5. The journal shows a permission or path error on a specific file. This rules out the port
   conflict and points at ownership, mode, path traversal, or a security policy on that path.
6. The journal contains nothing for the unit at all. This rules out the daemon having run and
   failed; suspect that the unit is masked, that a dependency failed first, or that nothing
   activates it — `systemctl is-enabled` and `systemctl list-dependencies` discriminate.

<a id="c-sysadmin.troubleshooting.disk-full"></a>
### Disk full
*id: `sysadmin.troubleshooting.disk-full` · depth 4 · importance 4 · LFS200: NOT COVERED · sources: man-df*

**What it is** A filesystem that can no longer accept writes — which happens for four
independent reasons that share one error message. Data blocks can be exhausted; *inodes* can
be exhausted while blocks remain free; the filesystem's reserved-for-root allowance can be all
that is left, so unprivileged writes fail while root's succeed; and space can be held by files
that have been deleted but are still open, so it is unreachable by any amount of deleting.

**Why it matters** The symptom is rarely "disk full." It is a service refusing to start, a
database going read-only, a login failing because a session file cannot be written, a package
upgrade aborting, or a log that simply stops. Reaching for "delete the biggest file" answers
only one of the four causes and actively wastes time on the other three.

**How it works** `df` reports per-filesystem block usage; `df -i` reports the same
filesystems' inode usage instead, because inodes are a fixed pool allocated when the
filesystem was created and one is consumed per file regardless of size. `du` walks a directory
tree and sums the space its files occupy — a different question, which is why `df` and `du` can
legitimately disagree. On ext4, `mke2fs` reserves 5% of blocks for the superuser by default;
`df`'s "Avail" column excludes that reserve, so `Use%` reaches 100% while root-owned daemons
continue writing. And an unlinked file whose descriptor is still open keeps its blocks
allocated until the last holder closes it or exits, which is invisible to `du` because the
name is gone from the tree.

**Key terms** inode exhaustion; reserved blocks; deleted-but-open file; filesystem boundary.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `df -h` | Report filesystem space usage in human-readable units | `-h` powers of 1024, `-H` powers of 1000, `-T` show filesystem type | `df -h /var/log` | Running bare `df -h` and acting on the wrong row — pass the affected path so the correct filesystem is identified |
| `df -i` | Report inode usage instead of block usage | same output shape, `IUse%` replaces `Use%` | `df -i /var` | Never running it, and concluding there is no space problem because `df -h` shows free space |
| `du -sh /*` | Summarise the size of each top-level entry | `-s` one total per argument, `-h` human-readable, `-x` stay on one filesystem | `du -sh /*` | The `/*` glob does not match dotfiles, and without `-x` the walk crosses into other mounted filesystems and inflates the totals |

**Traps** The single most misleading case is `df` reporting a full filesystem while `du` over
the same tree accounts for far less: that gap is space held by deleted-but-open files, and no
amount of searching for large files will find it — the fix is to identify and restart the
process holding the descriptors. Inode exhaustion produces `No space left on device` with
gigabytes free, and is caused by *many small files* (session data, mail spools, cache
fragments), so deleting a few large ones changes nothing. And `du -sh /*` on a running system
descends into pseudo-filesystems and other mounts unless restricted with `-x`.

**What the exam may test** Selecting `df -i` when the scenario explicitly states that space is
available but writes fail; recognising the `df`/`du` discrepancy as an open-file-handle
problem; and knowing that a filesystem showing 100% used can still be writable by root because
of the reserved-block allowance.

**Symptoms and diagnostic order**

1. `df -h <affected path>` shows `Use%` at 100%. Blocks are exhausted. This rules out inode
   exhaustion as the *sole* cause but does not yet rule out deleted-open files as the thing
   consuming them.
2. `df -h` shows space available and writes still fail with `No space left on device`. This
   rules out block exhaustion. Run `df -i`: `IUse%` at 100% means the inode pool is gone, and
   that in turn rules out any remedy based on file size — you must remove file *count*.
3. `df -h` shows the filesystem full but `du -sh /*` (or `du -sh` on that mount) totals far
   less. This rules out "find the large directory" entirely: the space is held by unlinked
   files still open by a running process, and only closing or restarting that process returns
   it.
4. Unprivileged writes fail while root-owned processes keep writing normally. This rules out
   true exhaustion and points at the ext4 reserved-block allowance, 5% by default.
5. `df -h` on the path you assumed is fine. This rules out nothing until you check the path
   that is actually failing — `/var` and `/home` are frequently separate filesystems from
   `/`, and a full `/var` presents as almost any service misbehaving while `df -h /` looks
   healthy.

<a id="c-sysadmin.troubleshooting.out-of-memory-and-the-oom-killer"></a>
### Out of memory and the OOM killer
*id: `sysadmin.troubleshooting.out-of-memory-and-the-oom-killer` · depth 4 · importance 4 · LFS200: NOT COVERED · sources: man-proc-pid-oom-score, kernel-sysctl-vm, man-dmesg, man-journalctl*

**What it is** When the kernel cannot satisfy an allocation and cannot reclaim enough memory,
it selects a process and kills it. This is a deliberate kernel action recorded in the kernel
log, not a crash and not a bug in the victim — which is why "the service died for no reason,
there is nothing in its own log" is the classic presentation.

**Why it matters** The victim is chosen by a badness score, and that score is roughly
proportional to how much of the allowed memory a process is using. The consequence is that the
process killed is usually the largest memory consumer, which is very often *not* the process
responsible for the exhaustion: a small leaking utility can trigger the death of the database.
Diagnosing from the victim's identity alone therefore points at the wrong cause by design.

**How it works** Each candidate task is scored from 0 (never kill) to 1000 (always kill), the
units being roughly the proportion of allowed memory the task is using; root-owned processes
receive a 3% allowance discount. `/proc/<pid>/oom_score_adj`, in the range -1000 to +1000, is
added to that score, so -1000 exempts a process entirely. "Allowed memory" depends on the
context that triggered the kill: for a system-wide exhaustion it is all allocatable memory,
but for a container or cgroup hitting its own limit it is that limit — which is why a
container can be OOM-killed on a host with gigabytes free. The kill is written to the kernel
ring buffer, readable with `dmesg` or, as journal records, with `journalctl -k`. A process
killed this way is terminated by SIGKILL, so its shell-visible exit status is 137 (128+9) and
its systemd unit enters the `oom-kill` failure state.

**Key terms** badness score; `oom_score_adj`; cgroup memory limit; SIGKILL; kernel ring
buffer.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `free -h` | Show memory and swap totals, usage, and availability | `-h` human-readable, `-s N` repeat every N seconds, `-w` split buffers and cache | `free -h` | Reading the `free` column as spare capacity — the meaningful figure is `available`, which counts reclaimable page cache; `used` is computed as total minus available |
| `dmesg` | Print the kernel ring buffer | `-T` human-readable timestamps, `-H` paged human output, `-w` wait for new messages | `dmesg -T` | Assuming it retains history — the ring buffer is fixed-size and wraps, and on many systems reading it requires root because of `dmesg_restrict` |
| `journalctl -k` | Show only kernel messages from the journal | implies the current boot unless `-b` says otherwise; `-b -1` for the previous boot | `journalctl -k -b -1` | Using `dmesg` to investigate a kill that preceded a reboot — the ring buffer does not survive it, while a persistent journal does |

**Traps** Low "free" memory is the normal state of a healthy Linux system, because the kernel
uses idle RAM as page cache and reclaims it on demand; `available` is the number that answers
"can this machine start another process." Heavy swap *usage* is likewise not itself a fault —
sustained swap *thrashing* is. And the OOM message names the victim and its memory footprint,
never the process that caused the pressure.

**What the exam may test** Recognising the symptom pattern — a service disappearing with no
message of its own, exit status 137, nothing wrong in its configuration — as an OOM kill, and
knowing which log holds the evidence. Also expect the container case: a process OOM-killed
against a cgroup limit while the host has ample free memory.

**Symptoms and diagnostic order**

1. `systemctl status` shows `Result: signal` with SIGKILL, or a shell exit status of 137. This
   is consistent with an OOM kill and rules out a clean self-termination, which would report
   an exit code rather than a signal. It does not yet rule out a human `kill -9`.
2. `journalctl -k` or `dmesg -T` around that timestamp contains an `Out of memory: Killed
   process` line. This confirms the kill and rules out a manual signal.
3. The kernel line names a memory cgroup rather than a system-wide condition. This rules out
   host memory exhaustion: a container or unit hit its configured limit, and raising the host's
   RAM will change nothing.
4. `free -h` shows a large `available` figure and little or no swap in use. This rules out
   host exhaustion at the time of observation, which pushes the explanation toward a cgroup
   limit, a per-process resource limit, or a transient spike already over.
5. `free -h` shows `available` near zero with swap fully consumed. This rules out the cgroup
   case and confirms genuine system-wide pressure — the next question is which process's
   growth caused it, not which one was killed.
6. No OOM line anywhere and the process exited with an ordinary non-zero status. This rules
   out the OOM killer entirely; go back to the unit's own journal.

<a id="c-sysadmin.troubleshooting.high-cpu-load"></a>
### High CPU load
*id: `sysadmin.troubleshooting.high-cpu-load` · depth 4 · importance 4 · LFS200: NOT COVERED · sources: man-proc-loadavg, man-uptime*

**What it is** The load average: three figures, over 1, 5, and 15 minutes, giving the number
of processes that are either runnable (state R — using or waiting for the CPU) or in
uninterruptible sleep (state D — typically blocked on disk I/O). It is a count of queued and
running work, not a utilisation percentage, and it is not normalised for the number of CPUs.

**Why it matters** Because D-state processes count, a machine can show a load of 30 with
almost entirely idle CPUs: the queue is waiting on storage, not on processor time. Adding CPUs
to that machine fixes nothing. Conversely, a load of 6 is unremarkable on a 32-core host and
severe on a 2-core one. Every useful conclusion here requires dividing by the core count
first, which is what `nproc` supplies.

**How it works** `uptime` prints the three load averages alongside how long the system has
been up; the same values come from `/proc/loadavg`. The manual is explicit that a load average
of 1 means a single-CPU system is loaded all the time, while on a 4-CPU system it means the
system was idle 75% of the time. `top` then separates the causes: its CPU-state line splits
time into user (`us`), system (`sy`), nice (`ni`), idle (`id`), I/O wait (`wa`), and steal
(`st`), and its per-task `%CPU` column is a share of elapsed CPU time — in the default Irix
mode a multi-threaded task can legitimately exceed 100%, while the `I` key toggles Solaris
mode, which divides by the CPU count instead.

**Key terms** runnable and uninterruptible states; core-count normalisation; `wa` I/O wait;
`st` steal time; Irix versus Solaris mode.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `uptime` | Print time since boot, logged-in users, and the 1/5/15-minute load averages | `-p` pretty uptime only, `-s` boot time | `uptime` | Comparing the number against 1.0 or against 100 as though it were a percentage, without dividing by core count |
| `nproc` | Print the number of processing units available to the calling process | `--all` reports installed processors, ignoring restrictions | `nproc` | Assuming it reports the hardware total — cgroup limits and CPU affinity can make the available count smaller than `nproc --all` |
| `top` | Show a live, sorted view of processes and per-state CPU time | `-b` batch mode for scripting, `-n N` iteration count, `1` toggles per-CPU lines | `top -b -n 1` | Reading only the process list and ignoring the `wa` and `st` fields on the CPU-state line, which is where the cause usually is |

**Traps** Load average is widely misread as a percentage; it is a count, it includes processes
blocked on I/O, and it is meaningless without the core count. The three figures also carry
direction: a 1-minute value far above the 15-minute one means the event is building or just
started, while the reverse means it has already passed and a `top` snapshot taken now proves
nothing. And high steal time means the hypervisor is descheduling this virtual machine — the
contention is real but not on this host, so nothing you tune inside the guest will help.

**What the exam may test** Interpreting a load figure against a stated core count, and
identifying which CPU-state field distinguishes a genuinely CPU-bound host from one that is
I/O-blocked or being starved by its hypervisor.

**Symptoms and diagnostic order**

1. `uptime` gives the load; `nproc` gives the divisor. A ratio comfortably below 1 rules out
   CPU saturation outright — the reported slowness is memory, storage latency, network, or
   application-level locking, and no amount of process-list reading will show it.
2. The ratio is well above 1. This establishes that work is queueing but rules nothing in
   yet; the queue may be for CPU or for disk.
3. `top`'s CPU-state line shows high `us` plus `sy` and low `id`. This rules out I/O wait and
   confirms a genuinely CPU-bound host; the per-task `%CPU` column now identifies the
   consumer.
4. High `wa` with low `us`. This rules out a CPU shortage: the load is inflated by D-state
   processes waiting on storage, and the investigation moves to the disk or the filesystem.
5. High `st`. This rules out both local CPU demand and local I/O — the guest is being denied
   physical CPU by its hypervisor, and the remedy is off-host.
6. The 15-minute figure greatly exceeds the 1-minute figure. This rules out an ongoing event;
   you are looking at the aftermath, and diagnosis must come from logs and metrics recorded
   during the episode rather than from live inspection.

<a id="c-sysadmin.troubleshooting.permission-denied"></a>
### Permission denied
*id: `sysadmin.troubleshooting.permission-denied` · depth 4 · importance 4 · LFS200: NOT COVERED · sources: man-path-resolution, man-namei*

**What it is** An access refusal that has several structurally different causes behind one
message. The file's own mode and ownership are only the first. Path resolution requires search
(`x`) permission on *every* directory in the prefix, so a world-readable file under a
`0700` directory is unreachable. Group membership is evaluated from the credentials the
process already holds, so a user added to a group is unaffected until a new login. Mount
options, mandatory access control, and file attributes can each refuse an operation that the
mode plainly permits.

**Why it matters** The instinct on seeing "Permission denied" is to look at the file and, if
its mode looks wrong, to widen it. When the real cause is a parent directory, a stale session,
or a `ro` mount, that `chmod` does not fix the problem and does permanently weaken the
file — a wrong answer that also causes harm.

**How it works** The kernel resolves a pathname component by component, and the manual is
explicit: if the process lacks search permission on the current lookup directory, `EACCES` —
"Permission denied" — is returned before the final component is ever examined. Read (`r`) on a
directory permits listing the names it contains; execute (`x`) permits traversing into it and
resolving entries. Those are separate bits, so a directory with `r` but not `x` lets you see
filenames you cannot open. `id` reports the credentials of the *current* process, which is why
comparing `id` inside the failing session with `id <user>` exposes a group added after that
session began.

**Key terms** search permission; `EACCES` versus `EPERM`; supplementary groups; mount option;
immutable attribute.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ls -l` | Show a file's mode, owner, and group | `-n` numeric uid/gid, `-a` include dotfiles | `ls -l /srv/app/config.yml` | Pointing it at a directory, which lists the directory's *contents* rather than describing the directory itself |
| `ls -ld` | Describe the directory itself rather than listing it | `-d` treat the directory as the operand | `ls -ld /srv/app` | Never running it, and so never seeing that the parent directory is the thing denying access |
| `id` | Print real and effective user and group IDs of the current process | `-G` all group IDs, `-n` names instead of numbers, a username argument shows that user's configured groups | `id` | Running `id <user>` and reading it as what the user's live session holds — a session started before a group change still carries the old set |
| `namei -l` | Walk a pathname component by component, showing each one's type, mode, and owner | `-l` long format (equivalent to `-m -o -v`), `-x` mark mount points | `namei -l /srv/app/config.yml` | Not knowing it exists and checking each parent by hand, which is where the traversal bit gets missed |

**Traps** The single most common miss is the traversal case: the file's mode is fine and a
parent's is not. Second is the stale session — a group added with `usermod -aG` takes effect
at the next login, not immediately, so `id` in the open shell and `id <user>` disagree. Third,
"root can do it" proves nothing, because the superuser bypasses ordinary mode checks; testing
as root is exactly the invalid reproduction described earlier in this file. Finally, note the
message: refusal by mode or by traversal is `EACCES`, printed as "Permission denied," whereas
an immutable file (`chattr +i`) refuses writes with `EPERM`, printed as "Operation not
permitted" — the exact wording discriminates between the two families.

**What the exam may test** Choosing `ls -ld` (or `namei -l`) over `ls -l` when the scenario
describes a readable file that cannot be opened, and recognising the newly-added-group case as
requiring a fresh login rather than another permission change.

**Symptoms and diagnostic order**

1. `ls -l <file>` — read the mode, owner, and group against the failing user's `id`. If the
   mode plainly grants the requested access, this rules out the file's own permissions and
   forces the investigation onto the path and the credentials.
2. `namei -l <full path>`, or `ls -ld` on each parent. A parent lacking `x` for that user
   explains an `EACCES` on a perfectly permissive file, and finding one here rules out both
   file-level and group-level causes.
3. Compare `id` run *inside the failing session* with `id <user>`. Differing group lists rule
   out a permissions misconfiguration entirely: the configuration is already correct and the
   session predates it. The fix is a new login, not another `chmod` or `chgrp`.
4. Mode, path, and groups all check out. This rules out the discretionary permission layer
   and leaves the mount and the security policy: a filesystem mounted `ro` or `noexec`, or an
   SELinux/AppArmor denial, each of which still surfaces as "Permission denied" while every
   mode bit looks right. An AVC denial in the audit log confirms the policy case.
5. The refusal happens only on write, the file is owned by the user with mode `644`, and the
   message reads "Operation not permitted" rather than "Permission denied". This rules out the
   permission model altogether — check `lsattr` for the immutable attribute.

<a id="c-sysadmin.troubleshooting.cannot-connect-to-a-service"></a>
### Cannot connect to a service
*id: `sysadmin.troubleshooting.cannot-connect-to-a-service` · depth 4 · importance 4 · LFS200: NOT COVERED · sources: man-ss, man-systemctl*

**What it is** A connection failure decomposed into independent layers, each of which is
separately testable: is the process running at all; is it listening on the address and port
you expect; does the network path permit the traffic; does the name resolve to the right
address; and does the application answer once connected. "The service is down" is a
conclusion, not an observation, and it is wrong more often than it is right.

**Why it matters** The layers fail in ways that look identical from the client and are fixed
in completely different places. A daemon bound only to the loopback address is up, healthy,
and unreachable from anywhere else; a firewall dropping packets and a wrong DNS answer both
present as "it just hangs." Testing the layers in order is what converts one ambiguous symptom
into one specific fault.

**How it works** `systemctl status` answers the first layer on the server. `ss -tulpn` answers
the second and is the highest-value command here, because its Local Address column shows the
bind address explicitly: `127.0.0.1:8080` accepts only local clients, `0.0.0.0:8080` (often
shown as `*:8080`) accepts any IPv4 client, and `[::]:8080` is the IPv6 equivalent. The client
side then distinguishes failure modes by their error text: *connection refused* means a host
was reached and actively rejected the connection (nothing listening on that address, or a
REJECT rule); *connection timed out* means nothing answered at all (a DROP rule, a wrong
address, or a routing problem); *no route to host* means the network returned an unreachable
message. `ping` tests ICMP reachability only, `dig` tests name resolution only, and `curl -v`
shows the connection attempt, the TLS handshake, and the response headers separately, which
distinguishes "never connected" from "connected and got an HTTP error."

**Key terms** bind address; listening socket; refused versus timed out; ICMP; connect phase.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `systemctl status` | Confirm the service is actually running on the server | `--full`, `--lines=N` | `systemctl status nginx.service` | Skipping it and debugging the network for a service that is not running |
| `ss -tulpn` | List listening TCP/UDP sockets with numeric addresses and owning processes | `-t` TCP, `-u` UDP, `-l` listening only (omitted by default), `-p` process, `-n` numeric | `ss -tulpn` | Ignoring the Local Address column, which is where the loopback-versus-wildcard bind is visible |
| `ping` | Test ICMP echo reachability of a host | `-c N` stop after N packets, `-n` no name resolution | `ping -c 3 10.0.0.5` | Concluding the host is down when ICMP fails — ICMP is very commonly filtered while TCP services work fine |
| `dig` | Query DNS directly for the name the client is using | `@server` to query a specific resolver, `+short` for a terse answer | `dig app.example.com` | Not checking resolution at all, and debugging a firewall while the client is connecting to a stale address |
| `curl -v` | Make the actual application request with the connection steps shown | `-v` shows `*` connection info, `>` request headers, `<` response headers | `curl -v http://10.0.0.5:8080/` | Reading a 502 or 404 as a connection failure — those prove the TCP connection succeeded and the fault is above the network |

**Traps** Binding to `127.0.0.1` instead of `0.0.0.0` is a frequent cause of "works locally,
fails remotely", and it is invisible unless you read the bind address: every local test
succeeds, every remote test times out or is refused, and the firewall gets blamed. `ss` needs
privilege to attribute other users' sockets, so an unprivileged `-p` shows an empty process
column rather than an error. A successful `ping` says nothing about whether the port is open,
and a failed one says nothing about whether the host is up. And a service listening on `::1`
only is the IPv6 form of the same loopback trap.

**What the exam may test** Ordering the layers, and reading the discriminating detail: the
bind address in `ss -tulpn` output, and the difference between a refused connection (something
answered) and a timed-out one (nothing did).

**Symptoms and diagnostic order**

1. On the server, `systemctl status <unit>`. `inactive` or `failed` rules out every network
   explanation — there is nothing to connect to — and redirects to the service-will-not-start
   path.
2. `ss -tulpn` shows no listening socket on the expected port. This rules out the firewall and
   DNS: the process is running but is not accepting connections there, so it is still starting
   up or is configured for a different port.
3. `ss -tulpn` shows the socket bound to `127.0.0.1` (or `::1`). This rules out the firewall
   as the cause of a *remote* failure and explains why local tests pass; no network change can
   make a loopback-bound socket remotely reachable.
4. From the client, `dig <name>` returns no answer or an unexpected address. This rules out
   the service and the firewall and makes it a name-resolution fault.
5. From the client, `curl -v http://<ip>:<port>/` by literal IP address. "Connection refused"
   means a host answered and rejected — this rules out silent packet-dropping firewalls and
   routing failures, leaving nothing listening on that address or an explicit REJECT rule.
   "Connection timed out" means nothing answered — this rules out "nothing listening" and
   points at a DROP rule, the wrong host, or routing.
6. `ping <ip>` succeeds while the port test fails. This narrows the block to the port rather
   than the host. `ping` failing rules *nothing* out, because ICMP is routinely filtered.
7. `curl -v` connects and the server returns an HTTP status. This rules out every network
   layer beneath it; the fault is in the application or something it depends on.

<a id="c-sysadmin.troubleshooting.name-resolution-failure"></a>
### Name resolution failure
*id: `sysadmin.troubleshooting.name-resolution-failure` · depth 4 · importance 4 · LFS200: NOT COVERED · sources: man-resolv-conf*

**What it is** A failure to turn a name into an address, separated from a failure to reach the
address once known. The separating test is trivial and decisive: try the IP address directly.
If the IP works and the name does not, the fault is in resolution; if neither works, resolution
is not the problem, or not the only one.

**Why it matters** Name resolution sits underneath almost every other network symptom, so it
is misdiagnosed in both directions — a connectivity outage blamed on DNS, and a DNS fault
investigated as a firewall problem for an hour. It also has several failure modes that are
distinguishable from the resolver's own response codes, which most candidates never learn to
read.

**How it works** `/etc/resolv.conf` holds the resolver's configuration: `nameserver` lines
give the servers to query in order (up to three are used), and `search` gives the domain
suffixes appended to short names. `dig` sends a DNS query directly — to the servers in
`/etc/resolv.conf` unless `@server` names one explicitly — and prints the response status. That
status is the discriminator: `NOERROR` with an answer is success; `NXDOMAIN` is an
authoritative "this name does not exist"; `SERVFAIL` means the resolver tried and failed
(unreachable upstream, or a DNSSEC validation failure); and "no servers could be reached"
means the resolver itself never answered. On systems running `systemd-resolved`,
`/etc/resolv.conf` is commonly a symlink to a stub file naming only `127.0.0.53`, and the real
upstream servers are held by the resolver service rather than in that file.

**Key terms** `nameserver`; `search` list; `NXDOMAIN` versus `SERVFAIL`; stub resolver;
`/etc/hosts`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `dig` | Query DNS directly and show the response status and answer section | `@server` query a specific resolver, `+short` answer only, `+trace` follow the delegation | `dig @1.1.1.1 app.example.com` | Reading only the answer section and ignoring the `status:` field, which is where NXDOMAIN, SERVFAIL, and REFUSED are distinguished |
| `ping` | Reach a host by literal IP address, to separate resolution from connectivity | `-c N` count, `-n` do not resolve names in output | `ping -c 3 93.184.216.34` | Pinging the *name*, which conflates the two failures the test was meant to separate |
| `cat /etc/resolv.conf` | Read the configured nameservers and search domains | none | `cat /etc/resolv.conf` | Editing it on a `systemd-resolved` system, where the file is generated and the edit is overwritten |

**Traps** `dig` queries DNS and only DNS: it does not consult `/etc/hosts` or the name service
switch that ordinary applications resolve through. So a host defined only in `/etc/hosts`
works for `ping` and `curl` while `dig` returns NXDOMAIN — and, in the other direction, a name
that `dig` resolves perfectly can still fail in an application because of a stale `/etc/hosts`
entry taking precedence. The `search` list produces host-dependent behaviour: a short name that
resolves on one machine and not another usually differs only in its search domains. And `dig`
is not always installed — it ships in the BIND utilities package, so its absence is a packaging
fact, not a diagnosis.

**What the exam may test** Using an IP address to separate a DNS fault from a connectivity
fault, reading `dig`'s status field, and knowing that a name working for applications but not
for `dig` implicates `/etc/hosts` rather than DNS.

**Symptoms and diagnostic order**

1. Connect by literal IP address. Success where the name failed rules out connectivity,
   routing, and the firewall, and confines the fault to resolution. Failure by IP as well rules
   out resolution as the sole cause and sends you to the connectivity path.
2. `cat /etc/resolv.conf`. No `nameserver` line at all explains a total failure. A single
   `127.0.0.53` entry rules out reading the real upstream servers from this file — it is the
   `systemd-resolved` stub, and the upstream configuration lives with that service.
3. `dig <name>` returns `NXDOMAIN`. The resolver reached an authority which said the name does
   not exist. This rules out an unreachable resolver and a network fault, and points at a
   missing record or a short name that needed a search domain.
4. `dig <name>` returns `SERVFAIL`. The resolver was reachable and could not complete the
   lookup. This rules out "the record is simply missing" and points upstream — a broken
   forwarder, an unreachable authoritative server, or DNSSEC validation failure.
5. `dig <name>` reports that no servers could be reached. This rules out both of the previous
   two: the configured resolver itself is unreachable — wrong address, or port 53 blocked.
6. `dig @<public resolver> <name>` succeeds while `dig <name>` fails. This rules out the record
   and the zone entirely and isolates the fault to the configured resolver.
7. `dig` returns NXDOMAIN but applications resolve the name fine. This rules out DNS as the
   application's source: the name is coming from `/etc/hosts` or another name service switch
   source.

#### Scenario

Users report that an internal web application "is down." Reaching it by IP address works while
the hostname does not, which immediately eliminates connectivity and the firewall and confines
the fault to resolution — `dig` returns SERVFAIL from the configured resolver but NOERROR from
a public one, isolating the fault to that resolver rather than to the record. While
investigating, a second symptom appears: the application host's own service has stopped.
`systemctl status` shows `failed` with `Result: signal` rather than an exit code, so this is
not a configuration error; `journalctl -k` carries an `Out of memory: Killed process` line, and
the unit's exit status of 137 corroborates it. `free -h` shows `available` near zero. The
memory pressure turns out to be a log-shipping process that grew unbounded because `/var` had
filled — `df -h /var` reads 100% while `df -h /` looks healthy, and `du -sh /*` accounts for far
less than `df` reports, which points at deleted-but-open log files held by that same process
rather than at any file you could find and remove. Restarting it returns the space, the memory,
and the service. Finally, one user still cannot read the application's config: the file's mode
is `644` and correct, but `namei -l` shows a parent directory without `x` for their group, and
`id` inside their session lacks a group that `id <user>` shows — two independent causes, one
message.

#### Knowledge check

1. A unit shows `Active: failed (Result: exit-code)` with status 1. What does that rule out,
   and where is the real message?
   It rules out a signal kill and an OOM kill, both of which report a signal result or the
   `oom-kill` state. The daemon exited under its own control, so its message is in
   `journalctl -u <unit> -b`, not in the ten-line tail `systemctl status` prints.
2. A write fails with "No space left on device" but `df -h` shows free space. What is the next
   command and why?
   `df -i` — the inode pool can be exhausted independently of blocks, and the remedy is to
   remove file count rather than file size.
3. `df` reports a filesystem full but `du` over the same tree accounts for far less. What is
   happening?
   Space is held by files that were deleted while still open by a running process; the blocks
   are not freed until the last descriptor closes, and no file search will find them.
4. Why is the process killed by the OOM killer usually a poor guide to the cause?
   The victim is chosen by a badness score roughly proportional to memory in use, so it is
   normally the largest consumer — which is frequently not the process whose growth caused the
   exhaustion.
5. A host shows a load average of 24 with mostly idle CPUs. What is that, and what does it
   rule out?
   Load counts uninterruptible (D-state) processes as well as runnable ones, so this is an
   I/O-blocked queue. It rules out a CPU shortage; adding CPUs will not help.
6. A file is mode `644` and owned by the user, yet they get "Permission denied" opening it.
   Name two causes and the command that distinguishes them.
   A parent directory without search (`x`) permission, or a session whose group membership
   predates a group change. `namei -l <path>` exposes the first; comparing `id` in the failing
   session against `id <user>` exposes the second.
7. What is the difference between a connection that is refused and one that times out?
   Refused means a host was reached and actively rejected the connection — nothing listening
   on that address, or a REJECT rule. Timed out means nothing answered at all — a DROP rule,
   the wrong address, or a routing failure.
8. `dig` returns NXDOMAIN for a name that `ping` and `curl` resolve without trouble. What does
   that tell you?
   The name is not coming from DNS at all — `dig` queries DNS directly and ignores
   `/etc/hosts` and the name service switch that applications use.
