# Deployment & DevOps — LFCA exam simulator

**Status:** approved, Phase 4, 2026-08-30
**Triggered because** this actually ships. Architecture: [03-technical-design.md](03-technical-design.md)

---

## 1. Environments

| | Local | Preview | Production |
| --- | --- | --- | --- |
| App | `next dev` on `localhost:3000` | Vercel preview, per pull request | Vercel, `main` |
| Database | Neon **dev branch** | Neon **branch per PR**, created and dropped by the integration | Neon primary |
| Content | seeded from the working tree | seeded from the PR's tree | seeded from `main` |
| Google OAuth | same client, `localhost:3000` in redirect URIs | same client, Vercel preview URL pattern | same client, production URL |
| `ALLOWED_EMAILS` | the owner | the owner | the owner |
| Sentry | **disabled** (`SENTRY_DSN` unset) | enabled, `environment=preview` | enabled, `environment=production` |

**What actually differs:** the database branch and whether Sentry is on. Nothing else — no feature
flags, no mock providers, no seeded fake users. A preview that behaves differently from production is
a preview that proves nothing.

**One Google OAuth client, three redirect URIs.** A second client would be a second secret to rotate
for no benefit at this size.

---

## 2. Environment variables

Every one of these is set in Vercel per environment, and mirrored in `app/.env.local` for local work.
`app/.env.example` is committed with **names and empty values only**.

| Name | Purpose | Where the secret lives | Secret? |
| --- | --- | --- | --- |
| `DATABASE_URL` | Neon connection string, `sslmode=verify-full` (§2.1) | Neon dashboard → Vercel env | **yes** |
| `BETTER_AUTH_SECRET` | signs session tokens | generated once (`openssl rand -base64 32`), stored in Vercel | **yes** |
| `BETTER_AUTH_URL` | canonical origin, for OAuth callbacks | plain config | no |
| `GOOGLE_CLIENT_ID` | OIDC client | Google Cloud console | no |
| `GOOGLE_CLIENT_SECRET` | OIDC client | Google Cloud console → Vercel env | **yes** |
| `ALLOWED_EMAILS` | the allowlist (doc 08 §3) | Vercel env | no, but **load-bearing** |
| `SENTRY_DSN` | error reporting | Sentry project settings | no (public by design) |
| `SENTRY_AUTH_TOKEN` | source-map upload at build | Sentry → Vercel env, **build-time only** | **yes** |

Four true secrets. None is ever committed; `.env*` is gitignored except `.env.example`.

**Setting them up locally:** `scripts/setup-google-oauth.sh` walks the Google side and writes
`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` and
`ALLOWED_EMAILS` into `app/.env.local`. The secrets go from the console to the file without
passing through a terminal echo or an agent's context. `DATABASE_URL` comes from the Neon setup.

**Two things about Google that are not obvious and will waste an afternoon otherwise.** An app in
*Testing* status serves only the accounts explicitly listed as test users — not adding your own
address is the classic first failure. And in Testing, an authorisation **expires seven days after
consent**, so being asked to consent again next week is the documented behaviour rather than a bug.

### 2.1 Every Neon connection string in this project says `sslmode=verify-full`

**The rule is per-string, not per-variable**, and it is written that way because a second Neon URL is
already known to be coming: schema migrations go to the *direct* host and a serverless runtime to the
*pooled* one (§2.2). Whichever variable it lands in, it is pasted from the Neon dashboard — which
hands out `sslmode=require` — and it gets the same treatment as this one.

Neon supports `verify-full` and [recommends it](https://neon.com/docs/connect/connect-securely);
its certificates chain to the public **ISRG Root X1** (Let's Encrypt), which ships in Node's bundled
trust store, so **no `sslrootcert` is needed** — verified against the dev branch on 2026-09-02, chain
`YR2 ← Root YR ← ISRG Root X1`, `authorized: true`. Keep `channel_binding=require` alongside it;
Neon documents it as SCRAM-SHA-256-PLUS mutual authentication and it is orthogonal to `sslmode`.

**Why the change is not cosmetic.** `node-postgres` today treats `require`, `prefer` and `verify-ca`
as aliases for `verify-full`, and warns on every server start that it will stop doing so in
`pg` v9 / `pg-connection-string` v3. Under those versions `sslmode=require` with no `sslrootcert`
adopts libpq semantics and sets **`rejectUnauthorized = false`** — not weaker certificate
verification but *none*, with no warning and no test failure. A routine Dependabot major bump (doc 03
§9 merges patch and minor automatically) would therefore silently downgrade the connection. Saying
`verify-full` is what survives that bump.

Substituting it is provably behaviour-preserving **today**: both modes hand `tls.connect` identical
options — no `rejectUnauthorized` override, no custom CA, no `checkServerIdentity` override — so the
only thing that changes is the warning going away.

### 2.2 The second connection string, still outstanding

Neon routes schema migrations to the direct host and a serverless runtime to the pooled one, so
`db:migrate` and the seed will want the direct URL while the deployed app wants `-pooler`. That
second variable is **not** introduced here: nothing reads it until Vercel exists, and inventing it
early would mean an unused secret in three environments. It belongs to the slice that deploys —
where §2.1's rule applies to it on arrival.

**Rotation:** `BETTER_AUTH_SECRET` invalidates every session when changed — which is the intended
emergency control, not a hazard. The Google client secret rotates in the Google console with a brief
overlap. `DATABASE_URL` rotates by resetting the Neon role password.

---

## 3. Deploying

Vercel's GitHub integration. **Push to `main` deploys production; a pull request deploys a preview.**
Root Directory is `app`.

The build command runs the ordered steps, and **any failure stops the release** — the previous
deployment keeps serving:

```bash
npm run db:migrate     # drizzle-kit migrate — additive, reviewed SQL
npm run seed           # truncate + reinsert content tables, one transaction
next build
```

Migrations run **before** the new code is live, so they must be backward-compatible with the release
currently serving — additive columns, no renames in the same deploy as the code that depends on them.
A rename is two deploys, always.

`npm run seed` never touches `user`, `attempt` or `answer` (doc 04 §0). It is safe to run on every
deploy, and running it every time is what keeps the database from silently diverging from the bank.

**CI gates the deploy** (doc 11 §5): the bank checks, the unit suite, the build, and the Playwright
run against a Neon preview branch. Red suite, no deploy.

---

## 4. Rollback — written before the first deploy

**Code:** Vercel → Deployments → *Promote to Production* on the last good build. Seconds, no rebuild.
This is the whole rollback for anything that is not a migration.

**Migration:** there is no `down` migration and none will be written — a down migration is a script
that has never been run pretending it will work under pressure. Instead:

1. Promote the previous deployment (above). If the migration was additive, the old code ignores the
   new column and the system is already correct.
2. If the migration was destructive, restore from a Neon **point-in-time branch** at a timestamp
   before the deploy, verify it, then repoint `DATABASE_URL`. **Only available within the 6-hour
   history window (§5)** — past that, the last `pg_dump` is the restore point, so a destructive
   migration noticed the next day costs whatever attempt history came after the dump.
3. Write a new forward migration to undo it properly.

This is why §3 forbids renames and drops in the same deploy as dependent code: it keeps step 1
sufficient in almost every case.

**Content:** a bad seed is fixed by fixing the JSON and redeploying. The content tables hold no state
worth preserving; they are a projection of the repo.

---

## 5. Backups, and the restore that must actually be tested

Neon's history window provides point-in-time restore. **Measured at signup, 2026-08-31: the free
plan's window is 6 hours** — both its default and its maximum, and capped at 1 GB of history. That is
the real retention. It is short enough that point-in-time restore is not a backup here; it is an
undo for a mistake you notice the same morning.

So the `pg_dump` below is not a belt-and-braces extra. **It is the backup.** The user data is small,
irreplaceable and cheap to copy:

```bash
pg_dump "$DATABASE_URL" --table=attempt --table=answer --table='"user"' --table=account \
  -Fc -f "lfca-$(date -u +%Y%m%d).dump"
```

Monthly, kept off Neon. Two hundred rows of attempt history is nothing to store and the only thing
here that cannot be regenerated from the repo.

**The restore has to be tested, once, before it matters:** create a Neon branch, restore the dump
into it, point a local `next dev` at it, and confirm the exam list still shows the right first-attempt
scores. An untested backup is a belief, not a backup. This is a checklist item for the first week
after launch, not a someday.

---

## 6. Monitoring — how you find out before you notice

For a single-user app the honest answer is that **the user is the monitor** for most things. What is
worth automating is the failure the user cannot see:

| Signal | Source | Why it matters |
| --- | --- | --- |
| Unhandled exceptions, client and server | **Sentry**, alert to email | The save failure at question 40 of a first attempt. The one thing that costs a number that cannot be recovered. |
| 5 consecutive answer-write failures on one attempt | Sentry event (doc 03 §8) | Distinguishes a flaky tunnel from a broken write path. |
| Failed deploy or red CI | GitHub / Vercel notifications | Default channels; no extra setup. |
| Neon compute-hour and storage ceiling | Neon dashboard, checked when a bill or a limit warning arrives | The first thing that breaks under any real load (doc 03 §10). |

**Deliberately not monitored:** uptime pings, web vitals, page analytics. Uptime for a one-user study
app is discovered by the one user opening it; analytics would measure the owner.

---

## 7. Domain

Vercel's generated `*.vercel.app` hostname is sufficient for v1 — nothing about the product depends
on a custom domain, and a custom domain would mean a DNS record and a certificate to maintain for an
audience of one. Revisit if the app opens to other users, at which point `BETTER_AUTH_URL` and the
Google redirect URI change together.
