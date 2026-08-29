# Product requirements — LFCA exam simulator

**Status:** approved, Phase 1, 2026-08-28
**What the system does, from the user's perspective. No tech decisions here.**
Brief: [01-project-brief.md](01-project-brief.md) · Decisions: [06-decision-log.md](06-decision-log.md)

---

## 1. User types

One: **the candidate.** Signed in with Google, and the only account that exists. There is no
admin type — question content is administered by editing JSON in the repo, not through the app.

---

## 2. The three modes

The whole product is three ways to answer the same questions. They differ in composition,
clock, and when feedback appears — not in how a question renders or where the data comes from.

| | **Exam mode** | **Practice mode** | **Domain mode** |
|---|---|---|---|
| Questions | 60 | 60 | 20 default, 40 or all-in-domain selectable |
| Composition | Official domain weights | Official domain weights | One chosen domain |
| Clock | 90 minutes, counting down | none | none |
| Feedback | After submit, all at once | Immediately per question | Immediately per question |
| Score | Yes, against 45/60 | No | No |
| Free navigation + flagging | Yes | No — forward only | No — forward only |
| Source | One of the 16 fixed exams | Exam pool, weighted | That domain's pool |

**Official weights, and what they mean per 60-question sitting.** These are the real exam's
published weights; the sixteen generated exams already match them to within one question.

| Domain | Weight | Per 60 | Exam pool available |
|---|---|---|---|
| System Administration | 30% | 18 | 300 |
| Cloud Computing | 18% | 11 | 180 |
| Linux Fundamentals | 16% | 10 | 160 |
| Security | 14% | 8 | 140 |
| DevOps | 12% | 7 | 120 |
| IT Project Management | 10% | 6 | 100 |

---

## 3. User stories

Priority is `MUST` (v1 is not v1 without it), `SHOULD` (v1 should have it, cut under pressure),
`LATER` (deliberately deferred).

### Exam mode

**E1 · `MUST` — Sit a timed exam.**
*As the candidate, I want to sit one of the sixteen exams under a 90-minute clock, so that I
practise under the real exam's time pressure.*
**Acceptance:** Starting exam 07 presents its 60 questions in their defined order with a
visible countdown from 90:00. The clock runs continuously from start. At 00:00 the attempt
auto-submits with whatever has been answered.

**E2 · `MUST` — Navigate and flag freely before submitting.**
*As the candidate, I want to skip a hard question, flag ones I'm unsure of, and review before
submitting, so that I can bank the easy questions first — a real test-taking skill at 90
seconds per question.*
**Acceptance:** Any of the 60 is reachable at any time. Each can be flagged and unflagged. A
review screen lists unanswered and flagged counts and jumps to either. Submit is available at
any point, and warns when questions are unanswered.

**E3 · `MUST` — Get no feedback until I submit.**
*As the candidate, I want the app to stay silent about correctness during the sitting, so that
the score means something.*
**Acceptance:** No correctness indicator, no `why` text, no running score is visible between
start and submit.

**E4 · `MUST` — See my score and a full review afterwards.**
*As the candidate, I want my score against the pass mark and an explanation of every question,
so that I learn from the sitting rather than just being graded by it.*
**Acceptance:** On submit: score as `n/60` and a percentage, with pass/fail against **45/60
(75%)**. Then every question in order showing my answer, the correct answer, and the `why`
text for **all four options** — not only the correct one. Wrong-option `why` text explains why
the misconception is tempting, and that is the most valuable content in the bank.

**E5 · `MUST` — Resume an interrupted attempt with the clock still running.**
*As the candidate, I want to close the tab at question 40 and come back to question 40, so
that a closed laptop doesn't destroy an attempt — especially a first attempt.*
**Acceptance:** Answers and flags persist as they are made, not at submit. Returning to an
in-progress attempt restores position, answers, flags, and the **true remaining time** —
elapsed wall-clock time counts whether the tab was open or not. If 90 minutes elapsed while
away, the attempt is submitted as it stood.

**E6 · `MUST` — See best and first-attempt scores for all sixteen exams.**
*As the candidate, I want one screen listing the sixteen exams with both numbers, so that I can
see how far I am from 100% everywhere and still see an honest signal.*
**Acceptance:** A list of all sixteen, each showing best score, first-attempt score, and number
of attempts. Un-sat exams show as not yet attempted. Both numbers are always shown together;
first-attempt is never overwritten by a later sitting.

**E7 · `SHOULD` — Re-sit any exam.**
*As the candidate, I want to sit exam 07 again after reviewing it, so that I can reach 100%.*
**Acceptance:** Any exam can be started again. Each attempt is recorded separately. Best score
updates; first-attempt does not.

### Practice mode

**P1 · `MUST` — Answer a weighted set with immediate feedback.**
*As the candidate, I want a 60-question set composed like the real exam but with the answer
revealed as I go, so that I learn continuously instead of waiting 90 minutes.*
**Acceptance:** 60 questions drawn from the exam pool in the weights of §2 (18/11/10/8/7/6).
On answering, the app immediately shows correct or incorrect plus the `why` for all options.
No clock. No score at the end — this mode is not measured.

**P2 · `MUST` — Never be served the 40 holdout items.**
**Acceptance:** The 40 unused pool items are excluded from practice and domain mode selection
and from all sixteen exams. They are reachable only through the holdout sitting (H1).

**P3 · `SHOULD` — Prefer questions I haven't seen.**
*As the candidate, I want practice mode to reach for unseen questions before repeating ones,
so that repeated sessions widen coverage instead of recycling.*
**Acceptance:** Within each domain's quota, unanswered questions are selected before
previously-answered ones. Once a domain's pool is exhausted, it repeats least-recently-seen
first. This is ordering only — explicitly **not** the adaptive selection ruled out in the brief.

### Domain mode

**D1 · `MUST` — Drill one domain.**
*As the candidate, I want to pick Security and get only Security questions, so that a weak area
gets a short, repeatable session instead of 8 questions buried in a 60-question exam.*
**Acceptance:** Choosing one of the six domains starts a session of that domain's questions
only, with immediate feedback, no clock, and no score. Unseen-first ordering as P3.

### Holdout

**H1 · `SHOULD` — Sit the 40-question holdout once.**
*As the candidate, I want one sitting on questions I have provably never seen, so that I have a
readiness signal untainted by memory before I book the retake.*
**Acceptance:** Presented as a distinct, clearly-labelled sitting, timed like exam mode
(pro-rata: 40 questions, 60 minutes), scored, reviewed the same way. The app records that it
has been sat and does not hide that fact afterwards.

### Cross-cutting

**X1 · `MUST` — Sign in with Google.**
**Acceptance:** Unauthenticated visitors see a sign-in screen and nothing else. After signing
in, all history belongs to that account.

**X2 · `MUST` — The app never writes question content.**
**Acceptance:** Questions, options, `why` text and exam composition are read from the repo's
JSON. No screen edits them. Rebuilding the bank and restarting the app picks up changes.

**X3 · `LATER`** — Other users, sharing, adaptive selection, in-app study guide, native mobile,
per-concept analytics beyond what E6 shows.

---

## 4. Zero-data states

Empty states are requirements, not afterthoughts. On a first sign-in, everything is empty.

| Screen | With no data | Requirement |
|---|---|---|
| Exam list (E6) | All sixteen unattempted | Show all sixteen as available with "not yet attempted" rather than blank rows or zeros. Zeros read as failures. |
| Exam review (E4) | n/a — always follows a sitting | — |
| Practice/domain | No history, so unseen-first is a no-op | Behaves identically to a fresh pool. No special case. |
| Holdout (H1) | Not yet sat | Visible but clearly marked as the one-shot check, with what it is for. |

---

## 5. Ugliest edge case per feature

| Feature | Edge case | Required behaviour |
|---|---|---|
| Exam clock | 90 minutes elapse while the tab is closed | On return, the attempt is already over. Submit it as it stood and go straight to review. Never silently extend the clock. |
| Exam clock | Two tabs open on the same attempt | One attempt is one attempt. Later writes win; the clock is derived from the attempt's start time, so tabs cannot disagree about remaining time. |
| Resume (E5) | Answer recorded, then the browser dies before the next | Each answer is durable when made. At most the in-flight one is lost. |
| Submit (E2) | Double-click submit | Second submit is a no-op. An attempt is scored exactly once and its first-attempt flag set exactly once. |
| First-attempt (E6) | An attempt abandoned mid-way, never submitted | An abandoned attempt is still the first attempt, auto-submitted at 90 minutes. Otherwise the honest number can be dodged by quitting badly-going sittings. |
| Selection (P3) | A domain's unseen pool runs out mid-session | Fill the remainder with least-recently-seen. Never return a short session, never error. |
| Holdout (P2) | A future `npm run build-exams` puts a holdout item into an exam | The holdout is defined by identity, not by "whatever is unused". Its 40 IDs are pinned, and a build that would serve one elsewhere is a validation failure. |
| Question data | An item has no `why` on some option | Render what exists; never show an empty explanation block. Missing `why` is a data defect for `npm run validate`, not a runtime crash. |

---

## 6. Not in v1 — expanded from the brief

Beyond the brief's five: no timed practice mode, no exam composed on the fly (the sixteen are
fixed sets), no partial-credit or multi-select questions (the bank is single-correct
four-option throughout), no printing or PDF export, no notifications or reminders, no
importing external question banks, no offline support.

---

## 7. Open assumptions

Flagged rather than invented. Neither blocks Phase 4.

1. ~~**Domain mode session length is assumed to be 20 questions.**~~ **Resolved 2026-08-29:**
   a 20 / 40 / all-in-domain selector, defaulting to **20**. See `06-decision-log.md` and
   `10-screen-specifications.md` §3.
2. **Practice mode is assumed to be 60 questions**, mirroring exam mode's composition. It may
   want to be shorter. Same one-line change.
