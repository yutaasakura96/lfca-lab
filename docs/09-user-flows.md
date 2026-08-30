# User flows — LFCA exam simulator

**Status:** approved, Phase 4, 2026-08-30
**Deliberately narrow.** [10-screen-specifications.md](10-screen-specifications.md) already specifies
all eight screens including their empty, loading and error states. This document covers only the
three flows whose interesting content sits **between** screens — a state machine no single screen
description can hold. Ordinary flows (sit an exam, drill a domain) are the happy path through doc 10
and are not restated here.

---

## Flow A — First sign-in

**Entry:** the deployed URL, no cookie.

1. Middleware finds no session → **302 `/sign-in?next=/`**.
2. Sign-in screen: the product name, one line of what it is, one button — *"Continue with Google"*.
3. Click → button takes its loading label (*"Signing in…"*, doc 03 §8) → redirect to Google.
4. Google consent (first time only) → callback to `/api/auth/callback/google`.
5. Better Auth's sign-in hook checks the verified email against `ALLOWED_EMAILS` (doc 08 §3).
6. Allowed → `user` + `account` + `session` written → **302 to `next`**, here `/`.
7. Home screen, entirely empty of history: three mode cards, the holdout card marked *not yet sat*,
   and the exams link showing **0 of 16 attempted** — never a blank panel and never zeros presented
   as scores (PRD §4: zeros read as failures).

**What can go wrong**

| At | Failure | User sees | State left |
| --- | --- | --- | --- |
| 3 | Google unreachable | Button returns to default, inline: *"Couldn't reach Google. Try again."* | None. |
| 5 | Email not allowlisted | `/sign-in?denied=1` — *"This app is private."* No email echoed, no request-access link. | **Nothing written.** No user row, no account, no session. |
| 5 | `email_verified` false | Same denied screen. | Nothing. |
| 5 | `ALLOWED_EMAILS` unset | Same denied screen for everyone, plus a startup error in the logs. Fails closed (doc 08 §3). | Nothing. |
| 6 | Database unreachable | The error state from doc 10, with retry. | Google session exists; ours does not. Retrying signs in cleanly. |

**Abandonment:** closing the tab at Google's consent screen leaves nothing behind anywhere.

---

## Flow B — The interrupted attempt

The one flow the whole architecture is shaped around (PRD E5, doc 03 §6). Three branches turn on one
question: **has the deadline passed?**

**Entry:** an exam attempt is in progress; the tab is closed, the laptop sleeps, or the network dies.

1. Every answer and flag was already durable when made (doc 03 §7). Nothing is pending at the moment
   of interruption except at most the in-flight write.
2. The candidate returns — reopens the tab, follows a bookmark, or clicks *Resume* on the home
   screen (which is visible because of the partial index in doc 04 §5.1).
3. The server loads the attempt and computes remaining time from `started_at`. **The browser is not
   asked what time it is.**

**Branch B1 — time remains.** The sitting is restored: the same question index, every saved answer,
every flag, and a countdown to the server-derived deadline. Elapsed wall-clock time counted while
the tab was closed, and the clock shows that honestly. No dialogue, no "welcome back" — resuming is
not an event, it is just the screen.

**Branch B2 — the deadline passed while away.** The attempt is finalised **lazily on this read**
(doc 03 §6, doc 07 §6): `submitted_at = now()`, `submit_reason = 'expired'`, score computed from the
answer rows that exist. The candidate lands **directly on the review screen**, which states plainly
that time ran out. The clock is never silently extended, and the sitting is never re-opened.

**Branch B3 — a second tab.** Both tabs derive the same deadline from the same `started_at`, so they
cannot disagree. Answers upsert on `(attempt_id, question_id)`, so the later write wins and the
earlier is not corrupted. If one tab submits, the other's next call returns
`409 attempt_already_submitted` and it routes to review.

**What can go wrong**

| Failure | User sees | State left |
| --- | --- | --- |
| Network dies mid-sitting | *"Not saved — retrying"* chip. **Answering continues. The clock continues.** (doc 10 §4) | Answers queue in memory; backoff 1→30s. |
| Network never returns, tab closed with a full outbox | `beforeunload` warns first. | Queued answers are lost — at most the last few. Everything acknowledged is durable. This is the accepted limit of the in-memory outbox (doc 03 §7). |
| Browser crashes between two answers | Nothing; on return, branch B1. | At most the in-flight answer lost, per PRD E5. |
| Submit clicked while the outbox is non-empty | Submit is blocked, button shows *"Scoring…"* until the queue drains. | Nothing lost. |

---

## Flow C — Abandoning without submitting

The flow that protects the honest number. **Quitting a sitting that is going badly must not be a way
to avoid recording a first attempt** (PRD §5).

1. Candidate starts exam 07 for the first time. `is_first_attempt` is set at **start**, not at
   submit — so it is already true on a sitting that is never finished.
2. They answer nine questions, dislike how it is going, and simply leave.
3. **Nothing is deleted and nothing is discarded.** The attempt stays open, with nine answers.
4. Meanwhile: the home screen offers *Resume*, and the exam list shows exam 07 as **in progress** —
   not as unattempted, and not with a score yet.
5. Ninety minutes after `started_at`, the attempt is due. It is finalised on the **next read of it**
   — resuming it, listing the exams, or opening the home screen. There is no cron; the score is
   already fully determined by the nine answer rows either way.
6. The exam list then shows exam 07 with **first attempt 9/60** — and that number is never
   overwritten, however many times it is re-sat afterwards (PRD E6, E7).

**Where the candidate can abandon, and what remains**

| Abandoned at | State left |
| --- | --- |
| Start screen, before starting | Nothing. No attempt row is written until *Start* is clicked. |
| Mid-sitting, exam mode | An open attempt with its answers; auto-submitted at the deadline as above. First attempt is recorded. |
| Mid-sitting, practice or domain mode | An open attempt with `time_limit_seconds = null` — it **never expires** and is never auto-submitted (doc 03 §6). It stays resumable indefinitely and affects nothing: practice is unscored, and its answers already count toward unseen-first selection. |
| On the submit confirmation dialogue | Dismissing returns to the sitting with the clock still running. Nothing changes. |
| Mid-review, after submitting | Nothing. The attempt is final; review is a read. |

**The one place this is deliberately uncomfortable:** there is no *"discard this attempt"* action,
anywhere, in any mode. It was considered and rejected — a discard button is precisely the dodge that
first-attempt scoring exists to close. See the decision log.
