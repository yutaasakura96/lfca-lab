# Security

Security is the largest of the three competencies in Security Fundamentals, the domain that
carries 14% of the exam — 4th largest of 6 domains — under the current (2025-09-16)
blueprint; the 2025 update left the competency in place but reworded it. LFS200 barely
reaches this material: of its 38 concepts, 35 are NOT COVERED and 3 FULLY COVERED — 3/38
(8%) are not NOT COVERED — and the course's own security vocabulary diverges from the exam's
in places (it discusses SSL, never TLS), so the three covered concepts are still written
here from primary sources (`research/lfs200-notes/00-course-map.md`). Everything below is
sourced from NIST publications, IETF RFCs, OWASP guidance, and manual pages. The material is
conceptual rather than command-heavy: five of 38 concepts carry commands at all, so most
questions turn on discriminating between terms that sound interchangeable and are not.

<a id="s-security-principles"></a>
## Principles

<a id="c-security.security.cia-triad"></a>
### CIA triad
*id: `security.security.cia-triad` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: nist-csrc-glossary, nist-sp-800-53r5*

**What it is** The three properties every security control ultimately serves:
confidentiality (only authorised parties can read the data), integrity (the data has not
been altered undetectably), and availability (authorised parties can reach the data and the
service when they need it).

**Why it matters** The triad is the exam's classification scheme. A question that describes
an incident or a control and asks "which security property does this protect or violate" is
asking you to map it onto one leg, and the mapping is not always the obvious one:
availability is a *security* property, so a denial-of-service outage is a security incident,
not merely an operations problem.

**How it works** Each leg has its own characteristic controls. Confidentiality is served by
encryption, access control, and least privilege. Integrity is served by hashing, digital
signatures, checksums, and write protection. Availability is served by redundancy,
capacity, backups, and DDoS mitigation. A single control can serve more than one leg — TLS
protects confidentiality and integrity of data in transit at the same time — but the legs
themselves stay distinct.

**Key terms** confidentiality; integrity; availability; security property.

**Traps** The CIA triad is not the AAA triad. Authentication, authorization and accounting
are a different trio entirely, and an exam option offering "authentication" as a leg of the
CIA triad is a distractor. Authenticity and non-repudiation are also separate properties
often discussed alongside the triad; they are not legs of it. Finally, a backup is an
availability *and* an integrity control (it restores known-good data) but is not a
confidentiality control — an unencrypted backup weakens confidentiality.

**What the exam may test** Given a described control (encryption, a checksum, a redundant
power supply) or a described incident (a leaked database, a tampered file, a flooded
server), name the leg of the triad it serves or violates.

*Not to be confused with [compliance](compliance.md#cmp-security.compliance.compliance).*

<a id="c-security.security.authentication-vs-authorization"></a>
### Authentication vs authorization
*id: `security.security.authentication-vs-authorization` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: nist-csrc-glossary, nist-sp-800-63b-4*

**What it is** Authentication establishes *who you are* by verifying evidence bound to an
identity. Authorization decides *what that identity may do* against a specific resource.
Authentication always runs first: there is nothing to authorize until the subject is known.

**Why it matters** These two are among the most commonly confused terms on this exam
precisely because both are abbreviated "auth" in casual speech and both produce "access
denied" to the user. The remediation differs completely — a failed authentication needs a
credential fix, a failed authorization needs a permissions or role change — so a scenario
that describes a symptom is really asking which of the two failed.

**How it works** A verifier checks an authenticator (password, key, token, biometric bound
to a device) against what it holds for that subscriber account; if it matches, the session
carries a proven identity. Every subsequent request is then evaluated against a policy —
file permissions, a role assignment, an access control list — that says what that identity
may do. The same person can authenticate successfully and still be authorized for nothing.

**Key terms** identity; verifier; credential; permission; policy decision.

**Traps** HTTP's status codes invert the intuitive naming: `401 Unauthorized` means the
request lacked valid *authentication* credentials, while `403 Forbidden` means the request
was authenticated and the server still refuses it — an authorization failure. Reading `401`
as "authorization failed" is exactly the error the naming invites. Second trap: "root can do
anything" is an authorization statement, not an authentication one — root still has to
authenticate.

**What the exam may test** Given a described failure or control, classify it as
authentication or authorization, and state which one must succeed first.

<a id="cmp-security.security.authentication-vs-authorization"></a>
#### Not to be confused with: Authentication vs authorization vs Accounting and auditing vs Multi-factor authentication
*compares: `security.security.authentication-vs-authorization`, `security.security.accounting-and-auditing`, `security.security.multi-factor-authentication`*

| | Authentication vs authorization | Accounting and auditing | Multi-factor authentication |
| --- | --- | --- | --- |
| Question it answers | Who are you, and what may you do | What was actually done, by whom, and when | How strongly is the "who are you" answer proven |
| Position in AAA | The first two As | The third A | Not a separate A — a strengthening of the first |
| Control type | Preventive | Detective | Preventive |
| When it acts | Before and during access | After the fact, from records | Only at the authentication step |
| What its failure looks like | Wrong person admitted, or right person blocked | An incident that cannot be reconstructed | A stolen password alone is enough to log in |

The separating axis is timing and role: authentication and authorization decide access
before it happens, accounting records what happened after, and multi-factor authentication
is not a fourth thing at all — it only raises the confidence of the authentication step.

<a id="c-security.security.accounting-and-auditing"></a>
### Accounting and auditing
*id: `security.security.accounting-and-auditing` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: nist-csrc-glossary, nist-sp-800-53r5*

**What it is** The third A of AAA: recording what an authenticated identity actually did —
which resource, which action, at what time, from where — and reviewing those records.
Auditing is the review activity; accounting is the recording that makes review possible.

**Why it matters** Accounting is the only one of the three As that produces evidence. It is
what makes an incident reconstructable, what supports non-repudiation, and what detects the
one attacker class that authentication and authorization cannot stop by design: the insider
whose access is legitimate.

**How it works** The system emits an event record for security-relevant actions — logins,
privilege escalations, file access, configuration changes — with a subject, an object, an
action, an outcome, and a synchronised timestamp. Those records are retained for a defined
period and shipped somewhere the acting identity cannot edit, because a log an attacker can
rewrite is not evidence. The shipping, clock synchronisation, and retention themselves belong
to security logging and monitoring, covered in the Defences section; accounting is the
property that pipeline exists to preserve.

**Key terms** audit record; non-repudiation; retention; log integrity.

**Traps** Accounting is a *detective* control, never a preventive one. It cannot stop an
action; it can only establish that the action occurred. An exam option that offers "enable
auditing" as the fix for an unauthorised access is describing detection, not prevention —
the preventive answer is an authorization change. Second trap: the presence of logs is not
auditing. Records nobody reviews detect nothing.

**What the exam may test** Distinguishing the third A from the first two, and recognising
that a scenario asking "how would we know this happened" is an accounting question while
"how would we have stopped it" is an authorization question.

*Not to be confused with [authentication vs authorization](security.md#cmp-security.security.authentication-vs-authorization).*

<a id="c-security.security.principle-of-least-privilege"></a>
### Principle of least privilege
*id: `security.security.principle-of-least-privilege` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: nist-csrc-glossary, nist-sp-800-53r5*

**What it is** Granting each identity — human account, service account, or process — exactly
the access its task requires and nothing beyond it, for no longer than it needs it. The
point is not tidiness: it is that a compromised identity can only reach what it was
authorised for.

**Why it matters** Least privilege sets the blast radius of every other failure. If a web
service runs as its own unprivileged account, a remote code execution in that service yields
an attacker that unprivileged account, not the machine. If it runs as root, the same bug
yields the machine.

**How it works** In practice it means: services run under dedicated non-root accounts;
administrators use ordinary accounts and elevate per command through `sudo` rather than
logging in as root; permissions are granted to roles rather than individuals; and grants are
reviewed and revoked as duties change. Time-bounded and just-in-time elevation is the same
principle applied to duration rather than scope.

**Key terms** blast radius; service account; privilege elevation; need to know.

**Traps** Least privilege is one control that limits how much authority any single identity
holds. It is not layering, and it is not the same as defense in depth — see the comparison
below. It also applies to non-human identities, which is where candidates forget it: a cron
job or a container running as root is a least-privilege violation even though no person is
involved.

**What the exam may test** Recognising a least-privilege violation in a described setup
(a shared admin account, a service running as root, a permission granted "temporarily" and
never revoked), and separating it from a layering question.

*Not to be confused with [defense in depth](security.md#cmp-security.security.defense-in-depth).*

<a id="c-security.security.defense-in-depth"></a>
### Defense in depth
*id: `security.security.defense-in-depth` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: nist-csrc-glossary, nist-sp-800-53r5*

**What it is** Layering multiple, *independent* controls so that the failure or bypass of any
one of them does not by itself expose the asset. The independence is the substance of the
idea; the count of layers is not.

**Why it matters** Every control fails eventually — a patch is late, a rule is
misconfigured, a credential leaks. Depth is what converts a single failure into a
near-miss instead of a breach, and it is the reasoning the exam expects behind "why do we
need a host firewall when we already have a network firewall."

**How it works** A typical stack for one asset: network segmentation and a firewall
restricting who can reach the service at all; TLS authenticating and encrypting the
connection; strong authentication with MFA at the service; least-privilege authorization
once inside; mandatory access control confining the process; and logging and monitoring
detecting what the previous layers missed. Each layer stops a different class of attack.

**Key terms** layering; independent control; common-mode failure; compensating control.

**Traps** Two controls that share a failure mode are one layer, not two. Two firewalls
running the same rule set fail together on a rule mistake; a password plus a security
question are both "something you know" and fall to the same disclosure. Duplicating a
control is redundancy, which serves availability; defense in depth requires the layers to
fail for *different* reasons.

**What the exam may test** Given a proposed set of additional controls, identify which
genuinely adds a layer and which merely duplicates one, and distinguish depth from least
privilege.

<a id="cmp-security.security.defense-in-depth"></a>
#### Not to be confused with: Defense in depth vs Principle of least privilege
*compares: `security.security.defense-in-depth`, `security.security.principle-of-least-privilege`*

| | Defense in depth | Principle of least privilege |
| --- | --- | --- |
| What it constrains | How many independent controls stand between an attacker and the asset | How much authority any single identity holds |
| Unit of application | The system or the path to an asset | One account, role, or process |
| How you add more of it | Introduce a control that fails for a different reason | Remove a permission that is not needed |
| Failure it mitigates | Any one control being bypassed or misconfigured | Any one identity being compromised |
| Typical exam wording | "Why keep the host firewall too" | "Why does this service not run as root" |

The separating axis is direction: defense in depth is about the number of independent
barriers on the way in; least privilege is about how little the attacker gains once past
them. Both shrink impact, but along different dimensions.

<a id="c-security.security.zero-trust"></a>
### Zero trust
*id: `security.security.zero-trust` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-207, nist-csrc-glossary*

**What it is** An architectural approach that grants no request implicit trust on the basis
of where it came from. Being inside the corporate network, on a VPN, or in the same subnet
as the resource confers nothing; every request is authenticated, authorized, and evaluated
against policy on its own merits.

**Why it matters** It is the direct answer to the failure mode of the perimeter model: once
an attacker is inside a flat trusted network, lateral movement is unopposed. Zero trust
removes the "inside is trusted" assumption that made that movement cheap, which is why it is
usually discussed alongside segmentation.

**How it works** NIST SP 800-207 describes a policy decision point that evaluates each access
request against identity, device state, and other context, and a policy enforcement point
that opens, monitors, and terminates the resulting connection to the resource. Trust is
per-session and re-evaluated, not granted once at the network boundary.

**Key terms** implicit trust; policy decision point; policy enforcement point; per-request
verification.

<a id="c-security.security.attack-surface"></a>
### Attack surface
*id: `security.security.attack-surface` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-53r5, nist-csrc-glossary*

**What it is** The total set of points at which an attacker can attempt to interact with a
system: listening network ports, exposed APIs and web endpoints, installed packages, running
services, enabled accounts, mounted filesystems, and physical interfaces. Hardening is the
practice of making that set smaller.

**Why it matters** Attack surface is the one security quantity you can reduce without
knowing about any specific flaw. A service that is not installed cannot be exploited by a
vulnerability that has not yet been discovered in it, which is why removal beats patching
whenever removal is an option.

**How it works** You enumerate what is reachable — open ports, installed software, accounts
that can log in, sudo grants — and then remove, disable, or restrict everything the system's
purpose does not require. What remains is the surface you must then defend by other means:
patching, authentication, monitoring.

**Key terms** exposure; hardening; unnecessary service; reachable endpoint.

**Traps** Reducing attack surface and patching are not the same remediation, and the exam
pairs them deliberately. Patching fixes one known flaw in software you keep running, so the
exposure remains and the next flaw in that software will affect you. Removing the software
eliminates the exposure including flaws nobody has found yet. A firewall rule that blocks a
port reduces *reachable* surface without reducing installed surface — useful, but the
service is still there if the rule is wrong.

**What the exam may test** Choosing between "remove the service," "patch the service," and
"filter access to the service" for a described exposure, and explaining what each does and
does not eliminate.

<a id="cmp-security.security.attack-surface"></a>
#### Not to be confused with: Attack surface vs Vulnerabilities, CVEs and patching
*compares: `security.security.attack-surface`, `security.security.vulnerabilities-cves-and-patching`*

| | Attack surface | Vulnerabilities, CVEs and patching |
| --- | --- | --- |
| What it counts | Points where interaction is possible at all | Specific known defects in what is installed |
| Known in advance | Yes — you can enumerate it today | Only once someone discovers and publishes the flaw |
| How it is reduced | Remove, disable, or restrict components | Apply the vendor's fix for that identified defect |
| Effect on undiscovered flaws | Removing a component removes its future flaws too | None — a patch fixes only the flaw it addresses |
| Question shape | "Why uninstall a service you are not using" | "Why is CVE-2024-XXXX urgent on this host" |

The separating axis is specificity: attack surface is about how much is exposed at all,
independent of any particular defect; vulnerability management is about named defects in
what remains exposed.

<a id="c-security.security.risk-threat-and-vulnerability"></a>
### Risk, threat and vulnerability
*id: `security.security.risk-threat-and-vulnerability` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-30r1, nist-csrc-glossary*

**What it is** Three terms used loosely in conversation and precisely in exams. A
vulnerability is a weakness in a system, control, or procedure. A threat is a circumstance or
actor with the potential to exploit that weakness and cause harm. Risk is the combination of
how likely that exploitation is and how much impact it would have.

**Why it matters** Only risk carries a magnitude, and only risk is what prioritisation is
based on. A vulnerability with no plausible threat, or with no meaningful impact if
exploited, is a low-risk finding — which is why a scanner's raw list is not a work queue
until it has been risk-ranked.

**How it works** NIST SP 800-30 frames a risk assessment as identifying threats and
vulnerabilities, then determining the likelihood that a threat exploits a vulnerability and
the impact if it does. Removing any one of the three collapses the risk: patch the
vulnerability, block the threat's access path, or reduce the impact through segmentation and
backups.

**Key terms** weakness; threat source; likelihood; impact; risk determination.

#### Scenario

An internal reporting server sits on the same flat network as the developer laptops, runs a
database listener nobody uses, and lets every engineer log in with a shared administrator
account. Classify each finding rather than fixing it at random: the unused listener is
attack surface, and the fix is removal, not patching. The shared administrator account is a
least-privilege violation and, because it is shared, also an accounting failure — the audit
log cannot attribute an action to a person, so non-repudiation is gone. The flat network is
the implicit-trust assumption zero trust rejects; segmentation adds a layer that fails for a
different reason than the account controls do, which is what makes it defense in depth
rather than duplication. Ranking the three is a risk judgement: likelihood times impact, not
count of findings.

#### Knowledge check

1. A denial-of-service attack takes a public web service offline for six hours. No data was
   read or altered. Which leg of the CIA triad was violated, and is this a security
   incident?
   Availability, and yes — availability is a security property, so an outage caused by
   attack is a security incident, not only an operations one.
2. A user logs in successfully but gets "permission denied" opening a file. Which of
   authentication and authorization failed, and which had to succeed first?
   Authorization failed; authentication succeeded first, since there is nothing to authorize
   until the identity is known.
3. Why are a password and a security question not two layers of defense in depth?
   They share a failure mode — both are "something you know" and both fall to the same
   disclosure — so they are one layer, not two.
4. State the one-sentence difference between least privilege and defense in depth.
   Least privilege limits how much authority a single identity holds; defense in depth
   limits how many independent controls must fail before the asset is exposed.
5. A scanner reports a vulnerability in a package installed on a host that is not running
   the affected service and is unreachable from any network. Is this high risk?
   Not necessarily — risk combines likelihood and impact, and both are low here; the
   vulnerability exists but the risk does not follow automatically from it.
6. What does zero trust actually remove, given that it does not mean "trust nothing"?
   Implicit trust based on network location — being inside the network or on the VPN no
   longer grants access by itself; each request is verified against policy.

<a id="s-security-authentication"></a>
## Authentication

<a id="c-security.security.multi-factor-authentication"></a>
### Multi-factor authentication
*id: `security.security.multi-factor-authentication` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-63b-4*

**What it is** Requiring evidence from two or more *distinct categories* of authentication
factor: something you know (a password or PIN), something you have (a hardware token, a
phone running an authenticator app, a smart card), and something you are (a biometric
compared against a stored reference). Two-factor authentication is the two-category case of
the same idea.

**Why it matters** MFA is the single most consistently effective control against the
credential-driven attacks in this competency — stolen passwords, credential stuffing,
password spraying, and most phishing — because possession of the password alone stops being
sufficient. That is why it appears as the recommended answer across so many scenarios.

**How it works** The verifier evaluates two independent authenticators in one authentication
event. NIST SP 800-63B requires two distinct factors at AAL2 and above, and treats a
biometric as usable only in combination with a physical authenticator — the device is the
"something you have," the biometric comparison is the "something you are." At AAL3 the
authenticator must additionally be phishing-resistant, which is what distinguishes a
FIDO2 security key from a one-time code the user can be tricked into typing into a fake site.

**Key terms** factor category; authenticator; AAL; phishing resistance.

**Traps** Two credentials of the same category are not MFA. Password plus security question
is two "know" factors; a password plus a second password is one factor twice. A one-time
code delivered by SMS *is* a second factor, but it is not phishing-resistant — an attacker
relaying a login in real time can capture and replay it, which is exactly what a hardware
security key prevents. And a biometric on its own is not treated as an authenticator: it
always accompanies the device holding it.

**What the exam may test** Given a described login scheme, decide whether it is genuinely
multi-factor, and identify which named attacks it stops and which it does not.

*Not to be confused with [authentication vs authorization](security.md#cmp-security.security.authentication-vs-authorization).*

<a id="c-security.security.password-hashing-and-salting"></a>
### Password hashing and salting
*id: `security.security.password-hashing-and-salting` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-63b-4, owasp-password-storage*

**What it is** Storing a password as the output of a one-way password hashing function rather
than as recoverable text, with a unique random salt per user mixed in so that two users who
chose the same password do not produce the same stored value.

**Why it matters** This is what determines how bad a database breach is. Plaintext storage
means immediate total compromise; fast unsalted hashes mean the whole table falls to rainbow
tables in minutes; per-user salts with a deliberately slow, memory-hard function mean the
attacker must attack each account separately at high cost.

**How it works** OWASP's guidance is Argon2id first, then scrypt, then bcrypt for legacy
systems, and PBKDF2 where FIPS-140 compliance is required — all of them deliberately slow
and tunable through a work factor that is raised as hardware gets faster. The salt is stored
alongside the hash and does not need to be secret; NIST SP 800-63B requires it to be at least
32 bits. A pepper is a different thing: a secret value kept outside the database entirely, as
an extra layer if the database alone leaks.

**Key terms** one-way function; salt; pepper; work factor; rainbow table.

**Traps** Hashing is not encryption. There is no key and no decryption step — a system that
can show a user their existing password is storing it reversibly, not hashing it. Second:
salting does not make a fast hash suitable. SHA-256 is fast by design, so a salted SHA-256
password table still falls to brute force quickly; the slowness of the algorithm, not the
salt, is what makes guessing expensive. Third: the salt being stored in the clear next to the
hash is correct and expected — its job is uniqueness, not secrecy.

**What the exam may test** Choosing an appropriate password storage scheme, and explaining
what a salt does (defeats precomputation and cross-account reuse) versus what a work factor
does (raises the cost of every single guess).

*Not to be confused with [symmetric vs asymmetric encryption](security.md#cmp-security.security.symmetric-vs-asymmetric-encryption).*

<a id="c-security.security.single-sign-on"></a>
### Single sign-on
*id: `security.security.single-sign-on` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: nist-csrc-glossary*

**What it is** One authentication event at a central identity provider granting access to
many separate applications, without the user re-entering credentials at each one.

**Why it matters** SSO reduces credential sprawl — fewer passwords to choose, reuse, and
leak — and it centralises the control point: disabling one account at the identity provider
removes access everywhere at once, which is what makes offboarding reliable. What it is not
is multi-factor authentication, and the exam offers the two as alternatives: SSO changes how
many times you authenticate, not how strongly. Putting every application behind one login
concentrates the risk in that login, which is why MFA is enforced at the identity provider
alongside SSO rather than replaced by it.

**How it works** The user authenticates once to an identity provider, which issues a signed
assertion or token that each participating application validates instead of running its own
login. The applications trust the identity provider's statement about who the user is;
they never see the password. That is also the boundary against same-sign-on, sometimes called
password synchronisation, where the same password is merely replicated to each application
and each still runs a login of its own: under SSO there is no password at the application to
change or forget, only an assertion to validate, which is what makes revocation at the
identity provider immediate rather than a per-application cleanup task.

**Key terms** identity provider; federation; assertion; session token.

<a id="c-security.security.public-key-authentication"></a>
### Public key authentication
*id: `security.security.public-key-authentication` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: rfc-4252-ssh-auth, openssh-ssh-keygen, rfc-4251-ssh-architecture*

**What it is** Authentication by proving possession of a private key rather than by sending a
shared secret. The user holds a key pair; the public half is installed on every server they
need, the private half never leaves the client. It is the standard method for SSH and is
stronger than password authentication because nothing reusable crosses the wire.

**Why it matters** A password is a secret the server must receive and therefore could log,
leak, or have phished. In SSH's publickey method (RFC 4252) the client signs a
session-specific challenge with the private key and sends only the signature, so an attacker
recording the exchange gains nothing replayable — which is why SSH hardening baselines turn
password authentication off entirely once keys are in place.

**How it works** `ssh-keygen` creates the pair, writing the private key to a file such as
`~/.ssh/id_ed25519` and the public key to the same name with `.pub` appended; invoked with no
arguments, current OpenSSH generates an Ed25519 key. `ssh-copy-id` appends the public key to
the remote account's `~/.ssh/authorized_keys` (the default `AuthorizedKeysFile` is
`.ssh/authorized_keys .ssh/authorized_keys2`), which is why it needs a working login —
usually password authentication — the first time. Protecting the private key with a
passphrase adds a "something you know" factor to the "something you have."

**Key terms** key pair; private key; `authorized_keys`; passphrase; challenge signature.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `ssh-keygen` | Generate and manage SSH authentication keys | `-t` key type, `-b` bits (RSA default 3072), `-C` comment, `-f` output file, `-l` show a key's fingerprint | `ssh-keygen -t ed25519 -C "laptop"` | Using `-b` with Ed25519 — that key type has a fixed length and the flag is ignored, so it does not produce a "stronger" key |
| `ssh-copy-id` | Install a local public key into a remote account's authorized_keys | `-i` use this identity file (`.pub` is appended when the name does not already end in it), `-p` remote port, `-n` dry run, `-f` skip the already-installed check | `ssh-copy-id -i ~/.ssh/id_ed25519.pub user@host` | Omitting `-i` — with no identity file it installs whatever `ssh-add -L` lists, so every key loaded in the agent lands in the remote `authorized_keys` rather than the one you meant |

**Traps** The private key is never transmitted and never installed on the server. Copying
`id_ed25519` instead of `id_ed25519.pub` is the classic error, and it compromises the key
rather than enabling the login. Second trap: `ssh-copy-id` is not a way in when password
authentication is already disabled — it authenticates as a normal client to write the file,
so the key must be installed by another route on a locked-down host.

**What the exam may test** Which half of the key pair goes where, which command generates
versus installs, and why key authentication resists credential theft in ways a password
cannot.

#### Scenario

A team migrates a bastion host from passwords to keys. Each engineer runs `ssh-keygen`,
choosing a passphrase, then `ssh-copy-id` while password authentication is still enabled —
after that the public half sits in their remote `~/.ssh/authorized_keys` and the private half
has never left the laptop. Note what changed and what did not: the login is now
"something you have" (the key file) plus "something you know" (its passphrase), which is
genuine multi-factor authentication only because the two are different categories; adding a
second password would not have been. The identity provider behind the team's web tools is
unaffected — SSO covers those applications, not SSH — and the account database behind it
still stores passwords as salted, slow hashes, because a breach of that database must not
yield usable credentials.

#### Knowledge check

1. A service asks for a password and then a security question. Is that multi-factor
   authentication?
   No — both are "something you know," so it is one factor category twice.
2. Why does a salted SHA-256 password table still fall quickly to an attacker with the
   database?
   The salt prevents precomputation and cross-account reuse but not speed; SHA-256 is fast,
   so each guess is cheap. A deliberately slow function such as Argon2id, scrypt, bcrypt or
   PBKDF2 is what raises the per-guess cost.
3. Does the salt need to be kept secret? What about a pepper?
   The salt does not — it is stored alongside the hash and exists for uniqueness. A pepper is
   a secret and is kept outside the password database.
4. Which half of an SSH key pair goes on the server, and what does the client actually send
   during authentication?
   The public half goes into the remote account's `authorized_keys`; the client sends a
   signature over session-specific data, never the private key.
5. An SMS one-time code and a FIDO2 security key are both second factors. What does the
   security key give you that the SMS code does not?
   Phishing resistance — a code can be typed into an attacker's relay site and replayed; a
   security key's response is bound to the real site and cannot be reused that way.
6. What does SSO centralise that makes offboarding more reliable?
   The authentication decision — disabling the account at the identity provider removes
   access to every participating application at once.

<a id="s-security-cryptography"></a>
## Cryptography

<a id="c-security.security.symmetric-vs-asymmetric-encryption"></a>
### Symmetric vs asymmetric encryption
*id: `security.security.symmetric-vs-asymmetric-encryption` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: rfc-8446-tls13, nist-sp-800-57p1r5*

**What it is** Symmetric encryption uses one key for both encryption and decryption; it is
fast and suited to bulk data, but both parties must already share the key. Asymmetric
encryption uses a mathematically linked key pair — what one key encrypts, only the other can
decrypt — which solves key distribution at the cost of being far slower.

**Why it matters** The reason both exist together, rather than one replacing the other, is
the actual insight: asymmetric cryptography is used to authenticate the peer and agree on a
fresh symmetric key, and the symmetric key then protects the actual traffic. Understanding
that division explains TLS, SSH, and signed package distribution in one move.

**How it works** In a TLS 1.3 handshake the server proves its identity with a certificate
containing its public key, and the two sides run an ephemeral Diffie-Hellman exchange to
derive shared secrets neither transmitted. TLS 1.3 removed static RSA and static
Diffie-Hellman key exchange precisely so that every such handshake provides forward secrecy:
compromising the server's long-term key later does not decrypt yesterday's recorded traffic.
Everything after the handshake is symmetric.

**Key terms** shared key; key pair; key distribution; ephemeral exchange; forward secrecy.

**Traps** Asymmetric is not "stronger" than symmetric; it solves a different problem, and key
sizes are not comparable across families — a 256-bit symmetric key and a 2048-bit RSA key are
not two orders of magnitude apart in strength. Second trap: encryption of either kind
provides confidentiality, not identity. Encrypting to the wrong party is still encryption;
authentication is what certificates add.

**What the exam may test** Naming which kind of cryptography does which job inside TLS, and
rejecting the claim that a protocol uses "asymmetric encryption" for its bulk data.

<a id="cmp-security.security.symmetric-vs-asymmetric-encryption"></a>
#### Not to be confused with: Symmetric vs asymmetric encryption vs Hashing vs Password hashing and salting
*compares: `security.security.symmetric-vs-asymmetric-encryption`, `security.security.hashing`, `security.security.password-hashing-and-salting`*

| | Symmetric vs asymmetric encryption | Hashing | Password hashing and salting |
| --- | --- | --- | --- |
| Reversible | Yes, with the right key | No — one way by construction | No — one way by construction |
| Key involved | Yes: one shared key, or a key pair | No key at all | No key; a per-user salt and a work factor |
| Designed to be | Fast (symmetric) or distributable (asymmetric) | Fast, for large inputs | Deliberately slow and memory-hard |
| Property it serves | Confidentiality | Integrity | Confidentiality of stored credentials |
| Typical algorithms | AES, ChaCha20; RSA, ECDH, Ed25519 | SHA-256, SHA-512 | Argon2id, scrypt, bcrypt, PBKDF2 |
| Same input, same output | No — output varies with key and IV | Yes, always | No — the per-user salt changes it |

The separating axis is reversibility and speed: encryption is meant to be undone by whoever
holds the key, general hashing is one-way and fast, and password hashing is one-way and
intentionally slow. Using a general-purpose hash where a password hash belongs is the error
this table exists to prevent.

<a id="c-security.security.encryption-at-rest-vs-in-transit"></a>
### Encryption at rest vs in transit
*id: `security.security.encryption-at-rest-vs-in-transit` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-57p1r5, nist-csrc-glossary*

**What it is** Two separate controls covering two separate exposures. Encryption at rest
protects data written to storage — disks, backups, object storage, database files.
Encryption in transit protects data moving across a network between two systems.

**Why it matters** They do not substitute for one another, and the exam sets them against
each other. HTTPS on the front end does nothing for a stolen backup tape; full disk
encryption does nothing for traffic crossing an untrusted network; neither protects data
being processed in memory by a compromised application.

**How it works** At rest is typically block-device or filesystem encryption (LUKS on Linux)
or application- and database-level encryption, with the keys held outside the encrypted data
itself. In transit is typically TLS, which additionally authenticates the peer — an important
asymmetry, since at-rest encryption authenticates nobody.

**Key terms** data at rest; data in transit; key custody; data in use.

<a id="c-security.security.hashing"></a>
### Hashing
*id: `security.security.hashing` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: nist-csrc-glossary, owasp-password-storage*

**What it is** A one-way function producing a fixed-length digest from input of any size. The
same input always produces the same digest, a one-bit change produces a completely different
one, and there is no operation that recovers the input from the digest.

**Why it matters** Hashing is the integrity primitive underneath most of this domain:
verifying a downloaded image, detecting file tampering, signing (a signature is computed over
a hash, not the whole document), and — with a purpose-built slow function — storing
passwords.

**How it works** `sha256sum` prints a digest for each file given, and with `-c` reads a file
of previously recorded digests and reports each as OK or FAILED. `md5sum` has the same
interface for MD5. Comparing a locally computed digest with the publisher's tells you whether
the bytes you received are the bytes they hashed.

**Key terms** digest; collision resistance; deterministic; avalanche effect.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `sha256sum` | Compute or check SHA-256 digests | `-c` check digests listed in a file, `--ignore-missing` skip absent files, `--status` report only through the exit code, `--quiet` suppress per-file OK lines | `sha256sum -c SHA256SUMS` | Running `sha256sum -c` against a file the same compromised server supplied — a matching digest then proves only self-consistency |
| `md5sum` | Compute or check MD5 digests | `-c` check digests listed in a file, `--warn` warn about malformed lines | `md5sum image.iso` | Treating an MD5 match as a security guarantee — MD5 is broken for collision resistance and unsuitable where an adversary may craft the input |

**Traps** Hashing is not encryption and has no key, so "decrypt the hash" is never the answer.
MD5 and SHA-1 remain in use as non-adversarial checksums but are broken for collision
resistance and must not be relied on where someone may deliberately construct a matching
input. And a digest only ever verifies against the value you compare it to: an integrity
check is worth exactly as much as the trustworthiness of the channel that published the
expected digest.

**What the exam may test** Distinguishing hashing from encryption, choosing a hash for
integrity verification versus a password hashing scheme for credential storage, and reading
what a checksum match does and does not prove.

*Not to be confused with [symmetric vs asymmetric encryption](security.md#cmp-security.security.symmetric-vs-asymmetric-encryption).*

<a id="c-security.security.digital-certificates-and-certificate-authorities"></a>
### Digital certificates and certificate authorities
*id: `security.security.digital-certificates-and-certificate-authorities` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: rfc-5280-x509*

**What it is** An X.509 certificate is a signed statement binding a public key to an identity
(a hostname, an organisation, a person). A certificate authority is the party that signs that
statement, vouching for the binding. Trust flows down a chain: a leaf certificate signed by
an intermediate CA, the intermediate signed by a root.

**Why it matters** Encryption alone cannot tell you *who* you are talking to. The certificate
is what turns an encrypted channel into an authenticated one, and the CA is what lets a
client that has never met the server decide whether the public key it was handed really
belongs to the name it asked for.

**How it works** The chain terminates at a trust anchor — in practice a self-signed root
certificate that the operating system or browser ships in its trust store. Its trustworthiness
comes from being in that store, not from its own signature, since it signed itself. The client
validates the chain from the leaf up to a trust anchor it already holds; a chain that ends
anywhere else fails, however well-formed it is.

**Key terms** X.509; certificate authority; chain of trust; trust anchor; intermediate CA.

**Traps** A self-signed certificate encrypts exactly as well as a CA-issued one; what it
lacks is any third party attesting to the identity, which is the entire reason browsers warn
about it. Second trap: a valid certificate says nothing about whether the site is honest or
its operator benign — the CA attests that the key belongs to the named host, not that the
host deserves your data.

**What the exam may test** Explaining what a CA actually attests to, why a self-signed
certificate triggers a warning while still encrypting, and where the chain's trust ultimately
comes from.

*Not to be confused with [certificate expiry and validation](security.md#cmp-security.security.certificate-expiry-and-validation).*

<a id="cmp-security.security.digital-certificates-and-certificate-authorities"></a>
#### Not to be confused with: Digital certificates and certificate authorities vs TLS and HTTPS
*compares: `security.security.digital-certificates-and-certificate-authorities`, `security.security.tls-and-https`*

| | Digital certificates and certificate authorities | TLS and HTTPS |
| --- | --- | --- |
| What it is | A data object plus the party that signs it | A protocol, and an application protocol carried inside it |
| What it provides | Identity binding — this key belongs to this name | An encrypted, integrity-protected, authenticated channel |
| Can exist without the other | Certificates are used by SSH, code signing, and email too | TLS can run with a self-signed or untrusted certificate, badly |
| Where it is configured | Issued, installed, renewed, and revoked | Enabled on a listener, with protocol versions and ciphers |
| Typical failure | Expired, wrong name, untrusted issuer | Version or cipher mismatch, or no TLS at all |

The separating axis is layer: the certificate is an input TLS consumes to authenticate the
peer. TLS is the conversation; the certificate is the identity document presented during it.

<a id="c-security.security.tls-and-https"></a>
### TLS and HTTPS
*id: `security.security.tls-and-https` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: rfc-8446-tls13, rfc-7568-ssl3-deprecation*

**What it is** TLS is the transport-layer protocol that encrypts a connection, protects it
from tampering, and authenticates the server (and optionally the client) using certificates.
HTTPS is not a separate protocol: it is ordinary HTTP carried inside a TLS connection,
conventionally on port 443. SSL is TLS's obsolete predecessor.

**Why it matters** TLS is the concrete instance of nearly every cryptographic idea in this
competency — asymmetric key agreement, symmetric bulk encryption, certificates, chain
validation — and the exam reaches for it whenever it wants to test encryption in transit.

**How it works** The handshake authenticates the server from its certificate chain and
derives fresh symmetric keys through an ephemeral exchange; application data then flows under
those symmetric keys. TLS 1.3 (RFC 8446) removed the static RSA and static Diffie-Hellman
key exchanges, so a compromise of the server's long-term key does not retroactively decrypt
captured sessions. SSL 3.0 was formally deprecated by RFC 7568 and must not be used.

**Key terms** handshake; port 443; cipher suite; protocol version; forward secrecy.

**Traps** "SSL certificate" is a misnomer in wide circulation — the object is an X.509
certificate, and the protocol using it has been TLS for years; an exam option offering "SSL"
as a current protocol choice is wrong. Second trap: TLS is not web-only. SMTP, IMAP, LDAP,
and database protocols all run over it, so "use HTTPS" is not the answer when the traffic
described is not HTTP. Third: HTTPS protects the channel, not the endpoints — a compromised
server serves malware over a perfectly valid TLS connection.

**What the exam may test** Separating TLS from HTTPS from SSL, knowing which is obsolete, and
recognising that a padlock indicates an authenticated encrypted channel rather than a
trustworthy site. Note that LFS200 discusses SSL and does not use the term TLS at all
(`research/lfs200-notes/00-course-map.md`), so the course's vocabulary here is behind the
exam's.

*Not to be confused with [digital certificates and certificate authorities](security.md#cmp-security.security.digital-certificates-and-certificate-authorities).*

<a id="c-security.security.certificate-expiry-and-validation"></a>
### Certificate expiry and validation
*id: `security.security.certificate-expiry-and-validation` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: rfc-5280-x509*

**What it is** Every X.509 certificate carries a validity window — the `notBefore` and
`notAfter` fields — and a client validating one checks far more than those dates: the
signature chain up to a trusted anchor, the requested hostname against the certificate's
names, the key usage, and revocation status.

**Why it matters** Expiry is the most common cause of a sudden, total outage on a service
that changed in no other way, and it is entirely predictable, which is why automated renewal
and expiry monitoring are the named controls. But it is only one of several validation
failures that produce a similar-looking browser warning, and they have different fixes.

**How it works** Validation walks the chain from the leaf certificate to a trust anchor in
the client's store, verifying each signature and each certificate's validity period along the
way, then checks that the name the client asked for appears in the certificate and that the
certificate has not been revoked. Any single failure invalidates the connection; the client
usually reports only the first one it hit.

**Key terms** `notBefore`; `notAfter`; hostname match; revocation; trust store.

**Traps** Renewing a certificate fixes expiry and nothing else. A hostname mismatch, an
untrusted or self-signed issuer, a missing intermediate certificate, and a clock skew on the
client all produce warnings that look alike to a user but need different remediations —
reissue with the right name, install the CA or the missing intermediate, or fix the time.
Second trap: an expired certificate still encrypts perfectly well; what has failed is trust,
not confidentiality, so "the connection is unencrypted" is the wrong reading of the warning.

**What the exam may test** Diagnosing which validation step failed from a described symptom,
and choosing renewal versus reissue versus trust-store or clock remediation accordingly.

<a id="cmp-security.security.certificate-expiry-and-validation"></a>
#### Not to be confused with: Certificate expiry and validation vs Digital certificates and certificate authorities
*compares: `security.security.certificate-expiry-and-validation`, `security.security.digital-certificates-and-certificate-authorities`*

| | Certificate expiry and validation | Digital certificates and certificate authorities |
| --- | --- | --- |
| What it names | The checks a client runs before accepting a certificate | The object itself and the party that issued it |
| When it happens | On every connection, at the client | Once at issuance, and again at renewal or revocation |
| Who acts | The connecting client or browser | The CA and the server administrator |
| What goes wrong | Expired dates, name mismatch, untrusted chain, clock skew, revoked certificate | Wrong details requested, chain not installed, key compromised |
| Fix | Renew, reissue, install the missing intermediate, or correct the clock | Request, install, or revoke the certificate |

The separating axis is object versus process: one is the credential and its issuer, the other
is the set of checks performed against that credential every time it is presented.

<a id="c-security.security.full-disk-encryption"></a>
### Full disk encryption
*id: `security.security.full-disk-encryption` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: cryptsetup-luks-faq, nist-sp-800-57p1r5*

**What it is** Encrypting an entire block device so that its contents are unreadable without
the key. On Linux this is conventionally LUKS, managed with `cryptsetup`, which stores an
encrypted volume key in a header with several key slots so more than one passphrase or key
file can unlock the same device.

**Why it matters** It is the control that survives physical loss. A stolen laptop, a
decommissioned disk that was never wiped, or a drive pulled from a rack yields nothing
without the passphrase — which is why it is the standard answer to physical-security
scenarios involving hardware leaving the building.

**How it works** The volume key encrypts the data; each key slot holds that volume key
wrapped by a passphrase-derived key, so passphrases can be added and removed without
re-encrypting the device. The LUKS header is therefore indispensable: destroy or overwrite it
and the data is unrecoverable even with the correct passphrase, which is why header backups
are part of the practice.

**Key terms** LUKS; volume key; key slot; header backup; unlocked volume.

#### Scenario

A finance application stores records in a database on an encrypted LUKS volume and serves
them over HTTPS. An auditor asks what each control actually covers. Encryption at rest
protects the disk if the server is stolen or decommissioned — but while the machine is
running and the volume is unlocked, every file is readable to any process with the right
permissions, so it is no defence against an application compromise. TLS protects the records
crossing the network and, through the server's certificate, proves to the client which host
it reached; the browser's padlock reflects a validated chain to a trust anchor, not the
honesty of the operator. When the certificate expires the connection fails outright while the
data stays perfectly encrypted, because what expired was trust, not confidentiality. And the
nightly checksum job over the exported files uses `sha256sum`, which detects tampering but
cannot undo it.

#### Knowledge check

1. Why does TLS use both asymmetric and symmetric cryptography rather than picking one?
   Asymmetric authenticates the peer and agrees a fresh key without a pre-shared secret;
   symmetric is fast enough for the actual traffic. Each solves a problem the other does not.
2. What is the one-sentence difference between hashing and encryption?
   Encryption is reversible with the right key; hashing is one-way and involves no key at all.
3. A browser reports a certificate problem. Name three distinct causes and their different
   fixes.
   Expiry (renew), hostname mismatch (reissue with the correct name), untrusted or incomplete
   chain (install the CA or the missing intermediate). A skewed client clock is a fourth, and
   is fixed on the client.
4. Is a self-signed certificate encrypted traffic?
   Yes — the encryption is unaffected; what is missing is any third-party attestation that the
   key belongs to that name.
5. Your service runs HTTPS and the disks are LUKS-encrypted. Which exposure is still
   uncovered?
   Data in use — a compromised running application reads the unlocked filesystem normally,
   and neither control addresses that.
6. Which is obsolete, SSL or TLS, and what is the object people call an "SSL certificate"?
   SSL is obsolete (SSL 3.0 deprecated by RFC 7568); the object is an X.509 certificate used
   by TLS.

<a id="s-security-threats"></a>
## Threats

<a id="c-security.security.phishing-and-social-engineering"></a>
### Phishing and social engineering
*id: `security.security.phishing-and-social-engineering` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: nist-csrc-glossary, verizon-dbir*

**What it is** Attacks that manipulate a person into acting against their own interest —
revealing a credential, approving a transfer, running an attachment, or clicking an MFA
prompt — rather than defeating a technical control. Phishing is the email-borne form;
spear phishing targets a named individual, vishing uses voice calls, smishing uses text
messages, and pretexting builds a false but plausible story to justify the request.

**Why it matters** The target is the one component that cannot be patched, so this is the
category where technical controls only ever *reduce* exposure. That is why user awareness
training appears as a named defence here and almost nowhere else in this competency.

**How it works** The attacker constructs urgency and authority — a locked account, an
invoice due, an executive travelling — so the victim acts before verifying. The credential
they surrender is then used through an ordinary login, which is what makes the follow-on
activity hard to distinguish from legitimate use in logs.

**Key terms** spear phishing; pretexting; business email compromise; user awareness;
phishing-resistant authenticator.

**Traps** Do not claim phishing is the single most common route to initial access. The
Verizon 2026 DBIR puts exploitation of vulnerabilities first at 31% of initial access — up
from 20%, and the first time in the report's 19-year history that it has displaced
credentials — with phishing second at 16% and credential abuse third at 13%. Credential abuse
still leads at 39% when counted anywhere in the breach chain rather than only as the first
step, but phishing is not first on either measure. Second trap:
MFA reduces phishing damage but does not end it, since a real-time relay can capture and
replay a one-time code; only a phishing-resistant authenticator, such as a FIDO2 security
key, breaks that. Third: filters and DMARC reduce delivery, not susceptibility.

**What the exam may test** Recognising the human-manipulation category from a described
scenario, naming user awareness as the control that technical measures cannot replace, and
avoiding unsupported "most common attack" claims.

*Not to be confused with [brute force and credential stuffing](security.md#cmp-security.security.brute-force-and-credential-stuffing).*

<a id="c-security.security.malware-and-ransomware"></a>
### Malware and ransomware
*id: `security.security.malware-and-ransomware` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: nist-csrc-glossary*

**What it is** Malware is any software written to cause harm or gain unauthorised access —
viruses, worms, trojans, rootkits, spyware, cryptominers. Ransomware is the subset that
encrypts the victim's data and demands payment for the key, increasingly combined with
exfiltrating the data first and threatening publication.

**Why it matters** Ransomware is the threat that turns backups from an operations concern
into a security control, and the exam tests that link directly. It is also the clearest case
where recovery capability, not prevention, determines the outcome.

**How it works** The classifications describe propagation and packaging, not payload: a worm
spreads on its own across a network, a virus attaches itself to a host file and spreads when
that file runs, a trojan arrives disguised as something wanted, and a rootkit hides the
attacker's presence from the operating system. Any of them can carry any payload, ransomware
included.

**Key terms** worm; trojan; rootkit; offline backup; double extortion.

**Traps** Backups only count as a ransomware control if they are tested and out of the
attacker's reach. A backup share mounted on the victim network gets encrypted along with
everything else, so offline, immutable, or otherwise isolated copies are the requirement, and
an untested restore is an assumption rather than a control. Second trap: restoring from
backup undoes the availability loss but not the confidentiality loss — if data was
exfiltrated before encryption, it is still breached.

**What the exam may test** Matching a described behaviour to the right malware category, and
identifying tested offline backups as the ransomware control while recognising what they do
not recover.

*Not to be confused with [denial of service](security.md#cmp-security.security.denial-of-service).*

<a id="c-security.security.denial-of-service"></a>
### Denial of service
*id: `security.security.denial-of-service` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: nist-csrc-glossary*

**What it is** An attack that exhausts a resource — bandwidth, connections, CPU, memory,
disk, or an application-level limit — so that legitimate users cannot be served. It is
distributed (DDoS) when mounted from many sources at once, typically a botnet.

**Why it matters** This is the availability leg of the CIA triad made concrete. Because
nothing is read or altered, candidates are tempted to file it as an outage rather than a
security incident, and the exam exploits exactly that hesitation.

**How it works** Volumetric attacks saturate the link, often through reflection and
amplification: the attacker sends small requests to third-party services with a spoofed
source address, and those services send much larger responses to the victim. Other variants
exhaust connection state or hit a slow application path repeatedly. The distributed form is
what defeats the naive response, since there is no single source address to block.

**Key terms** resource exhaustion; DDoS; botnet; amplification; rate limiting.

**Traps** A denial of service is not a data breach — confidentiality and integrity may be
entirely intact, and an answer claiming data loss from a described DoS is wrong. Second
trap: blocking the source IP is a valid response to a single-source DoS and useless against a
distributed one; upstream scrubbing, rate limiting, and capacity are the distributed answers.
Third: not every outage is an attack, and the exam sometimes describes an accidental
self-inflicted one.

**What the exam may test** Identifying the CIA leg affected, distinguishing DoS from DDoS by
what response each admits, and rejecting data-breach conclusions from an availability-only
incident.

<a id="cmp-security.security.denial-of-service"></a>
#### Not to be confused with: Denial of service vs Malware and ransomware
*compares: `security.security.denial-of-service`, `security.security.malware-and-ransomware`*

| | Denial of service | Malware and ransomware |
| --- | --- | --- |
| CIA leg attacked | Availability only | Confidentiality and integrity, and availability in the ransomware case |
| Code on the victim host | None required — the traffic alone does it | Yes, by definition — something must execute |
| What restores service | Filtering, scrubbing, rate limiting, added capacity | Eradication and restore from clean backups |
| Data affected | Untouched | Encrypted, stolen, corrupted, or all three |
| Ends when | The traffic stops or is absorbed | The malware is removed and the systems rebuilt |

The separating axis is whether anything runs on the victim: a denial of service overwhelms a
system from outside without executing on it, while malware requires code on the host and
therefore leaves the data itself in question.

<a id="c-security.security.man-in-the-middle"></a>
### Man-in-the-middle
*id: `security.security.man-in-the-middle` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: rfc-8446-tls13, nist-csrc-glossary*

**What it is** An attacker positioned between two communicating parties, relaying and
potentially altering traffic while each side believes it is talking directly to the other.
It is the attack that TLS with certificate validation exists to prevent.

**Why it matters** It explains why authentication, not just encryption, is required on a
channel. Without verifying who is on the other end, a client can negotiate a perfectly strong
encrypted session with the attacker, who then opens a second encrypted session onward to the
real server and reads everything in between.

**How it works** The attacker must first get into the path — a hostile or spoofed wireless
access point, ARP or DNS manipulation, a compromised router. Certificate validation is what
then defeats them: they cannot present a certificate for the requested name that chains to a
trusted anchor. The attack succeeds mainly when validation is skipped, when a warning is
clicked through, or when a rogue CA is present in the trust store.

**Key terms** on-path attacker; interception; certificate validation; trust store.

<a id="c-security.security.brute-force-and-credential-stuffing"></a>
### Brute force and credential stuffing
*id: `security.security.brute-force-and-credential-stuffing` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: owasp-credential-stuffing, nist-sp-800-63b-4*

**What it is** Three related but distinct credential attacks, which OWASP separates
precisely. Brute force tests many passwords against a single account. Credential stuffing
tests username and password *pairs* obtained from another site's breach. Password spraying
tests one weak password against a large number of different accounts.

**Why it matters** The distinction determines which defence works. Because they differ in
how the attempts are spread across accounts, a control that stops one can be irrelevant to
another — and the exam asks exactly that.

**How it works** Brute force and spraying guess; credential stuffing does not guess at all,
it replays credentials that were valid somewhere else and works only because people reuse
passwords. Stuffing is automated at scale and produces a low failure rate per account, so it
hides inside normal login traffic far better than repeated guessing against one account does.

**Key terms** password spraying; credential reuse; rate limiting; account lockout;
breached-password check.

**Traps** Account lockout after N failed attempts is the reflexive answer and it is the wrong
one for stuffing and spraying: those attacks make one or two attempts per account, staying
well under any threshold. Lockout also creates a denial-of-service vector, since an attacker
can lock out real users deliberately. MFA is the defence that covers all three, because a
correct password stops being sufficient. Second trap: strong password policies do nothing
against credential stuffing if the reused password was already strong — checking candidate
passwords against known-breached lists is what addresses reuse.

**What the exam may test** Matching each attack to the defence that actually stops it, and
recognising that lockout thresholds and password complexity rules do not address credential
stuffing.

<a id="cmp-security.security.brute-force-and-credential-stuffing"></a>
#### Not to be confused with: Brute force and credential stuffing vs Phishing and social engineering
*compares: `security.security.brute-force-and-credential-stuffing`, `security.security.phishing-and-social-engineering`*

| | Brute force and credential stuffing | Phishing and social engineering |
| --- | --- | --- |
| Where the credential comes from | Guessed, or replayed from another site's breach | Handed over by the user |
| Does the user participate | No — they are unaware | Yes — the attack requires them to act |
| Primary defence | MFA, rate limiting, breached-password checks | User awareness, plus phishing-resistant authenticators |
| What logs show | Many authentication attempts, or many accounts touched once | A single successful login from an unusual place |
| Fixed by a stronger password | Partly, for brute force only | No — strength is irrelevant when the password is given away |

The separating axis is who supplies the credential: the attacker derives it themselves in one
case and persuades the account holder to hand it over in the other, which is why one is fought
with rate limits and the other with training.

<a id="c-security.security.injection-attacks"></a>
### Injection attacks
*id: `security.security.injection-attacks` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: owasp-top10-injection*

**What it is** Supplying input that the receiving system interprets as code or query
structure rather than as data. SQL injection is the classic form; OWASP's Top 10:2025 places
injection at A05, down two places from A03 in the 2021 edition, and folds cross-site
scripting into the same category, since it is the same mistake against a different
interpreter. Cross-site scripting (CWE-79) is the largest single CWE in A05:2025 by CVE
count — high frequency, low impact — which is why the category's weighted impact is lower
than SQL injection considered alone would suggest.

**Why it matters** The root cause is a single design error — concatenating untrusted input
into a string that something else will parse — so the fix generalises across databases,
shells, LDAP, and HTML output.

**How it works** The defence OWASP puts first is to use a safe API that never builds the
statement by concatenation: parameterised queries, prepared statements, or an ORM, which keep
data and query structure in separate channels so input cannot change the statement's meaning.
Positive server-side input validation and context-appropriate escaping are supporting
measures, not replacements.

**Key terms** parameterised query; prepared statement; server-side validation; cross-site
scripting.

<a id="c-security.security.privilege-escalation"></a>
### Privilege escalation
*id: `security.security.privilege-escalation` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: nist-csrc-glossary*

**What it is** Turning access you already have into more access than you were granted.
Vertical escalation moves up — an ordinary user becoming root or administrator. Horizontal
escalation moves sideways — reaching another user's account or data at the same privilege
level.

**Why it matters** It is a post-access step, not a way in, and that ordering is what the exam
tests. An attacker who phished a credential or exploited a public service then needs
escalation to reach anything the compromised account could not already touch.

**How it works** Common Linux routes are a misconfigured `sudo` rule, a SUID binary that can
be made to run arbitrary commands, a service file or script writable by an unprivileged user,
and kernel or service vulnerabilities. Least privilege and mandatory access control are the
structural defences, because both shrink what the first foothold is worth.

**Key terms** vertical escalation; horizontal escalation; SUID; sudo misconfiguration.

<a id="c-security.security.insider-threat"></a>
### Insider threat
*id: `security.security.insider-threat` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: nist-csrc-glossary*

**What it is** Harm caused by someone who already holds legitimate access — an employee,
contractor, or partner — whether deliberately (theft, sabotage) or accidentally (a
misdirected file, a public bucket, a deleted database).

**Why it matters** The insider passes authentication legitimately, so the controls that
dominate the rest of this competency do not engage at all. Perimeter filtering, MFA, and
patching are irrelevant to someone who is supposed to be there.

**How it works** The controls that do apply are least privilege and need-to-know limiting
what any one person can reach, separation of duties so no single person can complete a
sensitive action alone, accounting and auditing to detect and attribute misuse afterwards,
periodic access review, and prompt revocation at offboarding.

**Key terms** separation of duties; access review; offboarding; accidental disclosure.

#### Scenario

An employee receives an invoice email, enters their password on a convincing fake portal, and
approves the push notification that follows. Trace what each control did. MFA was present but
not phishing-resistant, so the real-time relay captured the second factor too. The attacker's
subsequent login looks legitimate in the logs — one successful authentication from a new
location, not the burst of failures that brute force or spraying would leave — so detection
depends on accounting and monitoring rather than on a lockout threshold. From that foothold
they exploit a writable service unit to escalate vertically to root, then deploy ransomware
that encrypts the fileserver and the network backup share mounted on it. Availability is
restored from the offline copy; the exfiltrated data is not recoverable, because restoring
undoes the encryption but not the breach of confidentiality.

#### Knowledge check

1. Why is account lockout after five failed attempts a poor defence against credential
   stuffing?
   Stuffing makes about one attempt per account using pairs already known to be valid
   somewhere, so it never approaches the threshold — and lockout adds a denial-of-service
   vector against real users.
2. Is it safe to say phishing is the most common route to initial access?
   No. The Verizon 2026 DBIR puts exploitation of vulnerabilities first at 31% of initial
   access, ahead of phishing at 16% and credential abuse at 13%. Credential abuse is still
   the most pervasive technique overall at 39% of breaches when counted anywhere in the
   chain, but phishing leads on neither measure.
3. Which CIA leg does a DDoS attack target, and what does it tell you about the data?
   Availability; nothing was necessarily read or altered, so a data-breach conclusion does
   not follow.
4. Backups exist and are current, but the backup share is mounted on the file server. Why is
   that not a ransomware control?
   Anything the compromised host can write, the ransomware can encrypt — the copy must be
   offline, immutable, or otherwise out of reach, and restores must be tested.
5. Is privilege escalation a way into a system?
   No — it is what an attacker does after obtaining some access, to reach beyond what that
   access allowed.
6. Which named control actually addresses an insider who has legitimate access to the data
   they misuse?
   Least privilege and separation of duties limit what they can reach or complete alone;
   accounting and auditing detect and attribute it afterwards. Perimeter controls and MFA do
   not engage.

<a id="s-security-defences"></a>
## Defences

<a id="c-security.security.vulnerabilities-cves-and-patching"></a>
### Vulnerabilities, CVEs and patching
*id: `security.security.vulnerabilities-cves-and-patching` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: cve-program-overview, nist-csrc-glossary, verizon-dbir*

**What it is** A publicly known software weakness is catalogued under the CVE Program with a
unique identifier of the form CVE-YYYY-NNNN, assigned by a CVE Numbering Authority. Severity
is expressed separately, through CVSS, on a 0.0 to 10.0 scale. Patching — applying the
vendor's corrected version — is the primary remediation.

**Why it matters** Exploitation of vulnerabilities is the leading initial-access route in the
Verizon 2026 DBIR at 31%, ahead of phishing at 16% and credential abuse at 13%, and unlike
most threats it is defeated by a fully mechanical action: install the update. Patch latency is therefore one
of the few security metrics that maps directly onto exposure.

**How it works** A CNA assigns the identifier and publishes a record describing the affected
product; the identifier is a name, not an assessment. CVSS supplies a severity score, and
databases such as NIST's National Vulnerability Database enrich CVE records with those scores
and affected-platform data. Organisations then prioritise: severity, whether the affected
component is actually deployed and reachable, and whether exploitation is being observed in
the wild.

**Key terms** CVE identifier; CVE Numbering Authority; CVSS; National Vulnerability Database;
patch window.

**Traps** A CVE identifier is not a severity score and not a patch — it is a name that lets
everyone refer to the same defect. Confusing CVE with CVSS is a direct, testable error.
Second trap: a CVSS base score describes the flaw in the abstract, not your risk. A 9.8 in a
package you have installed but never run, unreachable from any network, may matter less than
a 6.5 on your internet-facing login service. Third: patching addresses that one defect; it
does not reduce attack surface — see the comparison.

**What the exam may test** Naming what a CVE identifier is versus what CVSS provides, and
choosing patch priority from deployment and reachability rather than from the raw score.

*Not to be confused with [attack surface](security.md#cmp-security.security.attack-surface).*

<a id="c-security.security.system-hardening"></a>
### System hardening
*id: `security.security.system-hardening` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-53r5, nist-csrc-glossary*

**What it is** Configuring a system to expose and permit as little as its purpose requires:
removing unnecessary packages, disabling and stopping unused services, closing listening
ports, disabling or deleting unused accounts, removing default credentials, and tightening
permissive defaults.

**Why it matters** Vendors ship for broad usability, not for your threat model, so a default
installation is by definition more permissive than a deployed system needs. Hardening is how
attack surface is actually reduced in practice, and it is the one improvement that requires
no knowledge of any specific vulnerability.

**How it works** Work from an inventory: what is installed, what is listening, who can log
in, what can elevate. Published baselines such as the CIS Benchmarks give a checked starting
point. Because configuration drifts as software is installed and rules are added, hardening
is verified periodically rather than done once.

**Key terms** baseline; default credentials; unnecessary service; configuration drift.

<a id="c-security.security.firewalls-and-network-segmentation"></a>
### Firewalls and network segmentation
*id: `security.security.firewalls-and-network-segmentation` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-53r5*

**What it is** Two complementary network controls. A firewall filters traffic against a rule
set at a boundary it sits on — a network perimeter, a subnet edge, or the host itself.
Segmentation divides the network into zones so that a compromise in one does not have free
reach into the others.

**Why it matters** They answer different questions: the firewall decides what may cross a
given boundary, and segmentation decides how many boundaries exist to cross. A strong
perimeter firewall around a flat internal network still leaves an attacker who gets inside
free to move laterally, which is the failure zero trust responds to.

**How it works** Rules are written default-deny — permit what is required, drop everything
else — and stateful firewalls track connection state so that return traffic for a permitted
outbound flow is allowed without a separate inbound rule. Host firewalls enforce the same
idea per machine, which is what makes them a genuine second layer rather than a duplicate of
the network firewall.

**Key terms** default deny; stateful filtering; host firewall; lateral movement; zone.

<a id="c-security.security.intrusion-detection-and-prevention"></a>
### Intrusion detection and prevention
*id: `security.security.intrusion-detection-and-prevention` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-94*

**What it is** An intrusion detection system monitors traffic or host activity for signs of
an incident and alerts. An intrusion prevention system does everything a detection system
does and additionally attempts to stop the activity. NIST treats them as one technology class
and calls it IDPS.

**Why it matters** The difference is not analytical power but placement and authority: a
prevention system must sit inline, in the traffic path, because it has to be able to drop
packets; a detection system commonly sits passively on a tap or mirrored port and cannot.
That placement decision carries the operational trade-off the exam tests.

**How it works** Detection methods include signature-based matching against known attack
patterns, anomaly-based comparison against a learned baseline, and stateful protocol
analysis. Deployment is network-based (NIDS/NIPS, watching a segment) or host-based
(HIDS/HIPS, watching one system's activity, files, and logs). Signatures catch known attacks
reliably and miss novel ones; anomaly detection can catch novel behaviour at the price of
more false positives.

**Key terms** inline versus passive; signature-based; anomaly-based; NIDS; HIDS; false
positive.

**Traps** An IPS false positive drops legitimate traffic — that is precisely why many
deployments run in detection-only mode first, and why "just turn on blocking" is not
automatically the better answer. Second trap: neither one patches anything. They observe
activity as it happens; they do not enumerate weaknesses in advance, which is a scanner's
job — see the comparison. Third: an IDS placed passively cannot block, however good its
detection is, so the fix for "it alerted but did not stop the attack" may be architectural.

**What the exam may test** Choosing detection versus prevention for a described requirement,
explaining the inline placement implication, and separating both from vulnerability scanning.

<a id="cmp-security.security.intrusion-detection-and-prevention"></a>
#### Not to be confused with: Intrusion detection and prevention vs Vulnerability scanning
*compares: `security.security.intrusion-detection-and-prevention`, `security.security.vulnerability-scanning`*

| | Intrusion detection and prevention | Vulnerability scanning |
| --- | --- | --- |
| What it examines | Live traffic and host activity as it happens | The configured state of hosts, applications, and images |
| When it runs | Continuously | On a schedule, or in a build pipeline |
| What it finds | An attack in progress or attempted | A known weakness that nobody has necessarily attacked |
| Initiated by | The attacker's activity | You |
| Result | An alert, or a dropped packet | A prioritised list of findings to remediate |

The separating axis is present tense versus latent state: the IDPS answers "is something
happening right now," while the scanner answers "what could be exploited if someone tried."
Neither substitutes for the other.

<a id="c-security.security.security-logging-and-monitoring"></a>
### Security logging and monitoring
*id: `security.security.security-logging-and-monitoring` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-53r5, nist-sp-800-61r3*

**What it is** Generating, retaining, centralising, and actively reviewing records of
security-relevant events, so that an intrusion can be detected while it is happening and
reconstructed afterwards. It is not a second name for accounting, defined earlier in
Principles, and the two definitions are close enough that the exam can separate them:
accounting is the AAA-triad property, the per-identity record of what an authenticated
subject did, which is what makes non-repudiation possible; security logging and monitoring is
the operational pipeline that makes such records survive and get seen — generation on every
host, shipping off-box, clock synchronisation, retention, alerting, and correlation across
systems. A question asking "which A of AAA is this" is accounting; a question asking "why
ship logs to a SIEM" or "why synchronise clocks" is this topic.

**Why it matters** Without it, an incident is invisible during and unexplainable after. Every
question about scope — which accounts, which systems, how long, what was taken — is answered
from logs or not at all, which is why insufficient logging is treated as a control failure in
its own right.

**How it works** Events are shipped off the originating host to a central collector or SIEM,
because logs on a compromised system can be altered or deleted by the attacker and are the
first thing they target. Clocks are synchronised so events from different systems can be
correlated into a timeline, retention is set long enough to cover the interval between a
breach and its discovery, and alerts are tuned so that the important events are actually
seen.

**Key terms** centralised logging; SIEM; time synchronisation; retention period; alerting.

<a id="c-security.security.incident-response"></a>
### Incident response
*id: `security.security.incident-response` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-61r3, sans-picerl*

**What it is** The prepared sequence an organisation follows when an incident occurs:
Preparation, Identification, Containment, Eradication, Recovery, Lessons Learned. Name its
origin, because the exam's phrasing borrows it and its provenance is routinely misattributed:
this six-step sequence is the SANS model, commonly abbreviated PICERL from its initials, and
it is SANS's, not NIST's. The order is the substance — acting out of sequence is the
characteristic wrong answer.

**Why it matters** Containment precedes eradication for a reason. Stopping the spread limits
damage while investigation is still possible; wiping and rebuilding first destroys the
evidence needed to establish scope, so you cannot tell whether the attacker is still present
elsewhere. Recovery precedes the lessons-learned review, and skipping that review is what
lets the same root cause recur.

**How it works** Preparation is the phase done before anything happens — plans, contacts,
authority to disconnect a system, and tested backups. Identification confirms that an event
is an incident and establishes scope. Containment isolates affected systems, eradication
removes the attacker's access and artefacts, and recovery restores service and verifies it is
clean before the post-incident review. No revision of NIST SP 800-61 has ever published that
six-step list. Rev. 2 used a *four*-phase life cycle — Preparation; Detection and Analysis;
Containment, Eradication and Recovery; Post-Incident Activity — and Rev. 3 (April 2025)
replaced that model entirely, reorganising incident response around the six Cybersecurity
Framework 2.0 Functions: Govern, Identify, Protect, Detect, Respond, Recover. CSF 2.0's six
Functions and PICERL's six steps are different six-item lists and must not be conflated: the
Functions are outcome categories spanning cybersecurity risk management as a whole, while the
PICERL steps are the tactical order of handling one incident. The six-step sequence above
remains the form the exam's vocabulary uses.

**Key terms** containment; eradication; scope; evidence preservation; post-incident review.

<a id="c-security.security.physical-security"></a>
### Physical security
*id: `security.security.physical-security` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-53r5*

**What it is** Controlling who can physically reach hardware: locked facilities and racks,
badge access, visitor escort, cameras, and secure disposal of decommissioned media.

**Why it matters** An attacker at the console operates below the level most software controls
occupy. They can interrupt the boot loader to obtain a root shell, boot from removable media
into a different operating system, or simply remove the disk and read it elsewhere — none of
which authentication or file permissions on the installed system can prevent.

**How it works** The layered answer combines physical access control with boot-path controls
— a firmware password, a restricted boot order, a boot loader password — and full disk
encryption, which is the control that still holds once the hardware itself is in someone
else's hands. Media that leaves the building is wiped or destroyed rather than merely
deleted.

**Key terms** console access; boot loader password; removable media; secure disposal.

<a id="c-security.security.ssh-hardening"></a>
### SSH hardening
*id: `security.security.ssh-hardening` · depth 5 · importance 2 · LFS200: NOT COVERED · sources: openssh-sshd-config, rfc-4252-ssh-auth*

**What it is** The standard configuration baseline for an internet-facing OpenSSH server:
disable direct root login, disable password authentication in favour of public keys, and
restrict who may connect at all. It is configured in `sshd_config`, read by the server from
`/etc/ssh/sshd_config`.

**Why it matters** SSH is exposed to continuous untargeted scanning on any public Linux host,
and the default configuration is deliberately permissive so that a fresh install is usable. Two
defaults do most of the damage: `PasswordAuthentication` defaults to `yes`, which makes the
host a valid target for brute force and credential stuffing, and `PermitRootLogin` defaults to
`prohibit-password`, which still lets root in by key when policy usually wants named accounts
that elevate through `sudo` so that actions are attributable.

**How it works** The file contains keyword-argument pairs, one per line, and — unless a
keyword documents otherwise — *the first obtained value is the one used*, which is the
opposite of the last-wins behaviour most configuration formats have. Modern distributions
place an `Include /etc/ssh/sshd_config.d/*.conf` line near the top, so a drop-in file can win
over a directive written further down in the main file. Changes take effect when the daemon
reloads its configuration, and the running session is unaffected until then.

**Key terms** `PermitRootLogin`; `PasswordAuthentication`; `PubkeyAuthentication`;
`KbdInteractiveAuthentication`; first-obtained-value; drop-in configuration.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `sshd_config` | The OpenSSH server configuration file, read from `/etc/ssh/sshd_config` | `PermitRootLogin` (default `prohibit-password`), `PasswordAuthentication` (default `yes`), `PubkeyAuthentication` (default `yes`), `MaxAuthTries` (default 6), `Port` (default 22), `AllowUsers`, `AllowGroups` | Set `PermitRootLogin no` and `PasswordAuthentication no`, then validate with `sshd -t` and reload | Editing the client file `ssh_config` instead of the server file `sshd_config`, and wondering why the server's behaviour did not change |

**Traps** Turning off `PasswordAuthentication` is not by itself sufficient to stop password
entry: `KbdInteractiveAuthentication` defaults to `yes`, and on a PAM-backed system that path
can still prompt for a password, so both are set to `no` in a real baseline.
`ChallengeResponseAuthentication` is a deprecated alias for the same setting, which is why
older guides appear to name a different directive. Second trap: moving the daemon to a
non-standard `Port` reduces log noise from untargeted scanning but is obscurity, not a
control — it stops nothing that looks for the service. Third: `PermitRootLogin
prohibit-password` is *not* the same as `no`; it disables password and keyboard-interactive
authentication for root while still permitting key-based root login.

**What the exam may test** Which directive produces a stated outcome, what each default
already is, and why disabling password authentication without also disabling
keyboard-interactive can leave a password path open.

**Symptoms and diagnostic order** When SSH access behaves unexpectedly after a hardening
change, work outward from the configuration rather than restarting things at random.

1. *Connection refused, immediately.* The daemon is not listening where you are connecting.
   Check that it is running and on which `Port`; a syntax error can leave it failing to
   start, which `sshd -t` reports before a reload rather than after.
2. *Connection times out.* Traffic is not reaching the daemon at all — a firewall rule or
   security group, not an `sshd_config` problem. Nothing in the server configuration produces
   a timeout.
3. *Permission denied (publickey).* The daemon is running and has rejected you: either the
   public key is not in the account's `AuthorizedKeysFile` (default
   `.ssh/authorized_keys .ssh/authorized_keys2`), or the client offered a different key, or
   the home directory, `.ssh`, or `authorized_keys` is writable by other users, which makes
   `StrictModes` (default `yes`) refuse to use the file.
4. *Password prompt appears when it should not.* `PasswordAuthentication no` is set but
   `KbdInteractiveAuthentication` is still `yes`, or a drop-in file included earlier in the
   file supplied the first — and therefore winning — value.
5. *Root can still log in.* `PermitRootLogin` is at its default `prohibit-password`, which
   blocks passwords for root but not keys.
6. *Everything looks right but nothing changed.* The daemon has not reloaded, or the edit was
   made to the client's `ssh_config`. Confirm with `sshd -t` and then reload.

Throughout: keep the current session open while testing changes in a second connection.
Closing the only session before verifying a new one is the standard way to lock yourself out
of a remote host.

**Syntax worth memorising** The baseline is short, and the exact spelling of these lines is
itself examinable:

```
Port 22
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
PermitEmptyPasswords no
MaxAuthTries 3
AllowGroups sshusers
X11Forwarding no
```

Each line is a keyword and its argument, separated by whitespace; `#` begins a comment. The
first four are the substance of the baseline: no direct root login, no password path of
either kind, keys permitted. `AllowUsers` and `AllowGroups` restrict who may authenticate at
all and take patterns; `AllowUsers` additionally accepts a `USER@HOST` form so a user can be
restricted to particular source addresses. `MaxAuthTries` (default 6) bounds attempts per
connection. Validate with `sshd -t` before reloading, and use `sshd -T` to print the
effective configuration when a drop-in file may be overriding what you just edited.

<a id="c-security.security.selinux-and-apparmor"></a>
### SELinux and AppArmor
*id: `security.security.selinux-and-apparmor` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: selinux-man8, apparmor-wiki*

**What it is** Linux's two mainstream mandatory access control implementations. Policy —
written by the distribution, not by the file's owner — confines what a process may do,
independently of and in addition to the ordinary owner/group/other permission bits. SELinux
is the Red Hat family's default; AppArmor is used by Ubuntu, Debian and SUSE.

**Why it matters** Discretionary permissions let a resource's owner grant access to anyone,
and let a process do anything its user could. Mandatory access control removes that
discretion: a compromised web server confined by policy cannot read `/etc/shadow` or write
outside its permitted paths even if it is running as root, which is what turns a service
compromise into a contained one.

**How it works** SELinux labels every process and object with a security context and decides
each access from type-enforcement rules; `/etc/selinux/config` selects the mode — `enforcing`,
`permissive`, or `disabled` — and the policy, commonly the targeted policy, which confines
specific services and leaves ordinary user processes unconfined. `getenforce` reports the
current mode and `setenforce` switches between enforcing and permissive at runtime. AppArmor
instead attaches profiles to program paths, with each profile in enforce or complain mode,
and `aa-status` reports how many profiles are loaded and in which mode.

**Key terms** mandatory access control; security context; type enforcement; profile;
enforcing versus permissive.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `getenforce` | Report whether SELinux is enforcing, permissive, or disabled | (takes no options) | `getenforce` | Reading `Permissive` as "protected" — permissive logs the denial and allows the access anyway |
| `aa-status` | Report AppArmor's state and how many profiles are loaded and in which mode | `--enabled` exit status only, `--profiled` count of loaded profiles, `--enforced` count in enforce mode, `--complaining` count in complain mode, `--json` machine-readable output | `aa-status` | Running it unprivileged and reading the resulting error as "AppArmor is not installed" — it needs root to read the policy state |

**Traps** Permissive mode is not protection. It logs what policy would have denied and permits
it anyway, so "SELinux is enabled" and "SELinux is enforcing" are different claims, and
`getenforce` is what distinguishes them. Second trap: disabling SELinux to make an application
work is the wrong remediation the exam offers as a plausible option — the correct fix is
relabelling the files or adjusting the policy, and the `selinux(8)` documentation notes that
setting `SELINUX=disabled` no longer necessarily disables it fully in any case. Third:
mandatory access control overrides discretionary permissions, so `chmod 777` on a file does
not let a confined process touch it.

**What the exam may test** Recognising MAC as a distinct layer above file permissions,
knowing which implementation belongs to which distribution family, and choosing the command
that reports the current mode. Note that LFS200 never uses the term SELinux
(`research/lfs200-notes/00-course-map.md` records it as a measured absence across the whole
158,185-character course, not just a gap in one lesson), which is why this concept is tagged
NOT COVERED rather than FULLY COVERED despite ch9.l3's general Network Security material —
a concept whose defining term never appears cannot be credited as fully covered by it;
everything here is written from `selinux(8)` and the AppArmor documentation.

<a id="cmp-security.security.selinux-and-apparmor"></a>
#### Not to be confused with: SELinux and AppArmor vs Access control models
*compares: `security.security.selinux-and-apparmor`, `security.sensitive-data.access-control-models`*

| | SELinux and AppArmor | Access control models |
| --- | --- | --- |
| What it names | Two concrete Linux implementations of mandatory access control | The taxonomy itself — discretionary, mandatory, and role-based |
| Level | A tool you install, configure, and query on a host | A category used to classify any access control scheme |
| Where you meet it | `/etc/selinux/config`, AppArmor profiles, `getenforce`, `aa-status` | Design discussions, and questions naming DAC, MAC, or RBAC |
| Question shape | "Which command shows whether enforcement is on" | "Which model does this description illustrate" |
| Relationship | Implementations of the mandatory model | The model SELinux and AppArmor implement, plus the two others |

The separating axis is instance versus category: SELinux and AppArmor are specific products
implementing one of the models; access control models name the classification scheme those
products are examples within.

<a id="c-security.security.package-and-download-verification"></a>
### Package and download verification
*id: `security.security.package-and-download-verification` · depth 3 · importance 2 · LFS200: FULLY COVERED · sources: gnupg-verify-docs*

**What it is** Establishing that software you are about to install is the software the
publisher released: comparing a published checksum against the bytes you received, and
verifying a cryptographic signature made with the publisher's private key.

**Why it matters** This is where the hashing and asymmetric-cryptography primitives become a
concrete supply-chain control. It is also what makes a package repository trustworthy, though
the two families check different objects: `apt` verifies the signature on every repository's
`Release` file as a matter of course, while `dnf` verifies each package's own signature
through the repository's `gpgcheck` setting — its separate metadata check, `repo_gpgcheck`,
is off by default. Either way, adding a third-party repository means adding its signing key
and extending trust to whoever holds it.

**How it works** A checksum answers only "are these the bytes that were hashed." `sha256sum`
with `-c` reads a digest file and reports OK or FAILED per entry. A signature answers "who
released these bytes," because it was produced with a private key: `gpg --verify` checks a
detached signature against the file — `gpg --verify sha256sums.txt.asc sha256sums.txt` — or a
clearsigned document given alone. In practice the two combine: the signature covers the
checksum file, and the checksum file covers the artefacts.

**Key terms** checksum; detached signature; signing key; repository key; supply chain.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `sha256sum` | Verify downloaded files against published digests | `-c` check the digests in a file, `--ignore-missing` skip files not present, `--status` report through the exit code only | `sha256sum -c SHA256SUMS` | Fetching the digest file from the same server and over the same channel as the download — an attacker who replaced one replaced both |
| `gpg --verify` | Verify a signature over a file or checksum list | Detached form takes the signature file then the signed file; clearsigned documents are passed alone | `gpg --verify SHA256SUMS.asc SHA256SUMS` | Accepting "Good signature" while ignoring the warning that the key is not certified — the signature matched a key you never validated |

**Traps** A checksum proves integrity, not origin. It tells you the file matches a value, and
if that value came from the compromised source alongside the download, it proves only
self-consistency. A signature proves origin as well — but only relative to the key you
verified it against, so `gpg --verify` printing `Good signature` together with a warning that
the key is not certified with a trusted signature means the signer's identity is still
unestablished. Obtaining the publisher's key through an independent, trusted channel is the
part that carries the security, and it is the part that gets skipped.

**What the exam may test** Distinguishing what a checksum proves from what a signature proves,
and identifying why a digest published beside the download adds little.

<a id="c-security.security.vulnerability-scanning"></a>
### Vulnerability scanning
*id: `security.security.vulnerability-scanning` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-53r5, cve-program-overview*

**What it is** Systematically probing hosts, applications, container images, and
configurations against a database of known weaknesses, on a schedule or as a build-pipeline
step, and producing a prioritised list of findings to remediate.

**Why it matters** It is how an organisation finds out that a CVE applies to it before an
attacker does, and it is the routine practice that feeds the patching queue. Scanning
container images at build time is the same idea moved earlier, catching a vulnerable base
image before it ever runs.

**How it works** The scanner enumerates what is present — versions, open ports, configuration
settings — and matches it against a vulnerability database, reporting matches with severity.
An authenticated scan logs in and reads installed package versions directly and is far more
accurate; an unauthenticated scan only sees what is exposed on the network and systematically
under-reports.

**Key terms** authenticated scan; false positive; container image scanning; remediation
backlog.

**Traps** A scan reports *known* weaknesses in a system's current state; it does not detect an
attack in progress, which is an intrusion detection system's job — the two are routinely
offered as alternatives for the same scenario. Second trap: scanning is not penetration
testing. A scanner enumerates and matches against a database; a penetration test attempts
exploitation and chains findings together, and finds classes of problem no scanner reports.
Third: a clean unauthenticated scan is weak evidence, because it never saw inside the host.

**What the exam may test** Choosing scanning versus detection versus penetration testing for
a stated goal, and knowing why authenticated scans are preferred.

*Not to be confused with [intrusion detection and prevention](security.md#cmp-security.security.intrusion-detection-and-prevention).*

#### Scenario

A public web server is found to be running an outdated application with a critical CVE. Work
the response in order rather than by instinct. Containment comes first — restrict access at
the firewall and isolate the host — because eradicating before establishing scope destroys
the evidence needed to tell whether the attacker reached anywhere else; the central log
collector, not the host's own logs, is where that scope is established, since local logs on a
compromised machine cannot be trusted. Eradication then means patching and rebuilding from a
verified image, checked with `sha256sum` against the publisher's signed digest list rather
than a digest fetched from the same page. Hardening afterwards is a different action from
patching: the unused management port that was also open should be closed, because that
reduces attack surface rather than fixing one named defect. The scheduled scan that found the
CVE would never have detected the intrusion itself — that is what the IDPS is for — and
mandatory access control, had the service been confined by SELinux or AppArmor in enforcing
mode, would have limited what the compromise reached in the first place.

#### Knowledge check

1. What is the difference between a CVE identifier and a CVSS score?
   The CVE identifier is a name for a specific publicly known defect, assigned by a CVE
   Numbering Authority; CVSS is a separate 0.0 to 10.0 severity score. The identifier carries
   no severity information.
2. A system is running SELinux in permissive mode. Is the service confined?
   No — permissive mode logs what policy would have denied and permits it anyway. Only
   enforcing mode blocks, and `getenforce` distinguishes the two.
3. Why does containment precede eradication in incident response?
   Containment stops the spread while investigation is still possible; eradicating first
   destroys the evidence needed to establish scope and confirm the attacker is gone.
4. Which of an IDS and a vulnerability scanner would notice an exploit attempt in progress,
   and which would have listed the weakness beforehand?
   The IDS notices the live activity; the scanner would have listed the known weakness in
   advance. Neither does the other's job.
5. You disabled `PasswordAuthentication` in `sshd_config` and users are still prompted for a
   password. What are the two likely causes?
   `KbdInteractiveAuthentication` is still at its default `yes` and PAM is supplying the
   prompt, or an included drop-in file provided the first — and therefore winning — value for
   the directive.
6. Why is a host firewall a genuine additional layer rather than a duplicate of the network
   firewall?
   It fails for different reasons and enforces at a different boundary, so a rule error or
   bypass at the network edge does not disable it — and it constrains lateral movement
   between hosts inside the same segment.
