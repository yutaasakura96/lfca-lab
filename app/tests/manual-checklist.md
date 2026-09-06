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

- [ ] Every screen in **both themes**: sign-in, exam list, sitting, submit dialog (all four of its
      states), review. Toggle with the control in the app, not with the OS, then once with the OS to
      confirm the default follows the system.
- [ ] No colour, spacing, radius or font value used outside `src/styles/tokens.css`. Grep the diff
      for a raw hex code before believing this.
- [ ] **If any colour token changed**, re-run the Phase 3 contrast check — 40 pairs, both themes,
      4.5:1 for text and 3:1 for non-text. A token change without this is not finished.
- [ ] Every state legible at `filter: grayscale(1)`: correct, incorrect, flagged, unanswered,
      current, and the three clock bands. Colour is never the only signal (doc 05 rule 4).

## 3. Keyboard and focus

- [ ] Focus ring visible on **every** control in both themes, 2px at 2px offset, never removed
      (doc 05 §7.3). Includes navigator tiles, review filters, and the option buttons.
- [ ] A full sitting driven by keyboard alone: `Tab` to reach everything, `1`–`4` to choose,
      `F` to flag, `←` `→` to move, and Submit reachable and operable.
- [ ] The submit dialog traps focus while open and returns it to the button on close.
- [ ] Every navigator tile is tabbable, and the sheet's contents are not tab stops while closed.

## 4. Mobile and pointer

- [ ] At 375px: the navigator becomes a **sheet**, not a rail, and the sheet's trigger is the
      question counter in the bar.
- [ ] Every target on a touch layout is **≥44px**. The 34px rail tile never appears on a coarse
      pointer — check with a real touch device or pointer emulation, not with width alone.
- [ ] Nothing overflows the page horizontally at 375px, on every screen. The bar wraps for the save
      chip rather than shrinking the clock.

## 5. The save failure

- [ ] Kill the network mid-sitting. The **"Not saved — retrying"** chip appears, answering keeps
      working, and **the clock does not pause**.
- [ ] The chip is visible at 375px as well as at 1440 — it sits outside the group the touch layout
      hides, deliberately (decision log, 2026-09-03).
- [ ] Submit is blocked while a write is owed, and the button reads "Saving…".
- [ ] Restore the network: the chip clears, and a reload shows the answers and flags are there.

## 6. Against the specifications

- [ ] Every screen beside doc 10, including its **empty, loading and error states** — the exam list
      with nothing sat, a 0/60 review's empty filter, and the page-level error state.
- [ ] The review shows the `why` text for **all four** options, on an answered card and on a blank
      one (PRD E4).
- [ ] Both numbers on the exam list, always together: best and first-attempt, with an unsat paper
      reading as words rather than as a zero.

---

## What the browser run already covers — don't re-check by hand

`npm run test:e2e` walks start → answer → flag → close the browser → resume with time genuinely
gone → past the deadline → auto-submitted as it stood → review → a second submit that changes
nothing. If that suite is green, none of that path needs a manual pass; spend the time on the
sections above, which no suite can reach.
