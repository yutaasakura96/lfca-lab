# Compliance

Compliance sits in Security Fundamentals, a domain worth 14% of the exam — the 4th largest of
6 domains — under the current (2025-09-16) blueprint. The competency was added in the 2025
update, so no pre-2025 material covers it. Neither does the course: all 14 concepts are NOT
COVERED, 0 of 14 (0%), and `GDPR`, `HIPAA`, `ISO 27001` and `SOC 2` each occur zero times
across the whole of LFS200 (`research/lfs200-notes/00-course-map.md`). Everything below is
therefore sourced from primary references — the regulations, the standards, the licence texts
and the NIST publications themselves — rather than from course material.
Two cautions the rest of this file is written under: nothing here is legal advice, and a
framework's scope — what it governs and whom it binds — is the fact the exam tests, far more
often than any list of its clauses.

<a id="s-compliance-fundamentals"></a>
## Fundamentals

<a id="c-security.compliance.compliance"></a>
### Compliance
*id: `security.compliance.compliance` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-53r5, lf-lfca-program*

**What it is** Demonstrably meeting obligations imposed by law, regulation or contract — with
evidence, not merely intent. Compliance is a claim about an organisation, measured against
criteria written outside the team that runs the system — a statute, a sector rule, a contract,
or a framework the organisation has voluntarily adopted — and tested either by an internal
reviewer or by an independent assessor. Security is a claim about a system, assessed against
whether an attacker can actually defeat it. The two overlap heavily and are not the same
thing.

**Why it matters** The exam will offer "compliant" and "secure" as alternative answers to the
same scenario, and both will look reasonable. A system can be fully compliant and insecure —
every mandated control implemented, while the actual attack path was never in scope of the
mandate. A system can be genuinely secure and non-compliant — strong controls, no records
proving they ran, no lawful basis documented, no retention schedule. Neither state is
contradictory, and recognising that is the whole of this concept.

**How it works** The loop has four stages and compliance is the loop, not any one stage. An
obligation arrives from a source outside the team — a statute (GDPR), a sector rule (HIPAA), a
contract (PCI-DSS), or an internal policy the organisation has bound itself to. It is
translated into controls: NIST SP 800-53 Rev. 5 defines security controls as the safeguards or
countermeasures employed within a system or an organisation to protect the confidentiality,
integrity and availability of the system and its information and to manage information security
risk. The controls are operated, and operating them produces evidence. An assessment examines
the evidence against the obligation and produces a finding or an opinion. Break any stage and
the organisation is not compliant even if the system is perfectly safe.

**Key terms** obligation; control; evidence; assessment; attestation; scope.

**Traps** "Compliant" is not "secure", and it is also not "certified" — certification and
attestation are two ways of evidencing compliance, not what compliance is. Compliance is also
retrospective and scoped: it is always compliance *with something*, *over a period*, *for a
defined boundary*. An organisation that says "we are compliant" without naming the standard,
the period and the scope has not said anything an auditor could test.

**What the exam may test** Given a described situation — a breach at an organisation holding a
current audit report, or a hardened system with no documentation — deciding whether the gap is
a security failure, a compliance failure, or both, and which of the two a named remedy
actually fixes.

<a id="cmp-security.compliance.compliance"></a>
#### Not to be confused with: Compliance vs the CIA triad
*compares: `security.compliance.compliance`, `security.security.cia-triad`*

| | Compliance | CIA triad |
| --- | --- | --- |
| What it names | An organisation's demonstrable conformance to obligations someone else wrote | The three properties — confidentiality, integrity, availability — that controls exist to protect |
| Measured against | An external standard: a law, a contract, an audit criterion | The system's own behaviour under attack or failure |
| How it is shown | Evidence produced over a period and examined by an assessor | Testing, monitoring, and whether the property actually held |
| Can hold while the other fails | Yes — a compliant system can still be broken into | Yes — a genuinely secure system with no records still fails an audit |
| Fixed by | Documenting, scoping, and evidencing | Changing the system's controls |

The separating axis is who sets the yardstick: the CIA triad is measured against the system
itself, compliance against an obligation written outside it — which is exactly why a system
can satisfy one and fail the other.

<a id="c-security.compliance.policy-standard-and-procedure"></a>
### Policy, standard and procedure
*id: `security.compliance.policy-standard-and-procedure` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-53r5, nist-sp-800-53Ar5*

**What it is** Three tiers of written direction, separated by specificity rather than
importance. A policy states intent and who is bound: "all remote administrative access is
authenticated and logged." A standard turns that intent into a measurable, mandatory
requirement: "multi-factor authentication on every externally reachable SSH endpoint." A
procedure gives the steps that satisfy the standard: the actual commands and approvals. A
guideline — the fourth term, and the usual distractor — is recommended, not mandatory.

**Why it matters** The standard is the tier that supplies a *threshold*, so it is the tier a
control's observed performance is measured against; a policy states intent and sets no level a
control can be held to. Note the limit on that, though, because a distractor can be built out
of overstating it: a policy is not unfalsifiable. NIST SP 800-53A Rev. 5 gives AC-01 POLICY AND
PROCEDURES its own assessment objectives — "an access control policy is developed and
documented", "the access control policy is disseminated to …" — so an organisation can and does
fail on the policy tier, just not on whether a control cleared a level the policy never set.
This hierarchy is not documentation hygiene either: NIST SP 800-53 places a
Policy and Procedures control at the head of 19 of its 20 control families (the exception is
Program Management, whose PM-1 is Information Security Program Plan), so having the
documents is itself a control an assessor will look for.

**How it works** The tiers change at different costs and by different authority. Rewriting a
procedure is routine operational work. Changing a standard changes what an assessor tests
against, so it moves the compliance boundary. Changing a policy usually needs management
sign-off because it changes what the organisation has committed to. A common failure is a
policy with no standard beneath it: intent stated, nothing measurable, nothing to evidence.

**Key terms** policy; standard; procedure; guideline; mandatory versus recommended.

<a id="c-security.compliance.controls-and-evidence"></a>
### Controls and evidence
*id: `security.compliance.controls-and-evidence` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-53r5, nist-sp-800-53Ar5, nist-sp-800-100*

**What it is** A control is a safeguard — in NIST SP 800-53 Rev. 5's own wording, a safeguard
or countermeasure employed within a system or an organisation to protect the confidentiality,
integrity and availability of the system and its information and to manage information security
risk. Evidence is the artifact showing that the control actually operated: the log line, the
ticket with an approval on it, the quarterly access review with dates and a reviewer's name,
the scan report. The control is the thing that protects; the evidence is the thing that proves.

**Why it matters** Audits examine evidence, not assurances. An organisation with excellent
controls and no artifacts fails, because the assessor has nothing to sample. That gap is
routine in practice and is a favourite exam framing: the described control is genuinely in
place, and the question is what is still missing.

**How it works** Controls are classified two ways, and both vocabularies are in common use.
By function: preventive (stops it happening — MFA, a firewall rule), detective (notices it
happened — log monitoring, file integrity checking), corrective (restores afterwards —
restoring from backup, revoking a compromised key). Sourcing note, because it matters for how
much weight to put on the vocabulary: NIST SP 800-53 Rev. 5 never uses the word "detective" —
the preventive/detective split is stated in NIST SP 800-100, which says selected security
controls "are either preventive or detective in nature", and the mechanism itself is SP 800-53
Rev. 5's SI-7, which employs integrity verification tools *to detect* unauthorised changes and
then takes a separately defined action. By nature: administrative (a documented
process, training, background checks), technical (enforced by the system itself), physical
(locks, badge readers, cameras). Evidence is generated as a by-product of the control running,
which is why controls that produce no artifact — "the team reviews this informally" — are the
ones that fail. An assessor then samples: NIST SP 800-53A Rev. 5 defines examination coverage
in terms of a *representative sample* of assessment objects, reserving the whole population for
a comprehensive examination.

**Key terms** preventive/detective/corrective; administrative/technical/physical; artifact;
sampling; compensating control; design versus operating effectiveness.

**Traps** A policy document is evidence that a control was *designed*, never evidence that it
*operated* — those are two different tests, and the second is the one a period-based audit
runs. "We have MFA enabled" is an assurance; the configuration export plus the authentication
logs for the period are evidence. A compensating control is also not a waiver: it is a
different control achieving the same objective, and it has to be evidenced like any other.

**What the exam may test** Distinguishing a control from the evidence it produces, classifying
a named control as preventive, detective or corrective, and recognising that a control which
generates no artifact cannot be audited regardless of how well it works.

*Not to be confused with [audit](compliance.md#cmp-security.compliance.audit).*

<a id="c-security.compliance.audit"></a>
### Audit
*id: `security.compliance.audit` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-53r5, nist-sp-800-53Ar5, aicpa-soc2, iso-certification*

**What it is** A formal examination of evidence against defined criteria, within a defined
scope and either as of a date or across a period, producing findings or an opinion. It can be
internal — the organisation examining itself — or performed by an independent external
assessor: a CPA firm for a SOC 2 examination, a Qualified Security Assessor for PCI-DSS, an
accredited certification body for ISO 27001.

**Why it matters** An audit is an *event*; compliance is a *state*. The gap between them is
easy to exploit in a question, because a candidate who treats "passed the audit" as "is
compliant now" will answer breach and incident scenarios wrongly. The report speaks about a
window that has already closed.

**How it works** The scope and criteria are fixed first — which systems, which standard, which
period. The assessor then examines artifacts, interviews the people who run the controls, and
tests the controls on sampled items from that period. What comes out is a finding list, an
opinion, or a certificate, depending on the regime. Two report shapes recur and are routinely
confused: a point-in-time examination asks whether the controls were suitably *designed* on a
given date; a period examination asks whether they *operated effectively* across months. A SOC
2 Type 1 and a Type 2 report are exactly this pair. The second costs more and claims more.
Sourcing note: AICPA's public pages confirm that a SOC engagement is an *examination* producing
an assurance report from a CPA firm, and name a "SOC 2 type 2 examination", but the definitional
text that maps Type 1 to design-as-of-a-date and Type 2 to operating-effectiveness-over-a-period
sits behind AICPA's click-through licence gate and has not been read against a primary source.
Treat the mapping as the industry's settled usage rather than as a checked citation. What *is*
checked, and what a question can safely turn on, is the design-versus-operating-effectiveness
distinction itself.

**Key terms** scope; criteria; period; sample; finding; opinion; independence.

**Traps** An audit does not certify that a system is secure. It states that the sampled
evidence supported the stated criteria, within the stated scope, over the stated period —
three qualifiers, all of which a distractor option will quietly drop. An unqualified report
also does not mean zero findings, and being un-audited is not the same as being
non-compliant: it means nobody independent has looked. Conversely, an organisation can hold a
clean report and be breached the following week without either fact contradicting the other.

**What the exam may test** Identifying what an audit result actually licenses you to claim,
separating internal from independent examination, and choosing between "design at a point in
time" and "operating effectiveness over a period" when a scenario names one of them.

<a id="cmp-security.compliance.audit"></a>
#### Not to be confused with: Audit vs Controls and evidence
*compares: `security.compliance.audit`, `security.compliance.controls-and-evidence`*

| | Audit | Controls and evidence |
| --- | --- | --- |
| What it is | The examination event and its report | The safeguard, plus the artifact proving the safeguard ran |
| Who produces it | An assessor — internal, or independent and external | The organisation, continuously, as a by-product of operating |
| When it exists | Periodically, for a fixed scope and period | Every day the control runs |
| What it consumes | Evidence, sampled | Nothing — it is the input, not the consumer |
| What its absence means | No independent opinion; not by itself non-compliance | Nothing to examine, so any audit of it can only fail |

The separating axis is direction: evidence is produced continuously by the organisation
running its controls, and an audit is a periodic examination of that evidence by someone else.

<a id="c-security.compliance.risk-assessment"></a>
### Risk assessment
*id: `security.compliance.risk-assessment` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: nist-sp-800-30r1, nist-sp-800-39*

**What it is** Identifying risks and estimating their likelihood and impact so they can be
prioritised. NIST SP 800-30 Rev. 1 runs it as four steps: prepare for the assessment, conduct
it, communicate the results, and maintain them. Deciding what to *do* about each risk is a
separate activity — risk response — which in NIST SP 800-39 means choosing to accept, avoid,
mitigate, share or transfer the risk.

**Why it matters** The assessment/response split is exactly the distinction an exam option
will blur. "We completed a risk assessment" says the organisation now knows what its risks are
and how they rank; it says nothing about any of them having been addressed. Buying insurance
is a response (transfer), not an assessment; patching is a response (mitigate); signing off a
low-impact risk knowingly is a response (accept) and is a legitimate outcome, not a failure.

**How it works** Conducting the assessment means identifying threat sources and threat events,
identifying vulnerabilities and the predisposing conditions that make them exploitable,
determining likelihood of occurrence and magnitude of impact, and combining the two into a
risk rating — qualitative or quantitative. The wider loop SP 800-39 describes wraps around
this: frame risk, assess it, respond to it, monitor it. Whatever remains after the chosen
response is residual risk, and it is owned, not ignored.

**Key terms** likelihood; impact; threat source; vulnerability; risk response; residual risk.

#### Scenario

A start-up is asked by a prospective customer for "proof that you are compliant." The team
points at its documented security policy. That is the wrong artifact three times over: the
policy states intent but sets no measurable threshold, so there is nothing an assessor could
test — the standard beneath it is missing; the policy is evidence that controls were
*designed*, not that they *operated*, so nothing shows the quarterly access review actually
happened; and nobody independent has examined anything, so there is no audit opinion to hand
over. Meanwhile the team's own risk assessment ranked credential theft as its top risk. That
ranking is not a fix: until they choose a response — mitigate with MFA, transfer via
insurance, or formally accept it — the risk is assessed and untreated, and their genuinely
hardened servers remain, on paper, unevidenced.

#### Knowledge check

1. A system is fully compliant with an applicable standard and is breached the next week. Is
   that a contradiction?
   No. Compliance is demonstrable conformance to an external obligation over a past period;
   security is whether the system actually resists attack. The mandate may never have covered
   the attack path used.
2. What is the one-sentence difference between a control and evidence?
   The control is the safeguard that protects; the evidence is the artifact proving the
   safeguard operated during the period.
3. Which of policy, standard and procedure is the tier an audit finding is written against,
   and why?
   The standard — it is the only tier that states a measurable, mandatory requirement, so it
   is the only one that can be failed on evidence.
4. An organisation completes a risk assessment. What has it produced, and what has it not?
   Prioritised information about likelihood and impact. It has not decided or implemented any
   response — accept, avoid, mitigate, share or transfer is a separate step.
5. A report says controls were suitably designed as of 31 March. What does it not tell you?
   Whether those controls actually operated effectively over any period; that requires a
   period-based examination, not a point-in-time one.
6. Why can a control that "the team reviews informally" never pass an audit?
   It produces no artifact, so there is nothing for an assessor to sample — audits examine
   evidence, not assurances.

<a id="s-compliance-regulations"></a>
## Regulations

<a id="c-security.compliance.gdpr"></a>
### GDPR
*id: `security.compliance.gdpr` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: gdpr-eurlex*

**What it is** Regulation (EU) 2016/679, the EU law governing the processing of personal data.
It binds two roles: the controller, who determines the purposes and means of processing, and
the processor, who processes on the controller's instructions. Article 3 gives it
extraterritorial reach — it applies to processing in the context of the activities of an
establishment in the Union regardless of whether the processing happens there, and to a
controller or processor *not* established in the Union where the processing relates to
offering goods or services to data subjects in the Union, or to monitoring their behaviour
within the Union.

**Why it matters** GDPR is easy to misdescribe plausibly, because almost everyone has heard of
it and almost nobody has read Article 3. Its scope is not "EU citizens" and not "companies in
Europe", and the two limbs of Article 3 do not test the same thing: 3(1) turns on the
*establishment*, so an EU establishment's processing is covered whoever the data subjects are
and wherever the processing happens, while 3(2) turns on the *data subject's location*,
reaching a controller or processor with no EU establishment when it offers goods or services
to, or monitors, people who are in the Union. Citizenship is not a condition in either limb.

**How it works** Article 5 sets the principles every processing must satisfy: lawfulness,
fairness and transparency; purpose limitation; data minimisation; accuracy; storage
limitation; integrity and confidentiality; and accountability. Article 6(1) requires at least
one of six lawful bases before processing is lawful at all. Chapter 3 gives data subjects
rights including access, rectification, erasure and portability. Article 33 requires the
controller to notify the competent supervisory authority of a personal data breach without
undue delay and, where feasible, not later than 72 hours after becoming aware of it, unless
the breach is unlikely to result in a risk to people's rights and freedoms. Chapter V governs
sending personal data outside the EU: an adequacy decision by the Commission, or appropriate
safeguards such as standard contractual clauses or binding corporate rules, or a specific
derogation.

**Key terms** controller; processor; data subject; personal data; lawful basis; supervisory
authority; adequacy decision.

**Traps** The 72 hours is the deadline for notifying the *supervisory authority*, not the
individuals — communicating a breach to affected data subjects is a separate duty, without a
fixed hour count, and is triggered only when the breach is likely to result in a high risk to
them. GDPR also contains no general obligation to keep data inside the EU: it restricts
transfers to third countries rather than forbidding them, so a lawful transfer mechanism
permits the data to leave. And it is a regulation, directly applicable across Member States —
not a directive each country implements differently, and not US law.

**What the exam may test** Whether a described organisation is in scope at all under Article 3;
which deadline and which recipient a breach-notification scenario is asking about; and
recognising that "store it in the EU" is not what GDPR actually requires.

<a id="cmp-security.compliance.gdpr"></a>
#### Not to be confused with: GDPR vs PCI-DSS
*compares: `security.compliance.gdpr`, `security.compliance.pci-dss`*

| | GDPR | PCI-DSS |
| --- | --- | --- |
| Source of authority | Law — an EU regulation | Contract — a standard published by the PCI Security Standards Council |
| Who enforces it | National supervisory authorities, with statutory powers | Payment brands and acquiring banks, through the merchant agreement |
| What it protects | Personal data caught by Article 3 — processed in the context of an EU establishment's activities, or belonging to people who are in the Union | Cardholder data and sensitive authentication data |
| Who is bound | Controllers and processors, inside or outside the EU, per Article 3 | Any entity storing, processing or transmitting payment account data, or able to affect the security of the cardholder data environment |
| Penalty mechanism | Administrative fines and corrective orders from a regulator | Contractual fines passed down by the acquirer; loss of the ability to accept cards |
| Style of requirement | Principles and outcomes; the controller chooses the measures | Twelve numbered requirements with explicit testing procedures |

The separating axis is statute versus contract: breaking GDPR makes you answerable to a
government regulator, breaking PCI-DSS makes you answerable to the bank and card brands you
signed with — PCI-DSS binds through the merchant agreement, not general legislation, though a
few US states have written compliance with it into their own statutes.

<a id="c-security.compliance.hipaa"></a>
### HIPAA
*id: `security.compliance.hipaa` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: hipaa-45-cfr-164*

**What it is** The US rules at 45 CFR Part 164 protecting health information. They bind covered
entities — health plans, health care clearinghouses, and health care providers that transmit
health information electronically in connection with covered transactions — and the business
associates who handle that information on their behalf. The Privacy Rule covers protected
health information in any form; the Security Rule covers electronic PHI specifically.

**Why it matters** HIPAA's scope is defined by *who holds the data*, not by how sensitive it
is. The same blood-pressure reading is protected health information in a hospital's system and
outside HIPAA entirely in a consumer fitness app that is neither a covered entity nor a
business associate. A question that describes a health app and asks whether HIPAA applies is
testing that boundary, not the safeguards.

**How it works** Under 45 CFR 164.306(a), covered entities and business associates must ensure
the confidentiality, integrity and availability of all ePHI they create, receive, maintain or
transmit, through administrative (164.308), physical (164.310) and technical (164.312)
safeguards. Each standard's implementation specifications are labelled Required or
Addressable. Addressable does not mean optional: the entity must assess whether the
specification is a reasonable and appropriate safeguard in its environment, implement it if it
is, and otherwise document why it is not and implement an equivalent alternative measure if
reasonable and appropriate. Under 45 CFR 164.404, a covered entity's notification to
individuals affected by a breach of unsecured PHI is due without unreasonable delay and in no
case later than 60 calendar days after discovery.

**Key terms** covered entity; business associate; PHI and ePHI; required versus addressable.

<a id="c-security.compliance.pci-dss"></a>
### PCI-DSS
*id: `security.compliance.pci-dss` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: pci-dss-standards, pci-ssc-glossary*

**What it is** The Payment Card Industry Data Security Standard, published by the PCI Security
Standards Council, covering entities that store, process or transmit cardholder data or
sensitive authentication data, or that could affect the security of the cardholder data
environment — merchants, processors, acquirers, issuers and service providers alike. It is not
legislation. The Council states plainly that whether an entity is required to comply with, or
validate compliance to, a PCI standard is at the discretion of the organisations that manage
compliance programs, such as a payment brand or an acquirer.

**Why it matters** This is the discrimination to hold onto for PCI-DSS: it is contractual, not
governmental, unlike GDPR and HIPAA. That difference changes who can punish you, what the
punishment is, and how the obligation reaches you in the first place — through a merchant
agreement with an acquiring bank rather than through a statute. A distractor calling PCI-DSS
"a regulation" or "a law" is wrong for exactly that reason.

**How it works** The standard is organised as twelve principal requirements, each broken into
sub-requirements with defined testing procedures — which makes it far more prescriptive than
GDPR's principles-based drafting. Its two most consequential data rules run in opposite
directions. Requirement 3.3.1 says sensitive authentication data (full track data, card
verification codes, PINs) is not stored after authorisation, even if encrypted; the one
carve-out is issuers and companies that support issuing services, which Requirement 3.3.3
allows to store it where there is a legitimate, documented issuing business need and it is
secured and encrypted using strong cryptography. Pointing the other way, Requirement 3.5.1
permits the primary account number to be stored but requires it be rendered unreadable anywhere
it is stored. Who must validate, and how, is set by the payment brands and acquirers rather
than by the standard: smaller merchants typically complete a self-assessment questionnaire, the
largest are assessed by a Qualified Security Assessor. One assessor role the standard does fix
is Requirement 11.3.2, which has external vulnerability scans performed by an Approved Scanning
Vendor. Scope is the lever worth knowing: the requirements reach the cardholder data
environment, including components with unrestricted connectivity to it, plus anything else that
could affect the security of account data. Segmentation is explicitly not a PCI-DSS
requirement, but the standard strongly recommends it for reducing assessment scope and cost.
Sourcing note, and it binds hard on anything built from this paragraph: the PCI DSS requirement
text sits behind the Council's licence gate and refused every automated access attempt, so the
four requirement numbers cited above (3.3.1, 3.3.3, 3.5.1, 11.3.2) are **unverified rather than
disproven**, and no question may turn on a PCI DSS requirement number. What the Council does
publish, and what a question can safely turn on, is on the standard page, the about page and the
glossary: that the Council does not enforce compliance; that whether an entity must comply or
validate is at the discretion of a payment brand, acquirer or other entity managing a compliance
program; that an acquirer is a merchant or acquiring bank subject to payment brand rules on
merchant compliance; and that sensitive authentication data is data a transaction "might be
transmitted or processed (but not stored)".

**Key terms** cardholder data environment; sensitive authentication data; QSA; ASV;
self-assessment questionnaire; tokenisation.

**Traps** PCI-DSS is not a law and the Council does not enforce it; the acquirer and the
payment brands do. Outsourcing payment pages narrows scope but does not empty it — the
merchant still carries requirements for the systems that redirect to, and depend on, that
provider, and an entity that outsources its payment operations remains responsible for the
protection of the account data. And validation is periodic rather than permanent: a passed
assessment describes a past state, exactly as any other audit does.

**What the exam may test** Naming the mechanism by which PCI-DSS binds an organisation
(contract, via the acquirer and payment brands), separating it from statutory regimes, and
recognising that sensitive authentication data may not be retained after authorisation — the
issuer carve-out aside — even though the account number may be, if rendered unreadable.

*Not to be confused with [GDPR](compliance.md#cmp-security.compliance.gdpr).*

<a id="c-security.compliance.data-sovereignty-and-residency"></a>
### Data sovereignty and residency
*id: `security.compliance.data-sovereignty-and-residency` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: gdpr-eurlex*

**What it is** Two terms used interchangeably that are not interchangeable. Residency is where
data physically sits — a country, a cloud region. Sovereignty is which legal system the data
is subject to, which follows from residency *and* from who operates the service and under
whose law that operator is incorporated.

**Why it matters** The practical form this takes is a cloud region choice, and the practical
trap is treating that choice as sufficient. Selecting an EU region fixes residency. It does
not, on its own, settle sovereignty, because a provider incorporated elsewhere may remain
subject to its home jurisdiction's lawful production demands regardless of where the bytes
live. "We store it in Frankfurt" answers a residency question and only partly answers a
sovereignty one.

**How it works** GDPR imposes no general data-localisation rule. Chapter V instead restricts
transfers of personal data to third countries unless one of three routes applies: a Commission
adequacy decision finding that the destination ensures an adequate level of protection, in
which case the transfer needs no specific authorisation; appropriate safeguards such as
standard contractual clauses or binding corporate rules; or a specific derogation. Some
national and sector-specific rules — outside GDPR — do impose genuine localisation, which is
why "must the data stay in-country" is always a question about the *particular* obligation,
never a general property of privacy law.

**Key terms** residency; sovereignty; region; adequacy decision; standard contractual clauses;
localisation.

#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `security.compliance.soc-2-and-iso-27001` | SOC 2 and ISO 27001 | Two voluntary frameworks: SOC 2 is an AICPA examination in which a CPA firm reports on controls relevant to security, availability, processing integrity, confidentiality or privacy; ISO 27001 certifies an information security management system through an accredited body — ISO itself states that it "does not perform certification or issue certificates" and that "Certification is performed by external certification bodies". | Neither is a law. SOC 2 yields a report — Type 1 on design as of a date, Type 2 on operation across a period — never a certificate, so "SOC 2 certified" is a wrong-sounding-right distractor that also does not discharge GDPR or HIPAA. |

#### Scenario

A European SaaS vendor signs a US hospital group as a customer. Untangle the regimes. The
hospital is a covered entity, and because the vendor handles ePHI on its behalf it becomes a
business associate — so 45 CFR Part 164 reaches it, US rule and European vendor
notwithstanding. GDPR applies through Article 3(1), because the vendor processes in the context
of an establishment in the Union. Its checkout page takes card payments, so PCI-DSS reaches it
too — not by law, but through the merchant agreement with its acquirer. Procurement asks for a
SOC 2 report; the vendor sends one and calls itself "SOC 2 certified", wrong twice over: the
artifact is a report, not a certificate, and it speaks only to the stated scope and to a
specified date or period. Hosting in Frankfurt then fixes residency, but sovereignty also
depends on whose law the operator answers to.

#### Knowledge check

1. Under GDPR, who must be notified within 72 hours of becoming aware of a personal data
   breach, and who must not necessarily be?
   The competent supervisory authority, without undue delay and where feasible within 72
   hours. Affected data subjects are a separate duty, without a fixed hour count, triggered
   only by a likely high risk to them.
2. A fitness app collects heart-rate data from consumers directly. Is that data covered by
   HIPAA?
   Not by itself. HIPAA's scope follows who holds the data — covered entities and their
   business associates — not how sensitive the data is.
3. What does "addressable" mean in the HIPAA Security Rule?
   Not optional. The entity must assess whether the specification is reasonable and
   appropriate, implement it if so, and otherwise document why not and implement an equivalent
   alternative measure if reasonable and appropriate.
4. By what mechanism does PCI-DSS become binding on a merchant, and who may still store
   sensitive authentication data after authorisation?
   Contract — the merchant agreement with the acquiring bank, and the payment brands' compliance
   programs; it is not legislation. Only issuers and companies supporting issuing services may
   store SAD, and only with a legitimate documented issuing business need and strong encryption.
5. Does choosing an EU cloud region settle GDPR's rules on international transfers, and does it
   settle data sovereignty?
   It fixes residency, and while the data stays in the EU no Chapter V transfer arises — but
   GDPR never required localisation: transfers to third countries are lawful under an adequacy
   decision, appropriate safeguards such as standard contractual clauses, or a derogation.
   Sovereignty is a separate question, turning also on whose law the operator answers to.
6. What is the difference between what a SOC 2 engagement produces and what ISO 27001
   produces?
   SOC 2 produces an examination report from a CPA firm — Type 1 on design as of a specified
   date, Type 2 on operating effectiveness across a period; ISO 27001 produces certification of
   a management system by an accredited body.

<a id="s-compliance-obligations"></a>
## Obligations

<a id="c-security.compliance.data-retention-obligations"></a>
### Data retention obligations
*id: `security.compliance.data-retention-obligations` · depth 3 · importance 2 · LFS200: NOT COVERED · sources: gdpr-eurlex, nist-sp-800-88r2*

**What it is** Rules requiring that data be *kept* for a minimum period — tax and accounting
records, clinical records, employment files, transaction logs — imposed by statute, a sector
regulator, or a contract. They are floors, and they point in the opposite direction from the
deletion duties and deletion rights that apply to some of the same data.

**Why it matters** This conflict is a natural exam target, because it looks like a
contradiction and is not. A data subject's erasure request cannot
be satisfied by deleting everything, and it also cannot be refused wholesale. The two rules
have to be reconciled deliberately, record category by record category.

**How it works** GDPR resolves the conflict explicitly rather than leaving it to judgement:
Article 17(3) disapplies the erasure right to the extent processing is necessary for
compliance with a legal obligation requiring processing under Union or Member State law. So
the retention obligation carves out the specific records it covers, and everything outside
that carve-out must still be erased. Pulling in the other direction, Article 5(1)(e) — storage
limitation — requires personal data be kept in a form permitting identification of data
subjects for no longer than is necessary for the purposes. A retention schedule is where the
two meet: for each category of data, a minimum set by obligation and a maximum set by purpose.
When the maximum arrives, the data is disposed of, and NIST SP 800-88 Rev. 2 frames that
disposal as one of Clear, Purge or Destroy, chosen by the confidentiality of the data and
whether the media will be reused, with the outcome verified and documented.

**Key terms** retention schedule; minimum retention period; storage limitation; legal hold;
Clear, Purge, Destroy.

**Traps** A legal hold overrides both the schedule and an erasure request: once litigation or
an investigation is anticipated, the relevant data is frozen in place until released. GDPR is
where the erasure half of that is actually written — Article 17(3)(e) disapplies the erasure
right to the extent processing is necessary "for the establishment, exercise or defence of legal
claims" — and it is worth citing that article rather than the phrase "legal hold", which appears
nowhere in NIST SP 800-88 Rev. 2, NIST SP 800-53 Rev. 5, NIST SP 800-53A Rev. 5, or the
Regulation. A
retention *obligation* is also not a retention *policy* — the obligation is imposed from
outside and cannot be shortened by writing a policy that disagrees with it. And "we deleted
the record" usually means one row in one database; backups, archives, log aggregators and
analytics copies are the same data and are governed by the same schedule.

**What the exam may test** Reconciling an erasure request against a statutory retention period
without treating either as absolute, recognising a legal hold as overriding both, and knowing
that verified, documented destruction — not merely deleting a pointer — is what disposal means.

<a id="cmp-security.compliance.data-retention-obligations"></a>
#### Not to be confused with: Data retention obligations vs Data retention and disposal
*compares: `security.compliance.data-retention-obligations`, `security.sensitive-data.data-retention-and-disposal`*

| | Data retention obligations | Data retention and disposal |
| --- | --- | --- |
| What it names | The externally imposed minimum keeping period | The organisation's practice of keeping data only as long as needed, then destroying it verifiably |
| Direction of pressure | A floor: you may not delete yet | A ceiling plus an action: delete once the purpose ends, and prove it |
| Who sets it | A statute, a regulator, or a contract | The organisation, inside the limits the obligations leave it |
| What it produces | An input to the retention schedule | The schedule itself, and the sanitisation of media at the end of it |
| Failure looks like | Destroying records you were obliged to keep | Hoarding data past its purpose, or "deleting" it recoverably |

The separating axis is which end of the lifecycle each governs: obligations set how early you
may not delete, while retention and disposal is the practice deciding how late you may not
keep — and how the destruction is actually carried out and verified.

<a id="c-security.compliance.licensing-compliance"></a>
### Licensing compliance
*id: `security.compliance.licensing-compliance` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: gnu-gpl-faq, osi-mit-license, apache-license-2*

**What it is** Meeting the obligations attached to the software an organisation uses or ships —
open source and proprietary alike. Open source removes the fee, not the licence. Permissive
licences make attribution travel with the code: MIT's whole condition is that the copyright
notice and the permission notice be included in all copies or substantial portions, BSD asks
the same of source and binary redistributions, and Apache 2.0 section 4 adds a copy of the
licence, prominent notices on any file you changed, and propagation of any NOTICE file.
Copyleft licences such as the GPL add that recipients of a distributed derivative receive the
corresponding source under the same terms.

**Why it matters** "Free" reads as "no obligation", and that misreading is the whole trap.
Licensing is a compliance domain in its own right, enforced by copyright holders and by
contract rather than by a security regulator — a licensing breach is not a security incident.

**How it works** The copyleft trigger is conveying, not use. GPLv3 permits making, running and
propagating covered works you do not convey, and states outright that mere interaction with a
user through a computer network, with no transfer of a copy, is not conveying — so running a
modified GPL program on your own servers to deliver a service does not by itself trigger the
source duty. The AGPL closes that gap, but read its wording: AGPLv3 section 13 attaches to a
version you have modified, requiring it to offer users interacting with it remotely access to
its corresponding source. Proprietary obligations are counted instead: per-seat, per-core or
per-socket entitlements, with audit clauses and true-up payments when use exceeds what was
purchased. Both are tracked the same way — an inventory or software bill of materials, not
memory.

**Key terms** permissive licence; copyleft; distribution; attribution; entitlement; software
bill of materials.

<a id="c-security.compliance.consequences-of-non-compliance"></a>
### Consequences of non-compliance
*id: `security.compliance.consequences-of-non-compliance` · depth 2 · importance 2 · LFS200: NOT COVERED · sources: gdpr-eurlex*

**What it is** Four distinct consequence types that a single scenario can trigger at once:
regulatory action, contractual loss, mandatory notification, and reputational or commercial
damage. They come from different authorities and are not interchangeable, which is the point
worth holding.

**Why it matters** The fine is the memorable consequence and not necessarily the costliest. A
supervisory authority's corrective powers under GDPR Article 58 include imposing a temporary
or definitive limitation, including a ban, on processing — an order that can stop a business
operating in a way no fine does. Contractual consequences work the same way: an acquirer
withdrawing card acceptance ends a merchant's revenue, whatever the fine attached.

**How it works** GDPR Article 83 sets two fine tiers, and both are stated the same way:
infringements in the lower tier are subject to administrative fines up to EUR 10 000 000 or,
for an undertaking, up to 2% of total worldwide annual turnover of the preceding financial
year, whichever is higher; the upper tier — covering the basic principles for processing, data
subject rights, and the rules on transfers — reaches EUR 20 000 000 or 4% of worldwide annual
turnover, again whichever is higher. Notification duties bite separately and on their own
clocks: GDPR's 72 hours to the supervisory authority, HIPAA's 60 calendar days to affected
individuals. Reputational damage lands last and is the one no remediation retracts.

**Key terms** administrative fine; corrective power; undertaking; worldwide annual turnover;
notification window.

#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `security.compliance.consent-and-lawful-basis` | Consent and lawful basis | The justification that makes processing personal data lawful; GDPR Article 6(1) lists six — consent, contract, legal obligation, vital interests, public task, and legitimate interests — of which consent is only one. | Consent is the over-chosen answer: most routine processing runs on contract or legal obligation. Watch which article does which job, because it is easy to read this row as though one article did both: Article 6(1) supplies the list of bases and nothing else, while the validity bar — "freely given, specific, informed and unambiguous", signified by a statement or a clear affirmative action — is **Article 4(11)**, and it is **Recital 32** that says silence, pre-ticked boxes or inactivity do not constitute consent. Article 7(3) makes withdrawal as easy as giving it. |

#### Scenario

A payroll provider receives an erasure request from a former employee of a client, and on the
same day discovers that a misconfigured backup exposed payroll files. Work the obligations
separately. The erasure request is not answered by deleting the records outright: statutory tax
and employment retention periods require some of them to be kept, and GDPR Article 17(3)
disapplies erasure to that extent — the covered categories stay, on the schedule, and
everything outside them goes. The breach starts its own clock: notify the supervisory authority
without undue delay and, where feasible, within 72 hours, with communication to individuals a
separate question of whether the risk to them is high. Because litigation now looks likely, a
legal hold freezes the very records the erasure request asked to remove. And when those records
age out, disposal means verified destruction of every copy, not deleting a row while the backup
survives.

#### Knowledge check

1. A data subject requests erasure of records the organisation is legally required to retain.
   What happens?
   Neither rule wins outright. GDPR Article 17(3) disapplies erasure to the extent processing
   is necessary to comply with a legal obligation, so the covered records are kept for the
   required period and the rest are erased.
2. What overrides both a retention schedule and an erasure request?
   A legal hold — once litigation or an investigation is anticipated, the relevant data is
   preserved until the hold is released.
3. In GDPR Article 83's fine tiers, is the cap the fixed euro amount or the turnover
   percentage?
   Whichever is higher: up to EUR 10 000 000 or 2% of total worldwide annual turnover for the
   lower tier, and EUR 20 000 000 or 4% for the upper tier.
4. Why is a fine often not the worst regulatory consequence?
   Because a supervisory authority's corrective powers include imposing a temporary or
   definitive limitation, including a ban, on processing — which can halt operations outright.
5. Does running a modified GPL program to power your own web service oblige you to publish its
   source?
   Not under the GPL — its trigger is conveying, and GPLv3 says mere interaction with a user
   over a network, with no transfer of a copy, is not conveying. Under the AGPL it would:
   section 13 requires a modified version that users interact with remotely to offer them its
   corresponding source.
6. Consent is one lawful basis for processing personal data. Name two others, and one reason
   an apparently obtained consent may still be invalid.
   Contract and legal obligation (also vital interests, public task, legitimate interests).
   Consent signalled by a pre-ticked box or by silence is not an unambiguous affirmative
   action, so it is not valid consent.
