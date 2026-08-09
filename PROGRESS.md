# Progress — LFCA Research Foundation

Cycle 1 of 4. Spec: `docs/superpowers/specs/2026-08-09-lfca-research-foundation-design.md`

## Stage status

| Stage | Description | Status |
| --- | --- | --- |
| 1 | Official objectives capture | **complete** |
| 2 | Exam mechanics | not started |
| 3 | Taxonomy expansion | not started |
| 4 | LFS200 crawl | not started |
| 5 | Per-concept documentation research | not started |
| 6 | Candidate experience research | not started |
| 7 | Depth assignment | not started |
| 8 | View generation | not started |

## Completed

- Repo scaffolding and tooling: dataset loader, importance formula, ten validation checks,
  `tools/validate.mjs` gate.
- Stage 1: official objectives captured, and the full pre/post 2025-09-16 change set derived
  and recorded. All 22 competencies carry a real `sept_2025_status` — none left `unknown`.

## Pending

- Stages 2 through 8.

## Unresolved questions

- Exam question count, duration, and passing score not yet retrieved (stage 2). The Candidate
  Handbook was checked during stage 1 and contains none of these; it is generic across all
  Linux Foundation exams and was last updated roughly two years ago. Remaining candidates:
  the LFCA learning-path PDF, the free-resources page, and the docs.linuxfoundation.org FAQ.

## Access problems

- None. LFS200 portal login not yet attempted (stage 4).

## Coverage gaps

- **No official objective text finer than the competency name exists.** Verified 2026-08-09 in
  a browser on both authoritative pages. The certification page's accordion yields zero extra
  characters when fully expanded; the program-changes page claims per-domain change outlines
  that are not present. Consequence: `objective_verbatim` holds the competency name, and all
  finer taxonomy structure is `inferred: true`. LFS200 learning objectives will be attached in
  stage 4 as a separate course-derived tier, never as exam-derived official text.

## Research findings

### The published change notice is inaccurate

`https://training.linuxfoundation.org/lfca-program-changes-2025/` states the domains "will
remain unchanged". The Linux Foundation's own archived certification page (2025-08-01)
contradicts this. Recorded as a documented source disagreement in `data/sources.json` under
`lf-objectives-2025`, not silently resolved.

- **All six domain weights changed.** Both the old and new weight sets sum to 100
  independently, which cross-checks the archived transcription.
- **A domain was renamed:** "Supporting Applications and Developers" (8%) →
  "IT Project Management Fundamentals" (10%).

| Domain | Old weight | New weight |
| --- | --- | --- |
| Linux Fundamentals | 20% | 16% |
| System Administration Fundamentals | 20% | **30%** |
| Cloud Computing Fundamentals | 20% | 18% |
| Security Fundamentals | 16% | 14% |
| DevOps Fundamentals | 16% | 12% |
| Supporting Applications and Developers → IT Project Management Fundamentals | 8% | 10% |

### Competency change set

22 competencies: 8 unchanged, 8 reworded, 6 added. Six removed outright.

- **Added** (no pre-2025 study material covers these): Command Line; Best Practices
  (System Administration); Disaster Recovery; Best Practices (Cloud); Networking (Cloud);
  Compliance.
- **Removed:** File Management Commands; System Commands; General Networking Commands
  (all three collapsed into "Command Line"); Serverless; Network Security; System Security;
  Deployment Environments.

### Study implications

1. System Administration Fundamentals is now the heaviest domain by a wide margin at 30%,
   up from a joint 20%. It warrants proportionally more preparation than any other.
2. Disaster Recovery, Compliance, and both Best Practices competencies are new. No
   pre-September-2025 resource — including older LFS200 editions — can cover them.
3. Serverless and Deployment Environments are no longer named competencies and are now
   low-yield study targets.
4. "Best Practices" and "Networking" each appear under two different domains and mean
   different things in each. They are kept distinct by a `Domain::Competency` key throughout.

### Source problems

- The archived pre-2025 page rendered "System Security:" with a trailing colon. Treated as a
  typographic artifact of that page rather than part of the competency name.
- The Candidate Handbook carries no LFCA-specific content despite being linked from the
  certification page as a candidate resource.
