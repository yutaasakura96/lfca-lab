# Testing plan — LFCA exam simulator

**Status:** approved, Phase 4, 2026-08-30
**Triggered because** this is expected to be maintained for six months and to hold data that cannot
be regenerated.

---

## 1. The principle

The whole product is a scoreboard, and there is no external system to reconcile against. **A
silently wrong number is worse than a crash**, because it is believed — and the first-attempt scores
in particular cannot be recovered once corrupted.

So the test effort goes almost entirely into `app/src/domain/` (doc 03 §4): pure functions, no I/O,
no `Date.now()` — time is a parameter — that decide *which questions, in what order, how much time is
left, and what the score is*. That directory is tested exhaustively. Everything else gets one
end-to-end run and a written manual checklist.

---

## 2. Must have automated tests

**Vitest, over `src/domain/`.** These assert invariants, not examples — the facts are already
measured in this repo and re-measured by the tests at load.

| Unit | What is asserted |
| --- | --- |
| `score.ts` | `n/60`; pass at **exactly 45**, tested at 44 / 45 / 46. Unanswered counts as wrong, never as skipped. A 40-question holdout scores against its own pro-rata mark, not 45. |
| `select.ts` — weighted | A practice set is **always exactly 60**; the per-domain split is **always 18/11/10/8/7/6**; no question repeats within one sitting; **no holdout item ever appears**. Run over the real bank, not a fixture. |
| `select.ts` — unseen-first | Unseen questions are exhausted before any seen one is repeated (P3). When a domain's unseen pool runs out mid-session the remainder is filled least-recently-seen — **never a short session, never an error** (PRD §5). |
| `select.ts` — domain mode | `20` / `40` / `all` each return exactly that, and `all` never exceeds the domain's non-holdout exam pool. |
| `clock.ts` | Remaining time derives from `started_at` only. Negative remaining ⇒ expired. A clock is never extended by any input. Practice and domain (`time_limit_seconds = null`) never expire. |
| `first-attempt.ts` | The flag is set on the **earliest** attempt at an exam, is never rewritten by a later sitting, and survives an attempt that was abandoned and auto-submitted. |
| Bank integrity | 1,150 items; every item has exactly four options; exactly one correct per question; every option has `why`; the sixteen exams are 960 **distinct** questions with zero overlap; `data/holdout.json` is exactly 40 ids and set-equal to `exams/index.json.unused`. |

That last row is the check that defends the project's riskiest assumption (doc 03 §3.1). It runs in
the app's suite **and** in `npm run validate` at the repo root, because either one alone can be
skipped by working in the other half.

**Playwright, one end-to-end run**, covering the path nothing else covers:

> sign in → start exam 07 → answer six questions → flag two → close the context → reopen →
> **assert answers, flags and the reduced remaining time are all restored** → travel past the
> deadline → assert the attempt auto-submits as it stood and lands on review → assert the review
> shows the `why` text for **all four** options → click submit a second time → assert it is a no-op
> and the score is unchanged.

One test, deliberately. It is the resume-and-auto-submit path from doc 09 Flow B, which is the
hardest thing in the app and the only place a bug costs a first-attempt score.

---

## 3. Tested manually, from a written checklist

Run before each deploy that touches the UI. Kept in `app/tests/manual-checklist.md`.

- [ ] Both themes, on every screen. No token used outside `styles/tokens.css`.
- [ ] Contrast re-verified **if any colour token changed** — the 40-pair check from Phase 3.
- [ ] Focus ring visible on every control, both themes, never removed (doc 05 §7.3).
- [ ] Full keyboard pass through a sitting: select an option, flag, next, previous, submit.
- [ ] Mobile: navigator becomes a sheet; every target ≥44px; the 34px tile never appears on touch.
- [ ] Kill the network mid-sitting → *"Not saved — retrying"* chip appears, answering continues, the
      clock does not pause. Restore → the chip clears and the answers are there on reload.
- [ ] Sign in with a **non-allowlisted** Google account → denied screen, and **no `user` row is
      created** (checked in SQL, not inferred from the screen).
- [ ] Screens against doc 10 side by side, including empty and error states.

---

## 4. Deliberately untested in v1, and why that is acceptable

| Not tested | Why acceptable |
| --- | --- |
| React component rendering (unit) | The components are presentational over the design tokens; their failures are visible, and the manual checklist plus one E2E catch them. Component tests here would mostly assert markup. |
| Database queries against real Postgres | Rejected in the interview as too much CI apparatus for one user. **The accepted risk is real**: the unseen-first `LATERAL` join in doc 04 §5.3 is exercised only by the E2E run and by use. Revisit the moment that query is edited. |
| Better Auth's own flows | Library code with its own suite. Ours is the allowlist hook — covered by the manual check above, which is the one that matters. |
| Load, performance, concurrency beyond two tabs | One user. Two-tab behaviour is covered by construction (a derived clock and an upsert), not by a test. |
| Visual regression / screenshot diffing | The design is stable and pinned in doc 05; a screenshot suite would need maintaining more often than the UI changes. |
| Accessibility automation (axe) | Contrast was verified by computation in Phase 3 and keyboard access is on the manual list. Worth adding if the app ever opens up. |

---

## 5. CI

GitHub Actions on push and pull request, from the repo root:

```
npm test && npm run validate && npm run check-bank     # the bank
cd app && npm run test:unit && npm run build           # the app
cd app && npm run test:e2e                             # Playwright, on a Neon preview branch
```

**A red suite blocks deploy** (doc 12). The bank checks run first and are the cheapest, so a holdout
violation fails in seconds rather than after a browser run.
