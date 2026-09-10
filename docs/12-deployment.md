# Deployment & DevOps — LFCA exam simulator

**Status:** approved, Phase 4, 2026-08-30
**Triggered because** this actually ships. Architecture: [03-technical-design.md](03-technical-design.md)

---

## 1. Environments

| | Local | Production |
| --- | --- | --- |
| App | `next dev` on `localhost:3000` | Vercel, git `main` |
| Database | Neon **`develop`** branch | Neon **`main`** branch (the project's root) |
| Content | seeded from the working tree | seeded from git `main` by the deploy workflow (§3) |
| Google OAuth | same client, `localhost:3000` in redirect URIs | same client, the production URL |
| `ALLOWED_EMAILS` | the owner | the owner |
| `BETTER_AUTH_SECRET` | its own value | **its own, different value** (§2) |
| Sentry | **disabled** (`SENTRY_DSN` unset) | enabled, `environment=production` |

**What actually differs:** the database branch, the signing secret, and whether Sentry is on. Nothing
else — no feature flags, no mock providers, no seeded fake users.

**This table had a third column, and it is gone rather than deferred.** It specified a Preview
environment with a Neon branch per pull request and "same client, Vercel preview URL pattern". There
is no such pattern: **Google forbids wildcards in redirect URIs** — a URI "cannot contain … Wildcard
characters (`'*'`)", and scheme, case and trailing slash "must all match" — while Vercel mints a new
hostname per preview deployment. Sign-in on a preview is therefore impossible without assigning a
custom domain to a branch, which §7 declines to buy. Neon's Free plan separately caps a project at
**ten branches** and refuses creation past it. And no pull request has ever been opened on this
repository. See the decision log, 2026-09-11.

**Non-production deployments are turned off**, in `vercel.json`'s `git.deploymentEnabled`, so a push
to `develop` mints no public URL. What is deployed is always whatever is on git `main`.

**"Branch" means two things here and is never used bare** — a git branch is code, a Neon branch is a
copy of the database. They are named after each other on purpose: Neon `main` backs git `main`, Neon
`develop` backs local work. See `CONTEXT.md`.

**One Google OAuth client, two redirect URIs.** A second client would be a second secret to rotate
for no benefit at this size.

---

## 2. Environment variables

Every one of these is set in Vercel per environment, and mirrored in `app/.env.local` for local work.
`app/.env.example` is committed with **names and empty values only**.

| Name | Purpose | Where the secret lives | Secret? |
| --- | --- | --- | --- |
| `DATABASE_URL` | Neon **pooled** string (`-pooler` host), `sslmode=verify-full` (§2.1). Read by the app. | Neon dashboard → Vercel env | **yes** |
| `DATABASE_URL_UNPOOLED` | Neon **direct** string, same rules. Read by `drizzle-kit migrate` and `npm run seed` (§2.2). | Neon dashboard → Vercel env **and GitHub Actions secrets** | **yes** |
| `BETTER_AUTH_SECRET` | signs session tokens | generated **per environment** (`openssl rand -base64 32`) — a different value locally and in production | **yes** |
| `BETTER_AUTH_URL` | canonical origin, for OAuth callbacks | plain config | no |
| `GOOGLE_CLIENT_ID` | OIDC client | Google Cloud console | no |
| `GOOGLE_CLIENT_SECRET` | OIDC client | Google Cloud console → Vercel env | **yes** |
| `ALLOWED_EMAILS` | the allowlist (doc 08 §3) | Vercel env | no, but **load-bearing** |
| `SENTRY_DSN` | error reporting | Sentry project settings | no (public by design) |
| `SENTRY_AUTH_TOKEN` | source-map upload at build | Sentry → Vercel env, **build-time only** | **yes** |

Five true secrets, and one of them lives in two places. None is ever committed; `.env*` is gitignored
except `.env.example`.

**`DATABASE_URL_UNPOOLED` is also a GitHub Actions repository secret**, because the deploy workflow
(§3) is what runs the migration and the seed. This repository is public; Actions secrets are
encrypted and this is the ordinary mechanism, but it is a new place a production credential lives and
it is listed here rather than left to be discovered.

**`BETTER_AUTH_SECRET` is two values, not one.** This section used to say "generated once", which
read as a single shared value. Rotating it is described below as the intended emergency control — and
with one value, rotating production to kill a session also signs the owner out locally, while the
value guarding the public URL would be one that had sat in a file on a laptop for months.

**Setting them up locally:** `scripts/setup-google-oauth.sh` walks the Google side and writes
`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` and
`ALLOWED_EMAILS` into `app/.env.local`. The secrets go from the console to the file without
passing through a terminal echo or an agent's context. `DATABASE_URL` comes from the Neon setup.

**Two things about Google that are not obvious and will waste an afternoon otherwise.** An app in
*Testing* status serves only the accounts explicitly listed as test users — not adding your own
address is the classic first failure. And in Testing, an authorisation **expires seven days after
consent**, so being asked to consent again next week is the documented behaviour rather than a bug.

### 2.1 Every Neon connection string in this project says `sslmode=verify-full`

**The rule is per-string, not per-variable**, and it was written that way because a second Neon URL
was known to be coming. It has arrived (§2.2). Both are pasted from the Neon dashboard — which hands
out `sslmode=require` — and both get the same treatment.

**With one caveat that is a test, not an assumption.** Neon recommends `verify-full` host-agnostically
but never states it for the **`-pooler`** host specifically, and its own connection-pooling examples
use `sslmode=require`. `verify-full` adds hostname verification, and the pooler is a different
hostname. The pooled string is therefore to be verified against `verify-full` the way the direct one
was on 2026-09-02 — measured, not believed — before this rule is asserted over it.

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

### 2.2 The second connection string, resolved

`DATABASE_URL` carries the **pooled** (`-pooler`) host and is what the app reads. **`DATABASE_URL_UNPOOLED`**
carries the **direct** host and is what `drizzle-kit migrate` and `npm run seed` read. Both endpoints
always exist for a branch — "the pooled endpoint is always available" — so this is two spellings of
one database, not two databases.

**The names are Neon's own**, set by its Vercel integration, adopted here so that nothing has to be
renamed if that integration is ever added.

**How strong the migration guidance actually is.** Neon's direction to use the direct host for schema
migrations is a hedged table row — *"Schema migrations | Direct | Tools may not support transaction
pooling"* — not a documented failure, and drizzle-kit is named nowhere in it. The mechanism is real
though: session-level advisory locks and `SET`/`RESET` are both documented as unsupported on pooled
connections, and migration tools use them. Splitting the two strings costs one variable and removes
the question.

**Rotation:** `BETTER_AUTH_SECRET` invalidates every session in that environment when changed — which is the intended
emergency control, not a hazard. The Google client secret rotates in the Google console with a brief
overlap. `DATABASE_URL` rotates by resetting the Neon role password.

---

## 3. Deploying

Vercel's GitHub integration. **Push to git `main` deploys production.** Nothing else deploys —
non-production deployments are off (§1). Root Directory is `app`.

**The build command is `next build` and nothing else.** This section used to put `db:migrate` and
`seed` ahead of it in the Vercel build; they run from **GitHub Actions** instead, in a workflow of
their own triggered by the same push. The reasoning is the 2026-08-31 decision-log entry: Vercel's own
docs contradict each other about whether a build with Root Directory `app` can read `../questions`,
build-container database egress is documented in neither direction, and Vercel may decide a commit
touching only `questions/**` changed nothing about this project. A runner has the whole repository
checked out and ordinary internet access, and it runs on the push regardless of what Vercel concludes.

```
push to git main
  |-- Vercel:  next build -> deploy                 (nothing else in the build)
  '-- Actions: npm run db:migrate; npm run seed     (against DATABASE_URL_UNPOOLED)
```

**The two race, and that is accepted.** For a short window the new code may serve the previous seed.
This is why migrations must be backward-compatible with the release currently serving — additive
columns, **no renames in the same deploy as the code that depends on them.** A rename is two deploys,
always.

`npm run seed` never touches `user`, `attempt`, `answer` or `attempt_question` (doc 04 §0, §7). It
upserts rather than truncating (doc 03 §3), so it is safe on every deploy, and running it every time
is what keeps the database from silently diverging from the bank.

**Both scripts read `--env-file-if-exists`, not `--env-file`**, so one script serves both a laptop and
a runner where the environment supplies the variables.

**CI gates the deploy, and it is smaller than doc 11 §5 specifies:** the bank checks, `typecheck` and
the app's unit suite — the three that need no database. The integration suite and the Playwright run
stay local, because both need a seeded branch and a credential the test workflow deliberately does not
hold. Red suite, no deploy. Node is **pinned** in every workflow: `npm run seed` executes
`scripts/seed.ts` directly, which needs Node ≥23.6 for unflagged type stripping and fails as a parse
error on an older major.

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

**The restore has to be tested, once, before it matters** — and it is tested by being *used*. The
first production database is created by running exactly the dump above against the Neon `develop`
branch and restoring it into the Neon `main` branch, which is where the owner's five first-attempt
scores (exams 05, 07, 08, 10 and 14) come from. The source branch is not deleted, so a bad restore
costs nothing and can be looked at again. Confirm afterwards that the exam list shows those five
first-attempt scores unchanged.

An untested backup is a belief, not a backup — so the promotion is deliberately arranged to be the
rehearsal, rather than leaving a separate rehearsal to be remembered in the first week after launch.
See the decision log, 2026-09-11.

**Why the root branch is the destination rather than the source.** Neon states unconditionally that a
project's root branch **cannot be deleted**, and separately that a branch with children cannot be
deleted either. Promoting the child instead — which Neon does permit — would have left the root
sitting permanently at the head of the project as the undeletable parent of production. Copying into
the root costs one `pg_restore`; the alternative costs a permanent misnamed branch.

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
