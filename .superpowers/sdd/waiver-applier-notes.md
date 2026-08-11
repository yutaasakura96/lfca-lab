# Notes for the Task 2 applier

Controller findings from reviewing the cluster JSON files before they are applied. These are
corrections to make while applying, not things for the cluster agents to redo.

## 1. Reuse existing source ids — do not register duplicates

`data/sources.json` already holds 282 sources. Two proposed ids collide with existing
registrations:

| Cluster proposed | Already registered as | Action |
| --- | --- | --- |
| `nist-sp-800-128-configuration-change-control` (D) | **`nist-sp-800-128`** — "NIST SP 800-128, Guide for Security-Focused Configuration Management" | Reuse `nist-sp-800-128`. Do not add a second record. |
| `nist-sp-800-30r1-risk-assessment` (D) | **`nist-sp-800-30r1`** — "NIST SP 800-30 Rev. 1 — Guide for Conducting Risk Assessments" | Reuse `nist-sp-800-30r1`. Do not add a second record. |

Before registering **any** proposed source, grep `data/sources.json` for the document number and
the organisation. A duplicate registration of the same document under two ids would make
`orphan-source` and the sourcing counts wrong, and would be invisible to every existing check.

## 2. NIST Special Publications are tier 2 in this dataset, not tier 1

Both NIST SPs already registered — `nist-sp-800-128` and `nist-sp-800-30r1` — carry
`"authority_tier": 2`. So do the other NIST publications this project cites (`nist-sp-800-34r1`,
`nist-sp-800-53r5`, `nist-sp-800-61r3`, `nist-sp-800-145`).

Cluster A proposed `nist-sp-800-77r1` at **tier 1** and cluster D proposed its NIST sources at
**tier 1**. That is arguably the more natural reading — these are US government standards
documents — but it is not how this dataset has classified NIST for two cycles.

**Register new NIST SPs at tier 2, matching the existing convention, and do not change the tier
of any already-registered source.** Changing an existing source's tier would ripple through
`weak-sources` for every concept citing it and is a dataset-wide decision, not a side effect of a
sourcing sprint. If the convention is thought wrong, that is a finding to record in `PROGRESS.md`
for a later deliberate pass — not something to fix here.

IETF RFCs are already tier 1 in this dataset, so cluster A's RFC 9111 and RFC 6349 at tier 1 are
correct as proposed. OASIS AMQP 1.0 (ISO/IEC 19464) is a standards-body document and tier 1 is
defensible; check how the dataset treats any comparable standards body before deciding.

## 3. Both prior waivers were correctly re-confirmed

Cluster D re-read the evidence for `sysadmin.best-practices.naming-conventions` and
`sysadmin.best-practices.capacity-planning` and confirmed both stay waived, which matches cycle
2's judgement. Do **not** un-waive either. `sysadmin.best-practices.principle-of-least-astonishment`
was reported genuinely unsourceable and also stays waived.

## 4. Recompute `by_competency`, never adjust it by hand

After removing cleared concepts from the `waived` array, regenerate the `by_competency` counts
from the resulting array. A hand-decremented count was among the most common defect classes in
both earlier cycles.

## 5. A cluster that did not run is not a cluster that found nothing

If any of `waiver-cluster-{A..F}.json` is missing or carries `"status": "partial"`, record that
in `docs/verification/waiver-sprint-2026-08-11.json` as unrun or partial work with the concepts
it did not reach named, and leave those concepts waived. Do not infer a negative result from an
absent file.

## 6. Cluster C failed on its first attempt — this is unrun work, not a negative result

The first cluster-C agent stalled with no progress for 600 seconds and was killed by the
watchdog. Its last output was "Now let me fetch the NASA SE Handbook and other candidate
sources." It examined **zero** of its ten concepts and wrote no output file.

The probable cause is the NASA SE Handbook: a ~700-page PDF that cluster A independently found
could not be read through the fetch-and-index path at all (it returned raw byte streams rather
than text, and A had to download and extract locally with pypdf before it could quote anything).

Cluster C has been re-dispatched as **C1** and **C2**, each with a smaller concept list and with
that extraction technique passed on explicitly.

**If either re-run also fails, its concepts stay waived and are recorded in
`docs/verification/waiver-sprint-2026-08-11.json` as `"status": "did not run"` with the concept
ids named.** They must not be recorded as "no source found" — nobody looked. Cycle 1 lost eight
findings to exactly this conflation, where a missing verdict read in the summary as a confident
refutation.

## 7. CORRECTION — note 2 was wrong about IETF RFCs

Note 2 above asserted "IETF RFCs are already tier 1 in this dataset". **That is false**, and the
Task 2 applier caught it by checking `data/sources.json` rather than believing the note.

Verified by the controller afterwards: all 20 tier-1 sources are Linux Foundation, CNCF, SPDX or
kernel-project publications. All 30 RFC records are tier 2. So `authority_tier: 1` in this dataset
does not mean "highest authority" — it means **the certifying body's own publications**, which is
a real and non-obvious convention nobody had written down.

All 24 sources registered by Task 2 are therefore tier 2, which is correct. The convention itself
is recorded in `PROGRESS.md` as a question for a later deliberate pass — a source's tier feeds
`weak-sources` for every concept citing it, so re-tiering is a dataset-wide decision, not a side
effect.

The note is left in place rather than deleted so the correction is visible.
