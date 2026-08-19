<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# Drill — Security Fundamentals :: Sensitive Data

26 question(s), every question in the bank for this scope, in concept order.

Answers follow each question, so this is study material rather than a timed test.

---

### 1.

A file owner grants a colleague read access to a shared document at their own discretion. On a second system enforcing a mandatory policy, the same owner's attempt to grant that access is refused because the policy does not permit it. Which model governs each system?

- **A.** The first is discretionary access control, where the owner decides. The second is mandatory access control, a system-enforced policy that constrains even the owner.
- **B.** Both are role-based access control, since access is being granted through a role the owner and the policy both recognise, even though neither system names a role explicitly.
- **C.** The second system is really data classification rather than access control — the document's label is what refused the grant, not any policy evaluating the request.
- **D.** The second system is attribute-based access control, evaluating request attributes rather than enforcing a uniform mandatory policy.

**Answer: A.** Under DAC, a subject granted access may pass it on at the owner's discretion. Under MAC, the policy is uniformly enforced and a subject granted access is constrained from passing it on regardless of who owns the object. The separating axis is who holds the decision: the owner in the first case, a system-enforced policy the owner cannot override in the second.

- B is wrong: Nothing in the scenario names a role; the first system is decided at the owner's discretion and the second by a uniformly enforced policy, not by role assignment.
- C is wrong: A label only tells an enforcement mechanism what to enforce; the refusal here comes from a mandatory access control policy, the one place labels and enforcement genuinely fuse.
- D is wrong: The scenario describes a policy uniformly enforced across all subjects and objects, which is the defining feature of MAC rather than an attribute evaluation.

### 2.

A company with 3,000 employees maintains per-user, per-file access grants and finds the list unmanageable as staff join and leave. Which access control model addresses the maintenance problem, and what does adopting it not by itself guarantee?

- **A.** Role-based access control, and it is automatically more secure than discretionary access control because roles are mandatory rather than discretionary.
- **B.** Role-based access control — permissions are defined once per role instead of once per user per object, but adopting it does not by itself make the system more secure than discretionary access control, only cheaper to maintain.
- **C.** Data classification — assigning a sensitivity label to each file removes the need to track individual grants, since the label itself becomes the access decision.
- **D.** Placing every employee in a single Unix group achieves the same result as role-based access control, since a group is also a role.

**Answer: B.** RBAC attaches permissions to roles instead of individual identities, so churn in headcount does not multiply into per-object grants — a maintenance-cost argument, and the common organisational choice for anything with meaningful headcount. It is not automatically more secure than DAC in the abstract, a data label is not a substitute for an access-granting mechanism, and a Unix group remains a discretionary construct under the owner's control rather than an administered role.

- A is wrong: Roles are administered rather than owner-discretionary, but that is a maintenance property, not a security guarantee over DAC by itself.
- C is wrong: A label tells an enforcement mechanism what to enforce; it does not itself replace the work of granting and revoking access.
- D is wrong: A Unix group is a DAC construct — the file's owner still decides what the group may do with it — and is not the same mechanism as administered role assignment.

### 3.

A production database is encrypted and access-restricted. Its nightly dump lands in a storage bucket with no encryption and broad read access. What is the state of the data's protection?

- **A.** Unchanged — the production database's controls are what matter, since the backup is only a secondary artefact.
- **B.** Downgraded, but only until the bucket's retention period causes the dump to be securely deleted, at which point the earlier exposure is treated as if it never happened.
- **C.** Downgraded to the weakest copy — a backup inherits the classification, encryption and access-control requirements of its contents, and an attacker will take the weakest copy available.
- **D.** Unchanged, provided the backup encryption keys are stored securely even though the backup itself is not encrypted, since secure key custody is what actually protects the data.

**Answer: C.** A backup inherits everything about its contents: the same classification, the same encryption requirement, the same access control. An encrypted production database dumped nightly to an unencrypted bucket has been downgraded to the weakest copy, and an attacker will take the weakest copy — the control travels with the data, not with the server it started on.

- A is wrong: This is exactly where the protection is forgotten: whoever can read the backup can read the data, regardless of how well the primary copy was protected.
- B is wrong: The exposure exists for however long the copy sits unprotected in the bucket; a future deletion date does not remedy the present downgrade.
- D is wrong: Securely stored keys protect nothing if the backup they would unlock was never encrypted with them in the first place.

### 4.

A seven-year-old customer record is deleted from production under a seven-year retention rule, but a copy still exists in a nightly backup set with a ninety-day expiry. When does that record actually cease to exist?

- **A.** Immediately — deleting the production copy satisfies the retention obligation regardless of what any backups retain, since backups are not considered part of the same dataset.
- **B.** Ninety days later, when the backup set's own expiry ages the copy out — surgical deletion inside backup sets is generally infeasible, so the backup's expiry is the record's real end of life.
- **C.** Never, since a legal hold automatically attaches to any record once it leaves production and enters a backup set.
- **D.** Immediately, provided the production deletion used a Purge-category sanitisation technique rather than an ordinary delete.

**Answer: B.** Retention applies to copies, and backups are copies. Deleting a record from production while it survives in a nightly backup means the obligation was not fully met the moment production is cleared; the practical answer is usually to let the backup's own expiry age the copy out, since surgical deletion inside backup sets is generally infeasible — the backup's expiry, not the production delete, is the record's real end of life.

- A is wrong: A record surviving in a nightly backup and a warehouse extract means the retention obligation was not met just because the production copy is gone.
- C is wrong: A legal hold is triggered by pending litigation naming specific records, not by the ordinary act of a record existing inside a routine backup rotation.
- D is wrong: Sanitising the production copy thoroughly says nothing about the separate copy still sitting in the backup set, which is unaffected by how the primary was disposed of.

### 5.

An intrusion occurred in March but was not discovered until a security review in July. When does GDPR's 72-hour notification clock start?

- **A.** In March, when the intrusion actually happened, regardless of when anyone noticed it.
- **B.** It does not start at all, since a breach discovered outside the data's retention window carries no notification duty, regardless of how the breach itself came to light.
- **C.** In July, on becoming aware of the breach — the deadline is to notify from that point, not to have finished remediating the March intrusion.
- **D.** In July, but only if the affected data was found in a backup rather than in the production system.

**Answer: C.** GDPR Article 33(1) requires notification without undue delay and, where feasible, not later than 72 hours after becoming aware of the breach. The clock starts at awareness, not at intrusion — a compromise that went unnoticed for months still starts its 72 hours the day it is discovered, and the deadline is a deadline to notify, not a deadline to have finished remediating.

- A is wrong: The clock is not backdated to the moment of compromise; awareness, not intrusion, is the trigger the article names.
- B is wrong: Retention windows govern how long data may be kept, not whether a breach discovered later must be reported; the two obligations are independent.
- D is wrong: Where the compromised data was stored has no bearing on when the clock starts; awareness of the breach is what triggers it, not which copy was affected.

### 6.

A breach is assessed as likely to result in a high risk to individuals' rights and freedoms, but the affected data had been encrypted throughout. What follows under GDPR?

- **A.** Neither notification is required, since encrypted data that is later exposed is not treated as a breach at all, no matter what access an attacker actually gained.
- **B.** Both notifications are excused, because encryption satisfies GDPR's requirements regardless of the risk assessment's outcome.
- **C.** The supervisory authority is still notified under Article 33; the individual communication under Article 34 is excused because the encryption rendered the data unintelligible to anyone unauthorised.
- **D.** Only the individual communication under Article 34 is required; the supervisory authority is notified only when HIPAA also applies.

**Answer: C.** GDPR splits the duty in two. The supervisory authority is notified under Article 33 essentially whenever there is a risk. The affected individuals are told separately under Article 34, and only when the breach is likely to result in a high risk — and Article 34(3)(a) excuses even that individual communication where protective measures such as encryption rendered the data unintelligible to anyone unauthorised, which is why encryption at rest changes the notification calculus without eliminating the regulator notification.

- A is wrong: Article 4(12) defines a personal data breach by the security failure itself, including unauthorised access, regardless of whether the data was encrypted.
- B is wrong: Article 34(3)(a)'s exemption is written for the individual communication specifically; it does not extend to the separate duty to notify the supervisory authority.
- D is wrong: HIPAA is a separate US regime and has no bearing on whether GDPR's own Article 33 duty to the supervisory authority applies here.

### 7.

A spreadsheet carries the label 'Public' under the company's classification scheme, but one of its columns holds employees' home addresses and dates of birth. Which statement correctly separates the two questions this raises?

- **A.** Because the column is PII, the label is necessarily wrong and must always read 'Restricted', since any presence of personal data forces the highest available classification tier.
- **B.** The label question and the PII question are the same question asked twice, since classification schemes exist to flag files containing personal data.
- **C.** The label is a policy decision the organisation can revise; whether the data is PII is a fact about the content, true regardless of what label the file carries.
- **D.** Neither question matters until the file actually leaves the organisation, since legal obligations attach only on export.

**Answer: C.** Data classification is a decision an organisation makes about a file and can revise; whether the file contains PII is a fact about its content that a mislabelling does not change. The two axes drive different things — classification drives internal handling rules, PII status drives external legal duties — which is exactly what the competency's owned comparison, data classification versus personally identifiable information, turns on.

- A is wrong: PII status and the required classification level are related but not identical questions; a scheme could reasonably classify low-sensitivity PII below Restricted.
- B is wrong: Classification also governs plainly non-personal data such as source code and pricing models, so the two questions are not interchangeable.
- D is wrong: PII obligations travel with the data wherever it sits, including internal copies, well before any export occurs.

### 8.

A dataset is assembled by merging three source files: one labelled Internal, one Confidential, and one Restricted. Under conventional classification scheme rules, what label does the merged dataset carry?

- **A.** Internal — most of the source files were not Restricted, so the majority label applies to the merge, the same way a vote would decide among competing classifications.
- **B.** Confidential — mandatory access control automatically re-labels merged data to the median sensitivity of its inputs.
- **C.** Whatever label the employee who performed the merge personally holds clearance for, since the clearance of the person doing the work determines the sensitivity of what they produce.
- **D.** Restricted; aggregation conventionally takes the highest label present, because the merged set discloses everything its most sensitive member discloses.

**Answer: D.** Where a set mixes labels, schemes conventionally give the aggregate the highest label present, because the set discloses everything its most sensitive member discloses. Neither a majority vote nor an access-control mechanism computes that label — classification is a decision applied to the data itself, distinct from both vote-counting and from the clearance held by any person handling it.

- A is wrong: Labelling by majority ignores that exposing the set discloses the most sensitive member regardless of how many less-sensitive files sit alongside it.
- B is wrong: MAC enforces a policy against labels; it does not compute a new label by averaging the inputs of a merge.
- C is wrong: Clearance belongs to a person; classification belongs to the data. Conflating the two is the trap this concept warns about directly.

### 9.

A ransomware attack encrypts a company's file server, and separately an employee emails a customer list to a personal account. Which incident does data loss prevention address?

- **A.** The ransomware attack — 'data loss prevention' exists to stop the organisation losing its data to encryption or deletion.
- **B.** The emailed customer list; DLP addresses loss of control over data leaving the organisation, not loss of availability.
- **C.** The ransomware attack, because backups are themselves a data loss prevention control under NIST SP 800-53.
- **D.** Neither — DLP only activates once data has been formally classified as Restricted, and this scenario names no classification.

**Answer: B.** The name is a trap, and the exam uses it: 'loss' here means loss of control — leakage, exfiltration, disclosure — not loss of availability. A candidate who reads 'data loss prevention' as 'stops us from losing our data' reaches for backups, which prevent an entirely different failure. The emailed customer list is exactly the kind of exfiltration DLP is built to catch.

- A is wrong: This reads 'loss' as availability loss, which is the exact misreading the name invites; that failure mode is a backup and recovery problem instead.
- C is wrong: Backups address availability loss and sit under system backup controls, not under the exfiltration-prevention controls DLP is assembled from.
- D is wrong: DLP is more effective when classification exists, but it still falls back to content matching without one — it does not switch off entirely for unclassified data.

### 10.

A firewall permits an outbound HTTPS connection to a partner's API. A DLP rule then blocks one specific message across that same connection. How is that possible?

- **A.** It isn't possible — once a firewall permits a connection, every message across it is necessarily allowed through, since nothing downstream of the firewall inspects the traffic further.
- **B.** A firewall decides by address, port and protocol; DLP decides by what the payload contains, so it can act within a connection the firewall has already allowed.
- **C.** The DLP rule is actually a mandatory access control policy overriding the firewall's discretionary decision.
- **D.** The message was blocked because it contained a credential, which only a secrets manager, not DLP, is able to detect inside outbound network traffic.

**Answer: B.** DLP is not a firewall: a firewall decides by address, port and protocol, while DLP decides by what the payload contains, which is why it can permit a connection at the network layer and still block one message across it once the content inside is inspected. The two controls answer different questions and operate at different points in the same path.

- A is wrong: This treats the firewall's address-and-port decision as the only control on the path, ignoring that DLP inspects content at a different layer entirely.
- C is wrong: DLP and firewalling are both network controls operating on traffic; neither is an access control model governing subjects and objects the way DAC or MAC does.
- D is wrong: A secrets manager stores and hands out credentials; detecting a credential inside outbound traffic and blocking it is exactly the content-inspection job DLP performs.

### 11.

A record is subject to a seven-year tax retention rule and a GDPR storage-limitation obligation to delete once no longer necessary. The data has been unnecessary for two years, but the seven years has not yet elapsed. What must happen to the record right now?

- **A.** It is deleted immediately, since the privacy obligation to minimise data always overrides a retention floor.
- **B.** Whether it is kept depends on whether a personal data breach has occurred involving this record in the meantime, since a breach resets which retention rule applies to it.
- **C.** It must be Cleared but not yet Purged, since only two of the seven years under the tax rule have passed, and Clear is the appropriate interim state for partially aged records.
- **D.** It is kept, because the tax rule is a floor that has not yet been reached, even though the privacy ceiling was crossed two years ago.

**Answer: D.** A retention rule has two edges pointing in opposite directions. Records and tax rules set a floor — deleting early violates it. Privacy rules set a ceiling — keeping past necessity violates it. A single dataset can be subject to both, and here the floor still binds even though the ceiling was crossed earlier; the correct answer is neither 'keep indefinitely' nor 'delete the moment the ceiling is crossed'.

- A is wrong: Deleting before a legal retention floor is reached is itself the violation the floor exists to prevent — the two obligations do not resolve by one automatically outranking the other.
- B is wrong: A breach affecting the record would raise a separate notification duty, but it does not change which retention rule currently governs the record's disposition.
- C is wrong: Clear and Purge are sanitisation techniques applied at disposal, not partial states a record passes through while a retention clock is still running.

### 12.

A retention schedule marks a customer's records for deletion this month, but a legal hold was placed on that customer's data last week for pending litigation. What happens to the scheduled deletion?

- **A.** It proceeds as scheduled, since a legal hold only prevents new data from being created, not existing data from being deleted.
- **B.** It is suspended: records under a legal hold must not be destroyed even though the schedule says their time is up, until the hold is lifted.
- **C.** It proceeds for the production copy, but the backup copy is retroactively covered by the hold instead, since a hold attaches to whichever copy is created most recently.
- **D.** It is blocked by the data loss prevention system rather than by the retention process, since DLP is what enforces legal holds.

**Answer: B.** A legal hold suspends the retention schedule: once a hold is in place for a matter, the affected records must not be destroyed even if the schedule says their time is up, and the hold overrides the schedule until it is lifted. It applies to the records themselves, wherever they sit, and is enforced by suspending the retention process rather than by any content-inspection control.

- A is wrong: A legal hold applies to existing records precisely to prevent their destruction while a matter is pending; it is not limited to future data.
- C is wrong: A legal hold covers the affected records wherever they exist, including production; it does not selectively skip the copy the litigation is actually about.
- D is wrong: DLP inspects data leaving the organisation; a legal hold is enforced by suspending the retention schedule itself, not by a content-inspection control.

### 13.

A service full-disk-encrypts its database volume and terminates every client connection over TLS. Which of the three data states remains unprotected by either control?

- **A.** In use. Plaintext exists inside the server process's memory while it operates on the data, and neither the disk encryption nor the TLS session reaches that memory.
- **B.** At rest — because the disk's encryption key is stored on the same host as the ciphertext, the control does not really count as protecting the state.
- **C.** None — encrypting the disk and using TLS between every endpoint covers the data everywhere it exists, leaving no state in the pipeline that still needs a separate control.
- **D.** In transit — because a DLP inspection point at the network boundary decrypts and re-encrypts the TLS stream, briefly exposing it.

**Answer: A.** Full-disk encryption protects information located on the storage component, and TLS protects it while it is on the wire between endpoints. Neither reaches the address space of the process that is actually working on the data, which is why data in use is the hardest of the three states and has no everyday answer built from 'we encrypted it'.

- B is wrong: That is a real custody concern, but it belongs to key management, not to whether the at-rest state itself is covered here.
- C is wrong: This is the assumption the third state exists to break: in use has no comparable boundary on an ordinary system.
- D is wrong: That describes a specific inspection architecture, not a gap in TLS itself, and is not what leaves this scenario's in-use state uncovered.

### 14.

Which technique below is reversible only by whoever holds a secret key, as opposed to being either irreversible or reversible by anyone with no key at all?

- **A.** Hashing — the digest can be reversed by anyone who runs the same one-way function again, since no secret is involved anywhere in the process.
- **B.** Base64 encoding — some systems describe it as encoding 'for security', though reversing it needs no key at all and any observer can decode it on sight.
- **C.** Encryption, since recovering the original value requires the key, and without it the ciphertext does not yield the plaintext.
- **D.** A salted hash, since adding a key-encrypting key to the salt makes the resulting digest reversible for anyone who also knows that outer key.

**Answer: C.** The three transformations sit on a fixed axis. Encryption is reversible with a key. Hashing is one-way, keyless, and produces a digest nothing is recovered from. Encoding is reversible by anyone with no key at all and provides no security whatsoever. Only encryption sits at the 'reversible, but only with a key' point on that axis.

- A is wrong: Hashing is a one-way function; no key is involved and nothing is recovered from the digest by design.
- B is wrong: Encoding is reversible by anyone with no key whatsoever; describing it as a security measure misdescribes it by definition.
- D is wrong: This mixes two unrelated mechanisms: a key-encrypting key wraps other keys, and salting a hash does not turn a one-way digest into a reversible one.

### 15.

What does a cryptoperiod bound, and why does SP 800-57 recommend bounding it deliberately?

- **A.** The number of times a key may be used, regardless of how much time has elapsed since it was generated, since usage count rather than elapsed time is what SP 800-57 actually bounds.
- **B.** The span of time a key is authorised for use; a shorter cryptoperiod limits how much material is available for cryptanalysis and how much is exposed if that one key is compromised.
- **C.** The interval at which a secret store rotates every credential it holds, cryptographic or not, since a cryptoperiod is simply another name for a rotation schedule.
- **D.** The time before a key must be sanitised using the Clear, Purge or Destroy categories, since those disposal categories are what a cryptoperiod is measuring.

**Answer: B.** SP 800-57 Part 1 defines a cryptoperiod as the time span during which a specific key is authorised for use, and bounds it deliberately: a shorter cryptoperiod limits both the material available for cryptanalysis and the exposure if that single key is compromised. It is a time-based limit on one key's authorised lifetime, distinct from a use count, from the broader practice of secrets rotation, and from the separate question of how media is sanitised.

- A is wrong: A cryptoperiod is a time span, not a use count, so this substitutes a different, unrelated limiting factor.
- C is wrong: Secrets management is the broader operational discipline covering every credential; a cryptoperiod is specific to a single cryptographic key's authorised lifetime.
- D is wrong: Those categories describe how media is sanitised at disposal, a different concern from how long a key remains authorised for active use.

### 16.

A team rotates its outer key-encrypting key every quarter without re-encrypting any of the data that key ultimately protects. How is that possible?

- **A.** It isn't really possible — every key rotation must re-encrypt the underlying data, so the team's process is unsound and will eventually corrupt the dataset it protects.
- **B.** The data was pseudonymized rather than encrypted, so no key ever protected it directly in the first place, which is why nothing needed to change when the outer key rotated.
- **C.** The data was in transit at the time of rotation, so no at-rest key ever needed to change.
- **D.** Envelope encryption — the key-encrypting key only wraps the data-encryption key, so rotating the outer key re-wraps the inner one without touching a byte of the underlying data.

**Answer: D.** Rotation in practice usually means envelope encryption: a data-encryption key protects the data directly, and a key-encrypting key protects that data-encryption key. Rotating the outer key re-wraps the inner one without re-encrypting a byte of the data itself, which is exactly what lets the outer key rotate on a quarterly schedule at negligible cost.

- A is wrong: This is precisely what envelope encryption is designed to avoid; rotating the outer key deliberately does not require touching the data it indirectly protects.
- B is wrong: The scenario states the data is protected by an encryption key hierarchy, not that it was replaced by a token — pseudonymization is a different technique entirely.
- C is wrong: Nothing in the scenario places the data in transit, and the explanation for cheap rotation is envelope encryption's structure, not which state the data happened to be in.

### 17.

Which of the three techniques is the only one that is genuinely one-way, with no additional information anywhere that could reverse it?

- **A.** Anonymization, which removes the association between the data and the data subject outright, unlike masking or pseudonymization.
- **B.** Pseudonymization — GDPR Article 4(5) requires the additional information needed to re-attribute the data to be destroyed immediately after use.
- **C.** Masking — hiding a value in a display permanently alters the underlying database record.
- **D.** Anonymization, but only for data that was never PII in the first place.

**Answer: A.** Masking hides a value in a display or a copy while typically leaving the original intact behind it. Pseudonymization substitutes a token or hashed identifier and retains, separately, whatever is needed to reverse it — GDPR Article 4(5) requires that additional information to be kept, not destroyed. Only anonymization removes the association outright, which is why it alone is genuinely one-way.

- B is wrong: Article 4(5) requires that additional information to be kept separately and protected, not destroyed — the mapping's continued existence is exactly why pseudonymized data stays personal data.
- C is wrong: Masking is a presentation control: it typically leaves the original value intact behind the display, which is the opposite of an irreversible change.
- D is wrong: Anonymization is a technique applied to data that was identifying; data that was never PII needs no such technique to begin with.

### 18.

A company hashes customer email addresses before sharing a dataset with a vendor and calls the result anonymized. Is that assessment correct?

- **A.** Yes — applying any one-way function to an identifier produces anonymized data by definition, regardless of how small or guessable the space of possible inputs happens to be.
- **B.** No, but only because a data loss prevention rule would have blocked the export regardless of which technique was used.
- **C.** Yes — and Article 34(3)(a) confirms that hashed data outside GDPR's scope never needs to be reported if it is later exposed.
- **D.** No — the input space of email addresses is small enough to enumerate, so hashing them is pseudonymization at best, and the data remains personal data under GDPR.

**Answer: D.** Anonymization must survive an attempt to re-identify. Hashing an email address is pseudonymization rather than anonymization because the input space of plausible email addresses is small enough to enumerate, so the mapping is effectively recoverable without any separately held key. Pseudonymized data remains personal data under GDPR, unlike data that has genuinely been anonymized under Recital 26.

- A is wrong: One-way is necessary but not sufficient; if the input space is small enough to enumerate, the function is reversible in practice even though no key is involved.
- B is wrong: Whether a DLP rule would have intervened is a separate control question and has no bearing on whether hashing achieves true anonymization.
- C is wrong: Article 34(3)(a) excuses individual notification where data was rendered unintelligible, which presumes the data is still in scope; it does not establish that hashing places data outside GDPR.

### 19.

An analytics export contains a browsing session ID, a product SKU viewed, a postcode, and a date of birth — no name, account number or email address anywhere in the file. Applying NIST SP 800-122's two-part test, what is the status of this export?

- **A.** It is PII, because the postcode combined with the date of birth is linked-or-linkable information capable of identifying a person even without a direct identifier.
- **B.** It is not PII, because no single field in the file can distinguish or trace an individual's identity by itself, and combination effects only matter once a name or account number is also present.
- **C.** It is a classification question rather than a PII question, since data classification exists precisely to flag files containing personal data.
- **D.** It stays anonymous unless the vendor later joins it to an account number, so no obligation attaches to the file as exported today, only to whatever the vendor might eventually build from it.

**Answer: A.** NIST SP 800-122 splits PII into information that distinguishes or traces an identity by itself and information that is linked or linkable to one in combination. A postcode and a date of birth carry no direct identifier but routinely narrow a population to a single person, which places the export in the second category regardless of what label the file carries or what a downstream vendor might later do with it.

- B is wrong: Stopping the analysis at direct identifiers is exactly the trap: removing a name does not end the question if what remains is still linkable.
- C is wrong: Classification is a label the organisation assigns; PII is a fact about the content that holds whether or not any label has been applied.
- D is wrong: The postcode-and-date-of-birth combination is already linkable on its own; waiting for a future join understates the risk in hand.

### 20.

A web service logs visitors' IP addresses and nothing else. Under GDPR Article 4(1), read with Recital 26, when does that log hold personal data?

- **A.** Whenever the person behind an address can be identified directly or indirectly by means reasonably likely to be used, since Article 4(1) names an online identifier as one of the references through which that identification may run.
- **B.** Never, because Article 4(1) confines personal data to information about a named individual, and an address identifies a device rather than a person who could be named from it.
- **C.** Only once the service joins the log to its own account table, because until that join happens Article 4(1) treats an address as anonymous information in every hand that holds it.
- **D.** Whenever the log is commercially sensitive, since Article 4(1) extends to any information whose disclosure would harm the company holding it, regardless of whom the information relates to.

**Answer: A.** Article 4(1) defines an identifiable natural person as one who can be identified directly or indirectly, in particular by reference to an identifier such as a name, an identification number, location data or an online identifier. Recital 26 supplies the test that decides the case: account is taken of all the means reasonably likely to be used, by the controller or by another person, to identify the person. An IP address is therefore neither outside the Regulation because it names a device nor personal data unconditionally in every hand, and commercial sensitivity is an unrelated axis.

- B is wrong: Article 4(1) expressly covers indirect identification and names an online identifier, so a value attached to a device is not excluded from scope by its form alone.
- C is wrong: Recital 26 asks about the means reasonably likely to be used by the controller or by another person, so an unjoined log can already be personal data before any join occurs.
- D is wrong: Sensitive and personal are separate axes: Article 4(1) turns on whether information relates to an identified or identifiable natural person, not on commercial harm.

### 21.

PHI and cardholder data both carry regulatory weight, but the source of that weight differs between the two regimes. Which statement is accurate?

- **A.** Both are federal statutes, and the same regulator enforces each of them, so the question of who has authority over a given dataset never actually arises in practice.
- **B.** PCI DSS binds every company that stores any customer data, whether or not it processes payment cards, in the same way HIPAA binds any company holding health information.
- **C.** HIPAA binds any company that happens to hold an employee's medical note, whether or not it is a covered entity, because the sensitivity of the record alone is what triggers the law.
- **D.** HIPAA is federal law enforced by HHS and binds covered entities and their business associates; PCI DSS is a council-published standard whose applicability is set by payment brands and acquirers, not by statute.

**Answer: D.** HIPAA's Security and Privacy Rules at 45 CFR Part 164 apply to covered entities and business associates and are enforced by HHS. PCI DSS, by contrast, is published by the PCI Security Standards Council, and whether an organisation must comply is a decision made by the payment brands and acquirers who run compliance programmes, not a matter of statute — so the same question, 'who enforces this and by what authority', has opposite answers for the two.

- A is wrong: PCI DSS is not legislation at all — the PCI Security Standards Council publishes it, and no government agency enforces it the way HHS enforces HIPAA.
- B is wrong: This treats PCI scope as coextensive with PII generally, when in fact it attaches specifically to cardholder and sensitive authentication data.
- C is wrong: HIPAA's obligations attach to covered entities and business associates by regulatory definition; an ordinary employer holding one medical note is not automatically either.

### 22.

A covered entity decides not to encrypt ePHI at rest, citing that encryption is 'Addressable' rather than 'Required' under the HIPAA Security Rule. Is that decision compliant by itself?

- **A.** No — Addressable requires the entity to assess whether encryption is reasonable and appropriate, implement it if so, and otherwise document why not and adopt an equivalent alternative measure.
- **B.** Yes — 'Addressable' is HIPAA's term for optional, so declining it needs no further justification beyond the entity's own preference not to implement it.
- **C.** Yes, provided the organisation's own scheme has classified the data as low sensitivity, since an internal label can substitute for a federal Security Rule assessment.
- **D.** No — but only because PCI DSS, not HIPAA, is what actually mandates encrypting this data, so the HIPAA specification itself carries no weight here at all.

**Answer: A.** Encryption of ePHI is Addressable both at rest and in transmission, and 45 CFR 164.306(d)(3) defines what Addressable means: assess whether the safeguard is reasonable and appropriate, implement it if it is, and otherwise document why not and put an equivalent alternative measure in place where that is itself reasonable and appropriate. Declining encryption with no such assessment or documentation does not satisfy that standard.

- B is wrong: Addressable is not optional; it obliges an assessment and, if the specification is not implemented, a documented reason and an equivalent alternative.
- C is wrong: An internal classification label has no bearing on a HIPAA Addressable requirement, which is assessed against reasonableness and appropriateness, not an internal scheme.
- D is wrong: The scenario is about ePHI under HIPAA's own Security Rule; pulling in PCI DSS answers a different regime's question.

### 23.

An API key is committed to a public repository. A later commit deletes the file that contained it. Is the exposure closed?

- **A.** Yes — once the file is removed from the latest commit, the key is no longer accessible to anyone.
- **B.** No, but only because the exposure now triggers a mandatory regulator notification regardless of what is done next, which is the actual remedy rather than rotating the credential.
- **C.** No. The blob survives in history, in every existing clone and fork, and in CI caches; only rotating the credential closes the exposure.
- **D.** No — the fix is to rotate the repository's disk encryption key rather than the exposed API key.

**Answer: C.** Deleting the secret in a later commit does not remove it: the blob remains in history, in every clone anyone has already taken, in forks, and in CI caches. Rewriting history is cleanup, not remediation. Rotating the credential — revoking the exposed one and issuing a replacement — is the only fix that actually closes the exposure, and it must happen before any tidying.

- A is wrong: This is the standard wrong reaction the guide names directly: the blob remains in history and in every clone anyone already took.
- B is wrong: Whether notification is owed depends on whether the exposed key gave access to protected data and on the applicable regime, which this scenario does not establish either way.
- D is wrong: The repository's own encryption key is unrelated to the credential that was exposed inside its committed content; rotating the wrong key leaves the real exposure open.

### 24.

A team moves a database password out of source code and into an environment variable that the application reads at startup. Have they achieved secrets management?

- **A.** Yes, fully — environment variables are process-local and therefore as secure as a purpose-built secret store, since nothing outside the process can ever read them.
- **B.** Partially — the value is no longer in source, but an environment variable is not access-controlled or audited and cannot be rotated without restarting the process, so it is a delivery mechanism rather than a store.
- **C.** Yes, fully — the variable is encrypted at rest by the operating system, which is all a secret store provides beyond simply holding a value for a process to read.
- **D.** No progress at all — an environment variable is exactly as exposed as leaving the password in the source file, since both are readable by anyone with host access.

**Answer: B.** An environment variable delivers a value to a process but provides none of a secret store's guarantees: it is inherited by every child process, readable by the process owner and root, and it routinely ends up in crash dumps, CI job logs and container inspect output. 'We moved it out of the code into an env var' is a partial answer — an improvement over source, but not access-controlled, audited or rotatable in the way a secret store is.

- A is wrong: Process-local is not the same as access-controlled or audited; the value still leaks into logs, dumps and any process that inherits the environment.
- C is wrong: A secret store's value is access control, an audit trail and rotation without a code change, none of which follows automatically from encryption at rest of the host.
- D is wrong: Moving it out of source does remove it from every clone and code review, which is a real improvement even though the destination still falls short of a proper store.

### 25.

A system administrator runs an ordinary file-delete command across a directory of sensitive files before decommissioning a drive. Has the data been securely deleted?

- **A.** No — an ordinary delete removes the directory entry and decrements the link count; the blocks holding the contents remain until reallocated and are recoverable.
- **B.** Yes — once a file has no directory entry pointing to it, its contents are gone from the device, since nothing else on the filesystem still references those blocks.
- **C.** Yes, provided the retention schedule for those files had already expired before the command ran, since an expired schedule makes any deletion method equally final.
- **D.** No, but only because a backup copy of the same files still exists elsewhere.

**Answer: A.** Deleting a file removes a directory entry and decrements the link count; the blocks holding the contents stay on the device until something else reallocates them, which is why undelete and forensic tools recover them routinely. NIST SP 800-88 warns specifically against methods that simply remove file pointers, and an exam option offering 'delete the files' as a disposal method for sensitive media is offering the wrong one.

- B is wrong: The contents stay on the device until something else reallocates the blocks, which is exactly why undelete and forensic tools recover them routinely.
- C is wrong: Whether the retention period has expired governs whether the data should be disposed of; it says nothing about whether the disposal method actually erased it.
- D is wrong: Even with no backup anywhere, the delete command still leaves the original blocks recoverable on this drive — the backup's existence is not what makes the answer no.

### 26.

A self-encrypting drive is retired by issuing a command that destroys its media encryption key, leaving only ciphertext behind. Which SP 800-88 category does this fall under, and what limits how much it can be trusted?

- **A.** Destroy — the drive can never store data again once its key is gone, which is what distinguishes Destroy from Purge.
- **B.** Clear — logical techniques like this only defeat simple, non-invasive recovery attempts, nothing more.
- **C.** Purge, and its trustworthiness is limited by whether the drive's retention schedule had already expired.
- **D.** Purge, via cryptographic erase — it is fast, but only as trustworthy as the drive's own encryption implementation.

**Answer: D.** SP 800-88 Rev. 2 defines Clear, Purge and Destroy as three distinct categories. Cryptographic erase is the Purge technique that destroys a self-encrypting drive's media encryption key, leaving only ciphertext — fast, but only as trustworthy as the drive's encryption implementation, and it leaves the media itself still usable, which is what separates it from Destroy.

- A is wrong: The drive remains physically usable for storage after cryptographic erase; Destroy specifically requires leaving the media unusable for storage, which this does not do.
- B is wrong: Clear defeats simple non-invasive recovery; cryptographic erase is specifically classified as Purge, rendering recovery infeasible against state-of-the-art laboratory techniques.
- C is wrong: A retention schedule governs when disposal should happen, not how much the sanitisation technique itself can be trusted once disposal is under way.

