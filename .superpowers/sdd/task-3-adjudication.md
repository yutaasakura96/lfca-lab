# Task 3 — controller adjudication of the fact-check refutations

Read this before applying anything from `docs/verification/factcheck-*.json` produced by Task 3.
A finding is a report, not an instruction, and three of the first refutations would be actively
damaging if applied literally.

## The governing rule for this batch

**Every refutation so far is an attribution defect, not a factual error.** In each case the
guide's technical claim is *true*; what fails is the citation that is supposed to support it. So
the fix is **to `additional_sources` and to attribution wording — not to the technical prose.**

Rewriting an accurate sentence so it matches a weaker citation would make the guide worse while
appearing to close a finding. Do not do it.

## `study-guide/03-cloud-computing/cloud-computing.md` — 26 examined, 3 refuted

### cloud-computing-013 · `cloud.cloud-computing.serverless-and-faas` — CONFIRMED, fix the source

The guide attributes to CNCF a specific claim: that FaaS charges only for computation time and
accrues no cost when idle. Declared sources are `cncf-glossary-serverless` and `nist-sp-800-145`.
The serverless glossary page does not contain that claim; the **FaaS** glossary page does.

**Fix:** register `https://glossary.cncf.io/function-as-a-service/` as a new source (tier 2 — CNCF
sits under the Linux Foundation, but see the tier note below) and add it to this concept's
`additional_sources`, then update the guide's metadata `sources:` line. **Leave the prose alone**
— it accurately reports what CNCF says, just from a page nobody had registered.

### cloud-computing-015 · `cloud.cloud-computing.container-vs-virtual-machine` — CONFIRMED, and the worst of the three

This concept's **only** non-objectives source is `cncf-glossary-virtualization`, and that page does
not mention containers at all. A concept whose subject is containers versus virtual machines cites
a page that never mentions containers.

**Fix:** register `https://glossary.cncf.io/container/` and add it. Leave the prose alone. Note in
`PROGRESS.md` that this is the same defect class as cycle 2's NIST SP 800-61r3 and SP 800-145
findings — a source cited for content it does not contain — now found for a third time, which
says the class is systemic rather than incidental and is worth a dedicated sweep in a later cycle.

### cloud-computing-016 · `cloud.cloud-computing.hypervisor` — CONFIRMED as attribution only. **DO NOT change the examples.**

The guide gives VMware Workstation and Oracle VirtualBox as type-2 hypervisor examples. The cited
VMware page lists "VMware Fusion, Oracle VM, VirtualBox".

**VMware Workstation is genuinely a type-2 hypervisor. The guide's claim is true.** Fusion and
Workstation are the same class of product on different host operating systems — Fusion on macOS,
Workstation on Windows and Linux. The defect is only that the guide presents its example list as
coming from that page when the page names a different product.

**Fix:** adjust the attribution, not the example. Either stop presenting the list as the VMware
page's own, or add Fusion alongside Workstation. **Do not replace Workstation with Fusion** —
that would swap a correct, more widely recognised example for a narrower one purely to satisfy a
citation, which is the tail wagging the dog.

## Tier

New CNCF sources: check what tier existing CNCF records use before choosing. `cncf-glossary`,
`cncf-charter` and `cncf-who-we-are` are **tier 1** in this dataset, because tier 1 here means the
certifying body's own publications and CNCF sits under the Linux Foundation. That is the opposite
of the NIST and RFC convention, and it is not an inconsistency to fix — it follows from what tier
1 actually means here. Match the existing CNCF records.

## Coverage, to be recorded honestly

`cloud-computing.md` has 23 concepts; the pass produced records for **19**. Four were not reached.
Record the count and the unexamined concept ids in `PROGRESS.md` rather than describing the file
as checked.

`cloud/networking.md`: 28 claims examined across all 14 concepts, **0 refuted**. The agent stated
plainly that it covered the highest-risk cross-provider assertions and not the provider name-map
table's remaining rows, the comparison-table restatements, or the scenario and knowledge-check
sections. Record it that way. This file has had two prior corrective passes, which is the likely
reason it came back clean; that is an explanation, not a guarantee.

## `study-guide/04-security/sensitive-data.md` — 34 examined, 0 refuted

All 13 concepts covered. 16 NIST sources, 7 GDPR, 4 CFR via Cornell, plus PCI SSC, RFCs, man7.
The agent deliberately used `citation-mismatch` as a *kind* on 11 records that all came back
confirmed — it went hunting for this project's known failure class and recorded that it looked.
That is what makes a zero-refutation result credible rather than suspicious.

**Minor, for the final review:** GDPR was read from `gdpr-info.eu` rather than
`eur-lex.europa.eu`. That site carries the verbatim official text and is widely used, but it is a
mirror and the brief asked for eur-lex. Not worth re-running; worth recording.

## `study-guide/04-security/compliance.md` — 31 examined, 30 confirmed, 1 "refuted"

**The single refutation is NOT a factual defect and must not be applied as one.**

`compliance-019` concerns the guide's citation of specific PCI DSS requirement numbers (3.3.1,
3.3.3, 3.5.1, 11.3.2). The agent could not reach the PCI DSS v4.0 standard text:
`docs-prv.pcisecuritystandards.org` returned HTTP 403 to every method attempted, and no reachable
secondary carried the requirement text. It recorded `refuted` **as a hard stop on
unverifiability**, and said so explicitly: "not because the numbers are known to be wrong... an
unverifiable requirement-number citation must not be reported as confirmed."

That is the correct default — uncertain resolves to refuted, never to confirmed. But the
**disposition is different from every other refutation in this batch**:

- **Do not change the guide.** The requirement numbers may well be right.
- **Do not record it as a confirmed defect** in any count of refutations.
- Record it in `PROGRESS.md` under what remains unverified: the PCI DSS standard text sits behind
  a licence-acceptance gate that refuses automated access, so those four requirement numbers rest
  on the writer's original sourcing and have never been checked against the standard.
- A question written on those requirement numbers should be avoided until they are verified, or
  written so it does not turn on the number. Flag this to whoever authors
  `Security :: Compliance` items in Task 24.

**Counting note.** Wave 1 totals are 119 claims examined and **3 genuine refutations**, all three
attribution defects in `cloud-computing.md`, plus 1 unverifiable claim recorded separately. Do not
report 4 refutations — that would overstate what was found, in the same way cycle 1's silent
default-to-reject overstated what had been refuted.

**Coverage.** The agent examined 31 claims and stated it did not separately check the Traps
sections, the knowledge-check answers, or the comparison tables. Record that boundary.

## `study-guide/03-cloud-computing/budgeting.md` — 19 examined across all 13 concepts, 2 refuted

Both confirmed by the controller as real. **Unlike every earlier refutation in this batch, the
first one is a genuine factual error and the prose must change.**

### budgeting · spot/preemptible interruption mechanics — FACTUAL ERROR, fix the prose

The concept states spot interruption mechanics — two-minute notice, terminate/stop/hibernate
options, rebalance recommendation — in the generic "the provider" voice. **Those are AWS's
mechanics only.** Azure Spot VMs and Google Cloud Spot/preemptible VMs both give a **30-second**
eviction notice with different semantics and no hibernate option.

This is the third confirmed instance of the cross-provider-generalization defect in the Cloud
Computing domain: `cloud-subnets`, `cidr-planning`, `internet-gateway-and-nat-gateway` in
`networking.md` (one Critical), and now this. **Fix the prose**, stating AWS's two-minute notice
as AWS-specific and naming the 30-second figure for Azure and Google Cloud, with each cited to
that provider's own documentation. Do not simply hedge it to "varies by provider" — the numbers
are the examinable content.

### budgeting · `cloud.budgeting.capex-vs-opex` cites a whitepaper about something else

The concept cites `aws-rightsizing-whitepaper`, whose content is entirely about instance
rightsizing and contains no CapEx/OpEx accounting material at all.

**Fix the citation, not the prose** (unless the prose itself is wrong on the accounting, which
this pass did not find). Either source it properly or, if no primary source states it, treat it
the way the waiver policy treats an unsourceable claim.

## The systemic finding — a source cited for content it does not contain

This is now **six confirmed instances across two cycles**:

| # | Concept | Cited | Actually contains |
| --- | --- | --- | --- |
| 1 | `security.incident-response` | NIST SP 800-61r3 | no PICERL six-step lifecycle |
| 2 | `cloud.multi-cloud` | NIST SP 800-145 | the term appears nowhere |
| 3 | `cloud.managed-services` | NIST SP 800-145 | the term appears nowhere |
| 4 | `cloud.serverless-and-faas` | `cncf-glossary-serverless` | claim is on the FaaS page |
| 5 | `cloud.container-vs-virtual-machine` | `cncf-glossary-virtualization` | never mentions containers |
| 6 | `cloud.budgeting.capex-vs-opex` | `aws-rightsizing-whitepaper` | no CapEx/OpEx material |

Cycle 2 found 1–3 and treated each as an isolated correction. Cycle 3 has found three more in a
single pass over eight files, without looking for them systematically. **The rate suggests many
more across the 537 concepts and 306 sources that nobody has checked.**

`npm run validate`'s `unsourced-concept` check proves a concept *cites* a tier-1/2 source. Nothing
in this project has ever checked that a cited source *contains* the claim attributed to it, and
that is a different and much harder property. Recommend a dedicated sweep as scope for cycle 4,
sized against all 537 concepts, rather than continuing to close instances one at a time.

## Task 3 final — after the coverage top-up

**241 claims examined, 9 refuted, 131/131 concepts covered (100%).**

The first eight-agent pass reached only 101/131 concepts (77%) despite examining 206 claims. Each
agent honestly reported prioritising the highest-density claims, so this was scoping rather than
dishonesty — but the plan promises a second pass over the *files*, not over their densest claims.
Two top-up agents closed the remaining 30 concepts.

**The top-up justified itself immediately: it found the same spot-interruption defect in a second
concept the original pass never opened** (`cloud.budgeting.free-tier-and-pricing-calculators`,
alongside the one already found in `cloud.budgeting.on-demand-reserved-and-spot`). The coverage
gap was concealing real errors, not merely unexamined-but-correct prose. Record that: it is the
argument for measuring coverage rather than accepting a claim count.

### The 9 refutations, by required action

**Fix the prose — 2, and they are the same defect in two places.** AWS's two-minute spot
interruption notice stated in the generic "the provider" voice. Azure and Google Cloud both give
roughly 30 seconds. Fix both sites; state AWS's figure as AWS's and name the others with their own
citations. Do not hedge to "varies by provider" — the numbers are the examinable content.

**Fix the citation, leave the prose — 5.**
- `serverless-and-faas` → register the CNCF FaaS glossary page.
- `container-vs-virtual-machine` → register the CNCF container glossary page.
- `hypervisor` → attribution only. **DO NOT replace VMware Workstation with Fusion.**
- `capex-vs-opex` → cited to `aws-rightsizing-whitepaper`, which has no CapEx/OpEx content.
- `cost-monitoring` → granularity claim is true per AWS Cost and Usage Reports, but cited to the
  AWS Budgets page, which does not discuss granularity.

**Change nothing, record as unverified — 2.**
- `compliance-019`, PCI DSS requirement numbers: standard text behind a licence gate.
- `virtual-machine` snapshot/clone/live-migration: the cited `vmware-hypervisor` page returns no
  fetchable body text. Unverified, not disproven.

**Do not report 9 factual defects.** The honest split is 2 factual errors, 5 attribution defects,
2 unverifiable. Conflating them would overstate what was found — the same error in the opposite
direction to cycle 1's silent default-to-reject.

### The systemic finding is now SEVEN instances

`cost-monitoring` cited to the AWS Budgets page brings the source-cited-for-content-it-does-not-contain
count to seven across two cycles. Four of those seven were found in the last few hours, in one
pass over eight of twenty-two files, without anyone hunting for them systematically. Extrapolating
even conservatively across 537 concepts and 306 sources, this is the largest known unmeasured
defect class in the project. Proposed as cycle 4 scope.
