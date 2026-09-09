# Manual checklist

Run before any deploy that touches the UI, and after any change to `tokens.css`.
Doc 11 §3 is this list's spec; doc 11 §4 says what is deliberately not automated and why.

Tick a box only for something you watched happen. "It probably still works" is what this
list exists to stop.

---

## 0. What no suite covers

Two things in this app have **no automated coverage in any suite**, and it is not an oversight:

- **The Google OAuth callback.** The browser run signs in by inserting a `session` row directly
  (`app/tests/e2e/support.ts`), because sessions are database-backed and driving Google would make
  the most important test in the repo also the flakiest and dependent on a third party. Nothing
  anywhere exercises the real redirect, the ID token, or `account` row creation.
- **The allowlist hook.** It lives in `validateUserInfo` (`src/auth.ts`), which only ever runs
  during a real OAuth sign-in. The unit suite tests the *rule* (`src/domain/allowlist.ts`) against
  every near-miss; nothing tests that the hook is wired to it, or that Better Auth honours a refusal
  by writing nothing.

The allowlist is the only thing standing between this app and a public one (doc 03 §9, doc 08 §3).
So it is checked here, by hand, first, and in SQL — because the two claims are different.

---

## 1. The allowlist refuses an account, and writes nothing — **run this first**

**Do not infer this from the screen.** "This app is private" appearing proves the *screen* refused.
The requirement is that **no row was created** — no `user`, no `account`, no `session`. A hook that
rendered the refusal after writing the user would look identical from the browser, and would mean
the app had silently admitted an account to its database.

1. Record the baseline, against the same `DATABASE_URL` the app is using:

   ```sql
   SELECT (SELECT count(*) FROM "user")    AS users,
          (SELECT count(*) FROM account)   AS accounts,
          (SELECT count(*) FROM session)   AS sessions;
   ```

2. Start the app with an allowlist that admits nobody real:

   ```bash
   cd app && npm run dev:denied
   ```

3. Sign in with a **real Google account that is not on the list** — your own is fine, because
   `dev:denied` sets `ALLOWED_EMAILS` to an address nobody holds.

- [ ] The screen reads **"This app is private"**. It does not echo the address back, does not say
      why, does not show an error code, and offers no way to request access.
- [ ] **In SQL, all three counts are unchanged from step 1.** Not "no new row for that address" —
      unchanged.

  ```sql
  SELECT (SELECT count(*) FROM "user")  AS users,
         (SELECT count(*) FROM account) AS accounts,
         (SELECT count(*) FROM session) AS sessions;
  ```

- [ ] With `ALLOWED_EMAILS` **unset entirely**, the same account is still refused. An empty
      variable must fail closed (doc 08 §3); an empty variable that meant "allow everyone" would
      silently publish the app.
- [ ] With the address restored to the list, the same account signs in and lands on the home
      screen, and `user.allowlisted` is `true` for it.

---

## 2. Themes and colour

- [ ] Every screen in **both themes**: sign-in, home, exam list, `/practice`, `/domain`, the timed
      sitting, the submit dialog (all four of its states), the composed sitting, the finish dialog
      (both its confirmations and both its outcomes), and **both** reviews, scored and unscored.
      Toggle with the control in the app, not with the OS, then once with the OS to confirm the
      default follows the system.
- [ ] No colour, spacing, radius or font value used outside `src/styles/tokens.css`. Grep the diff
      for a raw hex code before believing this.
- [ ] **If any colour token changed**, re-run the Phase 3 contrast check — 40 pairs, both themes,
      4.5:1 for text and 3:1 for non-text. A token change without this is not finished.
- [ ] Every state legible at `filter: grayscale(1)`: correct, incorrect, flagged, unanswered,
      current, and the three clock bands. Colour is never the only signal (doc 05 rule 4).
- [ ] The same at `grayscale(1)` for what only the composed modes draw: the four option states
      during feedback, both rail verdicts, and **not reached** against **incorrect**. The correct
      and incorrect fills are near-identical greys, so the glyph and the written label are what
      carry these — if the tiles read alike with colour removed, the glyph is missing, not the hue.

## 3. Keyboard and focus

- [ ] Focus ring visible on **every** control in both themes, 2px at 2px offset, never removed
      (doc 05 §7.3). Includes navigator tiles, review filters, and the option buttons.
- [ ] A full **timed** sitting driven by keyboard alone: `Tab` to reach everything, `1`–`4` to
      choose, `F` to flag, `←` `→` to move, and Submit reachable and operable.
- [ ] A **composed** sitting driven by keyboard alone: `1`–`4` to choose, `Enter` or `→` to
      advance — and `←` and `f` doing **nothing**, which is the forward-only rule felt rather than
      read. A key that silently works here is the defect; a key that does nothing is the spec.
- [ ] The submit dialog and the finish dialog both trap focus while open and return it to the
      button on close. Escape closes a confirmation and is refused on an outcome — the sitting is
      already over, so there is nothing to go back to.
- [ ] Every navigator tile is tabbable **in exam mode**, and the sheet's contents are not tab stops
      while closed. In a composed sitting the tiles are `<span>`s and **must not** be tab stops:
      tabbing through the sitting reaches the options, Save and exit and Next, and does not walk
      sixty tiles that would refuse every press.

## 4. Mobile and pointer

- [ ] At 375px in a **timed** sitting: the navigator becomes a **sheet**, not a rail, and the
      sheet's trigger is the question counter in the bar.
- [ ] At 375px in a **composed** sitting the rail is **still a rail**, dropped below the question —
      there is no sheet in these modes, so the rule that hides every `.rail` on a narrow layout is
      overridden here deliberately. Measure it: a session card of `0×0` is what its absence looks
      like, and it looks like nothing at all.
- [ ] Every target on a touch layout is **≥44px**. The 34px rail tile never appears on a coarse
      pointer — check with a real touch device or pointer emulation, not with width alone. The one
      standing exception is the shared `ThemeToggle` at 36px, which is pre-existing and on every
      screen; anything else under 44px is new and is a defect.
- [ ] Nothing overflows the page horizontally at 375px, on every screen — home, both setup screens,
      both sittings, both reviews. The bar wraps for the save chip rather than shrinking the clock.
      Compare `document.documentElement.scrollWidth` against `window.innerWidth` rather than
      judging by eye; a few pixels of overflow are invisible and still wrong.

## 5. The save failure

- [ ] Kill the network mid-sitting. The **"Not saved — retrying"** chip appears, answering keeps
      working, and **the clock does not pause**.
- [ ] The chip is visible at 375px as well as at 1440 — it sits outside the group the touch layout
      hides, deliberately (decision log, 2026-09-03).
- [ ] Submit is blocked while a write is owed, and the button reads "Saving…".
- [ ] Restore the network: the chip clears, and a reload shows the answers and flags are there.
- [ ] The same in a **composed** sitting: the chip appears, answering keeps working, **Save and
      exit** and **Finish this run** both read "Saving…" and are disabled, and the finish dialog
      states which wait it is. There is no clock here to keep running, and no clock to close the
      sitting either — so a write that never lands blocks Finish for as long as the tab is open.
      That is the known limit (decision log, 2026-09-08), and the escape is that the queue is in
      memory: a reload drops it and the sitting closes.
- [ ] A **permanently refused** write — not a retryable one — puts the answer back and leaves the
      options interactive again. The screen must not go on showing a choice the database refused.

## 6. Against the specifications

- [ ] Every screen beside doc 10, including its **empty, loading and error states** — the exam list
      with nothing sat, a 0/60 review's empty filter, and the page-level error state.
- [ ] **Home** (doc 03 §4): four cards, three of them reaching a mode and the holdout one visibly
      disabled and explaining itself. With an unfinished sitting, the *In progress* card names it
      and resumes it; with none, the card is absent rather than empty.
- [ ] **`/domain`** against doc 10 §3, on an account with **no history** — every card reads
      "0 of N seen" and "Last practised not started", with the real N. A blank or a bare "0" here
      is the failure PRD §4 names.
- [ ] **`/domain` loading and error.** Neither is built (there is no `loading.tsx` or `error.tsx`
      under the route), so both currently fall through to the App Router's own boundaries and doc
      10 §3's *six skeleton cards* and *Retry panel* are unmet. Check what actually happens with
      the database unreachable before the deploy slice, and either build them or cut them in doc 10
      the way the four elements were cut.
- [ ] **The "All N" chip is not a round number.** It must equal the domain's non-holdout exam pool,
      and the six must sum to **960**. A larger number means the coverage query stopped counting
      distinct questions — the bug of 2026-09-06, which inflates only for an account with history
      and so hides from any test written against an empty one.
- [ ] **The unscored close says no number that could be read as a score.** Finish or Save and exit
      a practice run and read the outcome: `Correct · Incorrect · Not reached` and nothing else — no
      percentage, no `n/20`, no pass mark, no verdict chip. PRD P1 forbids the measurement, and this
      is the one screen where one could plausibly be added by accident. The three counts must sum to
      the sitting's length once every write has landed.
- [ ] The review shows the `why` text for **all four** options, on an answered card and on a blank
      one (PRD E4, P1) — in **both** reviews, scored and unscored.
- [ ] **The unscored review carries no measurement either** (doc 10 §8a). Open a finished practice
      or domain run's review and confirm what is *absent*: no `n/20` numeral, no percentage, no pass
      bar, no "Pass · N" label, no verdict chip, no by-domain meters, no Time used, and no re-sit
      button. What is present is the run's name, the question count, and
      `Correct · Incorrect · Not reached`. It is the same route as the exam review, so an accidental
      un-branching would show up here as a pass mark appearing on an unmeasured run.
- [ ] **Incorrect does not claim the blanks on an unscored run**, and does on a paper. Save and exit
      a 20-question practice run at question 8 and read the filter chips: `Incorrect 3 · Correct 4 ·
      Not reached 13 · All 20`, the three summing to 20, and the default view showing **3** cards
      rather than 16. Then open any exam review and confirm `Incorrect` there still counts every
      blank. The reversal is mode-local (decision log, 2026-09-09) and this is the one check that
      sees both readings of the same rule.
- [ ] **A question never reached reads as never reached**, not as unanswered and not as wrong: the
      card head says *not reached*, the note says it cost nothing, the tile's label and the rail
      legend say *Not reached* — and its four explanations are shown anyway, because there is no key
      left to protect.
- [ ] **Both empty filter states on an unscored run.** A run finished with every question answered
      shows *Not reached 0* and, when pressed, a centred line rather than a blank region; a run with
      nothing right shows the same for Correct. Blank regions are the failure doc 10 §8 names.
- [ ] Both numbers on the exam list, always together: best and first-attempt, with an unsat paper
      reading as words rather than as a zero.

---

## 7. The composed sitting — practice and domain

The two unscored modes. Everything here is a **negative**: the value of these checks is what is
absent, and an absence is exactly what a passing suite does not notice. Run them on a real sitting
of each mode, started from home, not on a screenshot.

### 7.1 No clock, anywhere

- [ ] **No countdown, no deadline, no elapsed time on any composed screen** — not stopped, not
      greyed out, not `--:--`. `ComposedBar` is never handed a deadline and has no prop to receive
      one through, so a clock appearing here is a component that should not be on the screen at
      all. Search the rendered text for a `MM:SS` pattern rather than looking for one.
- [ ] The bar carries the position, the two running counts, the mode chip and **Save and exit** —
      and on a phone the chip stays, unlike the timed bar which gives up its paper's name there.
- [ ] In SQL, `time_limit_seconds IS NULL` on the attempt. A composed sitting never expires, so it
      is never finalised lazily; the only way one closes is a person pressing a button.

### 7.2 Feedback, on every option, straight away

- [ ] Answering shows the verdict **and the `why` for all four options**, including the three
      nobody chose — that wrong-option text is the most valuable content in the bank (PRD E4, P1).
      Not just the correct one, and not just the one that was picked.
- [ ] Between the click and the reply the screen says **"Marking your answer…"** and claims
      nothing. The verdict is never decided in the browser; there is no key in the component's
      props to decide it from.
- [ ] The verdict names a **letter** ("The answer is D"), and that letter still names the same
      option after a reload and again in the review. The slot is derived from the attempt and the
      question, so it is stable — if it moves, the review will tell the candidate they pressed
      something they never pressed.
- [ ] **The key is not always A.** The bank authors the correct option first in all 1,150
      questions, so a run whose answers were all at A would mean the derived slot is not being
      applied. Over twenty questions expect all four letters to occur.

### 7.3 Forward only, and no flagging

- [ ] The footer offers **Next question** and nothing else — no Previous, at any position. On the
      last question it reads **Finish this run**.
- [ ] **No flag control exists.** Not disabled — absent. The word "flag" does not appear on the
      screen, and `f` does nothing.
- [ ] The rail's tiles are **not clickable and not focusable**: they report progress and refuse to
      be a way back. Clicking one does nothing at all.
- [ ] A graded answer **cannot be changed**. The options lock on the click that answers, not on
      the reply — the window before the mark is exactly the window in which an answer must not be
      changeable.

### 7.4 The three counts, and nothing that could be read as a fourth

- [ ] The bar's running counts and the rail's `Correct · Incorrect · Remaining` agree with each
      other and, once every write has landed, sum to the sitting's length.
- [ ] Both closes show `Correct · Incorrect · Not reached` and **nothing else** — no percentage, no
      `n/20`, no pass mark, no verdict chip. PRD P1 forbids the measurement, and this is the screen
      where one could most plausibly be added by accident.
- [ ] **Not reached is not derived by subtraction.** With a write still owed, the dialog must not
      report the question it is owed for as one the candidate never reached — watch the counts move
      as the write lands rather than reading them once.
- [ ] **Finish** on the last question takes the primary treatment; **Save and exit** with questions
      left behind takes the danger treatment and adds the unreached panel. The destructive
      treatment appears where something is actually being left behind, so it is not taught to be
      ignored.
- [ ] In SQL, **`score IS NULL`** on every practice and domain attempt, and `submit_reason` is
      `user`. `expired` is unreachable without a clock.

### 7.5 The negatives that only SQL can settle

Run these against the same `DATABASE_URL` the app is using. Each is a claim the screen cannot make.

```sql
SELECT
  (SELECT count(*) FROM attempt_question aq JOIN question q ON q.id = aq.question_id
     WHERE q.is_holdout)                                              AS holdout_served,
  (SELECT count(*) FROM attempt
     WHERE mode IN ('practice','domain') AND score IS NOT NULL)       AS composed_scored,
  (SELECT count(*) FROM attempt
     WHERE mode IN ('practice','domain') AND is_first_attempt)        AS composed_claiming_first,
  (SELECT count(*) FROM attempt_question aq JOIN attempt a ON a.id = aq.attempt_id
     WHERE a.mode = 'exam')                                           AS exam_rows_frozen;
```

- [ ] **`holdout_served` is 0.** This is the whole point of the holdout and the third of its three
      locks — the pinned file, the builder's refusal, and the query's own `is_holdout = false`.
      Zero here against 40 marked holdout questions is the check; inferring it from a sitting that
      happened not to show one is not.
- [ ] **`composed_scored` is 0.** Doc 04 §5.1's check constraint enforces it, so a non-zero here
      means the constraint is gone, not that a screen is wrong.
- [ ] **`composed_claiming_first` is 0.** The first-attempt flag is exam-only and is settled at
      creation; nothing about a practice run can reach it.
- [ ] **`exam_rows_frozen` is 0.** A paper's order lives in `exam_item` and must never be readable
      from two tables — two places to read it from is two places to read it from *differently*.
- [ ] The frozen set matches its pinned quota **domain by domain**, read back from
      `attempt_question` rather than from the request: 60 → 18/11/10/8/7/6, 40 → 12/7/6/6/5/4,
      20 → 6/4/3/3/2/2, and a domain sitting entirely in its own domain. `question_count` equals
      the number of rows actually frozen, never the length that was asked for.

---

## What the browser run already covers — don't re-check by hand

`npm run test:e2e` walks start → answer → flag → close the browser → resume with time genuinely
gone → past the deadline → auto-submitted as it stood → review → a second submit that changes
nothing. If that suite is green, none of that path needs a manual pass; spend the time on the
sections above, which no suite can reach.

**It walks exam mode only, and there is deliberately no second run.** Doc 11 §2 specifies one
browser test, covering the path where a bug costs a first-attempt score — and nothing in an
unclocked, unscored mode can cost one. So the composed modes have **no browser coverage at all**:
§7 is the whole of it, and its SQL half is not optional decoration but the only place several of
those claims can be settled. The unit and integration suites cover the pure decisions and the
queries beneath both modes; what they cannot see is a screen, which is why §7 exists.
