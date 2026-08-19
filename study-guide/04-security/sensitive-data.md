# Sensitive Data

Sensitive Data sits inside Security Fundamentals, which is 14% of the exam — 4th largest of 6
domains — on the current (2025-09-16) blueprint, and the competency's 2025 status is
reworded. LFS200 is no help at all here: of its 13 concepts, 13 are NOT COVERED — 0/13 (0%)
are not NOT COVERED, so every topic below is sourced independently from NIST, GDPR, HIPAA and
PCI primary documentation rather than from the course
(`research/lfs200-notes/00-course-map.md`). The competency is also unusually abstract for this
exam: none of its concepts carry a command, so every question it can ask is a question about
which term applies, which regime attaches, or which control belongs to which state of the
data. Two discriminations recur across the concepts below and are drilled here — data at rest
versus in transit versus in use, and hashing versus encryption versus encoding.

<a id="s-sensitive-data-classification"></a>
## Classification

<a id="c-security.sensitive-data.personally-identifiable-information"></a>
### Personally identifiable information
*id: `security.sensitive-data.personally-identifiable-information` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-122, gdpr-eurlex*

**What it is** Information that identifies a person, either on its own or in combination with
other information. NIST SP 800-122 splits it in two: information that can be used to
*distinguish or trace* an individual's identity (name, Social Security number, date and place
of birth, biometric records) and any other information that is *linked or linkable* to an
individual (medical, educational, financial, employment). GDPR Article 4(1) draws a similar
line under the name "personal data": any information relating to an identified or
identifiable natural person, directly or indirectly, expressly including an online identifier.

**Why it matters** PII is not a label somebody assigns — it is a property of what the data
says. That is why the obligation travels with the data into backups, log files, test fixtures,
CSV exports and a developer's laptop, and why "we only copied it to staging" is never a defence.
Every legal duty in this competency, from retention limits to breach notification, is triggered
by the presence of PII rather than by where it happens to be stored.

**How it works** Two words in the NIST definition do the work. *Distinguish or trace* covers
direct identifiers, which single a person out by themselves. *Linked or linkable* covers
everything that identifies a person once combined with something else — a postcode plus a date
of birth plus a job title is routinely enough. A list of credit scores with no accompanying
identifiers is not PII; the same list joined to account numbers is. NIST then asks for a PII
confidentiality impact level of low, moderate or high, and states explicitly that this is a
different judgement from the FIPS 199 confidentiality impact level assigned to the system.

**Key terms** direct identifier; quasi-identifier; linked and linkable; PII confidentiality
impact level; data subject.

**Traps** "Sensitive" and "personally identifiable" are not synonyms in either direction: a
pricing model or a merger plan is highly sensitive and contains no PII, while a plain mailing
list is PII of low sensitivity. Stripping the name does not end the analysis — if
re-identification remains reasonably possible from what is left, it is still PII. And under
GDPR an IP address or device identifier can be personal data, because Article 4(1) expressly
lists an online identifier among the references by which a person may be identified directly
*or indirectly* — it does not make one a direct identifier, and Recital 26 still asks whether
identification is possible by means reasonably likely to be used; a question that offers "an IP
address" as the obviously non-personal option is testing exactly that.

**What the exam may test** Given a list of fields, deciding which are PII on their own, which
are PII only in combination, and which are not PII at all — and keeping that finding separate
from the question of what classification label the file should carry.

*Not to be confused with [data classification](sensitive-data.md#cmp-security.sensitive-data.data-classification).*

<a id="c-security.sensitive-data.protected-health-and-payment-data"></a>
### Protected health and payment data
*id: `security.sensitive-data.protected-health-and-payment-data` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: hipaa-45-cfr-164, pci-dss-standards*

**What it is** Two categories of data that carry their own regime on top of ordinary PII
handling. Protected health information (PHI), and its electronic form ePHI, is governed in the
United States by HIPAA at 45 CFR Part 164. Cardholder data and sensitive authentication data
are governed by PCI DSS, published by the PCI Security Standards Council.

**Why it matters** The two regimes differ in kind, and that difference is the examinable point.
HIPAA is federal law, enforced by HHS, and it binds only covered entities and their business
associates — an ordinary company that happens to hold an employee's medical note is not
automatically a covered entity. PCI DSS is not law at all: the PCI Security Standards Council
publishes it, and the council states that whether an entity has to comply with, or validate
compliance to, a PCI standard is at the discretion of the organisations that manage compliance
programmes — a payment brand, an acquirer, or a similar entity. So "who enforces this, and by
what authority" has opposite answers for the two.

**How it works** Under HIPAA's Security Rule, implementation specifications are marked either
Required or Addressable, and encryption of ePHI is Addressable — both at rest, at 45 CFR
164.312(a)(2)(iv), and in transmission, at 164.312(e)(2)(ii). Addressable does not mean
optional: 45 CFR 164.306(d)(3) makes the covered entity assess whether the specification is a
reasonable and appropriate safeguard in its environment, implement it if it is, and otherwise
document why it is not and implement an equivalent alternative measure where that is itself
reasonable and appropriate. PCI DSS works the other way, by prohibition and mandate on specific
fields: the primary account number must be rendered unreadable wherever it is stored, and
sensitive authentication data — the council's glossary names card verification codes, full
track data, PINs and PIN blocks — is data that may be processed but not stored, so it must not
be retained after authorisation at all, encrypted or otherwise.

**Key terms** PHI and ePHI; covered entity; business associate; Required versus Addressable;
cardholder data; sensitive authentication data.

<a id="c-security.sensitive-data.data-classification"></a>
### Data classification
*id: `security.sensitive-data.data-classification` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-122*

**What it is** Assigning each piece of data a sensitivity label — commonly public, internal,
confidential, restricted in commercial schemes — so that a control set can be attached to the
label once instead of being argued out per file. Classification is a decision the organisation
makes; it is not a fact discovered in the data.

**Why it matters** Almost every other control in this competency takes classification as its
input. NIST SP 800-53's media sanitization control, MP-6, requires sanitization mechanisms with
strength and integrity commensurate with the security category or classification of the
information, and the discussion under its backup encryption enhancement, CP-9(8), sets backup
protection strength the same way. A data loss prevention deployment with no classification
scheme behind it degrades into pattern matching. Classification is the dial the rest of the
machinery reads.

**How it works** A data owner assigns the label using the scheme's criteria, and the scheme
maps each label to handling rules: who may access it, whether it may leave the network,
whether it must be encrypted, how long it is kept, how it must be destroyed. Where a set mixes
labels, schemes conventionally give the aggregate the highest label present, because the set
discloses everything the most sensitive member discloses. NIST SP 800-122 adds a parallel scale for personal data
specifically — a PII confidentiality impact level of low, moderate or high — and is explicit
that this is not the same judgement as the FIPS 199 confidentiality impact level of the system
holding it.

**Key terms** label; handling rules; data owner; aggregation; security category.

**Traps** Classification is not access control. Marking a document "Confidential" enforces
nothing by itself; an access control mechanism enforces, and the label only tells it what to
enforce. The one place the two genuinely fuse is mandatory access control, where labels are
bound to enforcement by the system — which is why a question about labels should be read
carefully to see whether it is describing a corporate taxonomy or a MAC policy. Classification
is also not clearance: the label is on the data, the clearance is on the person.

**What the exam may test** Separating the act of labelling from the act of enforcing, and
separating a classification level from the question of whether the data is PII at all — a file
can be restricted with no personal data in it, or public-labelled by mistake with personal data
in it.

<a id="cmp-security.sensitive-data.data-classification"></a>
#### Not to be confused with: Data classification vs Personally identifiable information
*compares: `security.sensitive-data.data-classification`, `security.sensitive-data.personally-identifiable-information`*

| | Data classification | Personally identifiable information |
| --- | --- | --- |
| What it is | A sensitivity label the organisation assigns | A property of what the data actually says |
| Who decides | The data owner, under the organisation's scheme | Nobody — it follows from whether a person can be identified |
| Can change while the data does not | Yes — reclassification is a policy decision | No — only changing the content changes the answer |
| Applies to non-personal data | Yes — source code, contracts, pricing models | No — by definition it concerns a natural person |
| What it drives | Which internal handling and control set applies | Which external legal and regulatory duties attach |
| Scale used | The scheme's own levels (public to restricted) | NIST's PII confidentiality impact level: low, moderate, high |

The separating axis is decision versus fact: classification is something an organisation
decides about data and can revise; PII is something that is true of the data whether anyone
has labelled it or not.

<a id="c-security.sensitive-data.data-states"></a>
### Data states
*id: `security.sensitive-data.data-states` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-57p1r5, nist-sp-800-53r5, nist-glossary-encryption*

**What it is** Three states data can be in, each needing its own control. At rest is data
sitting on storage — the discussion under NIST SP 800-53's SC-28 describes it as the state of
information when it is not in process or in transit and is located on system components. In
transit is data moving across a network, which SC-8 covers as transmission confidentiality and
integrity. In use is data loaded into memory and being operated on by a running process.

**Why it matters** The states do not substitute for each other, and the exam builds options out
of exactly that. A control chosen for one state contributes nothing to the other two, so "the
disks are encrypted" is no answer to a question about data crossing a network, and "we use TLS"
is no answer to a question about data sitting in a database or held open by a process.

**How it works** Each state names a boundary, and the control covers only what is inside it.
At-rest protection guards information on the storage component, so full-disk encryption is
undone by mounting: once the volume is unlocked, every process allowed to open the file sees
plaintext, and narrowing the boundary means encrypting at the file, column or object level
instead of the device. In-transit protection guards the information while it is on the wire,
and TLS terminates at each endpoint, so the plaintext exists in the sending process before
encryption and in the receiving process after decryption — a file uploaded over HTTPS lands as
plaintext on the server unless something separately encrypts it there. In use has no comparable
boundary on an ordinary system, because the data is decrypted inside the address space of the
process working on it; that is why it is the hardest state and the one with no everyday answer,
needing a hardware enclave or another confidential-computing construct rather than "encryption"
in the sense the other two states use the word.

**Key terms** at rest; in transit; in use; hash digest; encoding.

Keep the three transformations apart from the three states, because they are a standing
multiple-choice trio in their own right. Encryption is reversible with a key and provides
confidentiality. Hashing applies a one-way function to produce a fixed-length digest; no key is
involved, nothing is recovered from the digest, and it serves integrity checking and password
verification, never data you must read back. Encoding — Base64, hex, URL escaping — is
reversible by anyone with no key at all; it is a transport format and provides no security
whatever. A scheme described as "encoded for security" is misdescribed by definition.

#### Scenario

A support engineer exports a CSV for an external analytics vendor: customer name, email
address, postcode, date of birth, the last four digits of a card number, and a free-text
clinical note. Name and email are PII on their own; postcode and date of birth are PII in
combination even without the name. The clinical note pulls HIPAA into scope only if the
organisation is a covered entity or a business associate — a question about the organisation,
not about the file. The card fragment is masked, but the database it came from is in PCI scope.
What label the file carries is a separate decision again, made under the company's scheme.
Finally trace the three states: at rest on the exporting host, in transit to the vendor over
TLS, in use in the analyst's process memory — and note that the TLS session covers exactly one
of them.

#### Knowledge check

1. What is the one-sentence difference between data classification and PII?
   Classification is a label an organisation decides to apply; PII is a fact about whether the
   content identifies a person.
2. A dataset contains only postcodes and dates of birth, with no names. Is it PII?
   Yes, if a person can be identified from the combination — NIST's "linked or linkable" limb
   covers exactly this, and removing the direct identifier does not end the analysis.
3. Under HIPAA's Security Rule, is encryption of ePHI Required or Addressable, and what does
   that word mean?
   Addressable — the covered entity assesses whether it is reasonable and appropriate,
   implements it if so, and otherwise documents why not and puts an equivalent alternative
   measure in place where that is itself reasonable and appropriate. Addressable is not optional.
4. Who decides whether PCI DSS applies to an entity, and by what authority?
   The organisations that run the compliance programmes — a payment brand, an acquirer or a
   similar entity — not the council and not a statute. PCI DSS is a council-published standard,
   not legislation, which is what distinguishes it from HIPAA.
5. A system uses TLS for uploads and full-disk encryption on the server. Which of the three
   data states is still unprotected?
   In use — plaintext is in the server process's memory, which neither TLS nor disk encryption
   touches.
6. What is the difference between hashing, encryption and encoding?
   Hashing is one-way and keyless and yields a digest; encryption is reversible with a key and
   provides confidentiality; encoding is reversible by anyone with no key and provides no
   security at all.

<a id="s-sensitive-data-controls"></a>
## Controls

<a id="c-security.sensitive-data.access-control-models"></a>
### Access control models
*id: `security.sensitive-data.access-control-models` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-162, nist-glossary-dac, nist-glossary-mac, nist-glossary-rbac*

**What it is** Three named models for deciding who may do what. Under discretionary access
control (DAC), a subject granted access may pass that information or those privileges on to
others — the object's owner decides, at their discretion. Under mandatory access control (MAC),
the policy is uniformly enforced across all subjects and objects, and a subject granted access
is constrained from passing it on, granting its privileges, or changing security attributes.
Under role-based access control (RBAC), permissions attach to roles rather than to individual
identities, and subjects receive them by being assigned a role.

**Why it matters** The separating axis is who holds the decision, and the exam builds its
distractors on that single question. DAC puts it with the owner. MAC puts it with a
system-enforced policy that the owner cannot override. RBAC puts it with whoever administers
role assignment, and buys scalability: permissions are maintained once per role instead of once
per user per object, which is why it is the common organisational choice for anything with
meaningful headcount.

**How it works** Ordinary Unix file permissions and POSIX ACLs are DAC: the file's owner can
`chmod` it world-readable and nothing in the model stops them. A MAC system evaluates a
policy that sits above the owner entirely, so the same `chmod` may succeed while access is
still refused. RBAC evaluates the role assigned to the requesting subject and the operations
that role is authorised to perform. NIST SP 800-162 documents a fourth model, attribute-based
access control (ABAC), which decides by evaluating attributes of the subject, the object, the
requested operation and, in some cases, environment conditions against policy — and notes that
a role can be viewed as just one subject attribute, so that RBAC is in effect ABAC over the
single attribute "role" while ABAC evaluates many attributes in one Boolean rule set.

**Key terms** subject; object; discretion; role assignment; role explosion; ABAC.

**Traps** "Root can do anything" is DAC reasoning, and it is wrong on a MAC system: mandatory
policy constrains privileged processes too, unless the policy has explicitly designated them
trusted subjects exempt from some of its constraints. RBAC is also not the same thing as Unix
groups — a group is a DAC construct, because the owner still decides
what the group may do with the file. And least privilege and separation of duties are
principles that any of the three models can be used to implement, not models in their own right;
an option offering "least privilege" as an access control model is offering a category error.

**What the exam may test** Given a described arrangement — an owner sharing a file, an
administrator granting a job title a permission set, a policy the owner cannot override —
naming which model it is, and recognising that RBAC's scalability argument is about
maintenance cost, not about being more secure than DAC in the abstract.

*Not to be confused with [SELinux and AppArmor](security.md#cmp-security.security.selinux-and-apparmor).*

<a id="c-security.sensitive-data.encryption-key-management"></a>
### Encryption key management
*id: `security.sensitive-data.encryption-key-management` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-57p1r5*

**What it is** The whole lifecycle of a cryptographic key: generating it, distributing it,
storing it, using it, rotating it, revoking it and destroying it. NIST SP 800-57 Part 1
organises this into four phases — pre-operational, operational, post-operational and destroyed
— and tracks a key through states including pre-activation, active, suspended, deactivated,
compromised and destroyed.

**Why it matters** Encryption's strength is bounded by key custody, not by the algorithm name.
AES-256 with the key stored in the same database, the same image or the same repository as the
ciphertext buys nothing, because the attacker who has one has both. A question that offers a
stronger cipher as the fix for a key-handling failure is offering the wrong layer.

**How it works** SP 800-57 defines a cryptoperiod as the time span during which a key is
authorised for use, and bounds it deliberately: a shorter cryptoperiod limits how much material
is available for cryptanalysis and how much is exposed if that one key is compromised. It also
states that a single key shall in general be used for only one purpose — encryption, integrity
authentication, key wrapping, random bit generation or signing, but not two of them at once.
Rotation in practice usually means envelope encryption: a data-encryption
key protects the data, a key-encrypting key protects the data-encryption key, and rotating the
outer key re-wraps the inner one without re-encrypting a byte of the data. SP 800-57 defines
the key-encrypting key as exactly that — a key used to encrypt or decrypt other keys.

**Key terms** cryptoperiod; key rotation; revocation; envelope encryption; key-encrypting key.

<a id="c-security.sensitive-data.secrets-management"></a>
### Secrets management
*id: `security.sensitive-data.secrets-management` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-57p1r5, nist-sp-800-53r5*

**What it is** Keeping credentials, API keys, tokens and certificate private keys out of source
code, container images and baked-in configuration, and inside a purpose-built store that
provides access control, an audit trail and rotation. NIST SP 800-53's IA-5 covers the same
ground as authenticator management, including changing default authenticators before first use
and refreshing them on a defined schedule.

**Why it matters** Committing a secret to Git is a frequent real-world cause of a breach, and
the standard reaction to it is wrong. Deleting the secret in a later commit does not remove
it: the blob remains in history, in every clone anyone has already taken, in forks, and
in CI caches. Rewriting history is cleanup, not remediation. Rotating the credential — revoking
the exposed one and issuing a replacement — is the only fix that actually closes the exposure,
and it must happen first, before any tidying.

**How it works** A secret store holds the value, hands it to a workload at run time under an
identity check, logs who fetched what, and supports rotation without a code change. The
neighbouring discipline is key management, which governs cryptographic keys and their
cryptoperiods; secrets management is the broader operational problem of every credential,
cryptographic or not. Note also that an environment variable is a delivery mechanism, not a
secure store: it is inherited by every child process, it is readable by root and by the process
owner (`/proc/<pid>/environ` is gated by a ptrace access check, not left world-readable, and
`ps eww` reads the same file), and it routinely ends up in crash dumps, CI job logs and
container inspect output. So "we moved it out of the code into an env var" is a partial answer
at best — it is not readable by any user on the host, but it is not access-controlled, audited
or rotatable either.

**Key terms** secret store; rotation as remediation; short-lived credential; authenticator
management; `.gitignore` (which prevents adding a file, and does nothing about one already
tracked).

<a id="c-security.sensitive-data.masking-anonymization-and-pseudonymization"></a>
### Masking, anonymization and pseudonymization
*id: `security.sensitive-data.masking-anonymization-and-pseudonymization` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: gdpr-eurlex, nist-sp-800-122*

**What it is** Three techniques for reducing identifiability, distinguished by reversibility.
Masking obscures values in a display or a copy — showing only the last four digits of an account
number. Pseudonymization, defined at GDPR Article 4(5), processes personal data so it can no
longer be attributed to a specific data subject without additional information, which is kept
separately and protected. Anonymization removes the association between the data and the data
subject outright. Only anonymization is genuinely one-way.

**Why it matters** The legal consequence follows exactly that reversibility line, and it is the
single most examinable fact in this topic. Pseudonymized data is still personal data under GDPR,
because the mapping exists somewhere and the person remains identifiable to whoever holds it;
every obligation continues to apply. Anonymous information is outside GDPR's scope entirely —
Recital 26 states that the principles of data protection do not apply to it. So the same export,
tokenised versus truly anonymised, sits under two completely different regimes.

**How it works** Masking hides a value from a viewer and typically leaves the original intact in
the database behind it, so it is a presentation control, not a data control. Pseudonymization
substitutes a token or a hashed identifier and retains, separately, whatever is needed to
reverse it. Anonymization must survive an attempt to re-identify: NIST SP 800-122 warns plainly
that de-identified information can be re-identified, and hashing an email address is
pseudonymization rather than anonymization because the input space is small enough to enumerate.

**Key terms** de-identification; re-identification; token and mapping table; Recital 26;
reversibility.

<a id="c-security.sensitive-data.data-loss-prevention"></a>
### Data loss prevention
*id: `security.sensitive-data.data-loss-prevention` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-53r5*

**What it is** Controls that inspect data in motion, at rest and at the endpoint, and block
sensitive content from leaving the organisation — email and web gateways, endpoint agents, and
cloud access controls that match content against classification labels or against patterns such
as account and identity numbers.

**Why it matters** The name is a trap, and the exam uses it. "Loss" here means loss of control
— leakage, exfiltration, disclosure — not loss of availability. A candidate who reads "data
loss prevention" as "stops us from losing our data" will reach for backups, which prevent an
entirely different failure. DLP is also not a firewall: a firewall decides by address, port and
protocol, while DLP decides by what the payload contains, which is why it can permit a
connection and block one message across it.

**How it works** NIST SP 800-53 Rev. 5 has no control literally named data loss prevention; the
capability is assembled from AC-4 information flow enforcement, the SC-7(10) boundary protection
enhancement for preventing exfiltration — whose discussion is where the catalogue does use the
phrase, calling exfiltration prevention similar to data loss prevention — and SI-4 system
monitoring. Effectiveness depends heavily on classification: told which data is restricted, DLP
enforces a policy; told nothing, it falls back to regular expressions and generates false
positives on every invoice number that resembles a card.

**Key terms** exfiltration; content inspection; egress point; false positive; dependence on
classification.

#### Scenario

An engineer pushes a commit containing a live cloud API key to a public repository; the same
week analytics asks for a customer extract. Order the response. Rotate the exposed key
first — revoke it, issue a replacement — because deleting the commit leaves the blob in history
and in every existing clone. Then the extract: the warehouse grants access by job role, so
adding an analyst is an RBAC role assignment, but if the analyst can re-share that table at
their own discretion, the sharing step is DAC and the role model is not containing it. Before
the extract leaves, choose between pseudonymizing it, which keeps every GDPR duty attached, and
anonymizing it, which puts it outside GDPR; the answer turns on whether a row must ever be
linked back to a customer. Finally the egress DLP rule stops the file by inspecting content,
not address or port.

#### Knowledge check

1. A file's owner grants a colleague read access. Which access control model is that, and which
   model would have prevented it?
   DAC — the owner decides at their discretion. MAC would constrain it, because under mandatory
   policy a subject cannot pass access on regardless of ownership.
2. Why is RBAC the common organisational choice?
   Maintenance scale: permissions are defined once per role rather than once per user per
   object, so churn in headcount does not multiply into per-object grants.
3. A secret was committed to Git and removed in the next commit. Is the exposure closed?
   No. The blob survives in history and in every clone and fork. Rotating the credential is the
   only true remediation; rewriting history is cleanup afterwards.
4. What does a cryptoperiod bound, and why is bounding it useful?
   The time span a key is authorised for use — limiting it limits both the material available
   for cryptanalysis and the exposure if that single key is compromised.
5. Pseudonymized data and anonymized data: which is still personal data under GDPR?
   Pseudonymized data is, because the additional information needed to re-attribute it exists.
   Anonymous information falls outside the Regulation entirely under Recital 26.
6. Does data loss prevention prevent data loss in the backup sense?
   No — it prevents loss of control, meaning leakage and exfiltration. Availability loss is a
   backup and recovery problem, not a DLP one.

<a id="s-sensitive-data-lifecycle"></a>
## Lifecycle

<a id="c-security.sensitive-data.data-retention-and-disposal"></a>
### Data retention and disposal
*id: `security.sensitive-data.data-retention-and-disposal` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-88r2, nist-sp-800-53r5*

**What it is** A retention schedule states how long each category of data is kept and what
happens to it afterwards. NIST SP 800-53's SI-12 requires information to be managed and retained
in line with applicable laws, regulations and operational requirements; GDPR Article 5(1)(e)
supplies the privacy half as the storage limitation principle — personal data kept in
identifiable form no longer than is necessary for the purposes it is processed for.

**Why it matters** A retention rule has two edges pointing in opposite directions, and mixing
them up is the whole exam trap. Records and tax rules set a *floor*: keep this for seven years,
and deleting it early is the violation. Privacy rules set a *ceiling*: delete this once the
purpose is spent, and keeping it longer is the violation. A single dataset can be subject to
both, and the correct answer is almost never "keep everything indefinitely, just in case" —
that satisfies the floor while breaching the ceiling.

**How it works** Each category gets a retention period, a trigger that starts the clock, and a
disposition action at the end. A legal hold suspends the schedule: once a hold is in place for a
matter, the affected records must not be destroyed even if the schedule says their time is up,
and the hold overrides the schedule until it is lifted. At the end, disposition is not merely
deletion — SP 800-53's MP-6 requires media to be sanitized prior to disposal, release from
organisational control, or reuse, with strength commensurate with the security category, and NIST
SP 800-88 supplies the actual techniques.

**Key terms** retention schedule; storage limitation; disposition; legal hold; MP-6.

**Traps** Retention applies to copies, and backups are copies. Deleting a record from production
while it survives in a nightly backup and a warehouse extract means the retention obligation was
not met — the practical answer is usually to let the backup's own expiry age the copy out, since
surgical deletion inside backup sets is generally infeasible, and to say so explicitly rather
than pretend the record is gone. Second, a retention period is not a licence to keep data until
it expires: the storage limitation ceiling is "no longer than necessary," which can arrive well
before the schedule's maximum.

**What the exam may test** Given a scenario naming both a keep-for-N-years obligation and a
delete-when-no-longer-needed obligation, identifying which one governs the specific record;
recognising that a legal hold suspends deletion; and distinguishing the retention decision
(when) from the disposal method (how).

*Not to be confused with [data retention obligations](compliance.md#cmp-security.compliance.data-retention-obligations).*

<a id="c-security.sensitive-data.secure-deletion"></a>
### Secure deletion
*id: `security.sensitive-data.secure-deletion` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-88r2*

**What it is** Making data genuinely unrecoverable, as opposed to unlinking it. Deleting a file
with `rm` removes a directory entry and decrements the link count; the blocks holding the
contents stay on the device until something else reallocates them, which is why undelete and
forensic tools recover them routinely. Emptying a recycle bin, quick-formatting a volume and
repartitioning a disk are all the same class of non-erasure.

**Why it matters** This is the single insight the topic exists for: deletion is a namespace
operation, sanitization is a data operation, and an exam option that offers "delete the files"
as a disposal method for sensitive media is offering the wrong one. NIST SP 800-88 warns
specifically against methods that simply remove file pointers.

**How it works** SP 800-88 Rev. 2 defines three categories. Clear applies logical techniques
across all user-addressable locations, typically by rewriting through ordinary read and write
commands, and defeats simple non-invasive recovery. Purge applies physical or logical techniques
that render recovery infeasible against state-of-the-art laboratory techniques — overwrite,
block erase, and cryptographic erase issued through the device's dedicated sanitize commands.
Destroy renders recovery infeasible and leaves the media unusable for storage. Section 4.7.3
then calls for the result to be verified: a full read-back of all accessible areas, checking
that the expected sanitized value is in every addressable location, should be performed if time
and external factors permit, and otherwise verification is by representative sampling —
pseudorandom locations, chosen fresh each run, spread across both the user-addressable and the
reserved areas. Cryptographic erase is the Purge technique that destroys a self-encrypting
drive's media encryption key, leaving only ciphertext behind — fast, but only as trustworthy as
the drive's encryption implementation.

**Key terms** unlink; Clear, Purge, Destroy; cryptographic erase; full verification versus
representative sampling; over-provisioned blocks.

<a id="c-security.sensitive-data.data-breach-and-notification"></a>
### Data breach and notification
*id: `security.sensitive-data.data-breach-and-notification` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: gdpr-eurlex, nist-sp-800-61r3*

**What it is** A security failure touching protected data, usually carrying a legal duty to
tell somebody within a defined window. The two regimes scope it differently: GDPR Article 4(12)
defines a personal data breach as a breach of security leading to the accidental or unlawful
destruction, loss, alteration, unauthorised disclosure of, or access to personal data, so
losing it counts as well as leaking it, while HIPAA's definition at 45 CFR 164.402 turns on
acquisition, access, use or disclosure not permitted by the Privacy Rule. GDPR Article 33(1)
requires the controller to notify the competent supervisory authority without undue delay and,
where feasible, not later than 72 hours after becoming aware of the breach, unless it is
unlikely to result in a risk to people's rights and freedoms; a later notification must be
accompanied by reasons for the delay. Under 45 CFR 164.404(b), individuals affected by a breach
of unsecured protected health information are notified without unreasonable delay and in no
case later than 60 calendar days after discovery.

**Why it matters** Two boundaries decide most questions here. First, an incident is not
automatically a notifiable breach — NIST SP 800-61 Rev. 3 handles incident response as part of
Cybersecurity Framework 2.0 risk management, and whether a given incident must be reported is a
question the regime answers, not the incident-response process. Second, the clock starts at
awareness, not at intrusion — a compromise that went unnoticed for four months still starts its
72 hours the day it is discovered, and the deadline is a deadline to notify, not a deadline to
have finished remediating.

**How it works** GDPR splits the duty in two. The supervisory authority is notified under
Article 33; the affected data subjects are told separately under Article 34, and only when the
breach is likely to result in a *high* risk to their rights and freedoms. Article 34(3)(a)
excuses that individual communication where the controller had applied protective measures that
render the data unintelligible to anyone unauthorised, naming encryption as the example — which
is why encryption at rest changes the notification calculus and not just the exposure. HIPAA
sets its threshold as a presumption instead: an impermissible use or disclosure is presumed to
be a breach unless a risk assessment shows a low probability that the information was
compromised. Its regulator notification then scales by size under 45 CFR 164.408 — breaches
affecting 500 or more individuals go to the Secretary contemporaneously with the individual
notice, while smaller ones are logged and reported no later than 60 days after the end of the
calendar year.

**Key terms** supervisory authority; awareness as the trigger; high risk; unsecured PHI;
incident versus breach.

<a id="c-security.sensitive-data.backups-of-sensitive-data"></a>
### Backups of sensitive data
*id: `security.sensitive-data.backups-of-sensitive-data` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-53r5*

**What it is** A backup inherits everything about its contents: the same classification, the
same encryption requirement, the same access control, the same retention limit, the same
disposal obligation. NIST SP 800-53's CP-9 covers system backup and requires the
confidentiality, integrity and availability of backup information to be protected; its
cryptographic protection enhancement, CP-9(8), requires cryptographic mechanisms preventing
unauthorised disclosure and modification of backup information, and the discussion applies that
at both primary and alternate locations, with strength commensurate with the security category
or classification.

**Why it matters** The control travels with the data, not with the server, and backup targets
are where that is forgotten. An encrypted production database dumped nightly to an unencrypted
bucket has been downgraded to the weakest copy, and an attacker will take the weakest copy. The
same applies to access: a restricted dataset does not become internal because it is now a
tarball, and whoever can read the backup can read the data.

**How it works** Encrypt the backup independently of the source system, hold the backup keys
somewhere that survives the disaster the backup exists for — a key stored only on the machine
being backed up is not a key you have — and restrict who may restore, since a restore is a read
of the whole dataset. Keep backups inside the retention schedule too: a backup holding records
past their disposal date quietly reintroduces the data you were obliged to delete, so the
backup's expiry, not the production delete, is the real end of that record's life. And distinguish
a backup from an archive: a backup exists to recover a working system within a recovery point
objective, while an archive exists to hold data for long-term retention, and they take different
retention rules even when they sit on the same media.

**Key terms** CP-9; backup encryption keys; restore authorisation; recovery point objective;
archive versus backup.

#### Scenario

A database server holding eight-year-old customer records is being decommissioned under a
seven-year retention rule. Running `rm -rf` across the data directory unlinks the files and
sanitizes nothing, so disposal still has to happen: the drive is flash, so degaussing cannot be
relied on and a whole-device overwrite is unreliable because remapped and over-provisioned
blocks are not reachable through ordinary write commands — Purge via the device's own sanitize
command or cryptographic erase, then verify. Meanwhile the same records sit in nightly backups
whose ninety-day expiry is the real date they cease to exist, and one customer is under a legal
hold that suspends deletion entirely. Two months later an audit finds a snapshot was copied to
an unencrypted archive bucket: an exposure of restricted data, notifiable or not depending on
the regime and on who could have read it.

#### Knowledge check

1. A records rule says keep for seven years and a privacy rule says delete when no longer
   necessary. Which one is the floor and which the ceiling?
   The records rule is the floor — deleting early violates it. The privacy rule is the ceiling —
   keeping past necessity violates it. Both can bind the same dataset.
2. What does a legal hold do to a retention schedule?
   Suspends it. Records covered by the hold must not be destroyed even when the schedule says
   their period has expired, until the hold is lifted.
3. Why does `rm` not count as secure deletion?
   It removes the directory entry and drops the link count; the blocks remain on the device
   until reallocated, so the contents are recoverable.
4. Name NIST SP 800-88's three sanitization categories and say where cryptographic erase sits.
   Clear, Purge and Destroy. Cryptographic erase is a Purge technique — it destroys the media
   encryption key and leaves only ciphertext.
5. A breach is discovered on a Monday but the intrusion happened four months earlier. When does
   the GDPR 72-hour clock start?
   On becoming aware of it — Monday. The deadline is to notify the supervisory authority, not to
   have finished remediating.
6. Under GDPR, when must the affected individuals be told, as opposed to the regulator?
   Only when the breach is likely to result in a high risk to their rights and freedoms, and
   even then the communication is excused where measures such as encryption had rendered the
   data unintelligible to anyone unauthorised.
