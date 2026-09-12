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

**One row in that table is not about a number, and it is deliberate.** `src/domain/` is where this
plan puts its effort because that is where a wrong number is believed — but the deploy slice adds a
second thing that fails silently, which is **committed configuration**. A reverted flag, a stale
Node version, a permission rule whose `*` moved: each is one character away, and none of them fails
a suite that only exercises the app. So the unit suite also asserts files in the repository, in the
shape `design-tokens.test.ts` established — read the committed file, assert an external observable
fact about it, need no database.

| Unit | What is asserted |
| --- | --- |
| `neon-permissions.test.ts` | Every destructive `neon` command and Neon MCP tool resolves to a prompt in `.claude/settings.json`, under **both** names a Neon tool arrives under; no allow rule reaches one; the reads still run; and neither of doc 12 §8.2's two traps is open. |
| `design-tokens.test.ts` | `tokens.css` and `base.css` are byte-identical to `design/`. |
| `backup-command.test.ts` | Doc 12 §5's `pg_dump` command names every table the migrations create that is not listed as excluded **with a reason**, dumps over the direct host, and keeps `PGSSLROOTCERT=system` rather than downgrading `sslmode`. Derived from the migrations' own `CREATE TABLE` statements, so **the next table added fails this test by name** — which is the check `attempt_question` went eleven days without. |
| `deploy-config.test.ts` | Every script in `app/package.json` that passes an env file uses the **conditional** form, derived from the manifest rather than from a list of script names. `.github/workflows/ci.yml` runs the three database-free suites, runs none of the three that write or read a database, holds no repository secret at all, and **pins a Node major strictly above the manifest's floor major** — so every version that pin can resolve to satisfies `engines.node`, whatever the runner picks. And `app/vercel.json` builds with `next build` alone, sets `git.deploymentEnabled` to a **branch map rather than the boolean that would also stop `main`**, denies by default, and grants **exactly one** exception — the last of those being an assertion whose only job is to refuse a second `true`. |

These assert the artefact, never a live system: a test that opens a socket proves today's behaviour,
which is not what is at risk. What is at risk is somebody changing a line and nothing complaining.

**`deploy-config.test.ts` is a fourth file rather than an extension of the first**, which reverses
what that file's own header and this paragraph used to say. The seam is real and the shape is shared,
but nothing in it is about Neon — these are npm script flags and a GitHub workflow — and a file named
`neon-permissions` that also asserts a Node version is one the next reader does not think to grep.
#46 adds its `deploymentEnabled` assertion here. See the decision log, 2026-09-12.

**It asserts the workflow as text, not as parsed YAML**, deliberately: there is no YAML parser in the
app's dependency tree, and adding one to read six lines would be a dependency taken on for a test.
Every fact it asserts is a single line. The cost is that a workflow reshaped into an equally valid
spelling — `on: [push]` for `on: push` — fails here; that is the intended behaviour rather than a
limitation, for the same reason the Node grammar is matched strictly. A changed form is exactly the
moment a human should re-read the comparison.

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
| ~~Database queries against real Postgres~~ | **Superseded 2026-09-01.** This row rejected database tests on two grounds: too much apparatus for one user, and the E2E run would exercise the unseen-first `LATERAL` join anyway. Neither held when the query was written — the slice that built it has no UI and therefore no E2E run, and "selection never returns a holdout item" is a claim about query results that no pure function can make. A small integration suite now runs against the Neon dev branch. See the decision log. |
| Better Auth's own flows | Library code with its own suite. Ours is the allowlist hook — covered by the manual check above, which is the one that matters. |
| Load, performance, concurrency beyond two tabs | One user. Two-tab behaviour is covered by construction (a derived clock and an upsert), not by a test. |
| Visual regression / screenshot diffing | The design is stable and pinned in doc 05; a screenshot suite would need maintaining more often than the UI changes. |
| Accessibility automation (axe) | Contrast was verified by computation in Phase 3 and keyboard access is on the manual list. Worth adding if the app ever opens up. |

---

## 5. CI

GitHub Actions on push, from the repo root — **`.github/workflows/ci.yml`, which exists as of
2026-09-12.** One job, steps in this order. **What is built is the first two lines only:**

```
npm test && npm run validate && npm run check-bank     # the bank
cd app && npm run typecheck && npm run test:unit       # the app, needs no database

# NOT in CI — both need a seeded branch and a credential CI deliberately does not hold:
# cd app && npm run seed && npm run test:integration
# cd app && npm run test:e2e
```

**The last two lines are run locally, not in CI**, and that is a decision rather than an omission
(decision log, 2026-09-11). Both need `DATABASE_URL` as a repository secret and a seeded Neon branch
— precisely the apparatus §4 originally declined for one user, and which the 2026-09-01 entry
admitted only for a claim no pure function could make. The three cheap suites run in seconds, need no
credential, and they run on every push; there was no `.github/` directory at all until the deploy
slice.

**They do not, however, gate anything, and doc 12 §3 said they did until #46 corrected it.** Vercel
builds on the push and this workflow runs on the same push — they race, and nothing couples them. CI
is a signal on the commit, not a gate in front of the deploy; the recovery is *Promote to Production*
(doc 12 §4). Said here as well as there because this is the section a reader consults to find out what
the suites are *for*.

**One job, not three in parallel**, and the step order is the claim: the bank checks run first
because they are the cheapest and they are the ones defending the holdout, so a holdout violation
fails in seconds rather than behind a typecheck. The bank half installs nothing — the root declares
no dependencies and every import under `tools/` is a `node:` builtin — so `npm ci` happens only for
the app, after the bank has already had its say.

**Node is pinned in the workflow, at `24.x`.** `npm run seed` executes `scripts/seed.ts` directly,
which needs Node ≥23.6 for unflagged type stripping, and `--env-file-if-exists` needs ≥20.12. Both
are silently absent on an older major, and the failure is a parse error in a workflow nobody is
watching. **`24.x` rather than the manifest's own range**, for the reason doc 12 §3 records: Root
Directory is `app`, so `engines.node` is the manifest Vercel reads and it resolves `>=23.6.0` there
to the latest 24.x — pinning the same major means CI typechecks under the major that compiles the
deploy it gates. `actions/setup-node` would take the range directly through `node-version-file`
(verified: it reads `volta.node`, then `devEngines.runtime`, then `engines.node`), and that cannot
drift — but **a range is not a pin**: it resolves to whatever the newest satisfying major is on the
runner that day, so a Node release would change CI's runtime with no diff to show for it.
`deploy-config.test.ts` is what keeps the pin and the manifest from drifting apart instead.

**`npm run test:e2e` runs `next build` itself**, which is a correction to this section rather than a
refinement of it: it originally read `npm run build && npm run test:e2e`, and that builds twice. The
build belongs inside the script because the alternative is a stale `.next` silently being what the
one browser test in the repo exercises — a failure that looks like a passing suite. Playwright then
serves it with `next start` on **port 3100**, deliberately not 3000: the run signs in by inserting a
session row, so it never touches an OAuth redirect and has no claim on the port the Google client is
registered against.

The browser run reuses the **same database** as the integration suite, under its own `e2e-` user
prefix — which is why the two commented lines above are ordered as they are, with one `seed` serving
both. A distinct prefix is what keeps their teardowns apart: each deletes every user carrying its own
prefix. That database is the Neon **`develop`** branch; production is the Neon **`main`** branch and
no suite has ever pointed at it.

All three app suites **skip cleanly** when `DATABASE_URL` is absent rather than erroring, so a
contributor without a branch still gets a green run and an honest count of what was skipped. The unit
suite deliberately needs no database at all, so it runs anywhere and fails fast.

**A red suite does not block the deploy** — see above, and doc 12 §3. *This line read "A red suite
blocks deploy (doc 12)" until #46*, which is the same claim from the other end and was wrong for the
same reason. The bank checks still run first and are still the cheapest, so a holdout violation is
reported in seconds rather than after a browser run; what it buys is a fast answer, not a refusal.
