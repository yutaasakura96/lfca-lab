<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# Drill — Security Fundamentals :: Security

82 question(s), every question in the bank for this scope, in concept order.

Answers follow each question, so this is study material rather than a timed test.

---

### 1.

An engineer with legitimate database access quietly exports a customer table over several weeks. No authentication or authorization control was ever bypassed. Which control is positioned to detect this, and why can the first two As of AAA not catch it by design?

- **A.** Multi-factor authentication, because a stronger login would have stopped the export before any rows left the database.
- **B.** Authorization, because a permission check is re-evaluated on every row a query returns and would have failed partway through the export.
- **C.** Accounting and auditing, because authentication and authorization only judge whether access is granted, not what a legitimately admitted identity then does with it.
- **D.** Nothing in AAA addresses this; only network segmentation placed between the analyst and the database can detect a slow export.

**Answer: C.** Accounting is the only one of the three As that produces evidence of what an authenticated, authorized identity actually did. It is what makes an insider's legitimate-access misuse reconstructable, since authentication and authorization have already been satisfied and cannot flag it themselves.

- A is wrong: MFA strengthens proof of identity at login; it does nothing once a legitimately authenticated identity is already acting.
- B is wrong: Authorization decides access at the point of the request and is not re-run per row, so it never notices a pattern of legitimate reads accumulating over weeks.
- D is wrong: Accounting exists precisely to catch what preventive access controls cannot, so the AAA triad is not blind to this case.

### 2.

After an unauthorised change is discovered, a manager proposes "enable auditing" as the fix that prevents it from happening again. What is wrong with that framing?

- **A.** Auditing is a detective control; it can establish that the change happened but cannot itself have stopped it, so the preventive fix is an authorization change.
- **B.** Nothing is wrong; enabling auditing is itself a preventive control, because a system that is watching refuses any action it cannot attribute.
- **C.** Auditing is wrong here because the correct fix is always multi-factor authentication, which re-checks the operator's identity before each write.
- **D.** Auditing is wrong because the real gap was in encryption at rest, which would have made the stored record unwritable without the key.

**Answer: A.** Accounting is a detective control: it establishes that an action occurred and by whom, but it cannot itself prevent the action. The preventive remedy for an unauthorised change is tightening authorization, not enabling more logging around it.

- B is wrong: This is precisely the misconception the guide warns against: accounting only ever establishes that an action occurred, never stops it.
- C is wrong: MFA strengthens login proof and does not address an authorization problem, which is what an unauthorised change actually is.
- D is wrong: Encryption at rest protects stored data from being read by someone who obtains the medium; it does not decide who may change a record, which is what an unauthorised change turns on.

### 3.

A server has written detailed access logs for a year, but nobody has ever reviewed them. Has the organisation been auditing its access?

- **A.** Yes — the mere presence of the logs constitutes auditing regardless of whether anyone reads them.
- **B.** Yes, because writing the logs already satisfies the authentication requirement for the account that generated them.
- **C.** No. Recording the events is accounting; auditing is the review activity, and records nobody reviews detect nothing.
- **D.** No, and the fix is to encrypt the log files rather than to schedule a review.

**Answer: C.** Accounting produces the record; auditing is the act of reviewing it. A year of unread logs demonstrates that accounting worked, but auditing — the review that actually detects misuse — never happened.

- A is wrong: The guide states this directly as a trap: the presence of logs is not auditing, since unreviewed records detect nothing.
- B is wrong: Authentication concerns proving identity at login and has no bearing on whether records are later reviewed.
- D is wrong: Encrypting the logs protects their confidentiality but does not make anyone examine them, which is the actual gap.

### 4.

A host runs a database listener that no application actually uses. Between removing the listener, patching it, and filtering access to it with a firewall rule, which action reduces attack surface the most, and why?

- **A.** Patching it, because an up-to-date service is no longer part of the attack surface.
- **B.** Filtering it with a firewall rule, because that removes the installed surface just as effectively as uninstalling it.
- **C.** None of the three matters — nothing can be reduced until a vulnerability scan identifies a specific CVE in the listener.
- **D.** Removing the listener, because it eliminates the exposure entirely including flaws nobody has discovered in it yet.

**Answer: D.** Attack surface is the total set of points an attacker can interact with, and it is the one quantity reducible without knowing about a specific flaw. Removing an unused service eliminates its exposure entirely, including future vulnerabilities, while patching addresses only a named defect and filtering only reachability.

- A is wrong: Patching fixes one known flaw in software that keeps running, so the exposure remains and the next undiscovered flaw still affects it.
- B is wrong: A firewall rule reduces reachable surface without reducing installed surface — the service is still present if the rule is ever wrong.
- C is wrong: Attack surface can be reduced without knowing about any specific flaw; waiting for a named CVE is not required to act.

### 5.

A CVE is published for a package installed on your fleet. What separates the attack-surface question from the vulnerability-and-patching question raised by this event?

- **A.** There is no real difference; reducing attack surface and patching a CVE are two names for the same remediation.
- **B.** Attack surface asks how much is exposed at all, independent of any particular defect; patching addresses this one named defect specifically.
- **C.** Attack surface concerns confidentiality only, while a CVE and its patch always concern availability.
- **D.** Attack surface is measured by a vulnerability scanner, while a CVE is only ever found by an intrusion detection system.

**Answer: B.** Attack surface counts every reachable point regardless of whether any specific flaw is known there, and it can be enumerated today. Vulnerability and patch management concerns a specific, catalogued defect discovered in what remains exposed. Reducing surface removes future flaws too; a patch only ever fixes the one it addresses.

- A is wrong: The guide draws this comparison precisely because the exam tests the difference: removing exposure and fixing one named flaw are not interchangeable.
- C is wrong: Neither attack surface nor vulnerability management is tied to one CIA leg; a given flaw can affect any of the three.
- D is wrong: A scanner finds known weaknesses including CVEs; an IDS detects live activity, not defects catalogued in advance.

### 6.

Which of the following is part of a system's attack surface?

- **A.** An enabled account that can still log in even though the person who used it left the team last year.
- **B.** A CVE severity score published for a package the host has never installed.
- **C.** The retention period configured for the organisation's nightly backups.
- **D.** The six-step order an incident responder follows once an intrusion is confirmed.

**Answer: A.** Attack surface is the total set of points an attacker can attempt to interact with — listening ports, exposed endpoints, installed packages, and enabled accounts among them. A stale but still-active account is exactly this kind of point, whether or not anyone currently uses it.

- B is wrong: A score for software that is not present does not touch this host's attack surface at all; nothing here is reachable.
- C is wrong: A retention setting governs how long recoverable copies persist and is not a point an attacker can interact with directly.
- D is wrong: A response procedure describes what happens after compromise, not a point of possible entry beforehand.

### 7.

A user's browser receives a `401 Unauthorized` response, and a colleague reads that as an authorization failure. What is the correct reading, and which of the two processes must succeed before the other can even be evaluated?

- **A.** `401` means authorization failed, since the status name says "Unauthorized" directly.
- **B.** `401` means authorization failed, and authorization is always evaluated first because it determines whether a login prompt is shown.
- **C.** `401` means authentication failed, and authentication must succeed before authorization is evaluated at all.
- **D.** `401` reports an accounting failure, since the server could not record who made the request, though accounting has no HTTP status code of its own to report through.

**Answer: C.** Authentication establishes identity and always runs first, because authorization has nothing to evaluate until a subject is known. HTTP's status codes invert the intuitive reading: `401 Unauthorized` is a failed authentication, while `403 Forbidden` is an authenticated request that authorization still refuses.

- A is wrong: This is the naming trap the guide calls out explicitly: `401` is the missing-credentials code, not the permissions code.
- B is wrong: Authorization has nothing to evaluate until an identity exists, so it cannot run before authentication regardless of the status code involved.
- D is wrong: Accounting is the third A of AAA and records what happened after access is decided; it has no HTTP status code of its own.

### 8.

Authentication, accounting and auditing, and multi-factor authentication are often offered as alternatives to one another. Which axis actually separates them?

- **A.** How strong each is: accounting is the weakest of the three, authentication is moderate, and MFA is the strongest because it checks more than one factor.
- **B.** What each costs to deploy — MFA is the most expensive, authentication moderate, and accounting the cheapest because it only writes log lines.
- **C.** When each acts: authentication decides access before it is granted, accounting records what happened afterwards, and MFA strengthens the authentication step rather than adding a further stage.
- **D.** How widely each is scoped: authentication covers a single system, accounting covers a whole organisation, and MFA covers only privileged accounts.

**Answer: C.** The named comparison block separates authentication/authorization, accounting and auditing, and multi-factor authentication by timing: the first pair is preventive and acts before and during access, accounting is detective and acts afterward from records, and MFA is not a fourth A at all — it strengthens the authentication step itself.

- A is wrong: Accounting is not a weaker authentication — it answers a different question entirely, recording what an already-admitted identity did rather than deciding whether to admit it.
- B is wrong: Deployment cost does not distinguish them; each answers a different question and acts at a different moment relative to the access decision.
- D is wrong: Scope of rollout is a deployment choice, not a property of the controls; all three can apply to any account on any number of systems.

### 9.

"Root can do anything on this box" is a statement about which of the two processes, and does root still have to complete the other one first?

- **A.** It is an authorization statement, and root still has to authenticate before that authorization ever applies.
- **B.** It is an authentication statement, since being root proves who the user is without any further check.
- **C.** It is an accounting statement, describing what root has already done on the system.
- **D.** It is neither, since root bypasses both authentication and authorization by design on a Linux system.

**Answer: A.** Unlimited permission describes what an identity may do once known, which is authorization. Authentication — proving that the identity really is root — is a separate, prior step that the statement takes for granted rather than replaces.

- B is wrong: This is the second trap the guide names directly: unlimited permission is an authorization property, not proof of identity.
- C is wrong: Accounting records actions taken after access, whereas this statement describes what root is permitted to do, not a log of what it did.
- D is wrong: Root still authenticates like any other account; what differs is the breadth of what authorization then grants it.

### 10.

A team enables account lockout after five failed logins to defend against credential stuffing. Logs later show the attack made only one or two attempts per account across thousands of different accounts. Why did lockout fail, and what would actually stop this?

- **A.** Lockout worked correctly here, and the low per-account attempt count only proves the attack was unsuccessful, when stuffing makes about one or two attempts per account and lockout also opens a denial-of-service vector against real users.
- **B.** Lockout never approached its threshold because stuffing makes few attempts per account; MFA is the defence that covers stuffing because a correct password stops being sufficient.
- **C.** Lockout failed because the passwords involved were too weak, and a stronger complexity policy is the actual fix.
- **D.** Lockout failed because this was actually phishing, and user awareness training is the fix instead.

**Answer: B.** Credential stuffing tests username-password pairs already known to be valid from another breach, making roughly one or two attempts per account, so it never approaches a lockout threshold and also creates a denial-of-service vector against real users if lockout is relied on. MFA is the defence that covers brute force, stuffing, and spraying alike, because it removes the sufficiency of a correct password alone.

- A is wrong: The guide states lockout is the reflexive but wrong answer for stuffing and spraying specifically because those attacks stay under any lockout threshold by design.
- C is wrong: Strong password policies do nothing against credential stuffing when the reused password was already strong; checking candidates against known-breached lists is what addresses reuse.
- D is wrong: Credential stuffing replays credentials the attacker already possesses and requires no action from the victim, unlike phishing, which needs the user to hand over a credential.

### 11.

Brute force and credential stuffing are compared against phishing as a pair. Which axis does the guide use to separate them?

- **A.** Who supplies the credential: the attacker derives or replays it themselves in one case, and the account holder hands it over in the other.
- **B.** Which one targets a database versus which one targets an operating system.
- **C.** Which one is automated versus which one is always performed manually by a person.
- **D.** Which one is stopped by rate limiting versus which one is stopped only by patching software, since a login endpoint that has been patched can no longer be automated against at any request rate.

**Answer: A.** The separating axis is who supplies the credential: an attacker guesses or replays it themselves in brute force and credential stuffing, with the victim unaware throughout, while phishing requires the victim to actively hand the credential over. That difference is why one is fought with rate limits and breached-password checks and the other with training.

- B is wrong: Neither attack is defined by which layer of a system it targets; both can be aimed at any login surface regardless of what sits behind it.
- C is wrong: Both brute force and stuffing are automated at scale, and phishing campaigns are frequently automated too; automation level is not the table's separating property.
- D is wrong: Neither attack is defeated by patching software; the guide names MFA, rate limiting and breached-password checks for one side and user awareness for the other.

### 12.

OWASP separates brute force, credential stuffing, and password spraying as three distinct attacks. What actually differs between password spraying and the other two?

- **A.** Spraying tests one weak password against many different accounts, rather than many passwords against one account or replaying known-valid pairs.
- **B.** Spraying is the only one of the three that does not require any guessing at all.
- **C.** Spraying is the only one of the three that targets a single account exhaustively, working an entire wordlist against one high-value login while the other two spread their attempts across a whole user base.
- **D.** Spraying is the only one of the three defeated by a strong password policy alone.

**Answer: A.** OWASP's three related credential attacks differ in how attempts are spread: brute force tests many passwords against one account, credential stuffing replays known-valid pairs from another breach, and password spraying tests one weak password against a large number of different accounts, which is what lets it hide inside normal login traffic.

- B is wrong: Spraying and brute force both guess; only credential stuffing replays credentials already known to be valid rather than guessing.
- C is wrong: Exhaustively targeting a single account describes brute force; spraying deliberately spreads a single guess across many accounts instead.
- D is wrong: MFA is named as the defence covering all three attacks; a strong password policy alone does not reliably stop any of them, spraying included.

### 13.

A browser reports a certificate problem on a service that changed in no other way overnight. The certificate's `notAfter` date is still weeks away, but the hostname in the certificate does not match the address requested. What is the correct fix, and is renewal the right one?

- **A.** Reissue the certificate with the correct name; renewal alone would not fix a hostname mismatch, since the dates were never the problem.
- **B.** Renew the certificate, since every certificate warning is ultimately an expiry problem regardless of what the browser reports.
- **C.** Install the missing intermediate certificate, since that is always the cause when the leaf certificate itself looks otherwise correct, and a gap in the chain is what makes a browser report the presented name as unrecognised.
- **D.** Correct the client's clock, since a skewed clock is the most common cause of a certificate warning.

**Answer: A.** Expiry, a hostname mismatch, an untrusted or incomplete chain, and clock skew all produce browser warnings that look alike to a user but need different fixes: renew, reissue with the correct name, install the CA or missing intermediate, or correct the clock respectively. A mismatch specifically needs reissue, since the dates were never the fault here.

- B is wrong: Renewing fixes expiry and nothing else; the guide is explicit that several distinct validation failures produce a similar warning and each needs its own fix.
- C is wrong: A missing intermediate is one distinct cause among several, but the symptom described — the requested name not appearing in the certificate — points specifically at a hostname mismatch, not a broken chain.
- D is wrong: Clock skew produces a warning about the validity window, not about the hostname the certificate presents, so it does not match the symptom described here.

### 14.

A certificate expires at midnight and the connection begins failing outright at that moment. Has the data crossing that connection become unencrypted?

- **A.** Yes, since an expired certificate can no longer perform any cryptographic operation.
- **B.** Yes, because expiry automatically reverts the connection to the deprecated SSL protocol as a fallback, and SSL performs no validity check of its own, so the session continues under the keys already agreed.
- **C.** This cannot be determined without first checking whether the certificate authority itself has been compromised.
- **D.** No. An expired certificate still encrypts perfectly well; what has failed is trust, and the client refuses the connection rather than downgrading it.

**Answer: D.** Expiry is entirely predictable and is the most common cause of a sudden, total outage, but it is a failure of trust, not of cryptography. An expired certificate still encrypts perfectly well; the client simply refuses to proceed because it can no longer vouch for the identity behind the connection.

- A is wrong: The guide states directly that this is the wrong reading of the warning; encryption is unaffected by expiry, only trust in the certificate is.
- B is wrong: There is no automatic protocol downgrade on expiry; a client that rejects an expired certificate simply refuses to connect at all.
- C is wrong: CA compromise is a separate, unrelated failure; an ordinary expiry needs no such investigation to explain the outage.

### 15.

A distributed denial-of-service attack takes a public web service offline for six hours. Investigators confirm no record was read or altered. Which leg of the CIA triad was violated, and is this properly classified as a security incident?

- **A.** Nothing was violated — no confidentiality or integrity breach occurred, so the outage is purely an operations matter.
- **B.** Availability was violated; yes, an attack-caused outage is a security incident even though nothing was read or changed.
- **C.** Integrity was violated, because the service being unreachable means its data can no longer be trusted.
- **D.** Confidentiality was violated, since an outage prevents authorised parties from confirming their data is still private.

**Answer: B.** The CIA triad classifies a described incident onto confidentiality, integrity or availability. A denial-of-service attack denies availability specifically, and because availability is itself a security property, the resulting outage counts as a security incident rather than only an operational one.

- A is wrong: This is exactly the hesitation the exam exploits: availability is a CIA leg, so an attack-caused outage is a security incident on its own terms.
- C is wrong: Integrity concerns undetected alteration of data; an outage with no record touched does not put integrity in question.
- D is wrong: Confidentiality concerns unauthorised reading, which an outage with no data accessed does not involve.

### 16.

An unencrypted nightly backup restores a deleted table correctly after a fault. Which CIA property did the restoration itself demonstrate, and which property does the backup's lack of encryption still leave exposed?

- **A.** The restore demonstrated confidentiality; encryption of the backup file is irrelevant once the restore succeeds.
- **B.** The restore demonstrated integrity and availability; the unencrypted backup leaves confidentiality exposed.
- **C.** The restore demonstrated availability only; a backup is never an integrity control regardless of encryption.
- **D.** The restore demonstrated authentication and authorization, since only a permitted operator could run it.

**Answer: B.** A backup restore serves availability (the service returns) and integrity (the data is known-good), which is exactly why the guide names it an availability-and-integrity control. It is not automatically a confidentiality control, and an unencrypted backup file continues to expose confidentiality even after a clean restore.

- A is wrong: A successful restore says nothing about confidentiality, and the guide is explicit that an unencrypted backup weakens exactly that leg.
- C is wrong: The guide states a backup restores known-good data and is therefore both an availability and an integrity control.
- D is wrong: Authentication and authorization are not legs of the CIA triad; they belong to the separate AAA trio.

### 17.

A service already sits behind a network firewall. A proposal adds a host firewall on the machine itself. What determines whether this counts as a genuine second layer of defense in depth?

- **A.** Whether the two run identical rule sets, since matching rules guarantee the second firewall enforces everything the first one does.
- **B.** Whether the two fail independently: if a misconfiguration or bypass of the network rule still leaves the host rule enforcing, it is a real second layer.
- **C.** Whether the second firewall sits on a different host — defense in depth counts layers by the number of machines involved.
- **D.** Whether the host firewall improves availability, since layering is only ever a redundancy measure for uptime.

**Answer: B.** Defense in depth is layering independent controls so no single failure exposes the asset. A host firewall enforcing at the machine itself fails for reasons distinct from a network-edge misconfiguration, which is exactly the independence the practice requires — unlike two firewalls duplicating the same rule set at the same boundary.

- A is wrong: Identical mechanisms are precisely what makes the extra protection illusory — SP 800-53r5 states that if the mechanisms are similar the adversary can simply attack them in series.
- C is wrong: Layers are counted by independent failure modes, not by machines; two hosts enforcing the same flawed rule fall together.
- D is wrong: Layering addresses resistance to compromise rather than uptime, and a firewall can serve confidentiality, integrity or availability depending on what it filters.

### 18.

A user's login requires a password and a security question. Why does this fail to count as a second layer of defense in depth even though two credentials are checked?

- **A.** It does count, since checking two separate pieces of information is exactly what defense in depth means.
- **B.** It fails because a security question violates least privilege by granting more access than the task requires.
- **C.** It fails because security questions are a form of biometric authentication, which is inherently unreliable as a second factor.
- **D.** Both are "something you know," so they fall to the same disclosure and share a failure mode rather than failing independently.

**Answer: D.** Defense in depth requires layers to fail for different reasons. A password and a security question are both "something you know" and both fall to the same kind of disclosure, so duplicating the check does not add independence — it duplicates one layer rather than adding a second.

- A is wrong: Counting layers by number of checks rather than by independence of failure is the error the guide's comparison exists to correct.
- B is wrong: Least privilege is about how much authority an identity holds once admitted, not about how login credentials are structured.
- C is wrong: A security question is a knowledge factor, not a biometric, and the objection here is about shared failure mode rather than factor type.

### 19.

A distributed flood of traffic from thousands of source addresses overwhelms a service's connection capacity. Blocking the single loudest source IP does nothing. What does the distributed nature of the attack rule out as a response?

- **A.** Restoring from backup, since a DDoS always corrupts the underlying data alongside exhausting capacity, and the half-written records left behind by dropped connections have to be rolled back before the service can return.
- **B.** Blocking a single source address, since a DDoS has no one address whose removal stops the flood; scrubbing, rate limiting, and added capacity are the distributed answers.
- **C.** Patching the service, since the flood must be exploiting a specific software vulnerability.
- **D.** Enabling full disk encryption, since encrypted storage resists resource exhaustion attacks.

**Answer: B.** Blocking the source IP is a valid response to a single-source denial of service, but a distributed attack has no single address whose removal stops it — upstream scrubbing, rate limiting, and added capacity are the distributed answers. Confidentiality and integrity may remain entirely intact throughout, so a data-recovery response does not apply.

- A is wrong: A denial of service is not a data breach; confidentiality and integrity may be entirely intact, so a restore from backup is not the relevant response to a pure availability attack.
- C is wrong: Volumetric and amplification-based denial of service exhausts resources through traffic volume, not through exploiting a named defect that patching would fix.
- D is wrong: Disk encryption protects data confidentiality at rest and has no bearing on a network capacity or connection exhaustion attack.

### 20.

A denial-of-service attack and a ransomware attack are compared as a pair. Which axis actually separates the two, according to the guide's comparison?

- **A.** Severity — denial of service is always classified as more severe than ransomware because it affects availability directly.
- **B.** Duration — a denial of service always lasts longer than a ransomware incident.
- **C.** Whether anything runs on the victim host, since a denial of service overwhelms from outside without executing there, while malware requires code on the host by definition.
- **D.** Attribution — denial-of-service attackers are always anonymous, while ransomware attackers always identify themselves for payment, which is why only the second of the two is ever recorded as a security incident.

**Answer: C.** The comparison's separating axis is whether anything runs on the victim host: a denial of service overwhelms a system from outside without executing on it, while malware and ransomware require code on the host and therefore leave the data itself in question in a way pure traffic exhaustion does not.

- A is wrong: The comparison does not rank the two by severity; it separates them by whether code executes on the victim, and ransomware also affects availability once files are encrypted.
- B is wrong: Duration is not the property the table tracks; both can last from minutes to weeks depending on the response, and the axis is about what runs where, not how long it takes.
- D is wrong: Attacker identification practices vary case by case for both attack types and are not the axis the comparison table is built around.

### 21.

A browser accepts a self-signed certificate presented by an internal tool, and traffic to it is fully encrypted. A developer argues the warning was pointless since encryption is working. What does the certificate authority actually add that a self-signed certificate lacks?

- **A.** Third-party attestation that the public key really belongs to the named host; a self-signed certificate encrypts exactly as well, but nothing vouches for the binding.
- **B.** Stronger encryption, since a CA-issued certificate always uses a longer key than a self-signed one, because the issuing CA replaces the requested public key with one drawn from its own approved key sizes.
- **C.** Proof that the site's operator is honest and the content served is trustworthy.
- **D.** A guarantee that the connection will never expire or need renewal.

**Answer: A.** A certificate binds a public key to an identity, and a CA vouches for that binding by signing it. A self-signed certificate encrypts a connection exactly as well as a CA-issued one — what it lacks is a third party the client already trusts attesting that the key really belongs to the claimed name, which is why browsers warn about it.

- B is wrong: Key strength is independent of who signs the certificate; a self-signed certificate can use exactly the same key length as a CA-issued one.
- C is wrong: A CA attests that a public key belongs to a named host, not that the host's operator or content deserves the visitor's trust.
- D is wrong: Every certificate, self-signed or CA-issued, carries a validity window and eventually needs renewal; a CA does not remove that requirement.

### 22.

A certificate chain runs from a leaf certificate through an intermediate CA to a root certificate that signed itself. Why does the client still trust that root?

- **A.** Because a root certificate's self-signature is cryptographically stronger than any other signature in the chain, when a self-signature proves nothing about the signer's honesty regardless of how the signature itself is constructed.
- **B.** Because TLS 1.3 automatically re-verifies every root certificate against a central registry during the handshake.
- **C.** Because the intermediate CA's signature alone is sufficient, and the root is not actually checked.
- **D.** Because the root is already present in the client's trust store as a trust anchor, not because of its own self-signature.

**Answer: D.** A root certificate's trust does not come from its own signature — it signed itself, which proves nothing on its own. It comes from being a trust anchor already present in the operating system's or browser's trust store; a chain that terminates anywhere else fails no matter how well-formed it is.

- A is wrong: Self-signing is not a stronger form of signature; the root's authority comes entirely from being pre-installed as a trust anchor, not from the signature's mathematics.
- B is wrong: TLS validates the chain against certificates already in the local trust store; it does not consult a central registry during the handshake.
- C is wrong: Validation walks the whole chain up to a trust anchor; a chain that never reaches one already in the store fails, however well-formed the intermediate signature is.

### 23.

A service enables HTTPS on its public endpoint. Does that protect a stolen backup tape holding the same data?

- **A.** Yes, because encrypting the connection also encrypts every copy of the data that connection ever carried, including anything later written to disk from it.
- **B.** No, because HTTPS protects data crossing the network, and a stolen backup tape is a data-at-rest exposure that a separate control must cover.
- **C.** Yes, because TLS certificates also authenticate whoever physically holds the backup media.
- **D.** No, but only because the backup was compressed rather than encrypted, which is a separate deficiency.

**Answer: B.** Encryption at rest protects stored data — disks, backups, object storage; encryption in transit protects data moving across a network. HTTPS on a public endpoint says nothing about whether a backup tape is encrypted, since the two controls address separate exposures and neither substitutes for the other.

- A is wrong: The guide states directly that HTTPS on the front end does nothing for a stolen backup tape; the two controls do not overlap that way.
- C is wrong: A TLS certificate authenticates a network peer during a connection; it has no bearing on who later holds a piece of offline storage media.
- D is wrong: Compression status is unrelated to the actual gap here, which is that encryption in transit and encryption at rest are two distinct controls, neither implying the other.

### 24.

A finance application runs on a fully patched host with LUKS-encrypted disks and HTTPS on every connection. An attacker exploits an application bug and reads live records from memory. Which exposure was neither control designed to address?

- **A.** Data at rest, since the LUKS volume should have prevented any process from reading its contents.
- **B.** Data in transit, since the application bug must have exposed the TLS session key over the network, though nothing in the scenario describes interception of network traffic, only a compromise reading memory directly on the host itself.
- **C.** None — HTTPS plus LUKS together cover every stage data passes through.
- **D.** Data in use, since a compromised running process reads the unlocked filesystem and live memory normally, and neither at-rest nor in-transit encryption applies there.

**Answer: D.** Encryption at rest and encryption in transit are two separate controls, and both stop short of data being actively processed. A compromised running application reads the unlocked filesystem and live memory as any permitted process would, which is why data in use is the exposure neither control was built to close.

- A is wrong: Full disk encryption protects data when the volume is locked or the hardware is lost; once the volume is unlocked and the system is running, files are readable to permitted processes as normal.
- B is wrong: Nothing in the scenario describes a network interception; the compromise reads memory directly on the host, which is outside what in-transit encryption covers in either case.
- C is wrong: The pair covers storage and network transit specifically, and the guide names a third stage, data in use, that neither one reaches.

### 25.

A strong perimeter firewall protects a flat internal network. Once an attacker gets past that perimeter, what stops them from reaching every other host inside?

- **A.** The same perimeter firewall, since its rule set is re-evaluated continuously against every internal connection too, with each host-to-host flow inside the network hairpinned back through it for inspection.
- **B.** On a flat network, nothing; segmentation is the control that limits lateral movement once inside, and the perimeter firewall alone does not provide it.
- **C.** Full disk encryption on each host, since an encrypted disk cannot be reached from elsewhere on the network.
- **D.** SSH hardening on the perimeter firewall's own management interface.

**Answer: B.** A firewall decides what may cross the boundary it sits on; segmentation decides how many boundaries exist to cross at all. A strong perimeter firewall around a flat internal network still leaves an attacker who gets past it free to move laterally, which is the specific failure zero trust and segmentation both respond to.

- A is wrong: A perimeter firewall filters what crosses the boundary it sits on; it does not by itself constrain traffic moving between hosts already inside a flat network.
- C is wrong: Full disk encryption protects data if the physical device is lost; it has no bearing on whether a running, unlocked host is reachable over the network.
- D is wrong: Hardening the firewall's own management access protects that one device; it does nothing to stop lateral movement between other hosts once an attacker is already inside.

### 26.

A stateful firewall permits an outbound connection from an internal host to a remote service. Does it need a separate inbound rule to allow that service's response traffic back in?

- **A.** Yes, since every direction of traffic always needs its own explicit rule regardless of the firewall's design.
- **B.** No, since a stateful firewall tracks connection state and allows return traffic for a permitted outbound flow without a separate inbound rule.
- **C.** No, but only because the internal host is also segmented into its own network zone.
- **D.** Yes, unless the connection uses TLS, in which case the encrypted channel bypasses the firewall's rules entirely, when stateful tracking already admits return traffic for a permitted flow regardless of whether that traffic happens to be encrypted under TLS.

**Answer: B.** Rules are written default-deny — permit what is required, drop everything else — and a stateful firewall tracks connection state so return traffic for a permitted outbound flow is allowed automatically, without a separate inbound rule having to mirror it.

- A is wrong: That describes a stateless design; a stateful firewall tracks the connection and admits the matching return traffic without a mirrored inbound rule.
- C is wrong: Segmentation and stateful tracking are separate mechanisms; return traffic for a permitted flow is admitted by the stateful property itself, independent of zoning.
- D is wrong: TLS encrypts the payload but does not exempt the connection from firewall filtering, and stateful tracking already handles return traffic without needing this exception.

### 27.

A laptop with a LUKS-encrypted disk is stolen while powered off. What does full disk encryption actually protect here, and is the running-and-unlocked case the same?

- **A.** It protects the data equally in both states, since LUKS encrypts continuously regardless of whether the volume is unlocked, when an unlocked volume leaves its files readable to any permitted process exactly as an unencrypted one would.
- **B.** It protects the network traffic the laptop last sent, in addition to the stored files.
- **C.** It protects only the LUKS header, not the data volume itself.
- **D.** It protects the data because the volume is locked without the key; while the machine was running and unlocked, the same files were readable to any permitted process.

**Answer: D.** Full disk encryption survives the physical loss of powered-off, locked hardware — a stolen laptop yields nothing without the passphrase. It does not extend to a machine that is running with the volume already unlocked, where files remain readable to any process with the right permissions.

- A is wrong: Once unlocked, the volume's files are readable as normal to permitted processes; encryption at rest specifically addresses the powered-off, locked case, not a running unlocked one.
- B is wrong: Full disk encryption is a storage control; it has no bearing on data that already crossed the network, which is encryption in transit's domain.
- C is wrong: The header wraps the volume key that protects the actual data; both matter, but the encryption's purpose is protecting the data volume, not merely the header in isolation.

### 28.

A LUKS volume's header is accidentally overwritten during a disk operation. No header backup was ever taken, the volume is not currently open, and the correct passphrase is still known. What is the state of the data?

- **A.** Unrecoverable, because the header holds the wrapped volume key, and destroying it makes the data unreadable even with the correct passphrase.
- **B.** Fully recoverable, since the correct passphrase alone is sufficient to derive the volume key directly from the encrypted data, because the key derivation is seeded from the first encrypted sector rather than from anything the header held.
- **C.** Unrecoverable, but only because a second key slot would have been needed regardless of the header's condition.
- **D.** Recoverable by restoring from a nightly database backup instead of the encrypted volume.

**Answer: A.** Each LUKS key slot holds the volume key wrapped by a passphrase-derived key, and the volume key itself lives in the header. Destroying or overwriting the header removes what any passphrase would unwrap, which is why header backups are treated as part of the practice, not an optional extra.

- B is wrong: The passphrase-derived key only unwraps the volume key held in the header; it cannot derive that key directly from the encrypted data once the header is gone.
- C is wrong: Additional key slots let more than one passphrase unlock the same volume; they do not change the fact that losing the header itself is what makes any passphrase useless.
- D is wrong: A separate backup might independently hold the data, but that does not change the state of this LUKS volume itself, which is what the question asks about.

### 29.

A publisher lists SHA-256 digests for a downloaded ISO. Which command checks the local file against that list, and what does a match actually prove?

- **A.** `md5sum -c SHA256SUMS`, which is interchangeable with `sha256sum` since both compute a digest
- **B.** `sha256sum -c SHA256SUMS`, which proves only that the bytes received match the bytes that were hashed, nothing about who produced them
- **C.** `gpg --verify SHA256SUMS`, which confirms the file's contents are correct without needing a signature
- **D.** `sha256sum -c SHA256SUMS`, which proves the publisher themselves produced the file and not an impersonator, because a digest list of this kind can only be generated by whoever holds the publisher’s release key.

**Answer: B.** `sha256sum -c` compares a locally computed digest against a file of previously recorded ones and reports OK or FAILED per entry. A match tells you the bytes you received are the bytes that were hashed — integrity — but says nothing about who produced them, since a digest carries no signature and no key.

- A is wrong: `md5sum` computes MD5 digests, not SHA-256, and MD5 is broken for collision resistance; it would not correctly validate a SHA256SUMS file at all.
- C is wrong: `gpg --verify` checks a cryptographic signature against a key, a different operation from comparing digests, and it requires an actual signature file to check against.
- D is wrong: A checksum proves only that the bytes match a value; it says nothing about who produced that value, which is what a signature is for.

### 30.

A support ticket asks for a file to be "decrypted" from its SHA-256 hash so the original contents can be recovered. What is wrong with the request?

- **A.** The request is valid, but only `md5sum` supports reversal, not `sha256sum`.
- **B.** There is no such operation; hashing has no key and is one-way by construction, so the original input cannot be recovered from the digest.
- **C.** The request is valid if the correct salt is supplied along with the digest.
- **D.** The request is valid, since `gpg --verify` can recover the original file from a signed digest, because the signature packet embeds a compressed copy of whatever was signed alongside the digest itself.

**Answer: B.** A hash is a one-way function: the same input always produces the same fixed-length digest, but there is no operation, key, or salt that recovers the input from the digest. "Decrypt the hash" describes something hashing was never designed to do.

- A is wrong: Neither MD5 nor SHA-256 is reversible; both are one-way hash functions regardless of which is used.
- C is wrong: A salt applies to password hashing to prevent identical inputs producing identical outputs; it does not make any hash function reversible.
- D is wrong: `gpg --verify` checks a signature against a file; it has no capability to reconstruct a file's contents from a hash of it.

### 31.

A study note attributes the six-step prepare-identify-contain-eradicate-recover-learn sequence to NIST SP 800-61. Is that attribution correct?

- **A.** No. That six-step sequence is SANS's model, commonly abbreviated PICERL; no revision of NIST SP 800-61 has ever published it.
- **B.** Yes, and it has appeared unchanged in every revision of NIST SP 800-61 since it was first published.
- **C.** Yes, because NIST SP 800-61 Rev. 3 renamed its four-phase lifecycle into these exact six steps in 2025.
- **D.** No, because the six-step sequence actually comes from the CIA triad's own incident classification scheme, which NIST later adopted wholesale into the Rev. 3 lifecycle.

**Answer: A.** The six-step prepare, identify, contain, eradicate, recover, learn sequence — commonly abbreviated PICERL — is SANS's model. NIST SP 800-61 Rev. 2 used a distinct four-phase lifecycle, and Rev. 3 (April 2025) replaced that with the six CSF 2.0 Functions, a different six-item list built around cybersecurity risk management broadly rather than one incident's tactical handling.

- B is wrong: This misattribution is exactly what the guide flags as routinely made; the six-step sequence is SANS's PICERL, not a NIST SP 800-61 model at any revision.
- C is wrong: Rev. 3 replaced the four-phase lifecycle with the six CSF 2.0 Functions — Govern, Identify, Protect, Detect, Respond, Recover — a different six-item list from PICERL, not a renaming of it.
- D is wrong: The CIA triad classifies which security property an incident affects; it is not the source of any incident-response process sequence.

### 32.

A responder finds an intrusion and immediately wipes and rebuilds the affected host before establishing how far the attacker spread. What did skipping ahead of containment cost, in PICERL terms?

- **A.** Nothing was lost, since eradication and containment achieve the same outcome regardless of order.
- **B.** It skipped the preparation phase, which should have happened at this point in the sequence instead.
- **C.** It skipped the lessons-learned review, which always occurs immediately after identification rather than at the end, so eradication then ran without the findings that review would have produced.
- **D.** It destroyed the evidence needed to establish scope, so it can no longer be confirmed whether the attacker is still present elsewhere.

**Answer: D.** Containment isolates affected systems while investigation is still possible, and it precedes eradication for exactly that reason. Wiping and rebuilding before scope is established destroys the evidence needed to confirm whether the attacker is still present elsewhere, which is the concrete cost of acting out of order.

- A is wrong: The guide states directly that acting out of sequence is the characteristic wrong answer, and order matters here because eradicating first destroys evidence containment would have preserved.
- B is wrong: Preparation is the phase completed before anything happens — plans, contacts, tested backups — not a step that occurs mid-incident after identification.
- C is wrong: The lessons-learned review is the final step, occurring after recovery, not a step that belongs immediately after identification.

### 33.

A web application builds a SQL statement by concatenating a search term straight from the request into the query string. What is the single design error underlying SQL injection and cross-site scripting alike?

- **A.** Storing user data without hashing it before it reaches the database.
- **B.** Running the database service with more privilege than its task requires, since a query built by concatenation is parsed safely whenever the account executing it holds only the rights its own task needs.
- **C.** Concatenating untrusted input into a string that something else will parse, so attacker-controlled text changes the statement's meaning.
- **D.** Failing to encrypt the connection between the application and the database.

**Answer: C.** SQL injection and cross-site scripting share one design error: untrusted input is concatenated into a string that a database, shell, or browser then parses as structure rather than as data. The fix generalises across all of them because the root cause is the same regardless of which interpreter is targeted.

- A is wrong: Hashing concerns how a value is stored, not whether untrusted input is allowed to alter a statement's structure, which is the actual mechanism behind injection.
- B is wrong: Over-privileged service accounts worsen the impact of a successful injection but are not the design error that makes injection possible in the first place.
- D is wrong: Transport encryption protects the connection from interception; it has no bearing on whether untrusted input is allowed to change a query's structure.

### 34.

A developer proposes fixing an injection vulnerability by escaping special characters in the user input before concatenating it into the query. What does OWASP name as the fix that should come first instead?

- **A.** Escaping is already the primary defence, and parameterised queries are only a supporting measure.
- **B.** Enabling mandatory access control on the database process, which prevents any injected query from executing because the policy labels the query text itself as untrusted before the parser ever sees it.
- **C.** Rate limiting requests to the endpoint that accepts the search term.
- **D.** A safe API that never builds the statement by concatenation at all, such as a parameterised query or prepared statement.

**Answer: D.** OWASP's primary defence is a safe API — parameterised queries, prepared statements, or an ORM — that keeps data and query structure in separate channels so input cannot change the statement's meaning. Positive server-side validation and context-appropriate escaping support that primary defence rather than replacing it.

- A is wrong: The guide reverses this: escaping and server-side validation are supporting measures, while a safe API that avoids concatenation entirely is the primary defence.
- B is wrong: Mandatory access control confines what a compromised process can reach on the filesystem; it does not prevent a malformed query from being parsed and executed in the first place.
- C is wrong: Rate limiting slows the volume of requests but does not stop a single malicious request from injecting a payload into the query.

### 35.

A contractor with legitimate database access exports records for personal gain. Why do MFA, perimeter filtering, and patching all fail to engage against this specific actor?

- **A.** Those controls only ever apply to attacks originating from outside the country the organisation operates in.
- **B.** The contractor already authenticated legitimately and never crosses the perimeter or exploits a software flaw, so none of those controls has a reason to trigger.
- **C.** MFA, perimeter filtering, and patching are all detective controls, and only preventive controls can address an insider, so the three raise alerts that nobody with authority over the contractor is positioned to act on.
- **D.** The controls do engage, but only after the contractor's session has already ended for the day.

**Answer: B.** An insider already holds legitimate access, so they pass authentication normally, never cross a perimeter to be filtered, and exploit no software flaw for patching to address. What does apply is least privilege and need-to-know limiting reach, separation of duties, and accounting and auditing to detect and attribute the misuse afterward.

- A is wrong: Geography plays no role in why these controls miss an insider; the reason is that the actor's access is legitimate, not where they are located.
- C is wrong: MFA, filtering and patching are preventive controls; what actually addresses an insider is a different set of preventive and detective controls, not a shift in control type generally.
- D is wrong: There is no delayed engagement here; these controls simply have nothing to check, since the contractor's login and access were already legitimate throughout.

### 36.

An employee accidentally makes a customer storage bucket public rather than deliberately leaking it. Does the guide's definition of insider threat still cover this case?

- **A.** No, since insider threat only applies when the person acted with deliberate malicious intent.
- **B.** No, because this is properly classified as an attack-surface issue rather than an insider one, since a storage bucket is infrastructure that sits outside the employee's own granted access.
- **C.** No, since only actions taken by permanent employees, not contractors or partners, count as insider threat.
- **D.** Yes. Insider threat covers harm by someone with legitimate access, deliberate or accidental, and a misdirected or misconfigured disclosure is the accidental case named directly.

**Answer: D.** Insider threat is harm caused by someone who already holds legitimate access, whether deliberate — theft, sabotage — or accidental, such as a misdirected file, a public bucket, or a deleted database. Intent is not the qualifying condition; legitimate access to cause the harm is.

- A is wrong: The guide's definition is explicit that accidental harm — including a public bucket — is covered alongside deliberate theft or sabotage.
- B is wrong: Attack surface concerns the total set of reachable points on a system, a different concept from harm caused by someone who already holds legitimate access.
- C is wrong: The guide's definition names employees, contractors, and partners alike as potential insiders, so employment type is not what excludes a case.

### 37.

A team wants a system that can actually drop malicious packets, not just alert on them. What placement decision does that requirement force, and what is the operational trade-off it carries?

- **A.** The system can stay on a passive tap or mirrored port and still block traffic once it detects it, when blocking traffic requires sitting inline on the path itself, which a passive tap or mirrored port position cannot provide however good the detection is.
- **B.** The system must sit inline in the traffic path to be able to drop packets, and that placement means a false positive drops legitimate traffic too.
- **C.** The placement decision only matters for host-based deployments, not for network-based ones.
- **D.** The system should instead be deployed as a vulnerability scanner, since scanners can already block traffic once a weakness is found.

**Answer: B.** The difference between detection and prevention is placement and authority, not analytical power: a prevention system must sit inline, in the traffic path, because it has to be able to drop packets, while a detection system commonly sits passively and cannot. Inline placement is also why many deployments run detection-only first, since a false positive there drops legitimate traffic.

- A is wrong: A passively placed system, off the direct traffic path, cannot drop packets however good its detection is — blocking requires inline placement.
- C is wrong: The inline-versus-passive distinction applies to network deployments (NIPS versus NIDS) just as much as host-based ones, since either can be placed to observe or to intervene.
- D is wrong: A vulnerability scanner enumerates known weaknesses on a schedule; it has no role in blocking live traffic, which is what this requirement is about.

### 38.

An IDPS and a vulnerability scanner are compared as a pair. What is the separating axis between what each one answers?

- **A.** Present tense versus latent state. The IDPS answers whether something is happening right now, while the scanner answers what could be exploited if someone tried.
- **B.** Cost — the IDPS is always cheaper to run than a vulnerability scanner.
- **C.** Both answer exactly the same question, and either one substitutes for the other in a mature security programme.
- **D.** Only the vulnerability scanner can be deployed on a host; the IDPS only ever runs on network infrastructure, when host-based deployment (HIDS/HIPS) is one of the IDPS's own two forms alongside the network-based one, not something reserved for a scanner.

**Answer: A.** An IDPS examines live traffic and host activity continuously, answering whether an attack is happening right now; a vulnerability scanner examines configured state on a schedule or in a build pipeline, answering what could be exploited if someone tried. Neither substitutes for the other, since one is initiated by the attacker's activity and the other by you.

- B is wrong: Relative cost is not the property the comparison table tracks; it separates the two by what each examines and when it runs, not by price.
- C is wrong: The guide states directly that neither substitutes for the other; one watches live activity continuously and the other checks configured state on a schedule.
- D is wrong: IDPS deployment includes both network-based (NIDS/NIPS) and host-based (HIDS/HIPS) forms, so host deployment is not exclusive to the scanner.

### 39.

Ransomware encrypts a fileserver, and the attackers had already exfiltrated data before deploying it. The organisation restores every file from a tested, isolated backup. Which loss has been undone, and which has not?

- **A.** Both losses are undone, since a clean restore returns the organisation to its pre-attack state entirely.
- **B.** The availability loss is undone by the restore; the confidentiality loss from exfiltration is not, since restoring copies back does not un-leak what was already taken.
- **C.** Neither loss is undone, because a backup restore only ever addresses integrity rather than availability, and the encrypted originals stay unreadable on disk.
- **D.** Both losses are undone as long as the backup share itself was also mounted on the same network as the fileserver.

**Answer: B.** A tested, isolated backup undoes the availability loss ransomware causes by encrypting data. It cannot undo a confidentiality loss from data already exfiltrated before encryption — restoring a copy back does not un-leak what an attacker already took.

- A is wrong: The guide states this directly: restoring undoes the availability loss but not the confidentiality loss when data was exfiltrated first.
- C is wrong: The guide names tested offline backups as exactly what restores availability after ransomware; the confidentiality loss is the piece that remains, not the availability one.
- D is wrong: A backup share mounted on the victim network would have been encrypted along with everything else, which is why the guide requires the copy to be offline or otherwise isolated in the first place.

### 40.

Malware is classified by how it propagates and packages itself, not by what it delivers. Given a program that hides the attacker's presence from the operating system after installation, which classification fits, and could it still deliver a ransomware payload?

- **A.** A worm — and no, worms are defined by carrying only self-replication code and cannot also carry ransomware.
- **B.** A trojan — and no, once classified as a trojan a program cannot also be described as hiding its presence, because the disguise is discarded the moment the program finishes installing and begins running.
- **C.** A rootkit, and yes, any of the propagation classes, rootkits included, can carry any payload, ransomware among them.
- **D.** A virus — and yes, but only viruses among the classifications are capable of carrying a ransomware payload.

**Answer: C.** The malware classifications describe propagation and packaging, not payload: a worm spreads on its own, a virus attaches to a host file, a trojan arrives disguised, and a rootkit hides the attacker's presence from the operating system. Any of them, rootkits included, can carry any payload, ransomware included.

- A is wrong: A worm is defined by spreading on its own across a network, not by hiding the attacker's presence, and the guide states any propagation class can carry any payload.
- B is wrong: A trojan is defined by arriving disguised as something wanted, which is a separate property from hiding presence after installation; the classifications are not mutually exclusive labels for payload.
- D is wrong: A virus is defined by attaching to a host file and spreading when it runs, not by hiding the attacker's presence, and the guide states the payload capability is not exclusive to any one class.

### 41.

A user on a hostile wireless access point clicks through a certificate warning rather than cancelling the connection. What does that click actually let an on-path attacker do?

- **A.** Present its own certificate as if it were the real server, relay traffic in both directions, and read everything in between.
- **B.** Nothing further, since TLS encryption remains effective regardless of whether the certificate warning was heeded, because the session keys are agreed before any certificate is presented and cannot be read by a relay.
- **C.** Exhaust the connection's available bandwidth, denying the user service entirely.
- **D.** Install a rootkit on the user's device without any further action required.

**Answer: A.** An on-path attacker relays traffic between two parties who each believe they are talking directly to the other. Certificate validation is what defeats this, because the attacker cannot present a certificate for the real name that chains to a trusted anchor — which is exactly why clicking through the warning removes that defence.

- B is wrong: Certificate validation is what defeats a man-in-the-middle; skipping it or clicking through is one of the named ways the attack actually succeeds, not a detail encryption alone covers.
- C is wrong: Resource exhaustion describes a denial-of-service attack; an on-path attacker here is relaying and reading traffic, not overwhelming capacity.
- D is wrong: A rootkit requires code execution on the victim device, which is a separate malware concern from intercepting and relaying network traffic.

### 42.

Which of the following gets an attacker into position for a man-in-the-middle attack in the first place, before certificate validation ever comes into play?

- **A.** A stolen but still-valid password used to log into the target service directly.
- **B.** A phishing email that persuades the victim to click a malicious attachment.
- **C.** ARP or DNS manipulation that redirects the victim's traffic through the attacker's machine.
- **D.** A misconfigured `sudo` rule that lets an unprivileged local user run arbitrary commands, since root on one endpoint places the attacker between that host and every party it goes on to talk to.

**Answer: C.** Before certificate validation can even be tested, the attacker first has to get into the traffic path — through a hostile or spoofed wireless access point, ARP or DNS manipulation, or a compromised router. Validation is then what defeats the attempt, unless it is skipped or the warning is clicked through.

- A is wrong: Logging in with a stolen credential is a direct authentication compromise, not positioning on the network path between two parties who believe they are talking to each other.
- B is wrong: Phishing manipulates the victim directly into an action; it does not itself place the attacker on the network path between two communicating parties.
- D is wrong: A `sudo` misconfiguration is a local privilege-escalation route, unrelated to intercepting traffic between two remote parties.

### 43.

A login requires a password, then a one-time code delivered by SMS. An attacker runs a real-time phishing relay that captures both and logs in immediately. Did MFA fail here, and what would have stopped this specific attack?

- **A.** MFA fully succeeded, since two distinct factor categories were checked and that is sufficient against any credential attack by definition.
- **B.** MFA did not apply here at all, since a password and an SMS code are both "something you know."
- **C.** The fix is authorization review, since the account should never have been permitted to log in from a new location.
- **D.** MFA reduced but did not end the risk; only a phishing-resistant authenticator such as a FIDO2 security key breaks a real-time relay.

**Answer: D.** SMS one-time codes are a real second factor but not a phishing-resistant one: a real-time relay captures and replays them before the code expires. Phishing-resistant authenticators such as FIDO2 security keys bind their response to the legitimate site, which is what actually stops this attack.

- A is wrong: The guide states plainly that MFA reduces phishing damage but does not end it, because a relay can capture and replay a code the user was tricked into providing.
- B is wrong: A password is something you know and an SMS code relies on possession of the phone, so this is genuinely two distinct factor categories, unlike a password plus a security question.
- C is wrong: The failure here is at authentication — the attacker proved possession of valid credentials — not a subsequent authorization policy decision.

### 44.

NIST SP 800-63B requires two distinct factor categories at AAL2. Which of these logins actually satisfies that requirement?

- **A.** A password plus a memorised security question, since two separate credentials are checked.
- **B.** A fingerprint scan alone, with no accompanying device or credential.
- **C.** A password plus a fingerprint compared against the stored reference on the user's registered device.
- **D.** Two different passwords entered in sequence for extra assurance.

**Answer: C.** MFA requires evidence from two or more distinct factor categories: something you know, something you have, and something you are. A password paired with a device-bound biometric spans two categories; a password paired with a second knowledge item, however different it feels, is one category checked twice.

- A is wrong: Both a password and a security question are "something you know," so this is one factor category checked twice, not two categories.
- B is wrong: The guide states a biometric on its own is not treated as an authenticator; it always accompanies the device holding it, so this is not two factors or even one complete one.
- D is wrong: Two passwords are both "something you know," so this is a single factor category checked twice rather than genuine multi-factor authentication.

### 45.

A team downloads a checksum file from the same page and the same server as the software it is meant to verify, runs `sha256sum` with `-c` against it, and gets `OK`. Does that establish the download is authentic?

- **A.** Yes, since an `OK` result from `sha256sum -c` proves both integrity and origin, because the digest is cryptographically bound to the file it describes.
- **B.** No — a checksum from the same compromised source as the download proves only self-consistency; `gpg --verify` against a key obtained independently is what establishes origin.
- **C.** Yes, as long as the digest file was downloaded over an HTTPS connection, since transport encryption authenticates whoever served the digest.
- **D.** No, and the fix is to also run `md5sum` on the same file and compare the two results, since agreement between two algorithms would rule out tampering.

**Answer: B.** A checksum answers only whether the received bytes match a value; if that value came from the same compromised source as the download, a match proves self-consistency, not authenticity. `gpg --verify` checked against a signing key obtained through an independent, trusted channel is what actually establishes who released the bytes.

- A is wrong: A checksum proves only that bytes match a value; it says nothing about who produced that value, which is exactly the trap the guide describes for a same-server digest.
- C is wrong: TLS protects the connection during transfer, but it does not establish that the source server itself was not the one compromised in the first place.
- D is wrong: Running a second, weaker hash algorithm against the same self-consistent source adds no independent verification of origin; the missing step is a signature checked against an independently obtained key.

### 46.

`gpg --verify SHA256SUMS.asc SHA256SUMS` prints `Good signature` along with a warning that the signing key is not certified with a trusted signature. Should this be treated as a successful verification?

- **A.** Yes, because `Good signature` is the only output that matters and the certification warning is purely informational.
- **B.** No, because `gpg --verify` requires both a detached signature and a clearsigned document to be present simultaneously, when the detached form already takes exactly a signature file and a signed file together, which is the pair this command supplies correctly.
- **C.** Yes, but only if `sha256sum -c` was also run separately against the same SHA256SUMS file first.
- **D.** No — the signature matched a key, but the signer's identity is still unestablished until that key was obtained and validated through an independent, trusted channel.

**Answer: D.** A signature proves origin only relative to the key it was verified against. `Good signature` together with a warning that the key is not certified with a trusted signature means the cryptographic match succeeded but the signer's actual identity was never established — that establishment comes from obtaining the publisher's key through an independent, trusted channel, which is the step that most often gets skipped.

- A is wrong: The guide names ignoring exactly this warning as the trap: the signature matching a key you never validated does not establish the signer's identity.
- B is wrong: The detached form takes the signature file and the signed file together, or a clearsigned document alone — this command already supplies the correct detached pair; the actual gap is key certification, not file form.
- C is wrong: Running a checksum check does not resolve the actual gap here, which is that the signing key itself was never validated through an independent, trusted channel.

### 47.

Two users choose the same password on a system that stores salted SHA-256 hashes. An attacker steals the database. Why does salting alone not make this table safe against a determined attacker?

- **A.** It is not safe because the salt must be kept secret and this system almost certainly stored it in the clear next to the hash.
- **B.** The salt defeats precomputation and stops the two users producing identical hashes, but SHA-256 is fast, so each individual guess is still cheap to try.
- **C.** It is not safe because SHA-256 is reversible with the right key, unlike a true one-way hash.
- **D.** It is not safe because this describes encryption, not hashing, and encryption always requires a shared key an attacker can also steal.

**Answer: B.** A salt exists to prevent precomputed rainbow tables and to stop identical passwords producing identical hashes across accounts; it does not slow down the hash function itself. SHA-256 is deliberately fast, so a salted SHA-256 password table still falls quickly to an attacker who can attempt guesses at speed — the fix is a deliberately slow, memory-hard function, not more salting.

- A is wrong: The salt does not need to be secret — its job is uniqueness, and storing it in the clear alongside the hash is correct and expected, not the flaw here.
- C is wrong: SHA-256 has no key and is not reversible; the weakness described is its speed against brute-force guessing, not reversibility.
- D is wrong: Storing a one-way digest with a salt is hashing, not encryption; there is no key involved and nothing here is reversible.

### 48.

A support engineer claims the application can display a user's existing password on request, and calls this "hashing it for display." What does this claim actually reveal about how the password is stored?

- **A.** The password is correctly hashed with a fast algorithm, since fast hashing allows quick redisplay when requested.
- **B.** The password is stored with a pepper instead of a salt, which permits recovery when combined with the secret pepper value.
- **C.** The password is stored reversibly, not hashed at all, since hashing has no decryption step and cannot be shown back to anyone.
- **D.** The password is stored using asymmetric encryption, which allows the application to decrypt it with the matching private key.

**Answer: C.** Hashing is one-way by construction: there is no key and no decryption step, so nothing that can be displayed back to a user was ever properly hashed. A system that can show an existing password is storing it reversibly, and calling that step "hashing" does not change what actually happened to the data.

- A is wrong: Hash function speed has nothing to do with whether the original input can be recovered — a one-way hash cannot be reversed regardless of how fast it runs.
- B is wrong: A pepper is an additional secret layered on top of hashing, not a mechanism that makes a one-way function reversible.
- D is wrong: Nothing in the claim describes a key pair, and password storage is expected to be one-way hashing, not any form of encryption at all.

### 49.

A study guide draft states, with no dataset named, that phishing is the single most common route to initial access. Should that sentence stand as written on this exam?

- **A.** Yes, because phishing needs no technical vulnerability to succeed, which settles the ranking without any measurement being required.
- **B.** No. “Most common” is a measured ranking that shifts between annual breach reports, so the sentence needs a named, current dataset behind it or it should not be made at all.
- **C.** Yes, because phishing and social engineering name the same category, so the claim is true by definition rather than by measurement.
- **D.** No, because denial of service is the most common initial-access route instead.

**Answer: B.** The guide explicitly withdraws the "most common" superlative about phishing: the Verizon 2026 DBIR ranks exploitation of vulnerabilities first among initial-access routes at 31%, phishing second at 16%, and credential abuse third at 13%, so no version of "phishing is the most common" is supported by the cited source.

- A is wrong: Ease of execution is not a measure of frequency; only a dataset that counted incidents can settle which route led, and that is exactly what the sentence fails to name.
- C is wrong: NIST defines phishing narrowly as a fraudulent solicitation in email or on a web site in which the perpetrator masquerades as a legitimate business, which is one technique within social engineering rather than the whole of it.
- D is wrong: A denial-of-service attack disrupts availability rather than granting an attacker access, so it is not counted on an initial-access measure at all; and the defect in the sentence is the missing dataset, not the identity of the leading vector.

### 50.

A company deploys email filters, DMARC, and firewall rules, and still loses a credential to a phishing email that got through. Why does the guide name user awareness rather than any technical control as the defence here?

- **A.** Because filters and DMARC only work against denial-of-service traffic, not against email at all.
- **B.** Because MFA is guaranteed to stop any phishing attempt outright, making user awareness unnecessary in practice.
- **C.** Because phishing is legally classified differently from other attacks and therefore requires a training response instead of a technical one.
- **D.** Because the target of the attack is the person, which technical controls can only ever reduce exposure to, never fully patch.

**Answer: D.** Phishing manipulates a person rather than defeating a technical control, so filters and DMARC reduce how much reaches an inbox but cannot patch the human decision to act on a convincing message. That is why user awareness training appears as this category's named defence almost nowhere else in the competency.

- A is wrong: DMARC and email filters specifically target phishing delivery; the gap here is that they reduce delivery volume without eliminating susceptibility, not that they target the wrong traffic entirely.
- B is wrong: MFA reduces phishing damage but does not end it — a real-time relay can still capture and replay a one-time code — so it is not a full substitute for user awareness.
- C is wrong: The defence choice follows from what the attack actually targets — a person's judgement — not from any legal classification of the attack type.

### 51.

An attacker gains physical console access to a locked-down server. Which of the installed system's software controls stop them from interrupting the boot loader to obtain a root shell?

- **A.** File permissions and authentication on the installed operating system stop this reliably.
- **B.** SELinux or AppArmor in enforcing mode stops this, since mandatory access control confines every process on the host, and its policy is loaded by the boot loader before any menu entry can be edited.
- **C.** None on the installed operating system itself, which requires boot-path controls such as a firmware password and a boot loader password, layered with physical access control.
- **D.** Full disk encryption alone stops this, since an encrypted volume cannot be booted into an alternate operating system.

**Answer: C.** An attacker at the console operates below the level most software controls occupy: interrupting the boot loader, booting from removable media, or simply removing the disk are none of them stopped by the installed system's authentication or file permissions. The layered answer combines physical access control with boot-path controls and full disk encryption, which is the piece that still holds once the hardware itself is in someone else's hands.

- A is wrong: The guide is explicit that authentication and file permissions on the installed system cannot prevent interrupting the boot loader, since the attacker acts before that system is even running.
- B is wrong: Mandatory access control confines processes running under the installed operating system; it has no bearing on interrupting the boot sequence before that system has started.
- D is wrong: Full disk encryption protects data confidentiality if the drive is removed; it does not by itself prevent interrupting the boot loader on the running hardware, which boot-path controls address.

### 52.

A decommissioned drive is deleted through the operating system's normal file deletion before leaving the building. Is that sufficient for secure disposal?

- **A.** Yes, since deleting a file through the operating system removes its data from the drive immediately, when ordinary deletion typically removes only the filesystem's pointer to the data and leaves the underlying bytes recoverable on the drive itself.
- **B.** Yes, as long as the drive was also protected by full disk encryption while it was in service.
- **C.** This question only applies to backup tapes, not to drives removed from a server.
- **D.** No, because media that leaves the building is wiped or destroyed rather than merely deleted; ordinary deletion does not remove the underlying data.

**Answer: D.** Ordinary file deletion typically removes only the filesystem's pointer to the data, leaving the underlying bytes recoverable. The guide's disposal practice is explicit: media that leaves the building is wiped or destroyed, not merely deleted, before it is decommissioned.

- A is wrong: Ordinary deletion typically only removes the filesystem's reference to the data, not the underlying bytes, which is why the guide requires wiping or destruction instead.
- B is wrong: Encryption while in service is a separate, valuable control, but the guide's stated disposal practice still calls for wiping or destroying the media, not relying on the earlier encryption state alone.
- C is wrong: Secure disposal applies to any media leaving the building, drives included, not only to tape backups specifically.

### 53.

A cron job runs nightly maintenance as root because that was the simplest way to get it working, and nobody has revisited the decision since. What does this violate, and what does that violation actually cost if the job is ever compromised?

- **A.** It violates least privilege, and the cost is that a bug in the job becomes a root-level compromise instead of one confined to an unprivileged account.
- **B.** It is not a violation — least privilege applies only to human accounts, not to cron jobs and other automated processes running under service identities.
- **C.** It violates defense in depth, since a single overprivileged job removes one layer from the stack.
- **D.** It violates accounting, because a root cron job cannot be attributed to a specific person.

**Answer: A.** Least privilege applies to any identity — human or automated — and limits how much a single compromise can reach. A root cron job has no need for that scope, and running it that way turns an ordinary bug into a full machine compromise.

- B is wrong: The guide states this directly: a cron job or container running as root is a least-privilege violation even though no person is involved.
- C is wrong: The comparison table draws the line at what defense in depth constrains: the number of independent layers, not how much authority one identity holds.
- D is wrong: Attribution is an accounting concern, but the described problem is about how much access the job holds, not about who gets credited for its actions.

### 54.

An administrator elevates through `sudo` for individual commands rather than logging in directly as root for the whole session. Which practice does this illustrate?

- **A.** Defense in depth, because `sudo` adds an independent layer on top of the login itself.
- **B.** Multi-factor authentication, since a second credential is effectively required for each elevated command.
- **C.** Accounting, because `sudo` records who ran which command.
- **D.** Least privilege, since access above the ordinary account is granted only per command and only for as long as it is needed.

**Answer: D.** Least privilege means granting only the access a task requires, for no longer than it needs it. Elevating per command through `sudo` rather than logging in as root applies that idea to duration as well as to scope.

- A is wrong: `sudo` elevation narrows how much authority the account holds at any moment; it does not add a separately-failing barrier on the path in.
- B is wrong: Per-command `sudo` elevation does not itself introduce a second, distinct factor category the way MFA does.
- C is wrong: Logging elevated commands is a side benefit for accounting, but the practice being described — using ordinary accounts and elevating per command — is what least privilege names.

### 55.

An attacker who phished a low-privilege credential then exploits a writable service unit to obtain a root shell on the same host. Is the exploit itself the way the attacker got in?

- **A.** Yes, since gaining root through the writable unit is itself the moment initial access occurred.
- **B.** This describes horizontal escalation, since the attacker moved to a peer account rather than upward, and a root shell reached from an ordinary user account counts as sideways whenever one host is involved.
- **C.** No. It is a post-access step; the phished credential was the way in, and the writable service unit is what turned that limited access into more.
- **D.** This is denial of service, since the writable service unit was used to disrupt the host.

**Answer: C.** Privilege escalation turns access already obtained into more access than was granted; it is a post-access step, not a way in. An attacker who phished a credential still needed that credential to gain initial access — the writable service unit is what let them reach further from that foothold.

- A is wrong: Initial access already happened through the phished credential; the writable unit is what let the attacker reach beyond what that access already allowed.
- B is wrong: Moving from a low-privilege account to root is vertical escalation, moving up in privilege, not horizontal movement to a peer account at the same level.
- D is wrong: Nothing here disrupts availability; the attacker instead gains more access than they started with, which is what escalation names.

### 56.

An ordinary user discovers a SUID binary that can be made to run arbitrary commands, and uses it to reach another ordinary user's private files rather than root. Which kind of privilege escalation is this?

- **A.** Vertical escalation, since any SUID exploitation always ends in a root shell by definition.
- **B.** Not privilege escalation at all, since no new privileges beyond the original account were technically granted and the account only used access it already held.
- **C.** Horizontal escalation, reaching another account's data at the same privilege level rather than moving up to root.
- **D.** An insider threat, since the attacker already had a legitimate account on the system.

**Answer: C.** Vertical escalation moves up in privilege, typically to root or administrator; horizontal escalation moves sideways, reaching another account's data or access at the same privilege level. Using a SUID binary to read a peer's private files without ever gaining root is the horizontal case.

- A is wrong: Vertical escalation specifically means moving up to root or administrator; a SUID exploit that only reaches a peer account's data at the same level is not vertical.
- B is wrong: Reaching data outside the scope the original account was authorised for is the definition of escalation, whether the movement is sideways or upward.
- D is wrong: Insider threat concerns harm from someone whose own legitimate access is misused, not a technique for reaching a different account's data entirely.

### 57.

An engineer runs `ssh-keygen -t ed25519 -C "laptop"` and then needs to install the resulting public key on a remote server they can currently only reach with a password. Which command installs it correctly?

- **A.** `ssh-add ~/.ssh/id_ed25519`, loading the key so the remote server can pick it up on the next connection
- **B.** `ssh-copy-id -i ~/.ssh/id_ed25519.pub user@host`, appending the public half to the remote account's `authorized_keys`
- **C.** `ssh-keygen -t ed25519 -C "laptop"` run a second time directly on the remote server
- **D.** `gpg --verify ~/.ssh/id_ed25519.pub user@host`, verifying the key's signature against the remote account

**Answer: B.** `ssh-keygen` generates the key pair; `ssh-copy-id` installs the *public* half into the remote account's `authorized_keys`, and needs a working login — typically the still-enabled password — the first time it runs. Copying the private key instead of the `.pub` file is the classic and dangerous mix-up.

- A is wrong: `ssh-add` loads a private key into the agent on the local machine and installs nothing on the remote host, so the server still holds no copy of the public key.
- C is wrong: `ssh-keygen` generates a new key pair; it does not install an existing public key anywhere, and running it again would just create an unrelated pair on the server.
- D is wrong: `gpg --verify` checks a signature over a file against a signing key; it has no role in installing an SSH public key into a remote account.

### 58.

During SSH's publickey authentication, what does the client actually transmit to the server, and why does this resist replay in a way a password does not?

- **A.** The private key itself, encrypted with the server's public key so only that server can read it.
- **B.** A one-time password derived from the key pair, refreshed every thirty seconds like a hardware token.
- **C.** A signature over session-specific data, never the private key or anything reusable, so an attacker recording the exchange gains nothing replayable.
- **D.** A hash of the password the user would otherwise have typed, computed locally before sending.

**Answer: C.** SSH's publickey method has the client sign a session-specific challenge with its private key and send only the resulting signature. Because the signature is bound to that session, an attacker who records the exchange gains nothing replayable — unlike a password, which the server must receive and could log, leak, or have phished.

- A is wrong: The private key never leaves the client under any circumstance; what crosses the wire is a signature, not the key in any form.
- B is wrong: SSH publickey authentication is not a time-based one-time code scheme; it signs session-specific data at the moment of connection.
- D is wrong: There is no password involved in publickey authentication at all; the mechanism authenticates by proving possession of the private key, not by hashing a secret.

### 59.

A scanner reports a critical vulnerability in a package that is installed but never run, on a host unreachable from any network. Is this necessarily high risk?

- **A.** Yes, because a critical severity score is itself the organisation's risk regardless of deployment context, since the score already accounts for exploitability in the wild.
- **B.** Yes, because the presence of a vulnerability always implies an active threat targeting it.
- **C.** This cannot be assessed at all without first running a penetration test against the host.
- **D.** Not necessarily, because risk combines likelihood and impact, and the described conditions drive likelihood toward zero even though the vulnerability is real.

**Answer: D.** Risk is the combination of likelihood and impact, not the severity score alone. A vulnerability in software that is never run and is unreachable from any network has its likelihood driven far down, so the finding is real but not automatically high risk.

- A is wrong: A raw scanner list is not a work queue until it is risk-ranked; severity alone ignores whether the flaw is reachable or exploitable in context.
- B is wrong: A vulnerability is a weakness; a threat is a separate circumstance or actor with the potential to exploit it, and presence of one does not establish the other.
- C is wrong: Risk can be reasoned about from likelihood and impact directly, using the deployment context already given, without requiring an exploitation attempt.

### 60.

Which of the three terms — vulnerability, threat, risk — is the only one that carries a magnitude, and what does removing any one of the three do to it?

- **A.** Threat carries the magnitude, since an actor's capability and intent set the scale of what can happen regardless of the flaw.
- **B.** Vulnerability carries the magnitude, expressed through its CVSS score.
- **C.** All three carry the same magnitude, since they are used interchangeably in practice and describe one underlying exposure viewed from three different angles.
- **D.** Only risk carries a magnitude, and removing any one of the three collapses it, so patching the vulnerability, blocking the threat's access, or reducing the impact all work.

**Answer: D.** A vulnerability is a weakness and a threat is a potential exploiter — neither carries a magnitude on its own. Risk is the combination of likelihood and impact, and removing any one of the three factors — patching the weakness, blocking the threat's access path, or reducing impact through segmentation and backups — collapses the resulting risk.

- A is wrong: It is risk, not threat, that is expressed as a magnitude of likelihood and impact combined; a threat is a circumstance or actor, not a scored quantity.
- B is wrong: CVSS scores a specific catalogued defect's severity, which is a different measurement from the likelihood-and-impact combination that defines risk.
- C is wrong: NIST keeps the three distinct: a vulnerability is a weakness, a threat is a circumstance or actor with the potential to exploit it, and only risk is expressed as a magnitude combining likelihood and harm.

### 61.

A question asks "why ship logs off the originating host to a central SIEM." Is that question testing accounting, or security logging and monitoring?

- **A.** Accounting, since shipping logs off-host is just another way of describing the third A of AAA.
- **B.** Neither — shipping logs off-host is an availability concern addressed by redundancy, not by either topic.
- **C.** Security logging and monitoring, since it asks about the operational pipeline that makes records survive and get seen, not about the AAA-triad property of recording actions.
- **D.** Accounting, because a SIEM is defined as the tool that performs authentication decisions for every host it collects from, when a SIEM's role is collecting and correlating events across hosts, not making authentication decisions for any of the systems it monitors.

**Answer: C.** Accounting is the AAA-triad property — the per-identity record of what an authenticated subject did. Security logging and monitoring is the operational pipeline that makes such records survive and get seen: generation on every host, shipping off-box, clock synchronisation, retention, and alerting. A question about why logs are shipped to a SIEM tests this pipeline, not accounting itself.

- A is wrong: The guide states these are close enough to test as separate concepts: accounting is the recorded event itself, while log shipping and SIEM architecture belong to this topic instead.
- B is wrong: Shipping logs protects the integrity and usefulness of the evidence, not availability of a service, and it is squarely part of this topic's operational pipeline.
- D is wrong: A SIEM collects and correlates events; it does not perform authentication decisions for the hosts it monitors, which is unrelated to what log shipping is for.

### 62.

Events from a database server, a web server, and a firewall arrive at a central collector with unsynchronised clocks. What does that unsynchronised state prevent an investigator from doing?

- **A.** Reading any individual log entry at all, since unsynchronised clocks make log files unreadable, because the collector discards every record whose timestamp it cannot reconcile against its own.
- **B.** Retaining the logs for the required period, since retention depends on clock accuracy.
- **C.** Correlating the events into an accurate timeline, since matching activity across systems depends on their clocks agreeing.
- **D.** Encrypting the logs in transit to the collector, since TLS requires synchronised clocks to function.

**Answer: C.** Clocks are synchronised across hosts specifically so events from different systems can be correlated into a single, accurate timeline. Without that synchronisation, an investigator cannot reliably determine the order in which activity occurred across the database, web, and firewall logs, even though each individual log remains readable.

- A is wrong: Unsynchronised clocks affect the reliability of cross-system ordering, not the readability of any single log file on its own.
- B is wrong: Retention is a separate setting governing how long records are kept; it does not depend on whether clocks across hosts agree with each other.
- D is wrong: TLS certificate validation checks clock time against a certificate's validity window, but ordinary log shipping to a collector does not require synchronised clocks to encrypt successfully.

### 63.

`getenforce` reports `Permissive` on a Red Hat host running a web service. A colleague reads this as "SELinux is protecting the service." Is that reading correct?

- **A.** Yes, since `Permissive` means SELinux is active and confining every process on the host, with policy denials both logged and enforced as they occur.
- **B.** Yes, because `Permissive` is simply AppArmor's name for what SELinux calls `Enforcing`.
- **C.** No — permissive mode logs what policy would have denied and permits it anyway, so the service is not actually confined.
- **D.** This cannot be determined from `getenforce` alone; only `aa-status` reveals whether policy is actually being applied.

**Answer: C.** SELinux being enabled and SELinux being enforcing are different claims, and `getenforce` is what distinguishes them. Permissive mode logs what policy would have denied and permits it anyway, so a service running under it is not actually confined despite SELinux being active.

- A is wrong: This is precisely the misreading the guide corrects: `Permissive` means denials are logged but still allowed, which is not confinement.
- B is wrong: `Permissive` is one of SELinux's own three modes alongside `enforcing` and `disabled`; it is not an AppArmor term at all.
- D is wrong: `getenforce` is exactly the command that reports SELinux's mode; `aa-status` reports AppArmor's state instead and would not apply to this Red Hat host's SELinux question.

### 64.

"SELinux and AppArmor" and "access control models" are compared as a pair. What separates them, given that both discuss mandatory access control?

- **A.** SELinux and AppArmor implement role-based access control specifically, while access control models covers only discretionary and mandatory.
- **B.** SELinux and AppArmor are Linux-specific, while access control models only describes Windows and macOS systems, which is why neither product appears anywhere in that taxonomy.
- **C.** Only access control models is examinable by command, since a taxonomy is what a `getfacl` listing reports; SELinux and AppArmor are conceptual only.
- **D.** Instance versus category — SELinux and AppArmor are specific Linux products implementing mandatory access control, while access control models is the taxonomy of discretionary, mandatory, and role-based schemes itself.

**Answer: D.** The separating axis is instance versus category: SELinux and AppArmor are specific products implementing one of the models, queried through commands like `getenforce` and `aa-status` and configured through `/etc/selinux/config` or AppArmor profiles, while access control models names the broader classification scheme — discretionary, mandatory, role-based — that those products are examples within.

- A is wrong: SELinux and AppArmor implement the mandatory model, not the role-based one, and access control models as a taxonomy covers all three schemes including role-based.
- B is wrong: Access control models is an operating-system-agnostic taxonomy, not one scoped to particular platforms other than Linux.
- C is wrong: The reverse is true — SELinux and AppArmor are the command-bearing concept here, queried with `getenforce` and `aa-status`, while access control models is the conceptual taxonomy.

### 65.

An employee leaves the organisation. Under SSO, what single action removes their access to every participating application?

- **A.** Nothing single-handed works; each participating application must have its own account disabled separately.
- **B.** Revoking the employee's MFA enrolment, since SSO and MFA are the same control.
- **C.** Disabling the account at the identity provider, since applications trust its assertion rather than running their own login.
- **D.** Rotating the shared password used across every application.

**Answer: C.** Under SSO, applications trust the identity provider's signed assertion about who the user is rather than running their own login. Disabling the account at that one central point removes access everywhere at once, which is what makes offboarding reliable.

- A is wrong: This describes password synchronisation, sometimes called same-sign-on, where each application still runs its own login — SSO's point is precisely to avoid that per-application cleanup.
- B is wrong: SSO changes how many times a user authenticates, not how strongly; MFA is a separate, complementary control enforced at the identity provider.
- D is wrong: Under SSO there is no password at the application to rotate — only an assertion from the identity provider to validate.

### 66.

A security architect wants to reduce how many separate passwords staff must choose and remember. Does deploying SSO by itself also make each individual login stronger?

- **A.** No. SSO reduces credential sprawl and centralises the control point, but it changes how many times a user authenticates, not how strongly.
- **B.** Yes, since consolidating logins into one identity provider automatically enforces a stronger authenticator everywhere.
- **C.** Yes, because SSO always requires public-key authentication instead of a password.
- **D.** No, and SSO actually weakens security in every deployment by design.

**Answer: A.** SSO reduces the number of separate passwords a user manages and centralises the control point for offboarding, but it does not by itself make any single authentication event stronger. Putting every application behind one login concentrates risk there, which is why MFA is enforced at the identity provider alongside SSO rather than replaced by it.

- B is wrong: SSO centralises where authentication happens; strengthening it to require MFA is a separate, deliberate decision enforced at the identity provider.
- C is wrong: SSO does not mandate any particular authenticator type; what it changes is how many separate logins the user performs.
- D is wrong: SSO concentrates risk in one login, which is exactly why MFA is enforced alongside it rather than a reason to call SSO weaker in every case.

### 67.

An administrator sets `PasswordAuthentication no` in `sshd_config`, reloads the daemon, and users are still prompted for a password. `PermitRootLogin` is untouched at its default. What is the most likely cause?

- **A.** `KbdInteractiveAuthentication` is still at its default `yes`, and on a PAM-backed system that path can still prompt for a password.
- **B.** The setting only takes effect after a full system reboot, not after a daemon reload.
- **C.** `PermitRootLogin` at its default `prohibit-password` is overriding `PasswordAuthentication` for all accounts, not just root, when `prohibit-password` only governs how root itself may authenticate and does not extend to overriding the setting for other named accounts.
- **D.** The public key was never generated with `ssh-keygen`, so the server falls back to a password prompt automatically.

**Answer: A.** Disabling `PasswordAuthentication` is not by itself sufficient to stop password entry: `KbdInteractiveAuthentication` defaults to `yes`, and on a PAM-backed system that path can still prompt for a password. A real baseline sets both to `no`.

- B is wrong: Changes take effect when the daemon reloads its configuration; a reboot is not required, and the running session is unaffected only until that reload happens.
- C is wrong: `PermitRootLogin prohibit-password` only governs root's login method; it does not override the `PasswordAuthentication` setting for ordinary named accounts.
- D is wrong: Whether a client has a key pair does not change what the server's `sshd_config` permits; the server is still offering a password path because that directive is separately enabled.

### 68.

Right after a hardening change to `sshd_config`, a new connection attempt from a second terminal times out — it never even reaches a login prompt. The first, still-open session continues to work normally. Where should the administrator look first?

- **A.** The `AuthorizedKeysFile` setting, since a wrong path there is the most common cause of a hung connection.
- **B.** A firewall rule or security group blocking the connection, since nothing in `sshd_config` itself produces a timeout.
- **C.** `StrictModes`, since a permissive `.ssh` directory always produces a silent timeout instead of an explicit rejection.
- **D.** The `Port` directive, since changing it always causes new connections to time out until clients are updated.

**Answer: B.** The guide's diagnostic order treats a timeout as evidence that traffic is not reaching the daemon at all — a firewall rule or security group, not an `sshd_config` problem, since nothing in the server configuration itself produces that particular symptom. The still-open first session and the immediate rejection cases (refused, publickey denied) point to different, later-stage causes instead.

- A is wrong: A wrong `AuthorizedKeysFile` produces a `Permission denied (publickey)` rejection once the daemon is reached, not a connection that times out before ever reaching it.
- C is wrong: `StrictModes` causes the daemon to refuse to use a permissively-writable `authorized_keys` file, which is a rejection after reaching the daemon, not a pre-daemon timeout.
- D is wrong: A wrong port produces an immediate connection-refused or a client connecting to the wrong service, not a silent timeout, and moving the port is a documented, deliberate option rather than a fault by default.

### 69.

A baseline sets `PermitRootLogin no`. A colleague argues this is redundant because `PermitRootLogin prohibit-password`, the default, already blocks root entirely. Are the two settings equivalent?

- **A.** No — `prohibit-password` still permits root to log in with a key; only `no` disables root login outright.
- **B.** Yes, since both values block every method of root login identically.
- **C.** Yes, because `PasswordAuthentication no` elsewhere in the file already makes the `PermitRootLogin` value irrelevant.
- **D.** No, but only because `prohibit-password` additionally requires MFA for any root login attempt.

**Answer: A.** `PermitRootLogin prohibit-password`, the OpenSSH default, disables password and keyboard-interactive authentication for root but still permits root to log in with a key. Only `PermitRootLogin no` disables root login outright, which is why a baseline that wants no direct root access at all sets it explicitly rather than relying on the default.

- B is wrong: This is the exact trap the guide names: `prohibit-password` is not the same as `no`, because key-based root login still succeeds under the default.
- C is wrong: `PasswordAuthentication` governs password login generally, but `PermitRootLogin prohibit-password` independently still allows root to authenticate by key regardless of that other setting.
- D is wrong: Neither value has anything to do with MFA enrolment; the distinction is specifically about which authentication method root is still permitted to use.

### 70.

Two directives for the same keyword appear in `sshd_config` — one in the main file, one in a drop-in file included earlier via `Include /etc/ssh/sshd_config.d/*.conf` near the top. Which value does OpenSSH actually use, and which command reveals it without guessing?

- **A.** The drop-in file's value wins, because unless a keyword documents otherwise the first obtained value is used — and `sshd -T` prints the effective configuration to confirm it.
- **B.** The main file's value wins, since directives placed later in a file always override ones read earlier.
- **C.** Neither wins outright; `sshd` merges both values and applies whichever is more restrictive.
- **D.** The drop-in file's value wins, and `sshd -t` is what prints the effective merged configuration to confirm it, since the daemon has no separate flag for dumping resolved keyword values.

**Answer: A.** `sshd_config` follows first-obtained-value semantics — the opposite of most formats — so a drop-in file included earlier in the main file wins over a directive written further down. `sshd -T` prints the effective configuration, which is the documented way to confirm which value is actually in force rather than guessing from file order alone.

- B is wrong: This is last-wins reasoning, which is the opposite of `sshd_config`'s actual first-obtained-value behaviour — the earlier-included drop-in value wins instead.
- C is wrong: `sshd_config` does not merge conflicting scalar directives by restrictiveness; it takes the first value it obtains and ignores subsequent ones for that keyword.
- D is wrong: `sshd -t` only validates syntax and reports errors before a reload; it is `sshd -T` that prints the effective configuration a drop-in file may be overriding.

### 71.

A TLS 1.3 handshake performs an ephemeral Diffie-Hellman key exchange and a certificate-based signature over that handshake, and then switches to a different kind of cryptography for the actual application data. Why does the protocol switch rather than using one kind throughout?

- **A.** It switches because asymmetric encryption is strictly stronger and the handshake only needs the weaker symmetric form for routine traffic.
- **B.** Asymmetric cryptography authenticates the peer and agrees a fresh key without a pre-shared secret; symmetric cryptography is fast enough to carry the bulk traffic that follows.
- **C.** It switches because symmetric cryptography is what proves the server's identity, while asymmetric only ever protects confidentiality.
- **D.** It switches because hashing replaces asymmetric cryptography once the handshake completes, since hashing is faster still and a digest of the traffic keys is all the record layer needs to keep the channel confidential afterwards.

**Answer: B.** Symmetric and asymmetric cryptography exist together rather than one replacing the other because they solve different problems: asymmetric cryptography authenticates the peer and agrees a fresh key without a pre-shared secret, and the resulting symmetric key then protects the actual traffic efficiently. TLS's handshake-then-bulk-data structure is this division made concrete.

- A is wrong: Asymmetric is not "stronger" than symmetric; the guide notes key sizes are not even comparable across the two families, and each solves a different problem.
- C is wrong: This reverses the roles — the certificate and asymmetric handshake are what authenticate the server, not the symmetric traffic keys.
- D is wrong: Hashing is a separate, one-way primitive used for integrity, not a substitute for the symmetric encryption that protects the application data itself.

### 72.

Symmetric-versus-asymmetric encryption, hashing, and password hashing and salting are compared as a trio. Which single property most cleanly separates encryption from both kinds of hashing in that comparison?

- **A.** Reversibility, since encryption is meant to be undone by whoever holds the right key, while both hashing forms are one-way by construction.
- **B.** Key involvement — encryption never uses a key, while both hashing forms require one.
- **C.** Output length — encryption always produces a longer output than either hashing form.
- **D.** Algorithm age — encryption algorithms are all newer than the hash functions used for either purpose, a property the comparison table does not track at all when separating the three primitives from one another.

**Answer: A.** The comparison's separating axis is reversibility and speed: encryption is designed to be undone by the key holder, while general hashing is one-way and fast and password hashing is one-way and deliberately slow. Using a general-purpose hash where a password hash belongs, or expecting either hash to be reversible, is the error the table exists to prevent.

- B is wrong: This reverses the table: encryption involves a shared key or a key pair, while general hashing uses no key at all and password hashing uses a salt and work factor instead of a key.
- C is wrong: The comparison does not turn on output length at all; it turns on whether the transformation can be undone.
- D is wrong: Relative age of the algorithms is not a property the guide's table tracks or that determines which primitive to choose for a job.

### 73.

A team hardens a freshly provisioned host once at build time and never revisits the configuration. Why does the guide treat hardening as something verified periodically rather than done once?

- **A.** Because configuration drifts as software is installed and rules are added, so a baseline that was correct at build time can become permissive again over time.
- **B.** Because CIS Benchmarks are updated so frequently that any host is out of date within days regardless of drift — the benchmark revision, not the host, is what a periodic check is tracking.
- **C.** Because vendors patch default installations weekly, making any earlier hardening pass obsolete.
- **D.** Because attack surface only ever grows through newly disclosed CVEs, not through configuration changes.

**Answer: A.** Vendors ship for broad usability, and a hardening baseline applied once reflects the system's state at that moment only. As software is installed and rules are added over the system's life, configuration drifts away from that baseline, which is why hardening is verified periodically against a published standard rather than treated as a one-time task.

- B is wrong: Benchmark cadence is not the reason periodic verification matters; the guide points to configuration drift on the host itself, from ordinary operational changes.
- C is wrong: Patching addresses named defects, a separate concern from whether unnecessary services, accounts, or ports have crept back in since the initial hardening pass.
- D is wrong: Attack surface grows through configuration changes too — a newly installed package or re-enabled account — which is exactly the drift hardening verification is meant to catch.

### 74.

A fresh Linux install ships with several services enabled and a permissive default account that most administrators never need. Why does this happen, and whose responsibility is it to fix?

- **A.** Vendors ship for broad usability rather than for any one threat model, so tightening the defaults for a specific deployment is the operator's hardening task.
- **B.** It happens because the vendor made an oversight, and the fix is to wait for a vendor patch that disables the defaults.
- **C.** It happens because the CVE program has not yet catalogued the default configuration as a weakness, and the vendor is barred from tightening the defaults until an identifier has been assigned.
- **D.** It happens only on systems without SELinux or AppArmor installed, and enabling either removes the need for hardening.

**Answer: A.** Vendors ship for broad usability rather than for any particular organisation's threat model, so a default installation is necessarily more permissive than most deployments need. Hardening — removing unnecessary packages, closing ports, disabling unused accounts — is the deploying organisation's own task, not something a vendor patch resolves.

- B is wrong: This is not a defect to be patched; it reflects a deliberate usability trade-off the vendor made, which the deploying organisation is expected to tighten itself.
- C is wrong: A permissive default is not a discrete catalogued defect; it is expected behaviour a deploying organisation tightens through hardening, not something a CVE would name.
- D is wrong: Mandatory access control confines what a process may do; it does not remove unnecessary services or accounts, which is a separate hardening task.

### 75.

An engineer trained on LFS200 refers to a service's "SSL certificate" and proposes enabling "SSL" for a new internal API. What is wrong with the terminology, and does it matter for the traffic described?

- **A.** Nothing is wrong; SSL and TLS are simply two names in current use for the identical current protocol.
- **B.** The terminology only matters for web traffic; an internal API that is not HTTP can safely use SSL, because SSL and TLS diverge only at the HTTP layer and share an identical record format below it.
- **C.** The terminology is fine because TLS is a transport protocol that replaced TCP for encrypted connections.
- **D.** SSL is TLS's obsolete predecessor and must not be enabled; the object commonly called an "SSL certificate" is an X.509 certificate used by TLS, which is what should be configured instead.

**Answer: D.** "SSL" names TLS's obsolete predecessor, deprecated by RFC 7568, while the object people call an "SSL certificate" is simply an X.509 certificate (RFC 5280) used by TLS. The naming lag is why material written before TLS 1.3 became common still says "SSL" for what is in fact TLS, and an exam expects the current name.

- A is wrong: SSL is an obsolete predecessor to TLS, not an alternate name for the same current protocol, and offering it as a current choice is the trap the guide names directly.
- B is wrong: TLS is not web-only and is used across SMTP, IMAP, LDAP and database protocols, but that does not make the obsolete SSL protocol an acceptable substitute for any of them.
- C is wrong: TLS runs on top of an already-established reliable transport such as TCP rather than replacing it, which is a separate error from the SSL naming issue.

### 76.

A site serves malware over a connection with a perfectly valid, correctly configured TLS certificate. What does the padlock in the browser actually indicate in this case?

- **A.** An authenticated, encrypted channel to the named host, and nothing about whether the content served over it is safe or the operator is trustworthy.
- **B.** That the site has passed a security review and its content has been scanned for malware.
- **C.** That the connection is immune to man-in-the-middle interception for the rest of the session, when the padlock only reflects the current handshake and says nothing about interception risk for the remainder of the session.
- **D.** That the server is running the current TLS 1.3 protocol version rather than an older one.

**Answer: A.** TLS protects the channel between client and server — encrypting it, protecting it from tampering, and authenticating the server via its certificate. It says nothing about the honesty of what that server chooses to send, so a valid padlock and malicious content are entirely compatible.

- B is wrong: A certificate attests to a key-to-name binding through the CA, not to any review or scan of the site's content.
- C is wrong: The padlock reflects that the current handshake authenticated the peer; it says nothing about future compromise of the endpoint delivering malware over that same valid channel.
- D is wrong: The padlock does not itself distinguish protocol version; a connection can be encrypted under an older TLS version and still show the same indicator.

### 77.

A team reads a CVE identifier and assumes it already tells them how severe the flaw is. What does a CVE identifier actually name, and where does severity come from instead?

- **A.** The sequence number in the identifier itself encodes the CVSS score, so a higher number means a more severe flaw.
- **B.** Severity comes from how large the affected package's attack surface is, not from any separate score, with the numbering authority recording that measurement alongside the identifier it assigns.
- **C.** The identifier is only a name for the defect, assigned by a CVE Numbering Authority; severity comes from a separate CVSS score.
- **D.** Severity comes from how the flaw is classified in the risk-threat-vulnerability framework, not from a numeric score.

**Answer: C.** A CVE identifier of the form CVE-YYYY-NNNN is a name for a publicly known defect, assigned by a CVE Numbering Authority; it carries no severity information. CVSS is the separate 0.0 to 10.0 scoring system that supplies severity, and databases such as the National Vulnerability Database enrich CVE records with those scores.

- A is wrong: The sequence number is only an assignment order from the numbering authority and carries no severity information at all.
- B is wrong: Attack surface describes total exposure independent of any one defect; CVSS is the actual severity scoring system for a specific catalogued flaw.
- D is wrong: The risk framework combines likelihood and impact qualitatively; the numeric 0.0-10.0 severity for a specific CVE is CVSS, a distinct and separately maintained score.

### 78.

A patch team has to choose between a CVE scored 9.8 in a package that is installed but never run and unreachable from any network, and one scored 6.5 in a package actively serving the internet-facing login. Which should be prioritised, and on what basis?

- **A.** The 9.8, because CVSS base score alone determines patch order regardless of where the package is deployed.
- **B.** Neither should be prioritised over the other until a penetration test confirms both are exploitable, since an unexploited weakness carries no patch priority of its own.
- **C.** The 6.5 on the login service, because deployment and reachability, not the raw CVSS number alone, should drive patch priority.
- **D.** The 9.8, because patching it also reduces the host's overall attack surface more than patching the 6.5 would.

**Answer: C.** Patch priority should follow severity, whether the affected component is actually deployed and reachable, and whether exploitation is observed in the wild — not the raw CVSS number in isolation. An unreachable, unused package's high score matters less than a lower score on a service actively exposed to attackers.

- A is wrong: The guide names this exact ranking as the trap: a CVSS base score describes the flaw in the abstract, not deployment context, which is what actually determines risk.
- B is wrong: Reachability and deployment context are already known and sufficient to prioritise; a penetration test is not a prerequisite for an ordinary patch-priority decision.
- D is wrong: Patching a named defect in software that keeps running does not reduce attack surface at all; that is a separate remediation, not a reason to rank this CVE higher.

### 79.

A monthly scheduled scan reports zero findings on a host, and the scan ran unauthenticated, reading only what was exposed on the network. Is that a strong signal the host has no known weaknesses?

- **A.** No — an unauthenticated scan only sees what is exposed on the network and systematically under-reports; a clean result is weak evidence because it never saw inside the host.
- **B.** Yes, since an unauthenticated scan and an authenticated scan produce identical accuracy against a given host.
- **C.** Yes, because a clean scan result also confirms no intrusion occurred on the host during the scan window.
- **D.** This cannot be assessed without also running a penetration test, since scanning and penetration testing produce equivalent results, and an unauthenticated scan is simply the automated form of that same exercise.

**Answer: A.** An authenticated scan logs in and reads installed package versions and configuration directly, making it far more accurate; an unauthenticated scan only sees what is exposed on the network and systematically under-reports. A clean unauthenticated result is therefore weak evidence of a host's actual state, since it never looked inside.

- B is wrong: The guide contrasts the two explicitly: an authenticated scan logs in and reads package versions directly and is far more accurate than an unauthenticated one.
- C is wrong: A scan reports known weaknesses in current state; detecting an attack in progress is an intrusion detection system's job, which a vulnerability scan does not perform.
- D is wrong: Scanning enumerates and matches against a database, while a penetration test attempts exploitation and chains findings — the two are not equivalent, but the specific gap here is authentication depth, not the absence of a penetration test.

### 80.

A scanner finds a known weakness in a container's base image before it is ever deployed. Once that same image is running in production, what job does the scanner still not do that an IDPS does instead?

- **A.** Reporting the severity of the weakness it already found in the base image, which is already what a vulnerability scan reports through its matched database entries rather than the live-activity gap the question is asking about.
- **B.** Verifying the checksum of the base image against the publisher's signed digest.
- **C.** Confining what the container process may do even if it is compromised.
- **D.** Detecting an attack actually happening against the running container in real time.

**Answer: D.** Scanning container images at build time catches a vulnerable base image before it ever runs, which is the same idea as host scanning moved earlier. Once deployed, a scan still only reports known weaknesses in current state on a schedule; noticing an attack actually happening against the running container is the IDPS's continuous, present-tense job instead.

- A is wrong: Severity reporting is exactly what a vulnerability scan already does through its matched database entries; the gap is live-activity detection, not severity scoring.
- B is wrong: Checksum and signature verification is a separate supply-chain control performed at download time, not a gap between scanning and intrusion detection specifically.
- C is wrong: Confining a compromised process is mandatory access control's job, which is a distinct layer from either scanning for known weaknesses or detecting live intrusions.

### 81.

A request originates from a laptop connected to the corporate VPN. Under a zero-trust architecture, what does that origin grant the request by itself?

- **A.** Full access to any resource reachable from that network segment, since the VPN already authenticated the device.
- **B.** Nothing, since being on the VPN confers no implicit trust; the request is still authenticated and authorized on its own merits.
- **C.** A reduced attack surface — VPN traffic is automatically encrypted end to end.
- **D.** A stronger authentication factor, since VPN connection counts as something you have.

**Answer: B.** Zero trust grants no request implicit trust based on where it came from. A device being on the VPN or inside the corporate network confers nothing by itself; each request is still authenticated, authorized, and evaluated against policy on its own merits.

- A is wrong: This is the perimeter-model assumption zero trust exists to remove; VPN membership is not treated as sufficient for access to anything.
- C is wrong: Attack surface is about what is reachable at all, a separate concept from whether a request is implicitly trusted by its origin.
- D is wrong: Being on a network is not treated as an authentication factor in the NIST model; every request is still evaluated against policy independently.

### 82.

NIST SP 800-207 describes a policy decision point and a policy enforcement point. What role does each play in a zero-trust architecture?

- **A.** The decision point is a firewall at the network edge, and the enforcement point is the VPN concentrator behind it.
- **B.** The decision point grants trust once at login, and the enforcement point re-checks it only if the session is idle for a long period.
- **C.** The decision point encrypts traffic, and the enforcement point decrypts it at the destination.
- **D.** The decision point evaluates each request against identity and context; the enforcement point opens, monitors, and terminates the resulting connection.

**Answer: D.** NIST SP 800-207 describes a policy decision point that evaluates each access request against identity, device state, and other context, and a policy enforcement point that opens, monitors, and terminates the resulting connection — trust is per-session and re-evaluated rather than granted once at a boundary.

- A is wrong: Zero trust's points are per-request logical roles evaluating identity and context, not a fixed pair of perimeter appliances.
- B is wrong: Zero trust re-evaluates trust per request rather than granting it once at login and revisiting it only occasionally.
- C is wrong: Encryption and decryption describe a cryptographic transport concern, not the policy evaluation and enforcement roles these two points play.

