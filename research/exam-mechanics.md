# LFCA Exam Mechanics

> **This file is hand-written, not generated.** Everything else under `research/` is produced
> by a tool that reads the concept dataset; this file is prose about the exam itself (delivery,
> scoring, logistics) and has no dataset view to generate it from. Do not run a generator over
> this file or replace it with generated output — edit it by hand.

Scope: how the LFCA exam is delivered and scored, not what it covers. Competency content lives
in `data/competencies.json`; this file is the stage-2 companion covering the eight mechanics
questions stage 1 left open: question count, duration, question format, passing score,
delivery/proctoring, retake policy, certification validity, and price.

Confidence key:
- **HIGH** — stated directly by the Linux Foundation on a page consulted for this file.
- **MEDIUM** — inferred from official material (arithmetic on stated numbers, or a bound implied
  by an anecdotal data point), not itself a stated figure.
- **LOW** — anecdotal or third-party, unverified, included only where explicitly labelled as such.

---

## 1. Question count

**Not stated in official sources.**

No page consulted — the LFCA certification page, the Candidate Handbook, the Multiple Choice
Exams FAQ, or the Multiple Choice Exams Important Instructions page — states a total number of
questions for the LFCA exam. Third-party prep sites widely quote figures (commonly "60
questions"), but these are tier-3/4 and unverified; several are stale relative to the
2025-09-16 competency change. **This project records no question count** rather than repeat an
unverified figure. If the Linux Foundation publishes this number on a page not yet checked, it
should be added here with a HIGH-confidence citation.

## 2. Exam duration

**90 minutes.** Confidence: **HIGH**.

Stated twice, independently, in two different official contexts:
- The LFCA certification page's "Includes" summary box: "Duration of Exam 90 minutes." (source:
  `lf-lfca-cert-page`)
- The Multiple Choice Exams FAQ, generic across LF multiple-choice exams: "Candidates are
  allowed 90 minutes to complete Multiple Choice Exams, with the exception of CNPA. CNPA
  candidates are allowed 120 minutes to complete the exam." (source: `lf-faq-mc`)

The two corroborate each other: the FAQ's generic 90-minute rule for MC exams matches the
LFCA-specific figure on the certification page, and the certification page independently
confirms LFCA is itself a "Multiple Choice Exam" (see below), so the FAQ's generic rule applies
to it by the page's own classification, not by assumption.

## 3. Question format

**Multiple choice.** Confidence: **HIGH**.

The LFCA certification page's "Includes" box lists "Multiple Choice Exam" as one of the LFCA's
stated attributes (source: `lf-lfca-cert-page`). The Multiple Choice Exams FAQ and Important
Instructions pages describe the format at the level of "Multiple Choice Exams" as a category,
not per-question mechanics.

**Not stated in official sources:** whether individual questions are single-answer or
multi-select, whether there is negative marking for wrong answers, and whether candidates can
navigate backward, skip, or flag questions for review. None of the four official pages consulted
describe question-level interaction mechanics — only exam-level logistics (proctoring, ID,
environment, timing).

## 4. Passing score

**75% or above.** Confidence: **HIGH**.

The Multiple Choice Exams FAQ states directly: "A score of 75% or above must be earned to pass
the Multiple Choice Exam." (source: `lf-faq-mc`) This is the FAQ's generic rule for the
Multiple Choice Exam category; LFCA is confirmed to be in that category by the certification
page's own "Multiple Choice Exam" label (source: `lf-lfca-cert-page`), so the 75% threshold is
attributed to LFCA at HIGH confidence rather than treated as merely suggestive.

**Caveat on this particular HIGH label.** Unlike the 90-minute duration and the 2-year validity
— both of which appear on the LFCA certification page *itself* as well as in the generic FAQ —
the 75% figure appears **only** in the generic FAQ. The certification page's "Includes" box
lists Online, Certification Valid for 2 Years, 12 Month Exam Eligibility, One Retake, Multiple
Choice Exam, Duration of Exam 90 minutes, and Beginner, but states no passing score anywhere.
This value therefore carries one more inferential step than the others rated HIGH here: it
depends on the classification chain holding, not on a direct LFCA-specific statement. It is
recorded as HIGH because the chain is short and both links are official, but a reader should
know it is the least directly-attested of the HIGH values on this page.

**Corroborating anecdotal data point (confidence: MEDIUM, does not substitute for the stated
number above):** the repository owner sat the LFCA exam and scored 71%, and did not pass. This
is consistent with — and bounds the passing threshold above — the stated 75% figure; it does not
contradict it. Recorded per the task brief's instruction to include this data point explicitly
labelled and not as a replacement for an official figure.

Scoring mechanics: "Upon completion, exams are scored automatically and barring any exceptions
or technical difficulties, a score report will be sent to the candidate via email within 24
hours from the time that the exam was completed." (source: `lf-faq-mc`, HIGH)

## 5. Delivery / proctoring

**Online, remotely proctored via PSI's "Bridge" platform.** Confidence: **HIGH**.

- The certification page's "Includes" box lists "Online" as a stated attribute (source:
  `lf-lfca-cert-page`).
- The Multiple Choice Exams FAQ: "The certification exam is proctored remotely via streaming
  audio, video, and screen sharing feeds. The screensharing feed allows proctors to view
  candidates' desktops (including all monitors)... The main function of the proctors during the
  exam is to facilitate the check-in process and to monitor the session." (source: `lf-faq-mc`)
- The Multiple Choice Exams Important Instructions page adds system/environment requirements:
  the PSI Online Proctoring System Check, the PSI Secure Browser (Chrome-based, downloaded at
  exam launch), one active monitor only (dual monitors not supported), reliable wired internet
  recommended, a working microphone, and a clutter-free, well-lit, private testing location with
  no other people, noise, or wall clutter. (source: `lf-important-instructions-mc`)
- ID requirements: a valid, unexpired, government-issued original physical ID with name, photo,
  and signature, exactly matching the name on the exam registration. Minors aged 16–18 need
  parental release paperwork. (source: `lf-important-instructions-mc`, corroborated in
  `lf-faq-mc`)
- Sanctioned-country restriction: citizens of Cuba, Iran, Syria, North Korea, and the Crimea
  region of Ukraine may test only from outside the sanctioned country, with ID and registration
  showing an outside address. (source: `lf-important-instructions-mc`)

This is generic PSI BRIDGE proctoring logistics also described in the Candidate Handbook
(`lf-candidate-handbook`, checked in stage 1), consistent with the Handbook being non-LFCA-
specific but still authoritative for platform-wide rules.

## 6. Retake policy

**One retake is included with the exam purchase.** Confidence: **HIGH** for that fact;
**Not stated in official sources** for the mechanics of using it.

The certification page's "Includes" box lists "One Retake" and, separately, "12 Month Exam
Eligibility" as attributes of the purchase (source: `lf-lfca-cert-page`). Read together with the
adjacent "12 Month Exam Eligibility" line, the most natural reading is that a purchased LFCA exam
includes one free retake attempt, and both the original attempt and the retake must be used
within 12 months of purchase — but the page does not spell out that relationship explicitly, so
the exact scope of "12 Month Exam Eligibility" (whether it bounds the retake window specifically
or the purchase-to-first-attempt window) is **not stated** and is recorded here as the literal
text only, not as an inferred rule.

**Not stated in official sources:** any mandatory waiting period between a failed attempt and a
retake, whether additional retakes beyond the first can be purchased separately, or what happens
if the included retake is also failed. The LFCA program-changes page notes only that whichever
exam version applies is determined by "the date you sit for the exam," irrespective of whether
that sitting is a first attempt or a retake (source: `lf-objectives-2025`, already in the
registry from stage 1) — relevant context, not a retake-policy statement.

## 7. Certification validity period

**2 years.** Confidence: **HIGH**.

- Certification page "Includes" box: "Certification Valid for 2 Years." (source:
  `lf-lfca-cert-page`)
- Multiple Choice Exams FAQ: "Certifications are valid for 2 years." (source: `lf-faq-mc`)
- The FAQ also states the renewal mechanic: "Candidates have the option to retake and pass the
  exam to renew their certification. Certification Renewal must be completed prior to the
  certification expiration date. The renewed certification will remain current for a further 2
  years effective from the date the exam is passed." A CARE-program note about higher-level exams
  auto-renewing certain Associate-level certifications names KCNA and KCSA specifically, not
  LFCA — so it is **not stated** whether any higher-level exam auto-renews LFCA. (source:
  `lf-faq-mc`)

## 8. Price

**Confidence: HIGH.** Three purchase options, stated on the certification page:

| Option | Price |
| --- | --- |
| Certification exam only | $250 |
| Certification exam + Fundamentals of Open Source IT and Cloud Computing (LFS200) course | $299 |
| Certification exam + THRIVE-ONE Annual Subscription (unlimited e-Learning courses, SkillCreds, premium Microlearning) | $495 |

Source: `lf-lfca-cert-page`, the certification page's purchase section ("You have three ways to
purchase!") and the adjacent pricing widget, both consulted in a browser on 2026-08-09. Currency
is implicitly USD (the page does not print a currency code, but the region/language selector was
set to English/US at the time of access; not itself verified as a stated currency, so recorded
as-is).

---

## Sources consulted for this stage, and what they yielded

| Source | Yielded |
| --- | --- |
| `lf-lfca-cert-page` (already registered, re-consulted for its "Includes" summary box and pricing widget, both JS-rendered and only visible in a browser) | Price (all 3 options), duration (90 min), format ("Multiple Choice Exam"), delivery ("Online"), validity (2 years), retake ("One Retake"), 12-month exam eligibility, experience level ("Beginner") |
| `lf-faq-mc` (new) | Duration (90 min), passing score (75%), proctoring description, scoring/reporting turnaround (24 hours), certification validity (2 years), renewal mechanics, ID requirements, system requirements, price non-answer (defers to catalog) |
| `lf-important-instructions-mc` (new) | Proctoring platform detail (PSI Bridge, Secure Browser), system/testing-location requirements, ID requirements, sanctioned countries. No question count, no format detail beyond "Multiple Choice." Links to a `faq-lfca` page that returned HTTP 404 at time of access — dead link, not a usable source. |
| `lf-candidate-handbook` (already registered from stage 1; also reached via the `training.linuxfoundation.org/go/LFCA-candidate-handbook` redirect checked in this stage) | Nothing new. The redirect target is the same handbook page already catalogued in stage 1 as generic, non-LFCA-specific proctoring logistics. No new source record added for the redirect URL since it resolves to already-catalogued content. |
| `lf-lfca-learning-path-pdf` (new) | Nothing on mechanics. The PDF is a one-page infographic ("Sample Curriculum Path") listing suggested free/paid courses (LFS101, LFS162, LFS158, LFD102, LFS200) and stating no course is a prerequisite for the exam, plus a rough "3-6 months" self-paced prep estimate. No question count, duration, price, or scoring information. |
| `lf-lfca-free-resources` (new) | Nothing on mechanics. Landing page linking to free introductory courses; no exam logistics content. |

## Contradictions between sources

None found. Every fact stated in more than one place (90-minute duration, 2-year validity) was
consistent across sources. The only near-contradiction is the already-documented stage-1 finding
that `lf-objectives-2025` claims domains are unchanged when the archived page shows otherwise —
unrelated to mechanics and not re-litigated here.

## Open questions for a future pass

- Exact total question count: never found in any official source checked across two stages.
- Whether questions are single- or multi-select, and whether there is negative marking.
- Whether "12 Month Exam Eligibility" governs the retake window specifically or the whole
  purchase-to-attempt window.
- Whether a mandatory cooling-off period exists between a failed attempt and the included
  retake.
- Currency of the stated prices was not explicitly labelled by the Linux Foundation on the page.
