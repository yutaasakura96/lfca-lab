# Project status

**Project:** An LFCA exam simulator built on this repo's existing 1,150-question bank — three
modes (exam, practice, domain) replacing the sixteen static markdown practice exams.
**Phase:** 6 — Build
**Updated:** 2026-09-09

## Done
- **Phase 1 — Brief + PRD.** [01-project-brief.md](01-project-brief.md),
  [02-product-requirements.md](02-product-requirements.md),
  [06-decision-log.md](06-decision-log.md).
- **Phase 2 — Design exploration.** One direction, built as a system, in `design/`.
  Canvas: <https://claude.ai/code/artifact/141693a7-0b34-4fae-a25e-72ecad4b3d30>
  14 artboards over 3 pages.
- **Phase 3 — Extract.** [05-design-system.md](05-design-system.md),
  [10-screen-specifications.md](10-screen-specifications.md), from `design/tokens.css`.
- **Phase 4 — Tech docs.** [03-technical-design.md](03-technical-design.md),
  [04-database-schema.md](04-database-schema.md), [07-api-design.md](07-api-design.md),
  [08-auth-and-permissions.md](08-auth-and-permissions.md), [09-user-flows.md](09-user-flows.md),
  [11-testing-plan.md](11-testing-plan.md), [12-deployment.md](12-deployment.md), and
  **[`../CONTEXT.md`](../CONTEXT.md)**. Thirteen decisions appended to the log.
- **Phase 5 — Configure the repo.** [`../CLAUDE.md`](../CLAUDE.md) rewritten for the two halves;
  `.claude/settings.json` extended (38 allow, 8 ask, 6 deny) with a `PreToolUse` branch guard;
  `.claude/hooks/pre-edit-branch-guard.sh` added and verified; root `.gitignore` given
  `node_modules/`, `.next/` and the `.env` rules **before** `app/` exists;
  `.claude/settings.local.json` emptied of five stale rules including `Bash(rm -rf *)`.
  `mattpocock-skills` enabled at project scope. Four decisions appended to the log.
- **Phase 5a — Skills setup.** `/setup-matt-pocock-skills` run. Tracker is **GitHub Issues** on
  `yutaasakura96/lfca-lab` via `gh` — *not* the local files the Phase 5 entry planned; see the log.
  `docs/agents/{issue-tracker,triage-labels,domain}.md` written, `## Agent skills` block added to
  `CLAUDE.md`, single-context doc layout, and the four missing triage labels created on the repo
  (`wontfix` already existed). `.claude/settings.json` now **42 allow, 14 ask, 6 deny** — read-only
  `gh issue`/`gh label`/`gh repo view` allowed, every `gh` write (`issue create`/`edit`/`comment`/
  `close`, `label create`, `gh api`) moved to `ask`. One decision appended to the log.
- **Phase 6, feature 1 — the holdout is pinned.** Issue #1 and its two children. `data/holdout.json`
  commits the 40 ids as source; `tools/lib/holdout.mjs` is the single definition of "the holdout is
  intact"; `npm run validate` fails on drift (#2); and `npm run build-exams` now **refuses to write**
  on the same comparison, before its first write, so a rebuild that would promote a holdout item onto
  a paper leaves all sixty-three generated files untouched (#3). The remaining two of PRD §5's five
  places — `is_holdout` in Postgres and the selection filter — arrived with the seed, in feature 2.
- **Phase 6, feature 2 — the data spine.** Spec #5 and its eight children (#6–#13), all closed;
  #1 and #4 closed with them. `app/` exists: TypeScript strict, Vitest, the pure domain layer
  (weights, scoring, the derived clock, the first-attempt rule, selection composition), ten tables on
  **Neon Postgres 18** from one committed migration, a seed that projects the bank, attempt creation,
  and the selection queries. No UI, no sign-in, no deployment — as scoped.
  **The holdout now has all three locks**, and they share no failure mode: the pinned file, the
  builder's refusal, and the query's own `is_holdout = false`. Measured on the seeded database:
  0 holdout items on any paper, 40 marked, 960 servable.
  Suites: 339 bank · 124 app unit · 27 app integration.

- **Phase 6, feature 3 — exam mode, in progress.** Spec **#14**, fourteen children (#15–#28).
  Grilled to six settled decisions: the slice is **complete exam mode, E1–E7**, sign-in to review;
  auth plus the exam list first, verified before any sitting work; **local only**, no Vercel;
  responsive throughout, emulation-verified until there is a deploy; one Playwright run that signs in
  by inserting a session row rather than driving Google; the holdout sitting, practice and domain
  modes **out**.
  **Closed so far: #15 #16 #17 #18 #19 #20 #21 #22 #23 #24 #25.** The Google OAuth client is provisioned
  (`scripts/setup-google-oauth.sh`), the app shell carries `tokens.css` and `base.css` copied
  byte-for-byte with a test asserting it, sign-in works behind the allowlist, the sixteen papers list
  with both scores, a paper can be started and its first question rendered, and **that question can
  now be answered and flagged, durably**: two `PUT` endpoints upserting on
  `(attempt_id, question_id)`, correctness denormalised from the bank inside the same statement and
  never selected back, a flag that stores without inventing an answer, and a reload that restores
  both. The screen updates on click and the write follows; until the outbox (#23) a failed write
  rolls the value back to what the database last confirmed rather than letting the screen claim
  something it does not hold.
  **All sixty are now reachable** (#21). The sitting holds the whole paper client-side — doc 10 §4
  fetches it once at start — so the navigator can report on all sixty rather than on whichever is
  rendered; answers and flags moved off the question and onto the sitting with them, keyed per
  question *and* per lane, so a failed flag cannot roll back an answer that saved.
  `src/domain/navigator.ts` decides the tiles and the three counts, and **asserts that a paper's
  positions run 0…n-1** — the tile reports its `seq` and the sitting reads it back as an index, and
  that assertion is the only reason those are the same number. A flagged-but-unanswered question
  counts as *unanswered*, per doc 04 §6.
  Rail and sheet are **two components, not one at two widths**; `screens.css` chooses between them on
  `(max-width: 1100px), (pointer: coarse)`, and the pointer half is what actually keeps the 34px tile
  off a touch screen (doc 05 rule 12) — a width query alone is only a proxy for it. Verified in the
  browser, both themes, at 1440 and 375: all five state combinations legible at `grayscale(1)`, a
  reload restoring answers and flags, `1`–`4` / `F` / `←` `→`, and every tile tabbable with the 2px
  ring at 2px offset.
  **The clock runs** (#22). It reaches the browser exactly as the paper does — computed on the server
  from `started_at` and the limit, sent as **one absolute instant**, and never sent back. The browser
  is told neither the start time nor the limit, so there is nothing on that side to recompute a
  deadline from and no code path anywhere that can assign a later one; a resync corrects *now*, never
  the deadline. `src/domain/clock.ts` grew the display half — `remainingToDeadline`, `clockBand`,
  `formatRemaining`, `skewMillis`, `correctedNow` — and a test **parses `tokens.css`** and asserts the
  two thresholds match `--clock-threshold-warning` / `--clock-threshold-critical`, so the ramp on
  screen and the ramp in the code cannot drift.
  Skew is measured, not assumed: the first render deliberately uses the server's own `now` so the
  markup matches across hydration, and only then does the effect compare clocks and keep the
  difference. `GET /api/attempt/:id/state` re-anchors it on tab focus and on reconnect — **built per
  doc 07 §6 but without the lazy finalisation write**, which is #26's; it reports `expired` honestly
  and writes nothing. Its read path is a **second, shorter helper** (`openAttemptForRead`): a
  submitted or expired sitting is perfectly readable, and refusing on the two states a resync exists
  to ask about would leave the client unable to find out its sitting was over.
  **Doc 10 §4's sticky bar landed with it**, which is what let the counter stop being duplicated: the
  bar owns it, and on a touch layout that counter *is* the sheet's trigger. Submit is deliberately
  absent — a button that looked real and did nothing would be worse than its absence.
  Verified in the browser, both themes, at 1440 and 375, on a real sitting watched from 07:01 down to
  00:00: warning at 20:00 and critical at **5:00 exactly**, the three bands told apart at
  `grayscale(1)`, the sheet pulled from the bar at 44px six-per-row, and at zero the clock **holds at
  00:00** with options, flag and `1`–`4`/`F` all refused while `←` `→` still read. The server refuses
  the write independently — `409 attempt_expired` — which is the guarantee; the freeze is the
  courtesy.
  Two things the review corrected, both worth naming. **05:00 exactly is warning, not critical** —
  doc 05 §9's rows are `> 20:00`, `20:00 → 5:00`, `< 5:00`, so the warning row is inclusive at both
  ends and 04:59 is the first critical second. And **skew is measured over the round trip**
  (`skewOverRoundTrip`, Cristian's midpoint) rather than against the moment the reply landed: the
  naive measurement folds the whole journey into the skew and errs *generously*, showing more time
  than remains. The render-time anchor still carries that bias for one beat — it has no round trip to
  measure — so the sitting resyncs immediately on mount to replace it. Resync listens on **three**
  events, not two: `visibilitychange`, `online`, and `focus`, because switching to another
  application with the tab still in front fires neither of the first two.
  **The outbox landed** (#23). A failed answer or flag is no longer disowned: it stays on screen and
  stays queued, and `src/lib/outbox.ts` keeps trying — 1s, 2s, 4s, 8s, 16s, then 30s forever. The
  queue holds **at most one write per `${questionId}:${lane}`**, and that keying is what stops a
  retry putting back an answer already changed: only the latest intention for a given thing is ever
  owed. A pass attempts everything owed rather than stopping at the first failure, so a flag that
  will not save cannot hold an answer hostage; a click *during* a backoff posts only itself, because
  a full pass per click would cost the square of the number of clicks made while the network was
  away. `attempt_expired` and every other non-retryable refusal is still rolled back, per lane, and
  still says so on the question — the bar's chip is for writes that are still being tried.
  **The rollback the screen used to do is gone, and that was the point.**
  Doc 10 §4's chip now lives in the bar, outside `barwide` so a phone is not the layout that fails to
  hear about a failed save; at 375px the bar takes a second line for it rather than shrinking the
  counter and the clock for a state usually absent. `beforeunload` warns while anything is owed, and
  a sustained failure reports **once per episode** at five consecutive failed passes (doc 03 §8's
  threshold, with `console.error` standing in until Sentry exists).
  The `online` event now flushes as well as resyncing: measured in the browser, a restored connection
  sent the owed write at **0 ms** instead of serving out the remaining 7s of its backoff.
  **Two stalls the review caught, both the same shape and both now regression-tested** — a queue left
  holding writes with nothing scheduled to send them, which would have shown as a lost answer with no
  chip and, once #24 lands, a submit blocked forever. A pass tracks what it has attempted **by write,
  not by key**, or a click landing while that question's previous write is still in the air is walked
  past and never sent — no network fault required, just changing an answer during an ordinary round
  trip. And a single write sent on its own re-arms the wait if it finds none, because its backoff can
  fire, or `online` can flush, while the request is still in the air.
  Two knowing divergences are in the log rather than only in a comment (2026-09-03): the chip binds
  to `retrying` rather than doc 03 §7's literal "outbox non-empty", and it sits outside `.barwide`
  rather than beside the counts doc 10 §4 hides on touch.
  Verified in the browser, both themes, at 1440 and 375, against a real sitting with `fetch` failing
  for `PUT /api/attempt/*`: the chip appeared and did not flash on healthy writes, answering and
  flagging continued, the clock ran through it (83:28 → 83:07 while failing), the backoff was
  measured at 1.7 / 3.0 / 5.0 / 9.0s, a click during the outage sent one request rather than the
  whole queue, and a reload after restoring showed the answer and the flag present.
  **Submit is still absent** — #24's. The signal it needs exists: `outbox.pending` is the boolean
  doc 03 §7 blocks on, and it is already threaded to the bar.
  **Submit landed** (#24). A sitting can now be finished, and the number that comes out of it is
  decided in one statement: `UPDATE attempt SET submitted_at = now(), … score = (SELECT count(*) …)
  WHERE id = $1 AND submitted_at IS NULL`. Counting **inside** the update rather than reading first
  and writing second is what stops a sitting being finalised with a score that predates one of its
  own answers; doc 07 §5 is corrected to match. A caller that updates zero rows is not an error — it
  reads back what the first caller decided, so a double submit shows the same score rather than a
  conflict. Verified: four `POST`s, one of them a pair fired together, all `200`, all `1/60`, and the
  row rescored by none of them. `is_first_attempt` is not in the statement at all.
  What the count *means* — the mark, the verdict, the percentage — stayed in `src/domain/score.ts`,
  which now has `outcomeFor(score, questionCount)` beside `scoreSitting`. `scoreSitting` is no longer
  on the live path and is **kept on purpose**: the integration suite runs it over the same answer
  rows the SQL counted and requires the two to agree, which is the closest thing to doc 11 §1's
  missing oracle this system can have. Its doc comment says so, so it is not deleted for looking dead.
  Doc 10 §5's confirmation is the whole of the pre-submit review — tally, the dashed *unanswered*
  panel with the arithmetic stated either way, and jump rows into both the blanks and the flags.
  `src/domain/submission.ts` decides that arithmetic. Submitting with blanks is permitted and never
  silent; blanks stay in the denominator, which is the point.
  **#24 does not route anywhere, deliberately** — see the log (2026-09-03). The dialog becomes the
  outcome, and its one onward action is the exam list. #25 replaces that action.
  **Submit is left enabled on an expired sitting**, against doc 10 §6, because §6 presumes the
  auto-submit that is #26's; disabling it now would make an expired sitting permanently unfinishable.
  The reason is read from the clock, so `expired` is recorded whoever pressed it. Also in the log.
  A sitting that is **already finalised when the page loads** opens on its outcome rather than
  presenting as answerable — a reload used to show a running clock and a live Submit over a sitting
  the server had already closed.
  Verified in the browser, both themes, at 1440 and 375, on real sittings: the warning and its
  jump rows, a queued write blocking submit with the button reading "Saving…" and the chip up, the
  recovery, a failed submit leaving the dialog open with "Couldn't submit — your answers are saved.
  Try again." and the button back, the expired variant reading "Time expired" at 00:00, and both
  outcomes surviving a reload. At `grayscale(1)` the dashed panel, the flagged chip and the
  destructive action are still told apart.
  **The review landed** (#25). A finished sitting can be read back, and the reason for **all four**
  options is on it — PRD E4's requirement, and the reason the bank was written the way it was. It is
  a **route**, `/attempt/[id]/review`, which doc 03 §4 already named: that is what makes it reachable
  again later rather than only in the moment after submitting, and it is where #26 lands a sitting
  that expired while the tab was closed. The submit dialog now offers it beside the exam list, and
  the exam list grew a **Review** link per sat paper — without one, a finished sitting was
  unreachable from any screen once it stopped being the open one.
  **The answer key travels through a new query, not a loosened one.** `getPaperQuestions` still
  strips correctness and never selects `why`; `getAttemptAnswers` still never selects `is_correct`.
  `getReviewQuestions` is the one query in the app that returns the key, it derives the paper from
  the attempt rather than taking an `examId` beside it — so one paper's questions can never be paired
  with another sitting's answers — and it reads the sitting's **own** recorded correctness rather
  than today's bank (doc 04 §5.3), which an integration test proves by forcing the two to disagree.
  Options are laid out by the **same** function the sitting uses: `layOutForPaper` was extracted from
  `orderOptionsForPaper`, so there is one placement and two projections of it. A second
  implementation would have drifted by a slot eventually, and the symptom would have been the review
  naming a letter the candidate never pressed.
  Sixty cards are **server-rendered**; the only client state on the screen is which filter is
  selected, applied as one attribute that CSS reads. Doc 10 §8's default of **Incorrect** stands, and
  **it claims the blanks too**, so `correct + incorrect` always sums to the paper and no miss is
  hidden from the default view — while the card still says *not answered* rather than inventing a
  choice. Both decisions are in the log (2026-09-04), along with the four elements of doc 10 §8 that
  have no input to draw on.
  Verified in the browser, both themes, at 1440 and 375, on the three real submitted sittings: every
  question in paper order, the `why` for all four options with inline code rendered rather than raw
  backticks, the unanswered card dashed and uncoloured, all four option states told apart at
  `grayscale(1)`, the empty filter state on a 0/60 sitting, the rail tile jump resetting the filter
  and landing on its card, and focus rings at 2px/2px offset on every filter and tile.
  **Two defects the browser found and one the review did.** `why` and option text rendered literal
  backticks — only the stem decoded them — so `BankText` came out of `Stem`. **Time used read
  25:01:20 on a ninety-minute paper**, because an expired sitting is finalised whenever somebody next
  presses the button; it is capped at the limit now. And the first-attempt line said "this is the
  first sitting of this paper" whenever `firstAttemptScore` was null — which is exactly what an
  **abandoned** first sitting looks like, against PRD §5. `standingOf` branches on the ordinal now
  and says the first attempt is still open. That path becomes reachable the moment #26 lands.
  **Auto-submit and resume landed** (#26), and with them the last of the fourteen this slice blocks
  on. A sitting whose ninety minutes ran out while nobody was watching is now closed by **whichever
  read reaches it first** — opening the paper, opening its review, a resync, or **listing the sixteen
  exams** — and every one of those goes through `src/lib/auto-submit.ts`, which calls the same
  `submitAttempt` a manual submit calls. There is no second finalisation path, so the score, the
  reason and the first-attempt flag cannot be decided two ways. Opening an expired sitting redirects
  to its review; listing was included because an abandoned sitting would otherwise go on offering to
  be resumed, with its first-attempt score reading as absent, on the one screen that exists to show
  the honest number. **Nothing in the path writes `started_at` or the limit**, so there is still no
  code that can extend a clock.
  With the tab open, **the countdown reaching zero submits the sitting itself** — #22's missing
  half — and the dialog becomes doc 10 §6's screen: "Your exam was submitted automatically", the
  score, the dashed panel of blank question numbers, and the review. A failed auto-submit is §6's
  own error state, with **Retry submit** and no way out; the jump rows and the cancel are gone,
  because a jump would close the dialog holding the only retry. Doc 10 §6's **disabled Submit is
  correct again** — its premise is finally true — which reverses the 2026-09-03 entry that left it
  enabled. `GET /api/attempt/:id/state` no longer has an `expired` status: the read that would
  return it closes the attempt first, so doc 07 §6 records the value as **gone rather than
  changed**.
  **Position is restored by derivation, not by a column** — `resumeSeq` opens the sitting on the
  question whose answer row was written most recently, since `answer.updated_at` moves on every
  answer and every flag and is written anyway. The named limit: a question looked at and left blank
  leaves no row, so walking forward without answering and reloading returns to the last question
  actually touched. That closes the second of #21's three leftovers. Grilled and chosen over a
  `resume_seq` column and over `localStorage`; the log carries the argument.
  Verified in the browser, both themes, at 1440 and 375, against real sittings: a reload returning
  to question 8 with its flag, an aged sitting redirecting straight to a review reading **TIME
  EXPIRED · 0/60 · time used 1:30:00**, the exam list sweep closing two long-abandoned sittings on
  load (exam-08 and exam-10, first-attempt scores now recorded), the countdown reaching 00:00 and
  submitting itself with exactly **one** `POST /submit`, and a blocked submit showing **Retry
  submit** and then succeeding when the network came back. One defect the browser found: the blank
  numerals were laid out in the jump row, whose flex line does not wrap a single long run of text —
  measured at **516px inside a 375px dialog**. They are prose now, and the widest thing in that
  dialog measures 342 at 375.
  Suites: 339 bank · 364 app unit · 97 app integration.

- **Phase 6, feature 3 — re-sits landed** (#27). Most of PRD E7 was already true and had been since
  #18: the list offers **Sit again** on a sat paper, swaps it for **Resume** while a sitting of that
  paper is still running, and `POST /api/attempt` refuses a second live sitting independently of
  what either screen believed. `tests/integration/exams.test.ts` already asserted both directions of
  the rule that matters — best rises on a better re-sit, and neither number moves on a worse one.
  What was missing was the ticket's own first line: **"from the list *or from a review*"**. The
  review now carries the action, and **its label is read rather than resolved after the press** —
  `getReviewContext` grew an `openAttemptId` subquery, so the button says *Resume the open sitting*
  or *Sit this paper again* before it is clicked. The endpoint's guard is still what makes two live
  sittings impossible; the query is only what stops the word on the button being a lie.
  **`is_first_attempt` is untouched on this path**, and that is the whole point: the flag was settled
  when the earliest attempt was *created* (doc 04 §5.2), so nothing about re-sitting can reach it.
  **Doc 07 §2 was corrected rather than the code.** It specified `409 attempt_in_progress`; the
  shipped behaviour is `200 {attemptId, resumed: true}`, which is doc 07 §5's own reading of a no-op
  applied one endpoint earlier — a double submit is answered with the first submit's score, and
  *start a sitting of exam-07* is likewise already satisfied by the sitting that exists. In the log,
  2026-09-04.
  Verified in the browser, both themes, at 1440 and 375, against a real re-sit of exam-07 driven end
  to end: the review's button started a second sitting, the **first** sitting's review then read
  *"sitting 1 of 2"* with its action flipped to *Resume the open sitting* pointing at the new one,
  and submitting the re-sit at **8/60** moved best from 2 to 8 while the first-attempt score stayed
  at **2**. One defect the browser found: the new actions row is a `.row`, which does not wrap —
  measured at 375 the pair wanted **371px inside a 343px content box** and the second button landed
  12px past the page edge. It wraps now, the way the bar wraps for the save chip.
  **Two the review found, and the second was the real one.** The first draft answered "is a sitting
  of this paper open?" with a **fourth** copy of a predicate that already existed three times, so it
  now calls `openAttemptForExam` — the same helper `POST /api/attempt` refuses a second live sitting
  with. That helper had no direct test despite the route depending on it; it has four now.
  And the review finalised only **its own** sitting (`finaliseIfExpired`), so a *sibling* sitting
  whose ninety minutes lapsed unattended was still `submitted_at IS NULL` and read as "still
  running" — the screen would have offered *Resume the open sitting* for a sitting that was over,
  while suppressing the re-sit PRD E7 asks for. The page sweeps with `finaliseExpiredSittings`
  ahead of the read now, as the exam list does, which makes `finaliseIfExpired` on this page a
  strict no-op; it is gone rather than left as dead code under a comment claiming it acts. Still
  **one finalisation path** — the sweep calls the same `submitAttempt`. Reproduced in the browser
  against a real backdated sitting on exam-05: the review reads *Sit this paper again*, and the
  stale sitting is closed `expired`.
  Suites: 339 bank · 364 app unit · **102** app integration.

- **Phase 6, feature 3 — the browser run and the checklist landed** (#28). The last of feature 3.
  One Playwright test walks doc 09's Flow B end to end: start exam-07, answer six and flag two,
  **close the browser context**, come back twenty minutes later, find position, answers, flags and a
  genuinely reduced clock restored, run past ninety minutes, watch the app close the sitting itself,
  read the review, and press submit a second time to no effect. It passes in about 12 seconds.
  **It signs in by inserting a `session` row** — sessions are database-backed, so a row plus its
  cookie is a session by every definition the app uses, and driving Google would make the most
  important test in the repo also the flakiest. The cookie's *name* comes from the library; its
  *value* is the one fact about Better Auth reproduced anywhere here, and the reproduction is
  bounded rather than trusted — a format change lands the first navigation on `/sign-in` and fails
  the first assertion. **Time travel is an `UPDATE` to `started_at`**: no fake timers, nothing
  waited out, which works only because the clock is derived.
  It reuses the integration suite's database under its own **`e2e-` prefix**, because doc 11 §5 runs
  both against one branch and each cleans up by deleting every user carrying its prefix — a shared
  prefix would let either teardown cut the other's rows out. Both suites still skip cleanly with no
  `DATABASE_URL`. Every number it asserts is asserted against the row, not the screen; the screen is
  asked only what a browser can answer.
  **Two real findings, both in the log.** `src/auth.ts` never set `baseURL`, so Better Auth took the
  session cookie's `__Secure-` prefix from `NODE_ENV` rather than from the origin — which makes a
  production build served over http unable to hold a session at all. It names `BETTER_AUTH_URL` now.
  Production and dev are unchanged, measured rather than assumed: the dev cookie is still
  `better-auth.session_token` and a session minted under it gets `GET /exams` → `200`.
  And the run failed twice on something worth keeping: **closing a context fires the sitting's
  resync, and a resync finalises an expired sitting** — the server was still serving that request
  when the clock was wound forward, so the resync closed the sitting ~110ms before the page read
  that the test exists to check. The run drains in flight before it moves the clock, and asserts the
  sitting is still open as the guard on that wait.
  `app/tests/manual-checklist.md` carries what no test should judge. **§0 states plainly that the
  OAuth callback and the allowlist hook have no automated coverage in any suite**, and **§1 is the
  allowlist, first**, requiring SQL proof that no `user`, `account` or `session` row was created —
  including the unset-variable case, which must still fail closed. Inferring it from the screen is a
  different assertion: a hook that wrote the row before rendering the refusal would look identical
  from the browser.
  **Playwright MCP is wired**, on the trigger `CLAUDE.md` recorded — "when the e2e run is written",
  which was this ticket. `.mcp.json` already held Neon MCP: it was added when the Neon project was
  provisioned and the docs were never updated, so both `CLAUDE.md` and this file said there was no
  `.mcp.json` while there was. Corrected in both.
  Suites: 339 bank · 364 app unit · 102 app integration · **1 app e2e**.

- **Phase 6, feature 4 — a practice sitting is 20, 40 or 60** (#32). PRD §7 assumption 2 is closed,
  and **both** of its assumptions are now resolved. It was not the "one-line change" the PRD
  assumed: `WEIGHTED_QUOTA` is hand-pinned for 60 exactly, and its own comment already recorded why
  — the published percentages divide none of the three lengths evenly, so which domain absorbs the
  remainder is a decision taken again per length. `WEIGHTED_QUOTA_BY_LENGTH` holds all three
  (20 → 6/4/3/3/2/2, 40 → 12/7/6/6/5/4, 60 → the unchanged 18/11/10/8/7/6), and `WEIGHTED_QUOTA` is
  now **defined as its 60 entry** rather than retyped, so the historical name and the table cannot
  come to hold different numbers.
  **`composeWeightedSitting` takes the quota table as an argument and reads its target length from
  that table's own sum.** Reaching for the 60 constant in the redistribution loop is the bug this
  shape rules out: a 20-question request would have come back 60 long the moment any domain ran
  short, which reads as working. `selectPracticeQuestions` takes the length as a **required**
  argument for the same reason — a default there would be a second place
  `DEFAULT_PRACTICE_LENGTH` is decided, and the one the candidate's selector does not go through.
  **`questionCountFor` no longer answers for practice.** It returned 60, which was true while 60 was
  practice's only length; the parameter is narrowed to `'exam' | 'holdout'` — the two modes the mode
  alone decides — so the compiler now refuses the caller that would read the old answer. The
  now-false assertion is replaced by two `@ts-expect-error` ones that pin the narrowing itself.
  One hazard the compiler caught rather than the tests: `DOMAINS.map(weightedQuota)` silently hands
  `map`'s index to the new defaulted `length` parameter. The literal union `20 | 40 | 60` makes that
  a type error, which is the only reason the default is safe; the call site is an arrow now and says
  so.
  Asserted over the **real bank**, not a fixture, at all three lengths: exactly that long, matching
  its table domain by domain, no repeats, and no holdout id — plus the standing fact that this bank
  never has to redistribute, since every domain covers its 60 quota. Integration adds the same
  length-reaches-the-database check against the seeded branch.
  Suites: 339 bank · **391** app unit · **104** app integration · 1 app e2e.

- **Phase 6, feature 4 — a composed sitting is written down** (#31). `attempt_question
  (attempt_id, seq, question_id, created_at)` — PK `(attempt_id, seq)`, unique on
  `(attempt_id, question_id)`, cascade from the attempt and **RESTRICT** to the question — from one
  reviewed additive migration, `0001_handy_rogue.sql`, applied. Doc 04 gains it as **§5.4**;
  `answer` stays at §5.3 so the nine cross-references to it across the docs and the code still land.
  §5.3's own "a third table is not worth it for one user" note is corrected in place: the reason was
  never the one user, it was that exam mode already had `exam_item` and the composing modes did not
  exist yet.
  **The set cannot be recovered if it is not written down**, and not because recovering it would be
  expensive: `answer` records what was *answered*, and the candidate ordering reads
  `max(answered_at) NULLS FIRST`, so answering question 1 changes the ordering a recomposition would
  read — `random()` re-rolls regardless. **Exam sittings get no rows**: `getSittingQuestions`
  branches on mode, `exam_item` for a paper and `attempt_question` otherwise, so a paper's order is
  never readable from two places.
  **Two option projections, not one.** `presentInAuthoredOrder` joins `orderOptionsForPaper` in
  `src/domain/paper.ts`: a paper reproduces the recorded slot of its key, a composed sitting has no
  slot to reproduce and renders authored order (doc 03 §3.2). Routing the composed path through the
  paper layout by handing it the key's own authored index would have worked and left the next reader
  deducing that the placement was a deliberate no-op. Both now share `assertOneKeyOfFour`, so the
  two reads that serve a question cannot come to disagree about what a well-formed one is — the
  guard is repeated in the projection that has no use for correctness precisely so it is not
  quietly absent from one of them.
  `freezeAttemptQuestions` takes an **executor**, not the handle, so #33 can write it in the same
  transaction as the attempt insert; it writes one multi-row `INSERT` rather than sixty round trips,
  and sorts, dedupes and validates nothing — the composer already did, and the unique index is what
  refuses a set the composer could only have produced by breaking.
  Verified against the seeded branch: a frozen set reads back in its own order (not the ids' sort
  order), identically on every read, with authored option order matched against
  `question_option.position` and nothing but `ref`/`text` on the wire; a duplicate is refused; the
  rows vanish with their attempt; deleting a question the sitting asked is refused by RESTRICT; an
  exam sitting reads sixty from `exam_item` having frozen nothing, byte-identical to
  `getPaperQuestions`. **And `npm run seed` leaves it alone** — measured, not assumed: a frozen
  sitting and its attempt both survived a full reseed intact.
  Suites: 339 bank · **397** app unit · **115** app integration · 1 app e2e.

- **Phase 6, feature 4 — a practice or domain sitting can be started** (#33). `POST /api/attempt`
  no longer refuses everything but exam mode. A practice sitting takes 20/40/60 and a domain sitting
  20/40/all, both defaulting to **20**, and the attempt and its `attempt_question` rows are written
  **in one transaction** — a sitting that exists without its questions is a sitting that cannot be
  rendered.
  The transaction is one function, `startComposedSitting`, and it exists because `createAttempt` now
  takes an **executor** rather than the handle — the seam #31 built `freezeAttemptQuestions` for.
  There is still **one attempt `INSERT`** for all four modes, so the six check constraints and the
  first-attempt claim have one expression rather than two. That is safe only because **the
  first-attempt retry is exam-only**: a unique violation aborts the transaction it happened in, and
  only exam mode claims the flag — and an exam sitting is created alone, because its paper is
  `exam_item`. The function's own comment says so, so a future mode that did both would find the
  warning rather than the bug.
  **`question_count` is what was frozen, never what was asked for.** The two differ whenever a pool
  cannot fill a request — a domain sitting of `all` is *defined* that way — and a column disagreeing
  with its rows would break the assumption the navigator rests on, that positions run 0…n-1. A
  composition of **zero** is the one case that is a broken bank rather than a short sitting: it
  throws before the transaction opens, so it reads as `500 internal_error` with no attempt row left
  behind. Unreachable against this bank, whose smallest non-holdout exam pool is a hundred against a
  quota of two.
  There is deliberately **no `resumed` short-circuit** here, unlike a paper: the request names a
  shape rather than a paper, so there is no single sitting of "practice" to hand back.
  The start schema moved out of the route and into `src/lib/requests.ts` beside the other two, which
  is what let the default and the two length unions be unit-tested without a server — practice's 20
  is read from `DEFAULT_PRACTICE_LENGTH` rather than retyped, and a domain sitting's `'all'` and a
  practice sitting's `60` are each refused by the other's union.
  Verified against the seeded branch: all three practice lengths matching their pinned table domain
  by domain **as read back from `attempt_question`**, a domain sitting of `all` recording the pool's
  actual count, no holdout id in any of five composed sittings, and a set reading back identically
  twice in its own order. **The rollback was verified rather than asserted** — with the transaction
  removed the test fails on an orphan attempt row (11 where 10 were expected), which is exactly the
  row a screen would find and fail to render.
  Doc 07 §2 is corrected: it said "practice is 60", and it now carries the selector, what
  `questionCount` means, and why there is no `resumed`.
  Suites: 339 bank · **404** app unit · **126** app integration · 1 app e2e.

- **Phase 6, feature 4 — the modes have a front door** (#34). `(app)/page.tsx` stops being a stub
  linking to `/exams` and becomes doc 03 §4's home: Exam, Practice, Domain, and a **disabled**
  holdout card that names what H1 is for and why it is not startable. `/practice` and `/domain` are
  the setup routes, both behind the session gate.
  **The two counts live in a new `src/db/queries/domains.ts`, not in `selection.ts`** — grilled and
  decided before writing. `selection.ts`'s own header pins its remit to *which questions are
  eligible, and in what order*; these reads choose nothing, they report history so a person can
  choose, and keeping them out of that file is the cheapest guard against the next reader wiring one
  into the other — the thing `CONTEXT.md` rules out by name. It mirrors `exams.ts` exactly: a screen
  read for the sixteen there, a screen read for the six here, one query rather than six.
  **The card's name and its competency tags are read from the bank**, not typed into the app:
  `question.competency` is already `"Security Fundamentals :: Compliance"`, so `split_part` gives
  both halves and a label map that could drift never exists. `weightPercent` stays in the pure layer,
  because the published percentage is a fact about the exam rather than about the bank.
  **"X of Y seen" means answered, not rowed.** #34's wording was "with an answer row"; that is not
  what selection means — `domainCandidates` orders by `max(answered_at) NULLS FIRST`, and doc 04 §6
  keeps a flagged-but-unanswered question *unseen* because the candidate never engaged with it. The
  looser wording was taken as loose rather than decided; the card now predicts what the sitting
  actually does.
  **One bug the browser found that no test had.** The availability chip read **963** against a
  measured pool of 960: the coverage query left-joins `answer`, which multiplies a question by its
  answer rows, so `count(*)` counted a question once per sitting that asked it — inflating the pool
  for exactly the candidate who has done the most work, and advertising a sitting the composer would
  not produce. `count(DISTINCT q.id)` fixes it. The test that would have caught it only ran against
  an account with no history; there is one against an account with repeats now, **verified by
  removing the `DISTINCT` and watching it fail**.
  Starting is one hook, `useStartSitting`, shared by all three buttons, so *"starting a sitting is a
  POST, not a link"* is written once; `StartAttemptRequest`'s inferred type is its body type, so no
  component restates the length unions.
  Doc 10 §3 is corrected rather than the code, and the four cuts plus three chosen divergences are in
  the log (2026-09-06): the selected card takes the accent border and fill but **not** the board's
  focus ring — a permanent ring is what makes keyboard focus unreadable — and carries a **"Selected"
  chip** instead, because in dark theme the two fills differ by 1.16:1 and doc 05 rule 4 forbids
  colour alone. On mobile the Length control stays in the strip; §3 moved it to make room for the
  *Draw from* checkboxes, and those are cut.
  **Home's resume card carries no countdown**, against doc 10 §2's rail: home is a server render, so
  a countdown there is a snapshot that goes on reading "12:48 left" long after it is false, and doc
  11 §1's standard applies hardest on the card whose job is to say a clock is running. Home **does**
  sweep expired sittings before listing, as the exam list does, so nothing it offers to resume is
  already over.
  Verified in the browser, both themes, at 1440 and 375: the six cards' availability summing to the
  measured **960**, the grid one column at 375 with no horizontal overflow, every target ≥44px except
  the shared `ThemeToggle` (36px, pre-existing, on every screen — **not fixed here**, because
  resizing a shared control silently changes six other screens), focus rings measured at **2px solid
  / 2px offset** on the card radios, the length control and both buttons, and the selected/unselected
  states told apart at `grayscale(1)` — 5.5:1 in light and 4.79:1 in dark on the length control, and
  by the word "Selected" on the card. The `.seg` group's `overflow: hidden` was removed so its ring
  is a real 2px/2px ring rather than an inset one. A real domain sitting was started end to end
  (`201`, redirect, the resume card naming the domain) and then removed, leaving the dev fixtures as
  they were.
  **Start ships disabled on both setup screens, and it is the one place #34's checklist is knowingly
  unmet.** The endpoint works — `201`, attempt and frozen set in one transaction — but
  `/attempt/[id]` requires an `examId` and calls `notFound()` without one, so the navigation lands on
  a **404**; pressing it would leave a permanent sitting nobody can open, and home would offer to
  resume it into the same 404, with no discard action anywhere to undo it. `COMPOSED_SITTINGS_UNBUILT`
  in `src/components/use-start-sitting.ts` is the one constant both screens read, so **#36 re-enables
  both in a single edit** — and a line under each button says so rather than leaving a dead control.
  Two doc 10 §3 states are **neither built nor cut** and are now recorded in §3 rather than silently
  unmet: its *Loading* skeletons and its *Error* Retry panel. `app/tests/manual-checklist.md` §6
  carries the check that decides which, alongside new entries for home, `/domain`'s zero-history
  state, and the "All N" chip summing to 960.
  Suites: 339 bank · **416** app unit · **141** app integration · 1 app e2e.

- **Phase 6, feature 4 — the answer response branches on the stored mode** (#35). The one place in
  this slice where a bug is silent. `PUT /api/attempt/:id/answer` reads `attempt.mode` off the row
  the request already had to load to prove ownership: exam and holdout get `{saved: true}` and
  nothing else, practice and domain get the verdict, the key and the `why` for **all four** options.
  The predicate is `showsImmediateFeedback` in the pure layer — a **third** predicate over the same
  two modes, deliberately not `!isScored`, and asserted mode by mode so a future divergence fails a
  test rather than passing in a response body nobody reads.
  **The negative is asserted on the bytes, against the real exported route handler.** No integration
  test in this repo had ever invoked one; this file does, with `next/headers` mocked and everything
  below it real — a real `session` row, the real allowlist check, real ownership, the real column.
  The exam-mode assertion is `toEqual({ saved: true })` on the **whole body**, so a fourth field
  added later fails here. A wrong answer and a right one are asserted **byte-identical**, so
  correctness cannot be inferred from the shape either. The cookie minting moved to
  `tests/support/sessions.ts` beside the user helpers: one fact about Better Auth, one copy, two
  consumers.
  **The tests were mutation-checked rather than trusted for passing first time** — forcing
  `showsImmediateFeedback` true fails three exam assertions; forcing the membership check true fails
  both refusals.
  **One bug found rather than decided.** `openWriteForQuestion` established membership as
  `attempt.examId !== null && isQuestionOnPaper(...)`, so **every write a composed sitting made was
  refused** `409 question_not_in_attempt`. Correct while `attempt_question` did not exist, wrong from
  the moment #31 landed, invisible until now because #34 ships Start disabled. The branch lives with
  the two queries now, mirroring `getSittingQuestions`: `exam_item` for a paper, `attempt_question`
  for a composed sitting.
  The answer key travels through a **second** key-returning query, `src/db/queries/feedback.ts`;
  `review.ts`'s header no longer claims to be the only one. `getPaperQuestions` still strips
  correctness and never selects `why`, `getAttemptAnswers` still never selects `is_correct`, and a
  timed sitting reaches neither key query. Flagging was already refused correctly by
  `allowsFlagging`; it now has the tests that prove it, in all three modes, including that a refused
  flag **writes nothing**.
  Two decisions are in the log (2026-09-07), both about what the endpoint does that the screen never
  will: the write **stays an idempotent upsert** in composed modes rather than refusing a second
  answer — the outbox retries the identical write, so a refusal would turn a lost `200` into a
  permanent client failure — and a **cleared answer returns `{saved: true}`**, which falls out of
  reading the verdict back from the row rather than deriving it from what was sent. Doc 07 §3 gains
  both, and its `question_not_in_attempt` line gains the table branch.
  **No browser sweep**: #35 has no screen to drive, because the composed sitting screen is #36.
  **The code review that followed found one real defect and corrected it** (`51c8521`, log entry the
  same day). The verdict was read back in a *second* query after the write, on the rationale that
  the response should report what was stored — right rationale, wrong implementation: two writes to
  one question can be in flight at once, because the outbox sends a click made during a backoff on
  its own, so the read reports the *other* click's verdict. It comes from the write's own
  `INSERT … RETURNING` now, and `getQuestionKey` shrank to take a question id and nothing else — no
  attempt, no join to `answer`, so nothing in it can pair one sitting's click with another's.
  `WriteResult` became a discriminated object with it, and one assertion now pins the property
  directly: two writes to one question, each reporting its own verdict. Both fixes were
  mutation-checked.
  Suites: 339 bank · **419** app unit · **157** app integration · 1 app e2e.

- **Phase 6, feature 4 — a composed sitting can be sat** (#36). **Start works.** Both setup screens'
  buttons are live, and `COMPOSED_SITTINGS_UNBUILT` is *deleted* rather than set to `false` — a dead
  constant gating two `disabled` expressions reads as a protection that no longer protects.
  `/attempt/[id]` branches on the stored `mode` and a practice or domain sitting renders through four
  new components (`ComposedSitting`, `ComposedQuestion`, `ComposedBar`, `SessionRail`) rather than
  through the timed sitting with its clock, flagging, free navigation and submit dialog behind flags.
  **No clock is structural, not conditional**: `ComposedBar` is not passed a deadline and there is no
  prop it could be passed one through. The two screens share the outbox, `writes.ts`,
  `NavigatorTile`, `Stem`/`BankText` and the option-role vocabulary; `Glyph` came out of `ReviewCard`
  so the check, the cross and the dash cannot be drawn two ways.
  **One finding reversed a shipped decision.** Measured against both the source JSON and the seeded
  database: in **all 1,150** questions the key is authored **first**. The sixteen papers are fine —
  the builder shuffles, and `index.json` is balanced exactly 240/240/240/240 — but #31 had a composed
  sitting render in *authored* order, on doc 03 §3.2's claim that "the bank's authoring already
  varies which option is correct", which is false. As specified, **every practice and domain answer
  would have been A**. The slot is now **derived** — `slotForComposedSitting` hashes
  `attemptId:questionId` and hands the result to the same `layOutForPaper` a paper's recorded slot
  does — so #31's "nothing here records the option layout" stays true, and a reload lays a question
  out identically because the verdict bar names a letter. Docs 03 §3.2 and 04 §5.4 corrected; the
  integration assertion that *required* authored order is inverted and was watched failing against
  the old projection.
  Forward-only throughout: no Previous, no tile jumps (the rail's tiles are `<span>`s, so they are
  not sixty tab stops refusing every press), and an answer locks on the **click** rather than on the
  reply — the window before the mark is exactly the window in which an answer must not be
  changeable. The verdict is never decided client-side; between click and reply the screen says
  *"Marking your answer…"* and claims nothing. **Next does not wait for the verdict**, so a dropped
  connection cannot strand a sitting on one question. Resume opens on the **first unanswered**
  question — exact here, unlike exam mode's derivation. On reload `getRecordedVerdicts` restores the
  verdict of every answered question (not the key: whether the option *this candidate chose* was
  right) and the full key for the resumed question only, which arises in exactly one case: when
  every question has been answered.
  **Doc 10 §7 loses four elements**, recorded in §7 with the reason for each: Previous, Flag for
  review, the sunken "Why this is the answer" panel with its study-guide link, and the *Weakest so
  far* card with *Drill these after the run*. Two chosen divergences: the mode chip stays on the
  phone bar, and the composed rail is put back explicitly at narrow widths — the rule that swaps the
  timed rail for a sheet hides every `.rail`, and this one has no sheet to replace it. Without that
  the session card measured **0×0**.
  Verified in the browser, both themes, at 1440 and 375, against real practice and domain sittings
  driven end to end: no clock and no flag control anywhere, feedback with the `why` for all four
  options, a reload restoring position/tiles/counts, `1`–`4` answering, `Enter`/`→` advancing, `←`
  and `f` doing nothing, a graded answer refusing to be changed, the outbox chip appearing and the
  answer landing when the connection came back, and a permanent refusal putting the answer back with
  the options interactive again. At 375: no horizontal overflow, rail below the question, tiles 44px
  five to a row, and the only target under 44px is the shared `ThemeToggle` (36px, pre-existing on
  every screen). At `grayscale(1)` all four option states and both tile verdicts are told apart —
  the correct and incorrect fills are near-identical greys, which is why the tiles and the legend
  carry the glyph. Focus rings resolve to the shared 2px/2px rule on every control. Exam mode
  re-checked and untouched: the outcome dialog, the clock, sixty clickable tiles, and a review of 60
  cards with 240 explanations.
  **Two things #36 does not do, both by ticket boundary:** there is no Finish or Save and exit (#37),
  so a composed sitting cannot yet be closed; and a finished one redirects to `/attempt/[id]/review`,
  which 404s until **#38** — unreachable from any screen in this slice, and the guard that will
  still be right when both land. A **holdout** sitting `notFound()`s here: composed like these two,
  timed and scored like an exam, belonging to neither screen unchanged.
  Suites: 339 bank · **444** app unit · **167** app integration · 1 app e2e.

- **Phase 6, feature 4 — a composed sitting can be closed** (#37). The bar's **Save and exit** and
  the last question's **Finish this run** open one dialog, take one `POST /api/attempt/:id/submit`,
  and land in one place. It matters more than it looks: a composed sitting carries
  `time_limit_seconds = null`, so nothing expires and no lazy finalisation applies — **this is the
  only path by which one ever closes**, and without it every practice attempt stayed
  `submitted_at IS NULL` for ever, on the partial index home reads on every render.
  **The dialog becomes the outcome**, which is #24's call made again: the unscored review is #38's,
  so the summary is shown where the button was pressed and its one action goes to a screen that
  exists. #38 adds *See the full review* beside it. Redirecting as the ticket's last line says would
  have ended every run on a 404 for one slice — and the counts *are* the ending of a sitting that is
  not scored.
  **That reverses a line #36 shipped deliberately.** `/attempt/[id]` no longer redirects a finalised
  composed sitting to its review; it opens on the outcome, as the timed sitting has since #24. #36
  chose the redirect while the state was unreachable — Finish is what makes it reachable.
  **Three numbers, and nothing that could be read as a fourth.** `Correct · Incorrect · Not reached`,
  decided by `finishSummary` in the pure layer, with a unit test asserting its **returned keys** so a
  mark, a percentage or a verdict cannot be added without failing. `unreached` reads the navigator's
  `remaining` rather than `questionCount - correct - incorrect`, so an answer whose verdict is still
  in the air is never reported as a question never reached — measured in the browser at 4/15/0 with
  one write owed and 4/16/0 once it landed. `attempt.score` stays null throughout; doc 04 §5.1's
  check constraint is what makes that a fact rather than a habit.
  **The negative is asserted on the bytes**, against the real exported route handler, `toEqual` on
  the whole body so a fifth field fails there — mutation-checked by making `outcomeOf` compute a
  pass mark and watching it go red. Its own component rather than `SubmitDialog` with six regions
  behind a flag, for the reason #36 made two sittings rather than one.
  Verified in the browser, both themes, at 1440 and 375, on four real sittings driven end to end:
  Save and exit at question 4 of 20 with the unreached panel and the danger treatment, Finish at 20
  of 20 with neither, Escape closing the confirmation but not the outcome, the sitting behind frozen
  (no option buttons, both actions disabled), a reload opening on the outcome rather than a 404,
  home no longer offering it, and the row reading `score NULL · submit_reason user`. With `PUT`
  failing: the chip up, both buttons reading "Saving…" and disabled, the dialog stating which wait
  it is, and the count moving 15 → 16 when the write landed. With `POST /submit` failing: the dialog
  held open with "Couldn't finish — your answers are saved. Try again." and the button back, then
  succeeding on retry. Contrast measured on the dialog in both themes — the lowest pair is 6.21:1;
  at `grayscale(1)` the three counts are told apart by their own labels, which is doc 05's rule.
  **The code review found four things and two test gaps**, all fixed and re-verified in the browser:
  a `submitFailed` never reset, so reopening the dialog after a failed close said "Couldn't finish"
  over a sitting nothing had tried to finish; three `finishSummary` fields nothing read; the modal
  shell duplicated verbatim across both dialogs, now `ModalShell` — focus-in and Escape are exactly
  what two copies rot into disagreeing about silently; and a `SubmitOutcome` threaded through three
  components only ever compared to null, now a boolean. The Save-and-exit test asserts #37's own
  figure (seven answered, **thirteen** unreached), and the exam-list check runs a domain sitting as
  well as a practice one. Exam mode re-checked on the shared shell: its outcome dialog still takes
  focus, is still labelled by its own heading, and still refuses Escape when the sitting is over.
  Suites: 339 bank · **450** app unit · **174** app integration · 1 app e2e.

- **Phase 6, feature 4 — an unscored run can be read back** (#38). `/attempt/[id]/review` stops
  404ing on a composed sitting: it is **one route and two screens**, branching on the stored `mode`
  — the same column `/attempt/[id]` and `PUT /answer` already branch on. Everything the ticket
  calls Kept is shared: the sixty-or-twenty cards in `seq` order, the `why` for **all four**
  options, the option states, the rail and its tile jump.
  **The reversal is the whole of the decision.** On a paper "Incorrect" claims the blanks, because a
  blank cost exactly what a wrong answer cost. On an unscored run it does not — nothing cost
  anything, and a question never *reached* is not one that was got wrong — so the blanks get a
  filter of their own and the three views **partition** the run: `Incorrect · Correct · Not reached
  · All`, opening on the misses as a paper does. Flagged is gone, because `PUT /flag` refuses these
  modes outright and a filter that could only ever be empty is a control that does nothing.
  It is carried by **one `scored` argument through one predicate** — `matchesFilter`,
  `countByFilter`, and the CSS reading the same flag off `data-scored`, so the cards and the counts
  cannot disagree about what a filter means. Required rather than defaulted, on #32's reasoning: a
  default makes one mode's reading the silent one. Mutation-checked — forcing the predicate to
  ignore `scored` fails three unit assertions and leaves every scored one green, which **is** the
  criterion that the exam review is untouched. Measured in the browser on the same twenty rows: 3
  visible under Incorrect against **16** with `data-scored` flipped.
  **Dropped from the result card**, each either forbidden by PRD P1 or without an input: the
  numeral, the percentage, the pass bar, the pass mark, the verdict chip, the first-attempt standing
  line, Time used, Left unanswered, Flagged, the re-sit action — **and the by-domain card**, which
  the ticket named neither way. `domainBreakdown` reports `correct/total` per domain with a meter
  that turns at 75%: a pass ratio applied six times, which is the mastery signal the 2026-08-28
  decision declined and #34 declined again. Put to the owner as its own option and cut. What stands
  in its place is the run's name, its question count, and `Correct · Incorrect · Not reached` —
  drawn by the **same `CountTally`** the finish dialog draws, so the two screens cannot come to
  describe the same run differently. `attempt.score` stays null throughout.
  **One `ReviewCard` with a two-word difference, not a second card.** `scored` changes what a blank
  is called (*not reached*, never *not answered* — the latter attributes a decision nobody made)
  and the note under it. The option rows, the stem, the glyphs and the four states are the valuable
  part; two copies of those is the failure `Glyph` and `ModalShell` were extracted to prevent, and
  the symptom would be a blank's dash drawn as a cross on one of the two screens.
  **The composed review reads through a second query, not a loosened one:**
  `getComposedReviewQuestions` over `attempt_question`, `getReviewQuestions` over `exam_item`, and
  `getSittingReviewQuestions` making the branch once — the shape `getSittingQuestions` already has.
  It lays options out at the **derived** slot, from the same `slotForComposedSitting` through the
  same `layOutForPaper` the run used, which is the claim the new integration file exists to make:
  the verdict bar named a letter while the run was on, so a review placing the key one slot over
  would tell the candidate they pressed something they never pressed. Mutation-checked by forcing
  authored order and watching two assertions go red. It does not select `flagged` at all.
  **The reload path stays as #37 left it** — a finalised composed sitting opens on its outcome and
  is **not** redirected here. #37 handed the question to this ticket; the answer is that the timed
  sitting has opened on its outcome since #24, that the three counts *are* the ending of a run that
  is not scored, and that the outcome now carries the review as its own action. Put to the owner
  before building. The dialog now has **two actions, both onward** — *Back to the modes* and *See
  the full review*, the review primary because that is where the `why` for all four options lives.
  Verified in the browser, both themes, at 1440 and 375, on **two real sittings driven end to end**
  — a practice run saved and exited at question 8 of 20 (4/3/13) and a domain run of IT Project
  Management finished at 20 of 20 (3/17/0): every question in `seq` order, the key at C rather than
  A on a card nobody answered, all four explanations on a never-reached card, the CSS hiding
  measured at 3/4/13/20 against the chips' own counts, both empty filter states rendering the
  centred line, a reload opening on the outcome rather than a 404, and the rail legend reading *Not
  reached*. Contrast computed rather than eyeballed on the new elements — the lowest pair is
  **6.15:1** (the selected chip in dark) — and every state is labelled and glyphed, so `grayscale(1)`
  loses nothing. At 375: no horizontal overflow, the rail dropped as §8 specifies with the counts
  already in the result card, and the only sub-44px target is the shared `ThemeToggle` (36px,
  pre-existing on every screen).
  **The exam review was re-checked and is untouched**, measured rather than assumed: `Incorrect 60 ·
  Correct 0 · Flagged 0 · All 60`, blanks still claimed by Incorrect, *not answered* still the
  label, "It scored as incorrect" still the note, pass bar, verdict chip, by-domain meters and
  Score/Needed/Gap all present.
  Doc 10 gains **§8a** and its §7 closing paragraph is corrected.
  Suites: 339 bank · **459** app unit · **189** app integration · 1 app e2e.

- **Phase 6, feature 4 — the checklist, the sweep and the docs** (#39). The last of feature 4, and
  the ticket with no code in it: what it produces is **evidence**, and a record of what the suites
  structurally cannot see.
  `app/tests/manual-checklist.md` gains **§7, the composed sitting**, in five parts — no clock,
  feedback on every option, forward-only and no flagging, the three counts, and the negatives only
  SQL can settle. Every item is written as a **negative**, because that is what these two modes
  are: the value is in what is absent, and an absence is exactly what a passing suite does not
  notice. §2, §3, §4 and §5 were extended in place rather than duplicated — the theme sweep now
  names all eleven screens, the keyboard pass names `←` and `f` **doing nothing** as the spec
  rather than as a gap, §4 records that the composed rail is still a rail at 375px, and §5 gains
  the composed save-failure and the known Finish-blocked-forever limit with its escape.
  **§6 keeps its number deliberately** — three docs cite it, one of them the append-only decision
  log — so the new section is §7 rather than a renumbering that would make a log entry false.
  The closing section now says plainly that **the browser run walks exam mode only**, so the
  composed modes have no browser coverage at all and §7 is the whole of it.
  **The sweep was run, not described.** Both themes, 1440 and 375, on **three real sittings driven
  end to end from home**: a domain run of 20 (SysAdmin) answered to the end and finished, a
  practice run of **60** answered to the end and finished, and a practice run of 20 saved and
  exited at question 7 to exercise the partial case. Measured rather than eyeballed: no `MM:SS`
  anywhere in a composed sitting, zero focusable rail tiles, tiles 44×44 rendered as `<span>`, the
  word "flag" absent from the document, no Previous at any position, `scrollWidth == innerWidth ==
  375` on every screen, and the only sub-44px target the shared 36px `ThemeToggle`.
  **The two readings of one rule were seen side by side, which is the check worth keeping.** The
  partial practice run's review reads `Incorrect 5 · Correct 2 · Not reached 13 · All 20`, they
  partition, `data-scored="false"`, and the default view shows **5** cards — the wrong answers
  only. The exam-07 review, opened immediately after, reads `Incorrect 52 · Correct 8 · Flagged 0 ·
  All 60` with `data-scored="true"`, its default showing **52** — the 30 blanks claimed, the label
  still *not answered*, the pass bar, `8/60` and `13.3%` all present. The reversal is mode-local
  and the exam review is untouched, measured rather than assumed.
  **The negatives were confirmed in SQL, not from the screen** (dev branch, `br-noisy-credit`):
  **0** holdout ids across all 100 `attempt_question` rows against 40 marked holdout questions;
  **0** practice or domain attempts carrying a score; **0** claiming a first-attempt flag; **0**
  carrying a clock; and **0** exam rows in `attempt_question`, so a paper's order is still readable
  from exactly one table. The frozen sets match their pinned quotas **read back from the rows**:
  the 60 at 18/11/10/8/7/6, the 20 at 6/4/3/3/2/2, and the domain run 20 of 20 in its own domain,
  with `question_count` equal to the rows actually frozen in all three.
  A reload of a finalised composed sitting **opens on its outcome** — not a 404, not a redirect —
  with zero option buttons behind it, which is #38's decision holding in the browser.
  `CONTEXT.md` gains the two terms this slice actually moved: **composed sitting**, and **not
  reached vs unanswered**, which are two different facts about a blank and are now written down as
  such rather than left to be inferred from which review you happen to be reading.
  **Nothing was found that needed fixing**, and the ticket carries no code change — worth saying
  plainly rather than leaving the absence of a diff to look like an absence of work.
  Suites re-measured rather than carried forward: **339** bank · **459** app unit · **189** app
  integration · **1** app e2e.

- **Phase 6, feature 4 — a long path stays inside its card** (#29). The last child of #30, and the
  one #39's sweep could not find: most code spans in the bank are short enough to fit whatever the
  rule says, so this needed **questions chosen for their content** rather than another sweep.
  The fix is the one decided on the issue, in two halves that do different jobs. `BankText` emits
  **`<wbr>` after each `/`, `:`, `.` and `-`**, so a path breaks where a reader of commands would
  have broken it; and `design/base.css`'s `code` rule gains **`overflow-wrap: anywhere`** as the
  backstop for a name with no separator in it. **Both are load-bearing, measured rather than
  argued:** with the backstop alone, `/proc/sys/net/ipv4/ip_local_port_range` breaks as
  `/proc/sys/net/ipv4/ip_loc` · `al_port_range` — mid-segment, which is the readability cost the
  ticket weighed the fix against — and with both it breaks `/proc/` · `sys/net/ipv4/` ·
  `ip_local_port_range`. `KbdInteractiveAuthentication` breaks mid-word either way, because there
  is nowhere else, which is exactly the division of labour intended.
  A **run of separators stays whole**, so `https://` wraps as a unit rather than leaving `https:`
  at the end of a line looking like a different URL. `_` is deliberately not a separator —
  `ip_local_port_range` reads as one name, and the backstop already covers it.
  The CSS is a **design-system change, not an app one**: `design/base.css` edited and re-copied, and
  the #16 byte-for-byte assertion is what proves the copy — verified by mutation, since removing the
  rule from the app's copy fails **both** that assertion and the new one that reads the rule.
  **Measured against the whole bank rather than the ticket's five questions**, and a sixth turned
  up: `/run/systemd/resolve/io.systemd.Resolve` at **39** characters, longer than anything the
  ticket listed. Across 1,150 items there are 5,518 space-free code words; splitting drops the
  longest unbreakable run from 39 to **28** — `KbdInteractiveAuthentication`, the backstop's own
  case. Two of the six sit on papers never sat (exam-01, exam-06), and **starting those to look at a
  rendering rule would have burned two first-attempt scores**, so they were rendered through the
  real `ReviewCard` on a scratch route instead, which was deleted before the commit.
  Verified in the browser at 375px, both themes, with the pre-fix rendering reconstructed on the
  same page for a real before/after: **9 code spans spilling, up to 148px, and a page
  `scrollWidth` of 481 against a 375 viewport — 0 spilling and 375 after.** The ticket said it
  never overflowed the viewport; on a review showing all four explanations it does, which is
  recorded here rather than left standing. The reviews of three **already-submitted sittings** on
  the owner's own account were measured the same way — exam-14 (36px × 3 → 0), exam-08 (36 → 0),
  exam-05 (29 → 0) — and dark theme came back 0. **Nothing was written to verify this**: no sitting
  was started, and the attempt count stood at 14 before and after.
  **The guarantee is a property, not a measurement**, which is what covers the sitting screen whose
  card is padded differently: `overflow-wrap: anywhere` shrinks min-content to one character, so a
  code span cannot exceed its box at any width. Squeezed to 241 / 200 / 140 / 80 / **40**px, the
  38-character path never spilled once.
  `app/tests/manual-checklist.md` §4 gains the check, written so it names the question to open —
  a sweep will not find this on its own.
  Suites: 339 bank · **470** app unit · 189 app integration · 1 app e2e.

- **Phase 6, feature 5 — the tools that can delete the scores now ask first** (#41). The first of
  thirteen, and first on purpose: every ticket after it operates on the database holding the five
  first-attempt scores, so the guard exists before the surgery rather than after it.
  `.claude/settings.json` gives the Neon CLI and the Neon MCP server the split `gh` has had since
  2026-08-30 — **88 allow, 110 ask, 6 deny** — and doc 12 gains **§8** with the identifiers read
  from the live account rather than copied from an older note: org `org-tiny-fire-00617341`, project
  `wispy-bird-80472699`, and the two **Neon** branches **with the id suffixes the short forms drop**,
  `br-jolly-mode-b39c5rdo` (`production`, the root) and `br-noisy-credit-b37kait6` (`dev`).
  **The obvious spelling of the MCP rules would have guarded nothing.** The same Neon tools reach a
  session under two names — `mcp__Neon__…` from `.mcp.json`, and an opaque connector id from
  claude.ai — so the rules **wildcard the server segment** and name Neon's own tools exactly
  (`mcp__*__delete_branch`, `mcp__*__reset_from_parent`). Grilled to three options before writing;
  the log carries why naming both, or naming `Neon` alone, were rejected.
  **That the wildcard actually matches was measured, not assumed** — segment-by-segment matching
  would have made every one of those rules inert while the file read as protection. The installed
  CLI compiles a rule to one anchored expression over the **whole** tool name, so
  `mcp__*__delete_branch` is `^mcp__.*__delete_branch$`. The same read corrected a claim this ticket
  had already written down: an `allow` rule **may** glob its tool segment (`mcp__Neon__list_*`) and
  is *refused* only on its server segment. The allow list still names every read in full anyway,
  because `get_connection_string` is at `ask` and a tidy `get_*` would put the two lists over one
  tool.
  **Four things that read as reads and are not**, each now at `ask`: `run_sql` and `neon psql`
  (nothing inspects the statement), **`explain_sql_statement`** (`EXPLAIN ANALYZE` executes what it
  explains), `get_connection_string` and `neon connection-string` (they hand out a password, the one
  thing the `.env` denials exist to keep out of context), and **`neon auth` itself**, which opens a
  browser and waits — as it did, hanging, at the start of this ticket.
  `app/tests/unit/neon-permissions.test.ts` asserts the committed file rather than trusting it: every
  destructive command and tool resolves to a prompt under **both** server names, no allow rule
  reaches one, and the reads still run. Mutation-checked both ways — removing one ask rule, and
  adding a broad `Bash(neon:*)` allow, each turn it red.
  **Three of the ticket's criteria are the owner's and are not met**, said plainly rather than left
  to look done: `neon auth` is a browser flow (`~/.config/neon/` is still empty); `neon projects
  list` and `neon branches list` therefore have not been run, so the identifiers above were read
  through the MCP's tools instead — verified live either way, not trusted from the docs that already
  carried them; and *watching* a destructive command prompt cannot be done from a
  bypass-permissions session, which is prompted by none of this. Doc 12 §8.3 carries all three with
  the exact commands.
  **The review found four things**, all fixed and re-checked. `neon --help` was read to line 80 and
  the output ran past it, so **`neon deploy`, `neon env`, `neon buckets` and `neon bootstrap`** had
  no rule — unmatched commands fail closed to a prompt, so this was a hole in the enumeration rather
  than an open door, and `neon status` joined the reads with them. The test hand-rolled one matcher
  for two grammars, which hid the trap above: an allow rule globbing its server segment is
  *discarded*, so the obvious next edit — `mcp__*__list_branches`, to stop a connector's reads
  prompting — would have left the file claiming a rule Claude Code had thrown away, with the suite
  green. Two assertions close it. And `SERVERS` in the test pinned the real connector id that the
  log had just refused to pin in `settings.json`; it asserts the property with a synthetic id now.
  Suites: 339 bank · **659** app unit · 189 app integration · 1 app e2e.

- **Phase 6, feature 5 — the Neon branches are named, and the pooler question is answered** (#42).
  The second of thirteen. The rename is the small half: `production` → **`main`** (the root, still
  `primary: true, default: true`) and `dev` → **`develop`**, so `CONTEXT.md`'s rule that "which
  branch" is answerable without asking "whose branch" is true of the account and not only of the
  docs. The ids did not move and were never going to — `br-jolly-mode-b39c5rdo` and
  `br-noisy-credit-b37kait6` are what the API and the CLI want, which is why doc 12 §8.1 records
  those rather than the names.
  **What a rename does to the endpoint host is undocumented, so it was measured: nothing.** Both
  endpoint records were captured in full before and after and diffed — identical hosts, and
  identical in every other field **including the endpoints' own `updated_at`**, so the rename did not
  touch those records at all; only the branch rows moved. A connection string carries the *endpoint*
  host and never the branch name, so **nothing holding one needed re-pasting**, `app/.env.local`
  included. The four hosts were re-measured against `verify-full` afterwards anyway, because *the
  host is unchanged* and *it still verifies* are two claims.
  **The measurement was the real work, and it came back with no exception to write down.** Doc 12
  §2.1 had held its own rule open over the pooled host since 2026-09-02 — Neon recommends
  `verify-full` host-agnostically but never states it for `-pooler`, and its own pooling examples use
  `sslmode=require`. **It holds**, on pooled and direct for both branches, TLSv1.3, chain
  `YR2 ← Root YR ← ISRG Root X1`, `authorized: true`. And it holds **structurally rather than
  luckily**, which is the part worth keeping: every endpoint here is served **one wildcard
  certificate for the proxy domain** — leaf CN and sole SAN `*.c-4.ap-southeast-1.aws.neon.tech` —
  and `-pooler` is a suffix on the **leftmost label**, so `ep-…-pooler.c-4.…` and `ep-….c-4.…` are
  both single labels under that wildcard and match it equally. The pooler is not a different
  certificate; it is a different name on the same one.
  **It was measured with no password, which is the only reason it could be measured at all.**
  `verify-full` is chain verification plus hostname verification, and both happen in the TLS
  handshake **before** authentication — so the probe made the Postgres `SSLRequest` by hand and handed
  the upgraded socket to `tls.connect` with `rejectUnauthorized: true` and `servername` set, the
  option pair node-postgres builds for `verify-full`. No connection string, no credential, nothing
  for doc 12 §8.2's `get_connection_string` prompt to protect — and no auth attempt to confound a TLS
  failure with an auth one.
  **The check was proved non-vacuous rather than trusted for going green.** Against the served
  certificate, Node's own `checkServerIdentity` **rejects** a deeper label (`deeper.label.c-4.…`) and
  a different proxy shard (`ep-…-pooler.c-9.…`) with *"Hostname/IP does not match certificate's
  altnames"*, while accepting both real hosts. A strict pass that accepted everything would have
  looked identical from the verdict alone.
  **The probe is a throwaway and is deliberately not committed** — the same call
  `connection-string.test.ts` already makes in its own header, *"It asserts the string, not the
  socket — a live connection proves today's behaviour, which is not what is at risk"*, and doc 11 §2
  as a rule. What is at risk is a fresh dashboard string saying `require`; the committed guard for
  that is the test, and **#43** extends it to both strings. What the repo keeps instead is §2.1's
  note on **what would break the finding**: Neon moving the pooler to a different parent domain, or
  issuing it its own certificate. The wildcard is one level deep, so a host at
  `…-pooler.pooler.c-4.…` would fail hostname verification while the direct host kept working —
  presenting as the pooler being down.
  **One measured fact that contradicts the endpoint record**, written down because the next reader
  meets the flag before they meet the explanation: both endpoints report **`pooler_enabled: false`**
  and the pooled host answers anyway. That is Neon's "the pooled endpoint is always available"
  holding in practice, so the flag is not a precondition to check before using a `-pooler` host.
  Docs 12 §2.1 and §8.1 rewritten, §8.1 gaining both endpoint hosts — not secrets, and having them
  written down is what let the measurement happen without one. `CLAUDE.md` and this file's carrying
  notes corrected; one adjacent staleness fixed while passing, the Blocked section's "all three
  Vercel environments", which the 2026-09-11 preview decision had already made two-thirds wrong.
  Suites unchanged and re-run: 339 bank · 659 app unit · 189 app integration · 1 app e2e.

- **Phase 6, feature 5 — the repo speaks two connection strings** (#43). The third of thirteen, and a
  prefactoring: make the change easy, then make the easy change. `DATABASE_URL` is now the **pooled**
  (`-pooler`) host and is what the app reads — **in both environments**, so the pooler is exercised
  every day rather than only in the one that cannot be debugged from; `DATABASE_URL_UNPOOLED` is the
  **direct** host and is read by `drizzle-kit migrate` and `npm run seed`, and by nothing else.
  **There is no fallback between them, and the absence is the feature.** `requireDirectDatabaseUrl()`
  throws rather than reaching for the pooled string, so a runner missing the secret fails where it can
  be seen instead of migrating production over the pooler and reporting success. The cost was accepted
  rather than discovered: both scripts stopped working on the laptop until `app/.env.local` gained the
  variable.
  **`drizzle.config.ts` carries the same refusal of its own** rather than importing the helper — that
  import would pull `pg`, `drizzle-orm` and the whole schema graph into whatever bundle drizzle-kit
  builds the config with. And it is a refusal rather than the `?? ''` the first draft had, because
  **`pg` reads an empty connection string as *use the `PG*` defaults***: a runner missing the secret
  would have aimed at localhost and presented as a connection error rather than a missing credential.
  `generate` opens nothing and is the one command exempt — verified, and it wrote no file.
  **The seed holds its own pool.** It had imported `db` and `pool` from `src/db/client.ts`, so the
  moment `DATABASE_URL` meant *pooled* it would have run its one long multi-statement transaction over
  the pooler with nothing saying so. A `makeDb(url)` factory in `client.ts` was rejected: that module
  is imported by every route, page and integration test, and it would have handed all of them a way to
  build a handle pointing anywhere. Nothing under `src/` can reach the direct host.
  **Three scripts moved to `--env-file-if-exists`, not two.** `test:integration` went with the two
  database scripts because under the mandatory form a missing `.env.local` exits `ENOENT` before vitest
  starts — so doc 11 §5's standing claim that the app suites "skip cleanly when `DATABASE_URL` is
  absent" had never been observable. Measured after the change: **18 files, 190 tests, all skipped,
  nothing failed.**
  **`app/package.json` declares `engines.node` as `>=23.6.0`** — the true floor, since `npm run seed`
  executes `scripts/seed.ts` directly and unflagged type stripping arrives in 23.6. One thing about
  that is not obvious and is written down rather than left to be found: **Root Directory is `app`, so
  this is the manifest Vercel reads**, and Vercel offers only 20.x, 22.x and 24.x — per its own
  documented mapping this range resolves to the latest 24.x, pinning the production build as a side
  effect. Harmless, since Vercel runs only `next build`. `24.x` was rejected as the value: it would
  warn on every `npm install` on the owner's Node 25.
  **The test asserts both strings under one gate**, and the gate is `DATABASE_URL` so a contributor
  with no Neon branch still gets a green run. Given a database, both are **required** rather than each
  skipped when absent — a skipped half would have reported green over exactly the state in which the
  seed refuses to run, closing the ticket's criterion while never once executing. It also asserts the
  two hostnames differ by precisely `-pooler` on the leftmost label, which is #42's structural finding
  turned into a check and catches the mistake actually available here: pasting one string into both
  names, which every parameter assertion would pass.
  **Two things the machine found that reasoning had not.** Parsing the connection string in the suite
  *body* broke the skip — **`describe.skipIf` still runs its callback at collection time**, a skipped
  suite being one whose tests do not execute rather than one whose body is never read — so `new URL('')`
  threw and a machine with no database saw *1 file failed, 186 skipped*. The parse moved inside each
  test. And the seed's pool, built at module load, threw **outside** the `catch` at the foot of the
  file, printing a stack trace where every other seed failure prints one `ERROR` line; it is built
  inside `main()` now, still before a single bank file is read.
  **Mutation-checked rather than trusted for passing first time**, both new claims: breaking the
  `-pooler` expectation turns the relationship test red, and breaking the `sslmode` expectation turns
  **two** tests red — one per string — which is what proves the direct-host block genuinely executes
  rather than being registered and skipped.
  Verified end to end against Neon `develop`: `db:migrate` applied over the direct host, `npm run seed`
  reported **1150 question(s), 4600 option(s), 16 paper(s), 960 paper item(s), 40 holdout** — the
  measured figures unchanged — and both refuse with one named line and exit 1 when the variable is
  absent. The integration and browser suites now run **over the pooler** for the first time, and both
  are green.
  `app/.env.example` gains the new name with an empty value; docs 12 §2.2 and §3 record the no-fallback
  rule, the `pg` empty-string hazard, the third moved script and the Vercel side effect.
  Suites: 339 bank · 659 app unit · **194** app integration · 1 app e2e.

- **Phase 6, feature 5 — production exists, and the backup command stops being broken** (#44). The
  fourth of thirteen. Neon `main` was migrated, seeded and restored into on 2026-09-12, **in that
  order** — the user tables reference the content tables under `RESTRICT`, so any other order fails
  on the foreign keys. `main` turned out to be emptier than the ticket said: not "one migration
  behind" but branched before *any* migration, with no `question` table and no `attempt` table, so
  both migrations applied. The seed reported **1150 question(s), 4600 option(s), 16 paper(s), 960
  paper item(s), 40 holdout** — the measured figures unchanged, its own holdout assertion green.
  **The ticket, doc 12 §5 and this file all said "the owner's five first-attempt scores (exams 05,
  07, 08, 10 and 14)". There were nine, and not one of them was a study sitting** — measured before
  anything was copied. Exams 05, 07, 08, 09, 10, 11, 12, 13 and 14 carried `is_first_attempt`, every
  one created 2026-09-02 → 09-03 while driving features 3 and 4 through a browser; **12, 13 and 14
  had zero answers**, 08, 09 and 11 had one each, and only exam-10 (52 of 60, expired after nine
  hours) resembles a sitting at all. Since the flag is set at creation and never rewritten and there
  is no discard action anywhere, letting those rows into production would have burned the honest
  first-attempt number on **nine of the sixteen papers**, six of them pinned at 0/60 unanswered.
  **So production starts with no exam attempts.** The full fixed dump was restored — all five tables,
  so the rehearsal exercised the command as documented — and then one explicit
  `DELETE FROM attempt WHERE mode = 'exam'` removed the eleven development sittings, `answer` and
  `attempt_question` cascading. What production keeps is the account and the **three composed
  sittings**, which carry no first-attempt flag, no score and no paper, and whose 87 answers are real
  history unseen-first can use. `develop` is untouched and keeps all nine. Put to the owner as its
  own decision before anything was copied; the log carries the argument, 2026-09-12.
  **The documented `pg_dump` carried three defects, not the one the ticket named.** It did not name
  `attempt_question`; it said `$DATABASE_URL`, which since #43 is the **pooled** host, against Neon's
  own *"Avoid using `pg_dump` over a pooled connection string"*; and it needed
  **`PGSSLROOTCERT=system`**, which only running it reveals — §2.1's "no `sslrootcert` is needed" is
  a fact about **node-postgres** and its bundled trust store, while `pg_dump` is libpq and refuses
  outright when `~/.postgresql/root.crt` is absent. The same string works from the app and fails from
  the backup, and the tempting fix is the `sslmode=require` downgrade §2.1 exists to prevent.
  Two more found by running it rather than reading it: Homebrew's `postgresql@17` `pg_dump` aborts
  against this Postgres 18 server (`/opt/homebrew/opt/libpq/bin/pg_dump` is 18.0 and works), and
  **`pg_restore`'s default TOC order is alphabetical** — `account` is entry 3512 against `"user"` at
  3513 — so the child restores before its parent. The restore reorders with `-l` / `-L` explicitly.
  **`app/tests/unit/backup-command.test.ts` is what stops it recurring**, in the committed-artefact
  shape doc 11 §2 describes: it derives the table set from the migrations' own `CREATE TABLE`
  statements and fails unless every table is either in the backup command or listed as excluded
  **with a reason**, so the failure lands on whoever adds the next table. Mutation-checked four ways;
  the decisive one is that adding a `study_note` table to a migration fails it **by name**.
  `attempt_question` went eleven days without that check.
  **No credential entered an agent's context and none was typed.** A Neon branch copies its parent's
  roles including their passwords, and both branches' `neondb_owner` rows carry the identical
  `created_at`/`updated_at` of 2026-08-30T23:12:44Z — the root's — so `main`'s strings were derived
  from `develop`'s inside a subprocess by rewriting the endpoint id in the **hostname only**, and
  verified by connecting. They live in **`app/.env.main`**, deliberately not `.env.production.local`:
  Next.js auto-loads that under `next build`/`next start`, which is exactly what the browser suite
  runs, and its teardown deletes every user carrying its prefix.
  **Verified in SQL on both branches, not inferred:** content 1150 / 4600 / 16 / 960 with 40 holdout;
  `user` and `account` identical to `develop`; **0** sessions copied; **0** exam attempts, **0** rows
  carrying `is_first_attempt`, **0** carrying a score; all 100 `attempt_question` rows present with
  every sitting's `seq` running 0…n-1 with no gaps and `question_count` equal to its row count; **0**
  holdout ids among them; and `develop` still at 14 / 189 / 100 / 1 with its nine flags.
  Doc 12 §5 rewritten, its dump command fixed three ways, and §2's **Rotation** paragraph moved back
  up from the foot of §2.2 with its "`DATABASE_URL` rotates" singular corrected — both strings carry
  the same role and rotate together.
  Suites: 339 bank · **663** app unit · 194 app integration · 1 app e2e.

## Next
**Phase 6 — Build.** Planning is complete. Phase 6 repeats, one feature per pass.

**Feature 3 is complete.** **Closed: #15–#28, and the parent spec #14 with them.** Exam mode runs
end to end, from sign-in to review, and the path that matters most — resume and auto-submit — is
covered by the one browser test doc 11 §2 specifies.

**Feature 4 is chosen: practice mode (P1, P3) and domain mode (D1)**, as one slice — the two
remaining unscored modes. Picked over the holdout sitting (H1) and the deploy slice on 2026-09-06,
because it is the only one of the three that adds study capability rather than moving where the
studying happens, and because domain mode at 20 questions is the sitting that gets done on a
weeknight. The holdout is deliberately sat **last**, once; the deploy slice moves nothing but the
URL. Neither is blocked by this, and both stay available.

**The spec is written and the tickets exist.** Parent **#30**, ten children: **#31–#39 and #29**, in
that dependency order. **#31–#39 are closed.** #38 settled the question #37 handed it: a finished
composed sitting **keeps** opening on its outcome rather than going back to redirecting to the
review, which now exists and is reachable from that outcome's own action.

**Feature 4 is complete. #29 and the parent #30 are both closed.** Practice and domain mode run
end to end — chosen from home, composed and frozen, sat forward-only with the answer and all four
explanations on every question, closed by hand, and read back with counts rather than a score.
The last of it was the 375px code-run overflow; see the feature-4 entry above for what landed.
Grilled to seven
settled decisions, five of them in the log under 2026-09-06 (recorded before implementation, on the
2026-08-29 precedent; each names its ticket):

1. **A composed sitting is frozen in a new `attempt_question` table** (#31). Practice and domain
   sittings are composed at start and today exist only in memory — `answer` records what was
   *answered*, not what was *asked* — and recomposing cannot work, because `max(answered_at)` moves as
   you answer and `random()` re-rolls. Exam sittings get no rows: their paper is `exam_item`.
2. **A practice sitting is 20 / 40 / 60, default 20** (#32). **PRD §7 assumption 2 is closed, and both
   assumptions are now resolved.** It was *not* the "one-line change" the PRD assumed — 18/11/10/8/7/6
   is pinned for 60 exactly, so 20 and 40 each need their own pinned table.
3. **Strictly forward, and no flagging** (#35, #36). Next only, no Previous, no tile jumps, rail not
   clickable; `409 flagging_not_available` per doc 07 §4. **Doc 10 §7 contradicts the PRD on both
   counts** and the board is corrected, not the PRD.
4. **The unscored review shows counts, never a score** (#37, #38) — and **Incorrect does not claim the
   blanks**, reversing the 2026-09-04 rule *for these modes only*. On an exam a blank cost what a
   wrong answer cost; here nothing costs anything. `attempt.score` stays null, which doc 04 §5.1's
   check constraint already enforces. **Shipped in #38, and the by-domain card went with it** — a
   per-domain `correct/total` against a pass ratio is the mastery signal declined twice already. The
   reversal is one `scored` argument through one predicate, and the exam review is measurably
   untouched. Doc 10 §8a.
5. **Doc 10 §3 loses four elements** (#34): both *Draw from* checkboxes (one is adaptive selection,
   ruled out by name in CONTEXT.md; the other is a no-op), the scored "Recent:" row, and the mastery
   meter (the readiness signal the 2026-08-28 decision declined). "X of Y seen" stays.

Two further decisions are in the tickets rather than the log: the **answer key leak point** is #35 —
`PUT /answer` branches on the mode read from the *database*, and its test asserts the negative on an
exam attempt directly — and **#29 was retriaged rather than duplicated**, `ready-for-agent`, with the
decided fix in a comment: `<wbr>` after path separators in `BankText` plus `overflow-wrap: anywhere`
on `code`, so a path breaks at its separators and only a genuinely unbreakable identifier breaks
arbitrarily.

**No second Playwright run** (#39). Doc 11 §2 specifies one, covering the path where a bug costs a
first-attempt score; nothing in an unclocked, unscored mode can.

**Feature 5 is chosen: the deploy slice.** Picked over the holdout sitting (H1) on 2026-09-09. The
2026-09-06 note that it "moves nothing but the URL" was written against a slice that *added* study
capability; against H1 that comparison no longer holds. Every screen through features 3 and 4 was
verified at 375px by **emulation against `localhost`**, and none of it has ever been reachable from
a phone — which is where a 20-question domain sitting actually gets done. H1 stays available and
unblocked, and is deliberately sat **last**, once the sixteen papers are worked, so building it now
would build well ahead of using it.

**The four carried findings under Blocked are settled**, grilled on 2026-09-11 ahead of the spec.
Three of the four were not what they said — read what each turned out to be rather than what it
claimed. *This line said "three" until 2026-09-09, and "re-read them before speccing this" until
2026-09-11.*

**The slice is grilled and the decisions are recorded** — nine entries in the decision log under
2026-09-11, on the 2026-08-29 precedent of writing a decision down when it is taken rather than when
it compiles. In short: **two environments, not three** (Google forbids wildcard redirect URIs and
Vercel mints a hostname per preview, so sign-in on a preview cannot work); **the Neon root branch
stays production** and the attempt history is copied into it by the `pg_dump`/`pg_restore` doc 12 §5
already requires as a rehearsal, so the promotion *is* the restore test; **two connection strings**
under Neon's own names; **migrate and seed from a separate Actions workflow**, with a reduced CI that
holds no database credential; **no ceremony on a push to `main`**; **Sentry last**; and the **Neon CLI
and MCP get `gh`'s permission split**. Docs 11 §5 and 12 §§1, 2, 2.1, 2.2, 3 and 5 are corrected to
match. Acceptance is a **real 20-question domain sitting completed on a phone against production** —
not an exam sitting, which would spend a first-attempt score to test a deployment.

**The tickets exist: parent #40, thirteen children #41–#53, in dependency order.** **#41 is closed**
— the Neon CLI and the Neon MCP server are behind `gh`'s permission split, and the identifiers are
recorded in doc 12 §8 rather than rediscovered. **#42 is closed** — the Neon branches are `main` and
`develop`, a rename was measured to move no endpoint host, and `verify-full` was measured to hold on
the pooler. **#43 is closed** — the repo speaks two connection strings with no fallback between them,
and the migration and seed scripts no longer hardcode a local env file. **#44 is closed** — production
exists, holds the bank and the account, and carries **no exam attempts at all**, so all sixteen papers
are still honest. **#45 is next.**

**Steps only the owner can do**, and worth a `/wizard`: finishing `neon auth` (a browser flow, started
2026-08-31 and abandoned — `~/.config/neon/` is still empty after #41), watching a destructive `neon`
command prompt in an ordinary session (doc 12 §8.3 — a bypass-permissions session is prompted by
nothing, so no agent can make that check), creating the Vercel project, adding the production
redirect URI in the Google console, setting the Vercel environment variables, and signing in with a
non-allowlisted account for the §1 allowlist check.

Of the three things #21 left, one is closed and two stand:
- ~~**The sheet's trigger duplicates the question counter.**~~ **Closed by #22.** The bar exists, it
  owns the counter, and on touch that counter is the trigger — doc 10 §4's arrangement exactly.
- ~~**A reload returns to question 1, not to where you were.**~~ **Closed by #26.** Restored by
  derivation rather than by a column: `resumeSeq` opens on the question whose answer row was written
  most recently. A question looked at and left blank still leaves no trace — the named limit, and
  the reason the column stays on the table if it ever matters.
- **`.grid60--touch` is `repeat(auto-fill, 44px)`, not the fixed seven** doc 10 §4 specifies: seven at
  the 390px the prototype is drawn at, six at 375px. Re-measured at 375 during #22: still six. The
  column count gives way so the 44px target never does. A divergence, chosen, not an oversight.

**#22's last criterion is closed.** It said reaching zero should route to the outcome. #24 made an
expired sitting finishable by hand; **#26 made it finish itself** — at 00:00 the sitting submits and
the dialog reports what it scored, which is doc 10 §6's screen rather than a navigation. Nothing
from either ticket had to be undone.

Run `/implement <n>` per ticket. Each one ends committed, merged into `develop` and pushed.

**Before connecting Vercel, merge `develop` into `main`.** Every such merge becomes a production
deploy afterwards (doc 12 §3).

Tickets land in **GitHub Issues**, so `/to-tickets` and `/triage` need `gh` authenticated. The five
triage labels exist on the repo. Never put a secret from doc 12 §2 in an issue body — the repo is
public.

Flow, context hygiene and phase boundaries:
`~/Documents/GitHub/claude-setup-inventory/mattpocock-skills-guide.md`.

## Blocked
Nothing. The holdout is fully defended and the data spine is built.

Four findings were **carried, not lost**, each belonging to the slice that deploys.
**All four are now settled** — grilled on 2026-09-11, ahead of the spec, with nine entries in the
decision log. Kept here with what each turned out to be, because three of the four were not what they
said.

- ~~**Doc 12 §2 lists one `DATABASE_URL`.**~~ **Settled.** Two strings, under Neon's own names:
  `DATABASE_URL` (pooled, the app) and `DATABASE_URL_UNPOOLED` (direct, `drizzle-kit migrate` and the
  seed). Doc 12 §2.2 is rewritten as resolved. ~~**One thing stays open as a test rather than a
  decision:** Neon never states `verify-full` for the `-pooler` host specifically.~~ **Measured and
  closed by #42, 2026-09-12: `verify-full` holds on the pooler**, on all four hosts, and it holds
  *structurally* — every endpoint is served one wildcard certificate for the proxy domain
  (`*.c-4.ap-southeast-1.aws.neon.tech`) and `-pooler` is a suffix on the leftmost label, so the
  pooler is not a different certificate but a different name on the same one. Doc 12 §2.1's rule
  binds the pooled URL with no exception. Nothing is left open here.
- ~~**Vercel skips builds for projects a commit did not touch.**~~ **Likely inapplicable, and the
  finding was probably backwards.** That behaviour is Vercel's *"skipping unaffected projects"*, which
  **requires an npm/yarn/pnpm/Bun workspace**; this repo has none, and Vercel documents non-workspace
  changes as "global changes" that "deploy all applications". Verify against the real project once it
  exists rather than building a fix for it. If `ignoreCommand` is ever needed: its exit codes are
  **inverted** — `0` skips, `1` builds — and the documented default example runs *inside* the Root
  Directory, so it would miss `questions/**` precisely when it matters.
- ~~**The seed will run from GitHub Actions.**~~ **Settled**, and the workflow is now specified: a
  **separate** `deploy.yml` on push to git `main`, holding `DATABASE_URL_UNPOOLED` as a repository
  secret, running migrate then seed. The test CI holds no database credential at all. **One of that
  decision's three original reasons has evaporated and is recorded rather than left standing:** the
  root-directory contradiction is *moot here* — measured against the tree, every relative import in
  `app/src` resolves inside `app/src`, and the only file reading `design/` is
  `tests/unit/design-tokens.test.ts`, a test rather than part of `next build`. The other two reasons
  stand.
- ~~**Nothing gates a push to `main` any more.**~~ **Settled: nothing will.** No hook, no manual
  promotion, no disabled auto-deploy. The recovery is better than the prevention — Vercel's *Promote
  to Production* is seconds and needs no rebuild — and the failure this repo has actually had is the
  opposite one, `main` drifting **behind** `develop`, ten commits at one point. Checked and rejected
  along the way: the dashboard control is "Auto-assign **Custom** Production Domains" and its
  behaviour on a project with no custom domain is **undocumented**. `stop-branch-drift.sh` stays and
  is now the more useful of the two guards.

### Done — `app/.env.local` now says `verify-full`
The owner made the edit. Confirmed 2026-09-02 while building #22:
`tests/integration/connection-string.test.ts` passes, and the running dev server emits **no**
`pg` SSL warning — the warning that appears in older console history predates the edit. Agents could
not make it themselves: `.claude/settings.json` denies `app/.env.*`, correctly, because the file
holds four secrets.

**Still outstanding for the deploy slice:** the same `sslmode=verify-full` is needed on both strings
in the **one** Vercel environment there will be — the 2026-09-11 decision cut previews, so "all three
environments", which this line said until #42, was already stale. Doc 12 §2.1's rule is written
per-string, it binds the pooled URL (§2.2), and #42 measured that it actually holds there.

### Verified by hand, not by a test — re-run before any deploy
- **The allowlist refuses an account and writes nothing.** Now §1 of
  [`../app/tests/manual-checklist.md`](../app/tests/manual-checklist.md), written out in full with
  the SQL: `npm run dev:denied` in `app/` (or the `app-denied` launch config), sign in, expect
  *"This app is private"*, then confirm in SQL that the `user`, `account` and `session` counts are
  **unchanged** — not that no row appeared for that address. Passed 2026-09-01. This is the only
  check standing between this app and a public one, and **no automated suite covers it or the OAuth
  callback** — the Playwright run signs in by inserting a session row. The checklist says so in its
  own §0 rather than leaving it to be rediscovered.

## Carrying

### The data half — measured, do not re-derive
- 537 concepts, **1,150 questions** (1,000 `exam` pool + 150 `supplement`), 16 exams, drills, guide.
- The 16 exams are a clean partition: **960 distinct questions, zero overlap, 40 pool items unused.**
- They match the official domain weights to within one question
  (SysAdmin 18 / Cloud 11 / Linux 10 / Security 8 / DevOps 7 / PM 6, per 60).
- Per-domain exam pools: SysAdmin 300, Cloud 180, Linux 160, Security 140, DevOps 120, PM 100.
- Question shape `{competency, items[]}`; item has `id`, `concept_id`, `pool`, `type`, `difficulty`,
  `stem`, `options[]` with `ref`/`correct`/`why`/`provenance`.
  Measured 2026-08-30: **every item has exactly 4 options; zero options are missing `why`.**
  `type` ∈ {application, discrimination, diagnostic, command, recall}; `difficulty` 1–5;
  22 competencies.
- `exams/index.json` = `{exams[16].items[60]{id, position}, unused[40], documents}`.
  **`position` is the correct option's slot on the paper, not the question's order.**
- Real exam figures at HIGH confidence: **60 questions, 90 minutes, 75% (45/60)**.

### Owner and stakes
- Sat LFCA 2026-07-11, scored **71 against 75** — No Pass by ~2 questions. One free retake, unbooked.
- **Riskiest assumption:** the bank has never been tested against the real exam. Mitigated by the
  40-question holdout and by first-attempt scoring. Do not weaken either.

### Tech, settled in Phase 4 (details in doc 03; rationale in the log)
- Next.js App Router in **`app/`** in this repo · TypeScript strict · Drizzle + drizzle-kit ·
  **Postgres on Neon** · **Vercel** · Better Auth + Google OIDC behind an **`ALLOWED_EMAILS`
  allowlist that fails closed** · Sentry free tier · Vitest + one Playwright run.
- **`app/` exists as of 2026-08-31** — `package.json`, TypeScript strict, Vitest, and the pure
  domain layer's first module. No Next.js, no database client, no pages yet. Doc 03 §4 is still its
  spec; the slice building it out is #5.
- The bank is **seeded** into read-only content tables; the app never writes question content.
- **The clock is derived from `started_at`**, never stored, never extended; expired attempts are
  finalised lazily on read. No cron anywhere in the system.
- **`is_first_attempt` is set at attempt creation**, not at submit — an abandoned first sitting keeps
  the flag. Guarded by a unique partial index.
- Answer writes are an idempotent upsert on `(attempt_id, question_id)` behind an **in-memory**
  outbox with backoff. Not persisted, deliberately.
- **`app/src/domain/` is pure** — no I/O, no React, no `Date.now()`. Everything that decides a number
  lives there and is unit-tested. That rule is what makes doc 11 affordable.

### Decided earlier, challenged, upheld — do not re-litigate
- **Postgres** and **Better Auth + Google OIDC in v1.** Deferring auth was proposed and overruled
  twice.
- No adaptive/spaced-repetition selection in v1; unseen-first is ordering only.
- The study guide stays outside the app. The app never writes question content.
- **No "discard this attempt" action anywhere** — it is the dodge first-attempt scoring closes.

### Design
- **`design/tokens.css` is the source of truth for every visual value.** Copy it into
  `app/src/styles/` verbatim. `05-design-system.md` explains and pins it but does not replace it.
  The `*.dc.html` artboards and the seeded canvas are gitignored — `node design/build.mjs` rebuilds.
- Both items doc 05/10 deferred to Phase 4 are now answered: **button loading = disabled + label
  swap, no spinner** (doc 03 §8); **save failure = in-memory outbox behind an idempotent upsert**
  (doc 03 §7), with doc 10's chip unchanged.
- Every score, timing and mastery figure in the prototype is invented sample data.
- Contrast verified by computation — 40 pairs, both themes. Re-run if any colour token changes.
- **Accepted divergence:** the app's *distractor* order on the sixteen papers will not always
  byte-match `exams/exam-NN.md`. The correct answer's slot always matches (doc 03 §3.2).

### Repo and tooling
- Work lands on **`develop`**, one branch per ticket, merged and pushed as each closes.
  **This said "only `develop` and `main` exist" and that is stale** — the sweep on 2026-09-06 deleted
  every ticket branch that existed *then*, including the Phase 2–5 `design/practice-app-system`, but
  `feature/37-finish-composed-sitting` landed afterwards and is still present **locally and on
  origin**. Its commits are reachable through `develop`; the branch is simply undeleted. Sweep it
  with the deploy slice.
  **No pull request has ever been opened on this repository** — zero, all-time — which is the fact
  that cut preview environments out of feature 5 (decision log, 2026-09-11).
  **`main` is current and pushed** as of 2026-09-06 — `origin/main` is at `27cd5de`, level with
  `develop`. **The hook that refused agent pushes to it is gone**, removed the same day; pushing
  `main` is now ordinary work, and `stop-branch-drift.sh` still reports on Stop when it falls six or
  more commits behind. It has drifted before — one commit behind when #27 started — so check
  `git log origin/main..main` before assuming production is current rather than trusting that
  somebody pushed. **A push to `main` becomes a production deploy once Vercel is connected**
  (doc 12 §3); whoever wires that slice decides whether it wants a prompt back.
- **`mattpocock-skills` on, `superpowers` and `frontend-design` off** — never run superpowers here
  alongside mattpocock (guide §10).
- **`.mcp.json` holds Neon MCP and Playwright MCP.** Neon's was added when the project was
  provisioned and went unrecorded here; Playwright's arrived with #28 on its stated trigger. Add
  Sentry MCP when the Sentry project exists — which the deploy slice's last ticket creates.
  context7 is already user-scoped.
  **The Neon CLI is `neon` v4.14.0, installed globally** (the `neon` npm package *is* the CLI;
  `neonctl` is the old name) and **still unauthenticated** — `~/.config/neon/` was empty and dated
  2026-08-31 when #41 landed, so every command that talks to the API opens a browser. `neon auth` is
  the owner's.
  **Both the CLI and Neon MCP now have `gh`'s split** (#41): reads allowed, every write at `ask`,
  which is what the MCP's "Write mode active. Destructive tools are exposed" banner asks for. The
  MCP rules **wildcard the server segment**, because the same tools arrive both as `mcp__Neon__…`
  from `.mcp.json` and under a claude.ai connector's opaque id. Identifiers, the rules and their two
  limits: [12-deployment.md §8](12-deployment.md). Org `org-tiny-fire-00617341`, project
  `wispy-bird-80472699` (`lfca-simulator`, Postgres 18, Free plan), branches
  `br-jolly-mode-b39c5rdo` (**`main`**, root) and `br-noisy-credit-b37kait6` (**`develop`**) —
  renamed from `production` and `dev` by #42, which also measured that a rename moves no endpoint
  host, so nothing holding a connection string needed re-pasting.
- Editing on `main` is blocked by a hook. Branch first.
- `.claude/launch.json` serves the `design/` static preview on :4173. Tracked; the artboards it
  serves are not — run `node design/build.mjs` first.

## Skipped
- **Doc 13 — Infrastructure & Security.** None of its four triggers fire: one Next.js app on a PaaS,
  one managed database, no IaC, and user data amounting to one email address plus study history.
  Doc 03 §9's mandatory baseline and doc 12 cover what exists. **Revisit if sign-up opens to
  strangers, a second service or worker appears, or infrastructure moves to code.**
- Doc 09 was written **narrow** — three cross-screen flows (first sign-in, the interrupted attempt,
  abandoning without submitting) rather than every mode, because doc 10 already specifies all eight
  screens including empty, loading and error states.
- **Phase 5 wrote no `rules/`, `agents/` or project skills.** The catalog's starter pack contradicts
  doc 03 on three counts and `rules/` would drift from docs 03/04/07. See the log.
