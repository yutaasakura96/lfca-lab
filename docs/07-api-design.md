# API design — LFCA exam simulator

**Status:** approved, Phase 4, 2026-08-30
**Triggered because** a real write surface exists: answers, flags and submits are HTTP calls made
during a live sitting, and their failure behaviour is a product requirement.
Architecture: [03-technical-design.md](03-technical-design.md) · Schema: [04-database-schema.md](04-database-schema.md)

---

## 0. Shape of the surface

**Reads are not endpoints.** Every screen is a React server component that queries Postgres directly
through `src/db/queries/`. There is no `GET /api/questions`, no `GET /api/exams`. This is deliberate:
the answer key lives in `question_option.correct` and `question_option.why`, and the surest way to
keep it off the wire during an exam is for no endpoint to be capable of returning it.

**Writes are route handlers**, six of them, all under `/api`. They are called by one small typed
`fetch` wrapper that owns the outbox (doc 03 §7). No server actions: an action's transport is
generated, which makes the retry semantics the outbox depends on harder to see and harder to test.

**Auth on every one is `user`.** There is no public endpoint except Better Auth's own, and no admin
role exists (PRD §1).

---

## 1. The one error format

Every non-2xx response from every endpoint, without exception:

```json
{
  "error": {
    "code": "attempt_already_submitted",
    "message": "This attempt was already submitted."
  }
}
```

`code` is a stable `snake_case` string the client branches on; `message` is human-readable English
and may change freely. There is no `details`, no field-level error array — the input surface (doc 03
§9) is four enums and two ids, and a failure there is a bug or an attack, not a user typo worth
explaining.

| Status | When | `code` values used |
| --- | --- | --- |
| 400 | Body fails its Zod schema | `invalid_request` |
| 401 | No valid session | `unauthenticated` |
| 403 | Signed in but not allowlisted | `not_allowlisted` |
| 404 | Attempt does not exist **or is not yours** | `not_found` |
| 409 | State conflict — already submitted, expired, question not on this attempt | `attempt_already_submitted`, `attempt_expired`, `question_not_in_attempt` |
| 500 | Anything unhandled | `internal_error` |

**404 is deliberately used for another user's attempt.** A 403 there confirms the row exists.

**No pagination, filtering or sorting conventions**, because nothing is unbounded: sixteen exams,
at most sixty questions, and an attempt history measured in dozens. If attempt history ever needs
paging, the convention is a cursor on the UUIDv7 `id` — never an offset.

---

## 2. `POST /api/attempt` — start a sitting

Creates an attempt and, for exam and holdout modes, freezes its clock by writing `started_at`. For
`mode = "exam"` it also sets `is_first_attempt` in the same `INSERT` (doc 04 §5.2).

**Request**

```json
{ "mode": "domain", "domain": "security", "length": 20 }
```

| Field | Rule |
| --- | --- |
| `mode` | `exam` \| `practice` \| `domain` \| `holdout` |
| `examId` | required iff `mode = "exam"`; must match `exam-\d{2}` and exist |
| `domain` | required iff `mode = "domain"`; one of the six |
| `length` | `mode = "domain"` only: `20` \| `40` \| `"all"`. Default `20`. Ignored elsewhere — practice is 60, exam is 60, holdout is 40 |

**Response `201`**

```json
{ "attemptId": "01936f2a-7c41-7a3e-9b52-0f1c8d4e6a10", "questionCount": 20, "deadline": null }
```

`deadline` is an ISO-8601 instant for `exam` (start + 90m) and `holdout` (start + 60m), `null`
otherwise. The client counts down to it for display only; the server never trusts it back.

**Failures:** `400 invalid_request` · `401` · `403 not_allowlisted` ·
`409 attempt_in_progress` — an unsubmitted attempt already exists for this mode-and-target, and the
client should resume it rather than start a second (the response carries its `attemptId`) ·
`409 holdout_already_sat` — the holdout is a one-shot sitting (PRD H1); a second start is refused,
and the screen offers its review instead.

---

## 3. `PUT /api/attempt/:id/answer` — record one answer

The hot path. Called on every option click. **Idempotent upsert** on `(attempt_id, question_id)`, so
every outbox retry is safe (doc 03 §7).

**Request**

```json
{ "questionId": "q.linux.command-line.awk.03", "optionRef": "o2" }
```

`optionRef: null` clears an answer.

**Response `200` — exam and holdout modes**

```json
{ "saved": true }
```

**Response `200` — practice and domain modes**

```json
{
  "saved": true,
  "isCorrect": false,
  "correctRef": "o1",
  "why": {
    "o1": "Short options take one hyphen each and may be clustered behind a single hyphen…",
    "o2": "Clustering does not fold case; `-a` and `-A` are different options…",
    "o3": "A single hyphen introduces a cluster of short options, not a long one…",
    "o4": "Long options take two hyphens and are spelled out in full…"
  }
}
```

**This response shape is where PRD E3 is enforced.** In timed modes the handler returns `{saved}`
and nothing else — not a correctness flag, not a running total, no `why`. The branch is on
`attempt.mode` read from the database, never on anything the client sent. P1 needs the `why` for
**all four** options, not just the correct one, because the wrong-option text is the most valuable
content in the bank (PRD E4).

**Failures:** `400` · `401` · `404 not_found` · `409 attempt_already_submitted` ·
`409 attempt_expired` — the clock ran out; the client stops accepting input and routes to review ·
`409 question_not_in_attempt` — the question is not one of this attempt's own (doc 03 §9).

---

## 4. `PUT /api/attempt/:id/flag` — flag or unflag

Exam and holdout modes only. Separate from `/answer` so that a flag is never coupled to an answer's
retry, and so a flag write can never accidentally carry an `optionRef`.

**Request** `{ "questionId": "q.linux.command-line.awk.03", "flagged": true }`
**Response `200`** `{ "saved": true }`

Upserts the same `(attempt_id, question_id)` row, touching only `flagged`. If no answer row exists
yet, one is created with `option_ref = null` — the flagged-but-unanswered case in doc 04 §6.

**Failures:** as §3, plus `409 flagging_not_available` in practice and domain mode (forward-only, no
flagging — PRD §2).

---

## 5. `POST /api/attempt/:id/submit` — finalise and score

**Request** — empty body.

**Response `200`**

```json
{
  "submitted": true, "score": 52, "questionCount": 60,
  "passed": true, "passMark": 45, "percent": 86.7, "reason": "user"
}
```

For practice and domain mode the four measured fields are null together:
`{ "submitted": true, "score": null, "questionCount": 20, "passMark": null, "passed": null,
"percent": null, "reason": "user" }` — those modes are not measured (PRD P1, D1).

**`percent` and `reason` are two fields this section did not originally list**, added when it was
built. `percent` because PRD E4 requires the score "as `n/60` **and a percentage**", and a
percentage computed on the client would be a second place a displayed number is decided.
`reason` because PRD E6 must not conflate finishing with running out of time, and the column that
records the difference (doc 04 §5.1) is otherwise unreadable to the screen that reports it. Both are
derived server-side from the row; neither is anything a client may send.

**The concurrency contract.** Submission is one conditional update:

```sql
UPDATE attempt SET submitted_at = now(), submit_reason = $reason,
  score = CASE WHEN $scored THEN (
            SELECT count(*)::int FROM answer a
            WHERE a.attempt_id = attempt.id AND a.is_correct
          ) END
WHERE id = $1 AND submitted_at IS NULL
```

**The score is counted inside that statement rather than read first and written second**, which is a
correction to this document rather than a refinement of it. A read-then-write leaves a window in
which an answer commits between the two, and the update then finalises the sitting with a score that
predates one of its own answers. Counting in the `UPDATE` decides the count and the `submitted_at`
that stops further answers at one instant. What the count *means* — the mark, the verdict, the
percentage — stays in `src/domain/score.ts`, and the integration suite runs that pure function over
the same rows and requires the two to agree (doc 11 §1's oracle problem, answered as well as it can
be).

The caller that updates a row is the one that submitted. A caller that updates zero rows — the second
click, the second tab — gets **`200`, not an error**, reading back the already-final result. PRD §5
requires a double submit to be a no-op, and the honest reading of "no-op" is that the user sees their
score, not a conflict. `is_first_attempt` is **not** touched here — it was set when the attempt was
created (doc 04 §5.2), so the flag does not depend on the order sittings are finalised in.

**Failures:** `401` · `404` · `409 outbox_pending` is **not** a server concern — the client blocks
submit while its outbox is non-empty (doc 03 §7); the server has no way to know.

**There is deliberately no `409 attempt_expired` here, and no `409 attempt_already_submitted`.**
This is the one attempt-scoped write that loads its attempt through the *read* helper, because both
of those refusals would be wrong: a second submit must be answered with the first one's score, and an
expired sitting is precisely one that still needs finalising. The reason is read from the clock — a
sitting past its deadline is recorded `expired` whoever pressed the button — never from the request,
which has no body to say it in.

---

## 6. `GET /api/attempt/:id/state` — resync

Called on tab focus and on reconnect. The only `GET` in the surface, and it exists solely so the
client can re-derive the clock without a full page load.

**Response `200`**

```json
{
  "status": "in_progress",
  "deadline": "2026-09-05T19:40:00.000Z",
  "serverNow": "2026-09-05T18:52:31.004Z",
  "answeredCount": 41,
  "flaggedCount": 6
}
```

`status` is `in_progress` | `submitted`. `serverNow` lets the client measure clock skew
and apply it to its own countdown — the display is then correct even on a machine with a wrong clock,
while the actual expiry stays server-side. It is measured **over the round trip**, not against the
moment the reply landed, or the journey itself would be counted as skew and the countdown would read
generously by exactly that much.

When the server finds the attempt expired, this call **finalises it lazily** (doc 03 §6) and returns
`status: "submitted"`. This is the endpoint that implements "90 minutes elapsed while the tab was
closed" for a tab that is still open — a laptop woken with the sitting in front of it resyncs on
`focus`, learns the sitting is over, and shows what it scored where it stands. It does **not**
navigate: doc 10 §6 makes the expired dialog the destination, and a redirect out from under someone
who has just come back to the page would take the number away before they read it. The redirect to
review belongs to the *page* read (`/attempt/[id]`), which is the arrival PRD E5 describes.

**There was a third value, `expired`, and it is gone rather than changed.** It existed only for the
window in which this endpoint reported an expired sitting without closing one, because the lazy
submit reuses the submit path and that path belonged to a later slice. That slice has landed: the
same read that would have returned `expired` now finalises the attempt first, so there is no longer
a moment at which the value is true on the way out of this handler. An attempt past its deadline
that nothing has touched is still a real state in the database (doc 03 §6) — it simply cannot be
observed through this endpoint, because observing it through this endpoint ends it. See the decision
log, 2026-09-02 and 2026-09-04.

---

## 7. `/api/auth/*` — Better Auth

Mounted wholesale by Better Auth's Next.js handler. Not designed here; its behaviour and the
allowlist hook are documented in [08-auth-and-permissions.md](08-auth-and-permissions.md). The routes
used are the Google sign-in redirect, its callback, session read, and sign-out.

---

## 8. Full example — one exam question answered

```http
PUT /api/attempt/01936f2a-7c41-7a3e-9b52-0f1c8d4e6a10/answer HTTP/1.1
Content-Type: application/json
Cookie: better-auth.session_token=…

{ "questionId": "q.security.compliance.policy-standard-and-procedure.02", "optionRef": "o3" }
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{ "saved": true }
```

The same call thirty seconds after the clock expired:

```http
HTTP/1.1 409 Conflict
Content-Type: application/json

{ "error": { "code": "attempt_expired", "message": "This attempt's time has run out." } }
```

— on which the client stops accepting input, drops the outbox, and routes to the review screen.
