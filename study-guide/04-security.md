# Security Fundamentals

Three competencies — [Security](04-security/security.md), [Sensitive Data](04-security/sensitive-data.md)
and [Compliance](04-security/compliance.md) — covering 65 concepts across 11 sections. This page
is a map and a plan; every definition lives in the three files below, and nothing is defined
here.

## Weight, and what the two-point drop means for effort

`guide-plan` reports the same header for all three competencies: **14% of the exam — 4th
largest of 6 domains**. `data/competencies.json` records the previous weight as **16**, so the
domain lost two points at the 2025-09-16 revision.

Two points down is not a reason to spend less time here, for a reason specific to how the
domain shrank. The same revision cut the domain from four competencies to three — **Network
Security** and **System Security** were removed as competency names — so the remaining three
carry 14 points where four previously carried 16. Per competency the marks went up, not down.
The subject matter did not leave the exam either: firewalls and network segmentation, system
hardening, SSH hardening, SELinux and AppArmor, intrusion detection and vulnerability scanning
all sit inside the current Security competency's [Defences](04-security/security.md#s-security-defences)
section, which is the single largest section in the domain at 11 concepts.

For a candidate at 71% against a 75% pass mark, the arithmetic that matters is the weight:
14% means every 10 percentage points gained inside this domain moves the overall score by 1.4
points. This domain alone can close a four-point gap only with a very large swing in it, so
treat Security as one of several sources of the missing marks rather than the whole answer —
but note that its 65 concepts are the smallest concept count of the six domains, which makes
complete coverage of it cheaper than complete coverage of System Administration's 173.

## The 2025 update, competency by competency

| Competency | `guide-plan` 2025 status | Previous name | Rewording significance |
| --- | --- | --- | --- |
| [Security](04-security/security.md) | reworded | Security Basics | substantive |
| [Sensitive Data](04-security/sensitive-data.md) | reworded | Data Security | substantive |
| [Compliance](04-security/compliance.md) | added | — | — |

**Compliance is new.** `guide-plan` states the consequence directly: this competency is new in
the 2025 update — no pre-2025 material covers it. That is not a claim about depth of coverage;
it is a claim about existence. Any practice bank, course, or set of notes assembled before
2025-09-16 was built against a syllabus in which the word Compliance did not appear as a
competency, so its 14 concepts — GDPR, HIPAA, PCI-DSS, SOC 2 and ISO 27001, audit, controls and
evidence, retention obligations, consent, licensing compliance, the consequences of
non-compliance — are absent from that material by construction, not by omission. There is
nothing to revise from. The [Compliance](04-security/compliance.md) file is the first pass.

For the two reworded competencies, `data/competencies.json` marks both **substantive**, which
its own `rewording_significance_note` defines as the scope or emphasis plausibly having
changed — as against **formatting**, the value that would have meant pre-2025 material stays
valid. Neither reword here is cosmetic: "Security Basics" became "Security" and "Data Security"
became "Sensitive Data", and the dataset now files the whole of the deleted Network Security and
System Security subject matter under the first of those two. The Linux Foundation publishes no
text finer than the competency name, so where exactly the removed scope landed is an inference
from concept placement rather than a stated fact — but the practical effect is not in doubt:
pre-2025 notes on either competency are a starting point, not a substitute.

## LFS200 coverage position

Security Fundamentals is the least-covered domain on the exam by LFS200. `guide-plan`'s LFS200
lines, verbatim:

| Competency | LFS200 coverage (which concepts LFS200 touches at all, not how deeply) |
| --- | --- |
| Security | 37 NOT COVERED, 1 FULLY COVERED — 1/38 (3%) are not NOT COVERED |
| Sensitive Data | 13 NOT COVERED — 0/13 (0%) are not NOT COVERED |
| Compliance | 14 NOT COVERED — 0/14 (0%) are not NOT COVERED |

One concept out of the domain's 65. Security Fundamentals is the least-covered domain on the
exam at 1 of 65, with Cloud Computing next at 3 of 82.

`research/lfs200-notes/00-course-map.md` adds four structural facts worth holding:

- The domain has two substantive lessons: ch9.l2 `Securing Linux` (12,484 characters) and
  ch9.l3 `Network Security` (5,809 characters).
- ch9.l3's name is one of the competencies the 2025 update **removed**, which the course map
  lists among its evidence that LFS200 is still built on the pre-September-2025 syllabus. The
  domain's one covered concept — package and download verification — is credited to ch9.l2 in
  `data/topics/04-security.json`; ch9.l3 credits none of the current dataset's concepts.
- **Security :: Compliance has no lesson at all.** It is one of six competencies in that
  position, and one of the four of those six that are new in 2025.
- Measured absences, checked as exact strings across all 158,185 characters and occurring zero
  times: `GDPR`, `HIPAA`, `ISO 27001`, `SOC 2` under Compliance; `authorization`,
  `multi-factor`, `TLS`, `VPN` under Security. The course discusses `SSL` (7 occurrences) and
  never `TLS`. Both `TLS` and `SELinux` are tagged NOT COVERED in the dataset, which agrees
  with this measured absence rather than contradicting it.

## Section map

Every `## ` section in the domain, with the anchor to link to.

**[Security](04-security/security.md)** — 38 concepts; 23 at depth 3, 14 at depth 2, one at
depth 5 ([SSH hardening](04-security/security.md#c-security.security.ssh-hardening), the only
depth-5 concept in the domain). Five of the 38 carry commands; the other two competencies carry
none.

| Section | Concepts | Link |
| --- | ---: | --- |
| Principles | 8 | [#s-security-principles](04-security/security.md#s-security-principles) |
| Authentication | 4 | [#s-security-authentication](04-security/security.md#s-security-authentication) |
| Cryptography | 7 | [#s-security-cryptography](04-security/security.md#s-security-cryptography) |
| Threats | 8 | [#s-security-threats](04-security/security.md#s-security-threats) |
| Defences | 11 | [#s-security-defences](04-security/security.md#s-security-defences) |

**[Sensitive Data](04-security/sensitive-data.md)** — 13 concepts; 4 at depth 3, 9 at depth 2.
No concept in this competency carries a command.

| Section | Concepts | Link |
| --- | ---: | --- |
| Classification | 4 | [#s-sensitive-data-classification](04-security/sensitive-data.md#s-sensitive-data-classification) |
| Controls | 5 | [#s-sensitive-data-controls](04-security/sensitive-data.md#s-sensitive-data-controls) |
| Lifecycle | 4 | [#s-sensitive-data-lifecycle](04-security/sensitive-data.md#s-sensitive-data-lifecycle) |

**[Compliance](04-security/compliance.md)** — 14 concepts; 6 at depth 3, 6 at depth 2, 2 at
depth 1 (defined in Quick reference rows rather than topic blocks). No commands.

| Section | Concepts | Link |
| --- | ---: | --- |
| Fundamentals | 5 | [#s-compliance-fundamentals](04-security/compliance.md#s-compliance-fundamentals) |
| Regulations | 5 | [#s-compliance-regulations](04-security/compliance.md#s-compliance-regulations) |
| Obligations | 4 | [#s-compliance-obligations](04-security/compliance.md#s-compliance-obligations) |

## Recommended order

**Security, then Sensitive Data, then Compliance.** The order is not editorial preference; it
follows the direction of the domain's own cross-file dependencies, which are visible in the
comparison blocks listed below.

1. **[Security](04-security/security.md).** It is the largest competency in the domain and the
   only one the course touches at all, and it establishes the vocabulary the other two reuse
   without redefining — the CIA triad, the authentication/authorization/accounting split,
   encryption versus hashing, certificates. Read [Principles](04-security/security.md#s-security-principles)
   and [Cryptography](04-security/security.md#s-security-cryptography) before anything in the
   other two files.
2. **[Sensitive Data](04-security/sensitive-data.md).** Its
   [Controls](04-security/sensitive-data.md#s-sensitive-data-controls) section supplies access
   control models, which Security's SELinux and AppArmor block compares itself against — the
   one backward edge in the domain. If you want that comparison to land the first time,
   read Sensitive Data's Controls section before returning to
   [Defences](04-security/security.md#s-security-defences).
3. **[Compliance](04-security/compliance.md)** last, and with the most time. It is new, it is
   uncovered by any prior material, and two of its four comparison blocks point backwards —
   compliance against the CIA triad in Security, retention obligations against retention and
   disposal in Sensitive Data. Both are far easier to hold once the thing being contrasted is
   already familiar. Weight the schedule accordingly: 14 concepts you have provably never been
   taught deserve more hours than 38 you have partly seen.

Inside each file, work the [comparison blocks](#comparison-blocks) before the Knowledge checks.
The domain is conceptual — 60 of its 65 concepts carry no command — so almost every question it
can ask is a discrimination between two terms that sound alike, which is exactly what those
blocks are.

<a id="comparison-blocks"></a>
## Comparison blocks

Fifteen blocks, all of them owned by a concept in this domain and all comparing within it.
These are the highest-yield pages in the three files.

| Block | Where it lives |
| --- | --- |
| Authentication vs authorization vs Accounting and auditing vs Multi-factor authentication | [security.md](04-security/security.md#cmp-security.security.authentication-vs-authorization) |
| Defense in depth vs Principle of least privilege | [security.md](04-security/security.md#cmp-security.security.defense-in-depth) |
| Attack surface vs Vulnerabilities, CVEs and patching | [security.md](04-security/security.md#cmp-security.security.attack-surface) |
| Symmetric vs asymmetric encryption vs Hashing vs Password hashing and salting | [security.md](04-security/security.md#cmp-security.security.symmetric-vs-asymmetric-encryption) |
| Digital certificates and certificate authorities vs TLS and HTTPS | [security.md](04-security/security.md#cmp-security.security.digital-certificates-and-certificate-authorities) |
| Certificate expiry and validation vs Digital certificates and certificate authorities | [security.md](04-security/security.md#cmp-security.security.certificate-expiry-and-validation) |
| Denial of service vs Malware and ransomware | [security.md](04-security/security.md#cmp-security.security.denial-of-service) |
| Brute force and credential stuffing vs Phishing and social engineering | [security.md](04-security/security.md#cmp-security.security.brute-force-and-credential-stuffing) |
| Intrusion detection and prevention vs Vulnerability scanning | [security.md](04-security/security.md#cmp-security.security.intrusion-detection-and-prevention) |
| SELinux and AppArmor vs Access control models | [security.md](04-security/security.md#cmp-security.security.selinux-and-apparmor) |
| Data classification vs Personally identifiable information | [sensitive-data.md](04-security/sensitive-data.md#cmp-security.sensitive-data.data-classification) |
| Compliance vs the CIA triad | [compliance.md](04-security/compliance.md#cmp-security.compliance.compliance) |
| Audit vs Controls and evidence | [compliance.md](04-security/compliance.md#cmp-security.compliance.audit) |
| GDPR vs PCI-DSS | [compliance.md](04-security/compliance.md#cmp-security.compliance.gdpr) |
| Data retention obligations vs Data retention and disposal | [compliance.md](04-security/compliance.md#cmp-security.compliance.data-retention-obligations) |

Three of the fifteen cross a file boundary — SELinux and AppArmor against access control
models, compliance against the CIA triad, retention obligations against retention and disposal
— which is the whole of the argument for the reading order above.

## Exam frame

The current exam took effect 2025-09-16: 90 minutes, multiple choice, 75% to pass, no practical
component, and the certification is valid for two years. The Linux Foundation does not publish
a question count, so no plan on this page assumes one. Domain weights are Linux Fundamentals
16, System Administration Fundamentals 30, Cloud Computing Fundamentals 18, Security
Fundamentals 14, DevOps Fundamentals 12, IT Project Management Fundamentals 10.
