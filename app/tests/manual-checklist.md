# Manual checklist

**§0–§7 run before** any deploy that touches the UI, and after any change to `tokens.css` —
**except §1a and §7a**, which are production checks kept beside the things they check rather than
gathered into §8, because three other docs cite them by number. **§8 runs after** a push to `main`
has deployed. Those three are the only parts of this list that are about a deployment rather than
about the app. **§9 is the holdout**, and runs on its own boundary: §9.1 on develop, §9.2 on
production at a ticket close, §9.3 only after the real sitting.
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

- **Any environment but the local one.** The unit suite needs no database; the integration suite
  and the browser run both point at Neon **`develop`**, and CI holds no database credential at all
  (doc 11 §5). **No suite has ever run against production or touched Neon `main`.** So everything
  §1–§7 establishes, it establishes about `localhost` — §8 is where the deployment itself is
  checked, §1a and §7a are the two places a section above it is repeated against production, and
  §9.2–§9.3 are the holdout's production checks, on a boundary of their own.

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

### 1a. The same check on production

Production's `ALLOWED_EMAILS` is a different variable in a different environment, and a variable
that silently failed to save looks identical to one that saved correctly until somebody tries. So
§1 is repeated against `https://lfca-lab-six.vercel.app` and Neon `main`, with two differences:
the refused account is a **second Google account** against the value already saved in Vercel,
not a swapped list, and the fail-closed case **removes the variable** rather than blanking it.

Run every sign-in from a **private window**. An existing session is not re-checked against the
variable — the session guard reads `user.allowlisted`, not `ALLOWED_EMAILS` — so a signed-in
browser proves nothing about the gate.

The count query, run against Neon `main` (`br-jolly-mode-b39c5rdo`) before and after every step.
The `max(created_at)` columns are what make "unchanged" mean unchanged rather than a delete and an
insert that happened to balance:

```sql
SELECT (SELECT count(*) FROM "user")                AS users,
       (SELECT count(*) FROM account)               AS accounts,
       (SELECT count(*) FROM session)               AS sessions,
       (SELECT count(*) FROM "user" WHERE allowlisted) AS allowlisted_users,
       (SELECT max(created_at) FROM "user")         AS user_latest,
       (SELECT max(created_at) FROM account)        AS account_latest,
       (SELECT max(created_at) FROM session)        AS session_latest,
       now()                                        AS measured_at;
```

1. **Baseline.** Run the query.
2. **Refusal.** Sign in with a Google account that is not on the list. The screen reads "This app
   is private" and echoes nothing. Run the query: every column but `measured_at` is identical.
3. **Fail closed.** Remove the variable and redeploy — a changed variable reaches only a new build:

   ```bash
   npx --yes vercel@latest env rm ALLOWED_EMAILS production --yes --cwd app
   npx --yes vercel@latest redeploy https://lfca-lab-six.vercel.app --target production --cwd app
   ```

   Sign in with the **allowlisted** account. It is refused. Run the query: unchanged.
4. **Restore**, piped from `app/.env.local` so the address never reaches a terminal or a transcript,
   and redeploy:

   ```bash
   grep -E '^ALLOWED_EMAILS=' app/.env.local | tail -n1 | cut -d= -f2- | sed -E 's/^"//; s/"$//' | tr -d '\n' \
     | npx --yes vercel@latest env add ALLOWED_EMAILS production --force --cwd app
   npx --yes vercel@latest redeploy https://lfca-lab-six.vercel.app --target production --cwd app
   ```

   Sign in with the allowlisted account. It lands on home. Run the query: `users` and `accounts`
   unchanged, `sessions` up by exactly one, `allowlisted_users` unchanged.

**Last run: 2026-09-15, passed, #49.** Baseline 1 user / 1 account / 1 session / 1 allowlisted,
newest user and account 2026-09-01, newest session 2026-09-13.
Refusal (a second Google account, 12:17Z): identical, the URL carrying only `?denied=1`.
Removed (the owner's own account, 12:23Z): refused, identical, `user.updated_at` unmoved.
Restored (12:28Z): home screen, 1 / 1 / **2** / 1, the new session at 12:27:47Z on the allowlisted
user, no new `user` or `account` row.

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

Every box here is satisfied by **emulation against `localhost`**, which is how all of it was
checked through features 3 and 4. Emulation gives you a coarse pointer and a 375px viewport; it
does not give you a mobile radio, the browser chrome a phone actually reserves, or a tab the OS
may background. §7a is the same width on a real device over cellular, and the two are not
interchangeable — run this list here, and read §7a for what only the device could answer.

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
- [ ] A long backticked path stays **inside its option card** at 375px. This is the check a sweep
      does not make for you: it needs a question chosen for its content, because most code spans in
      the bank are short enough to fit whatever the rule says. `BankText` emits `<wbr>` after each
      `/`, `:`, `.` and `-`, and `code` carries `overflow-wrap: anywhere` as the backstop for an
      identifier with no separator in it. Both are asserted in `tests/unit/inline-code.test.ts`; what
      the browser adds is **where the break lands**. Open the review of a sitting that asked
      `q.pm.software-application-architecture.http-methods-and-status-codes.01`, switch the filter to
      **All**, and compare a code span's right edge with its `.opt`'s content box. A path should
      break at a slash — `/proc/` · `sys/net/ipv4/` · `ip_local_port_range` — and only a genuinely
      unbreakable name like `KbdInteractiveAuthentication` should break mid-word.

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

**Killing the network in devtools is not the failure this is for.** It fails a request immediately
and cleanly; a radio going away can leave one hanging until it times out, and reaching Airplane
mode means backgrounding the tab, which throttles the timer the backoff runs on. §7a step 5 is the
radio version, on the device where this will actually happen. Do both — this one is repeatable and
costs nothing, and that one is the real thing.

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

### 7a. A domain sitting of 20, on a phone, against production

Everything above was verified at 375px by **emulation** against `localhost`, on a connection that
never drops. This is the same sitting on a real device, over a real mobile network, against
`https://lfca-lab-six.vercel.app` and Neon `main` (`br-jolly-mode-b39c5rdo`). It is the deploy
slice's acceptance test (#50). **Never an exam sitting** — that would spend a first-attempt score
to test a deployment.

**Wi-Fi off for the whole run**, so every request goes over cellular. The drop is **Airplane mode**,
which cuts every radio at once; turning off cellular alone lets Wi-Fi quietly come back and makes
the check prove nothing.

The count query, before the run and after it:

```sql
SELECT (SELECT count(*) FROM attempt)                             AS attempts,
       (SELECT count(*) FROM attempt WHERE mode = 'exam')         AS exam_attempts,
       (SELECT count(*) FROM attempt WHERE mode = 'domain')       AS domain_attempts,
       (SELECT count(*) FROM attempt WHERE submitted_at IS NULL)  AS open_attempts,
       (SELECT count(*) FROM attempt WHERE is_first_attempt)      AS first_attempt_rows,
       (SELECT count(*) FROM attempt_question)                    AS frozen_rows,
       (SELECT count(*) FROM answer)                              AS answers,
       (SELECT max(created_at) FROM attempt)                      AS attempt_latest,
       (SELECT count(*) FROM attempt_question aq JOIN question q ON q.id = aq.question_id
          WHERE q.is_holdout)                                     AS holdout_served,
       now()                                                      AS measured_at;
```

1. **Baseline.** Run the count query.
2. **Start.** On the phone: home → Domain → any domain → length **20** → Start. The sitting opens on
   question 1 with no clock anywhere.
3. **Light theme, forward.** Answer about half the questions. Each shows the verdict, the letter,
   and the `why` for **all four** options. Every tap target is comfortable; nothing scrolls sideways.
4. **Reload.** Pull to refresh mid-run. It reopens on the **first unanswered** question, with the
   rail's tiles and the bar's counts as they were.
5. **The drop.** Airplane mode **on**. Answer a question: the **"Not saved — retrying"** chip
   appears, and Next still works. Answer one more. Airplane mode **off**: the chip clears and the
   counts catch up.
6. **Dark theme.** Switch with the in-app toggle and answer the rest in dark.
7. **Finish.** *Finish this run* on question 20. The outcome reads `Correct · Incorrect · Not
   reached` and nothing else, summing to 20.
8. **Review.** *See the full review*, read it back in both themes: every card's four explanations,
   the letters matching what was pressed.
9. **SQL.** Run the count query: `attempts`, `domain_attempts` and `frozen_rows` up by exactly 1, 1
   and 20, `answers` up by 20; `exam_attempts`, `first_attempt_rows`, `open_attempts` and `holdout_served` unchanged.
   Then the sitting itself:

   ```sql
   SELECT a.mode, a.domain, a.question_count, a.time_limit_seconds, a.score, a.is_first_attempt,
          a.submit_reason, a.submitted_at IS NOT NULL                              AS submitted,
          (SELECT count(*) FROM attempt_question aq WHERE aq.attempt_id = a.id)    AS frozen,
          (SELECT count(DISTINCT q.domain) FROM attempt_question aq
             JOIN question q ON q.id = aq.question_id WHERE aq.attempt_id = a.id)  AS frozen_domains,
          (SELECT min(seq) || '..' || max(seq) FROM attempt_question aq
             WHERE aq.attempt_id = a.id)                                           AS seq_range,
          (SELECT count(*) FROM answer w WHERE w.attempt_id = a.id
             AND w.option_ref IS NOT NULL)                                         AS answered,
          (SELECT count(*) FROM answer w WHERE w.attempt_id = a.id AND w.is_correct) AS correct
   FROM attempt a
   WHERE a.mode = 'domain'
   ORDER BY a.created_at DESC
   LIMIT 1;
   ```

   `question_count` 20, `frozen` 20, `frozen_domains` 1, `seq_range` `0..19`, `answered` 20,
   `correct` equal to the outcome's Correct, **`score` null, `is_first_attempt` false,
   `time_limit_seconds` null**, `submit_reason` `user`.

**Last run: 2026-09-15, passed, #50.** A SysAdmin sitting of 20 on the owner's phone, over
cellular: started 21:50:24Z, finished 21:55:15Z, the owner reporting every step above as seen,
including the chip under Airplane mode and the reload. Baseline (12:53Z) 3 attempts / 0 exam /
1 domain / 0 open / 0 first-attempt / 100 frozen / 87 answers / 0 holdout served. After (21:59Z)
**4 / 0 / 2 / 0 / 0 / 120 / 107 / 0**. The sitting: `question_count` 20, frozen 20 in 1 domain,
`seq` 0..19, answered 20, correct **6** (the owner's own recollection of the outcome),
`score` null, `is_first_attempt` false, `time_limit_seconds` null, `submit_reason` `user`.
The screen-side steps are the owner's report; SQL confirms only what they left in the database.

---

## 8. Production — the pipeline, and the way back

Three things in this list are facts about a deployment rather than about the app, so none of them
can be run against `localhost`. Two already have homes, and keep them:

- **The allowlist against the variable actually saved in Vercel** — **§1a**, beside §1, because it
  is the same check in a different environment.
- **A real device on a real network, and the outbox on a mobile connection** — **§7a**, inside §7,
  because what it exercises is a composed sitting.
- **The pipeline itself** — the deploy, and the rollback. That has no home anywhere else, and §8 is
  it.

Everything else — §1 through §7, those two subsections aside — runs against `localhost`, and did.

**Nothing gates the deploy.** Vercel builds on the push and `.github/workflows/ci.yml` runs on the
same push; they race, and nothing couples them (doc 12 §3, corrected by #46). A red suite deploys
anyway, and the deployment is live before the run finishes. So the whole of the protection is §8.1
— somebody looking afterwards — and §8.2, the way back when they do not like what they find.

### 8.1 After every push to `main`

Run this **after** the push. It is the only part of this list that is.

`gh run list --commit` needs the **full 40-character SHA**. An abbreviated one returns nothing at
all, silently — that is the GitHub API, not this repository, and mistaking it for a repository quirk
sends you to `--branch main --limit N`, which quietly stops finding the commit once N runs have
landed on top of it:

```bash
gh run list --commit "$(git rev-parse main)" \
  --json headSha,name,conclusion,status \
  --jq '.[] | "\(.name) \(.status) \(.conclusion)"'
```

- [ ] **Both workflows completed and green on that SHA** — a `CI` row and a `Deploy` row. A commit
      sitting on `develop` as well shows `CI` **twice**, once per branch, which is not a fault. What
      must be there is the `Deploy` row: it is the one carrying the migration and the seed, and its
      absence means the bank never reached production however green the rest looks.
- [ ] **The seed reported the bank unchanged.** In the `Deploy` run's *Bank checks, migrate, seed*
      job, the last line of `npm run seed` reads
      `seeded: 1175 question(s), 4700 option(s), 16 paper(s), 960 paper item(s), 40 holdout`
      (1,150 until #62 added the 25 `recall` items).
      Any other figure means either the bank changed in this commit — in which case it is the
      number you intended — or the seed applied partly. There is no third reading.
- [ ] **`__drizzle_migrations` matches the files on disk**: one row per file in
      `app/src/db/migrations/`, moving only when a migration was added. **Two files, two rows, as
      of 2026-09-16.** This query is not optional tidiness — **drizzle-kit's progress spinner
      swallows the SQL error** (doc 12 §3), so a failed migration's log shows an exit code and
      nothing else, and this is where you find out what actually landed.

  ```sql
  SELECT count(*) AS applied,
         max(to_timestamp(created_at / 1000)) AS latest
  FROM drizzle.__drizzle_migrations;
  ```

- [ ] **Vercel saw the push.** The commit carries a Vercel commit status and a GitHub Deployment
      record. #46 used the *absence* of both to prove `develop` does not deploy — so on `main`
      their absence means Vercel never received the push, not that it declined it.
- [ ] **The site answers.** Three requests, and they cost nothing:

  ```bash
  for u in / /sign-in /exams; do
    curl -s -o /dev/null -w "$u %{http_code} %{redirect_url}\n" "https://lfca-lab-six.vercel.app$u"
  done
  ```

  `/` and `/exams` redirect `307` to `/sign-in?next=…`, and `/sign-in` answers `200`. A `500` there
  is what a missing `BETTER_AUTH_SECRET` looked like in #46. The other failure worth recognising is
  not visible from here at all: a build that fails with *"No Output Directory named 'public'"* — a
  lost `"framework": "nextjs"` — leaves the **previous** deployment serving all three of these
  perfectly, and is only visible in the `Deploy` run and the Vercel build log.

- [ ] **If the commit changed question content, it also ran `npm run build-exams`.** The papers
      render the `why` text, so a content edit is never content-only. Without it the deploy
      workflow's own `npm test` fails and **every later step is skipped, the credential included**
      — #48 saw exactly that. The site deploys anyway, because the two race, so production then
      serves new code over the *previous* seed. That is the state this box exists to catch, and it
      is invisible from the screen.

**First run: 2026-09-16, passed, #51 — against the deploy of the commit that added this section.**
`31fd5f0`: three workflow rows (`CI` twice, once per branch, and `Deploy`), all green; the seed
reported `1150 question(s), 4600 option(s), 16 paper(s), 960 paper item(s), 40 holdout`;
`__drizzle_migrations` at **2** against two files on disk, its newest row still 2026-09-06, so
nothing was pending and nothing applied; Vercel's commit status `success`; and `/` `307`,
`/sign-in` `200`, `/exams` `307`. No bank content changed, so the last box did not apply. Unlike
§1a, §7a and §8.2, this is a **recurring** check rather than a proof — the line records that it has
been exercised once end to end, not that it need not be run again.

### 8.2 The rollback — *Promote to Production*

Doc 12 §4 makes this the whole recovery for anything that is not a migration, and the 2026-09-13
decision made it the thing standing in place of a CI gate. An unexercised recovery is doc 12 §5's
"a belief, not a backup" applied one control over — so it is rehearsed here rather than first
attempted under pressure.

**Nothing the browser receives names the deployment.** The response headers carry `x-vercel-id`,
which is a request id and not a deployment id, and the HTML's asset paths are content hashes under
`/_next/static/immutable/` — so two builds whose *compiled* source is identical are
indistinguishable over the wire, which is every docs-only commit this repository makes. The alias
is the fact, and `inspect` is how you read it:

```bash
npx --yes vercel@latest inspect https://lfca-lab-six.vercel.app --cwd app  # which build is live
npx --yes vercel@latest ls --cwd app                                       # all of them, newest first
npx --yes vercel@latest promote <deployment url> --yes --cwd app           # move the alias
```

**The list is not a history of good builds, and this is the part that will bite.** It holds every
production deployment ever made, deliberately broken ones included, and two are still sitting in it:

- **`lfca-47z8aeqia`**, 2026-09-15 — #49's redeploy with **`ALLOWED_EMAILS` removed**. This is the
  hazard. It promotes cleanly, serves every page, and then refuses every sign-in **including
  yours**: doc 08 §3 fails closed, which is correct behaviour and a total lockout at the same time.
- **`lfca-klock56zp`**, 2026-09-13 — a build that failed while the Framework Preset read `Other`
  (#46). Harmless: it is `● Error` and never built, so it cannot be promoted at all.

The lockout is **inferred rather than measured**: #49 established that a changed variable reaches
only a new build, which is true only if each deployment carries its own snapshot of the
environment. So age and status in `vercel ls` are not enough — check the candidate against
`git log` and know what that commit was before you move the alias onto it.

- [ ] `inspect` the alias and **write down the deployment it names**. That is what you are coming
      back to, and after the first promote nothing on the site will tell you what it was.
- [ ] `promote` the previous deployment. It takes seconds and **does not rebuild**.
- [ ] `inspect` the alias again: it names the deployment you promoted.
- [ ] The site answers — the three curls from §8.1, `307` / `200` / `307`.
- [ ] `promote` the one you wrote down. `inspect` again, and curl again. All three hostnames come
      back with it.
- [ ] Nothing in the database moved. A promote moves an alias; it runs no migration and no seed.

**What this proves, and what it does not.** It proves the mechanism, the timing, and that the alias
returns. It does **not** prove that an arbitrary older build tolerates today's schema, and it
cannot — two adjacent builds here differ by documentation only, so nothing migrated between them.
That property is held by doc 12 §3's rule instead: migrations are additive, and a rename is two
deploys. Step 1 of doc 12 §4 is sufficient precisely because of it. A rollback across a
**destructive** migration is doc 12 §4 steps 2 and 3, needs a Neon point-in-time branch inside the
**6-hour** history window, and nothing here rehearses it.

**Last run: 2026-09-16, passed, #51.** Alias on `dpl_45agcydu…` (`lfca-2de1y2543`, commit
`8721e95`) at 01:16:19Z. Promoted `lfca-imh8avcp7` (`8ebe05e`) at 01:16:34.9Z; the CLI reported
success in **2s**, and the alias named it at 01:16:42Z. At 01:16:51Z the older build served `/` →
`307 /sign-in?next=%2F` and `/sign-in` → `200` rendering "Continue with Google". Promoted
`lfca-2de1y2543` back at 01:16:55.8Z, success in **2s**; at 01:17:14Z the alias and all three
hostnames were on it again, with `/` at `307`, `/sign-in` at `200`, and `/exams` redirecting to
`/sign-in?next=%2Fexams`. **The 21 seconds between the two `promote` commands is measured; how long
production actually served the older build is not** — the alias was *seen* on it at 01:16:42Z and
seen back on `8721e95` at 01:17:14Z, and nothing observed either flip, so the true window lies
somewhere inside that. What is measured is the **2s** each promote took. Neither rebuilt anything:
the Duration column of `vercel ls` puts a build in this project at 15–44s. Neon `main` before and
after: 1 user,
1 account, 4 attempts, 0 exam, 0 first-attempt, 120 frozen, 107 answers, 1150 questions, 40
holdout, 2 migrations — unchanged, as a promote cannot change them.

---

## 9. The holdout — one sitting, and a boundary

The holdout is sat **once**, and there is no discard action anywhere. So this section is the one
place in the list where *where* a check runs matters more than *what* it checks. The boundary,
settled in #56 and not to be widened:

```
develop     start / submit / 409 / result card   — freely, repeatedly      (§9.1)
production  card + dialog, then Cancel           — at ticket close         (§9.2)
production  409 + result card                    — after the real sitting  (§9.3, DEFERRED)
```

The integration suite already proves the one-shot **as rows** on Neon `develop` — start, hand-back,
`409`, the forty set-equal to `data/holdout.json`, the race under `one_holdout_per_user`, the
`{saved: true}` answer body. What no suite sees is a screen, and production.

### 9.1 On develop — as often as wanted

Use a throwaway `itest-` user (a session minted through `app/tests/support/sessions.ts` works on any
localhost port), never the owner's account, so a sat holdout costs nothing. The row query, run
before and after the dialog steps:

```sql
SELECT count(*) AS holdouts,
       (SELECT count(*) FROM attempt_question aq JOIN attempt a ON a.id = aq.attempt_id
         WHERE a.user_id = '<user id>' AND a.mode = 'holdout') AS frozen
FROM attempt WHERE user_id = '<user id>' AND mode = 'holdout';
```

- [ ] **Never sat:** the card shows `Sat once`, three lines, and **Start the holdout**.
- [ ] Pressing it opens the dialog; the three facts — one-shot, sixty minutes, abandoning counts —
      are each on their own line.
- [ ] **The two buttons are hard to confuse:** Cancel is the primary, at the left; the confirm is
      the danger treatment, at the right, and reads **Start the 60-minute clock**. At 375px they
      stack full-width, Cancel first.
- [ ] **Cancel** and **Escape** each close the dialog and write **nothing** — `0` and `0` in SQL.
- [ ] The confirm shows *Starting…* with both buttons disabled, then lands on the sitting: bar reads
      **Holdout**, clock at **60:00**, forty tiles, **Needed to pass 30**.
- [ ] Home now shows **Resume** on the card *and* the sitting in the *In progress* band. Resume goes
      straight to the sitting with no dialog.
- [ ] Answer some, flag two, reload: position, answers, flags and the reduced clock are restored.
- [ ] Submit: the confirmation says the holdout cannot be sat again; the outcome shows `n/40` and
      **See the full review**.
- [ ] The review: `Pass · 30` on the bar, the Flagged filter counting the two, and **no** re-sit,
      ordinal, first-attempt line or by-domain card anywhere.
- [ ] Home's card is the **result**: `n/40`, Pass or No pass in words, pass mark 30, the UTC day,
      **See the full review**. Nothing on home offers Start again.
- [ ] **Expiry:** with a second throwaway user, start, then `UPDATE attempt SET started_at =
      started_at - interval '61 minutes'` on that row, and load home — the card reads the result,
      closed `expired`, never *Resume*.

### 9.2 On production — at ticket close, and nothing more

Sign in as the owner. **Press Cancel. Never the confirm.**

- [ ] The card shows `Sat once` and **Start the holdout**; the dialog opens and reads as in §9.1.
- [ ] **Cancel** closes it. Then, on Neon `main`:
      `SELECT count(*) FROM attempt WHERE mode = 'holdout'` → **0**.

*Run 2026-09-21 for #60, on the dialog as it then was: the first try pressed the confirm by mistake,
and that attempt — no answers, question 1 unread — was deleted by hand at the owner's request
(decision log, same day); the re-run pressed Cancel and read 0. The dialog's buttons were separated
by #61 because of it. Re-run §9.2 after the #61 deploy, on the new buttons.*

*Re-run 2026-09-21 on `f93ac09`, on #61's buttons: the owner opened the card and the dialog and
pressed **Cancel**. Read back at 10:35 UTC over a read-only transaction on the Neon `main` pooled
endpoint (`ep-weathered-base-b3vtd226-pooler`): **0** holdout attempts, 0 orphaned
`attempt_question` rows, 4 attempts in total (unchanged), 40 pinned holdout questions, 3
migrations. The screen-side steps are the owner's report; the counts are measured.*

### 9.3 On production — the `409` and the result card: **DEFERRED, not proved**

**These two are not verified, and closing feature 6 does not verify them.** They can only be seen
on production after the owner's **real** holdout sitting, which comes after the sixteen papers and
may be weeks away. Rehearsing them would spend the sitting they exist to protect. Tick them when
that sitting happens, not before — a box ticked here on the strength of develop would be exactly
the stale safety claim this repository has caught and corrected three times.

- [ ] After the real sitting, home's card on production reads the result — `n/40`, the verdict in
      words, pass mark 30, the day — and **See the full review** opens it.
- [ ] Nothing on production offers Start again. The card has no Start button to press, so the
      refusal is asked for directly — **only once the result card is showing**, when it can write
      nothing: in the signed-in tab's console,
      `await fetch('/api/attempt', {method: 'POST', headers: {'content-type': 'application/json'}, body: '{"mode":"holdout"}'}).then(r => r.status)`
      answers **409**, and Neon `main` still holds exactly **one** holdout row for the owner.

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

**And it runs in one environment, which is the other half of the same sentence.** `npm run test:e2e`
builds and serves the app on `localhost:3100` against the Neon **`develop`** branch, under its own
`e2e-` user prefix; the integration suite uses that same branch; the unit suite reaches no database
at all; and CI runs the three that need no credential (doc 11 §5). **Nothing automated has ever run
against `https://lfca-lab-six.vercel.app` or read Neon `main`**, and nothing is going to — CI
deliberately holds no production credential, and a suite that seeded or signed in against
production would write to the database holding the first-attempt scores. So the deployment is
covered by §8, §1a, §7a and §9.2–§9.3, by hand, or it is not covered.
