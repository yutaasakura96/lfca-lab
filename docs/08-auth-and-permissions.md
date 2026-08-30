# Auth & permissions — LFCA exam simulator

**Status:** approved, Phase 4, 2026-08-30
**Triggered because** users log in. Decided in Phase 1 and reaffirmed twice: Google sign-in ships in
v1. See [06-decision-log.md](06-decision-log.md).

---

## 1. Login method

**Google OIDC only, via Better Auth.** No email/password, no magic link, no second provider.

Why: the only user already has a Google account, so there is no password to store, no reset flow to
build, no verification email to send, and no credential of the user's for this app to lose. The
entire class of authentication bugs that ships with hand-rolled credentials is simply absent. The
cost is a hard dependency on Google being up to *start* a session — acceptable, because sessions are
database-backed and last 30 days (§2), so a Google outage cannot interrupt a sitting in progress.

Rejected: deferring auth to v2 and running unauthenticated (proposed twice, overruled twice — an
unauthenticated app has nowhere to hang first-attempt scores, which are the product); adding
email/password as a fallback (a second credential path to secure, for a user who does not need it).

---

## 2. Sessions

**Database-backed sessions, not JWTs.** Better Auth's default `session` table (doc 04 §2), keyed by
an opaque token in a cookie.

| | |
| --- | --- |
| Cookie | `Secure`, `HttpOnly`, `SameSite=Lax`, path `/` |
| Expiry | **30 days** |
| Refresh | Rolling — Better Auth extends the expiry when a session is used within its update age (1 day). A user who studies weekly never signs in again. |
| Revocation | Deleting the `session` row logs that browser out **immediately**. This is the reason for sessions over JWTs: a stateless token cannot be withdrawn, and the recovery move if anything ever looks wrong is `DELETE FROM session`. |

A 90-minute exam sits comfortably inside a 30-day session, so the clock can never be interrupted by
an expiring session. There is no idle timeout — there is nothing here worth protecting from someone
who already has the owner's unlocked laptop.

---

## 3. The allowlist — the control that makes deploying safe

Google sign-in is open to every Google account on earth unless it is closed. It is closed by an
environment variable.

```
ALLOWED_EMAILS=yuta.asakura.se@gmail.com
```

Comma-separated, compared **case-insensitively after trimming**, and only against a Google profile
whose `email_verified` is true.

Enforced in Better Auth's **`signIn` / account-linking hook**, before any row is written:

- **In the list** → the `user` row is created (or found), `allowlisted` is set true, the session is
  issued, and the user lands on the home screen.
- **Not in the list** → **no `user` row, no `account` row, no `session`** is created. The user is
  redirected to `/sign-in?denied=1`, which renders a plain, unhostile screen: *"This app is
  private."* No email address is echoed back, and there is no request-access affordance to probe.

Two further layers behind it, per doc 03 §9:

1. `user.allowlisted` is checked in the session guard on every request, so a row that somehow existed
   before the list was tightened still cannot act.
2. Every attempt-scoped query is filtered by `user_id` from the session, so even a hypothetical
   extra account sees only its own empty history.

**If `ALLOWED_EMAILS` is empty or unset, the app refuses every sign-in and logs a startup error.**
Failing closed is the only safe default: an accidentally-empty variable that meant "allow everyone"
would silently publish the app.

---

## 4. Roles and permissions

There is **one role: the candidate.** No admin role exists, because there is nothing to administer —
question content is edited as JSON in the repo and seeded (PRD X2), not managed through a screen.

| Action | Anonymous | Candidate (allowlisted) |
| --- | --- | --- |
| See the sign-in screen | ✅ | ✅ (redirected away) |
| See any other screen | ❌ | ✅ |
| Start an attempt in any mode | ❌ | ✅ |
| Answer / flag / submit **their own** attempt | ❌ | ✅ |
| Read **another user's** attempt | ❌ | ❌ — 404, per doc 07 §1 |
| Sit the holdout | ❌ | ✅, once |
| Create, edit or delete a question | ❌ | ❌ — **no one.** Not a permission; there is no code path |
| Delete their own history | ❌ | ❌ — deliberately absent, per doc 04 §7 |

The interesting row is the last two: two capabilities that no role has, by construction rather than
by check.

---

## 5. Protected routes

Everything under the `(app)` route group is behind the session gate; `/sign-in` is the only page
outside it.

| Route | Unauthenticated visitor |
| --- | --- |
| `/` , `/exams`, `/attempt/*` | **302 → `/sign-in?next=<path>`**, and after signing in they land where they were going. This matters for a bookmarked in-progress attempt. |
| `/api/*` (except `/api/auth/*`) | **401 `unauthenticated`** — JSON, never a redirect. A redirect here would make the outbox parse an HTML login page as an answer response. |
| `/sign-in` while signed in | 302 → `/` |

Enforced in Next.js middleware for the page redirect **and** re-checked in every route handler and
server query helper. Middleware alone is not a security boundary; it is a convenience that avoids
rendering a page only to throw it away.

---

## 6. Password reset and email verification

**Neither exists, and neither is deferred — they are structurally absent.** There is no password to
reset, and email verification is Google's, asserted by the `email_verified` claim in the ID token,
which §3 requires to be true. If email/password were ever added, both come back onto the table.

---

## 7. Sign-out, and account recovery

Sign-out deletes the `session` row and clears the cookie. Signing back in with the same Google
account returns the same `user` row and all history — identity is the Google `sub` stored on
`account.account_id`, not the email, so the history survives an email change at Google.

**Recovery if the owner loses access to the Google account**: there is no self-service path, and none
should be built. The recovery move is to edit `ALLOWED_EMAILS`, sign in with the new account, and
re-point the old `account` row's `user_id` in SQL. Written here so it is not improvised later.
