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

**Rotation.** `BETTER_AUTH_SECRET` invalidates every session in that environment when changed — which
is the intended emergency control, not a hazard. The Google client secret rotates in the Google
console with a brief overlap. **Both database strings rotate together**, by resetting the Neon role
password: they are two spellings of one database (§2.2) and they carry the same role, so a rotation
that re-pasted only one would leave the other authenticating with a password that no longer exists —
and the half that broke would be whichever of the app and the seed ran next.

**This paragraph is about every secret in the table above, and it used to sit at the foot of §2.2**,
where it read as a fact about the second connection string alone. Moved back to the §2 level with
#44, which is also where the "`DATABASE_URL` rotates" singular was noticed.

### 2.1 Every Neon connection string in this project says `sslmode=verify-full`

**The rule is per-string, not per-variable**, and it was written that way because a second Neon URL
was known to be coming. It has arrived (§2.2). Both are pasted from the Neon dashboard — which hands
out `sslmode=require` — and both get the same treatment.

**The caveat this section carried is settled, and the answer is structural rather than lucky.** Neon
recommends `verify-full` host-agnostically but never states it for the **`-pooler`** host
specifically, and its own connection-pooling examples use `sslmode=require` — so the rule was held
open until the pooled host was measured the way the direct one was on 2026-09-02. **Measured
2026-09-12 on all four hosts — pooled and direct, both branches: `verify-full` holds on the pooler.**

It holds because **the pooler is not a different certificate.** Every endpoint in this project is
served one wildcard certificate for the proxy domain — leaf CN and sole SAN
`*.c-4.ap-southeast-1.aws.neon.tech` — and `-pooler` is a suffix on the **leftmost label**, so
`ep-…-pooler.c-4.…` and `ep-….c-4.…` are both single labels under that wildcard and match it equally.
There is no exception to write down. TLSv1.3 throughout, chain `YR2 ← Root YR ← ISRG Root X1`,
`authorized: true`, four hosts for four.

**The measurement needed no password, which is why it could be made at all.** `verify-full` means
chain verification *plus* hostname verification, and both happen in the TLS handshake **before**
authentication — so the Postgres `SSLRequest` was made by hand and the upgraded socket handed to
`tls.connect` with `rejectUnauthorized: true` and `servername` set, which is the option pair
node-postgres builds for `verify-full`. No connection string, no credential, nothing for §8.2's
`get_connection_string` prompt to protect. **And the check is not vacuous**, which was verified
rather than assumed: run against the served certificate, Node's own `checkServerIdentity` rejects a
deeper label (`deeper.label.c-4.…`) and a different proxy shard (`ep-…-pooler.c-9.…`) with
*"Hostname/IP does not match certificate's altnames"*, while accepting both real hosts.

**What would break it, named so a future reader knows what to re-measure** rather than inheriting a
fact with no expiry: Neon moving the pooler to a different parent domain, or issuing it a
certificate of its own. The wildcard is one level deep, so a pooled host at `…-pooler.pooler.c-4.…`
would fail hostname verification while the direct host kept working — which would present as the
pooler being down.

**One thing measured along the way that contradicts the endpoint record.** Both endpoints report
**`pooler_enabled: false`**, and the pooled host answers anyway — which is Neon's "the pooled
endpoint is always available" (§2.2) holding in practice. The flag is not what decides whether the
`-pooler` host exists, so it is not something to check before using one.

**The measurement was a throwaway and is not in the repo, deliberately.** A script that opens a
socket proves today's behaviour, which is not what is at risk; what is at risk is somebody pasting a
fresh dashboard string that says `require`. The committed guard is
`app/tests/integration/connection-string.test.ts`, which asserts the *string*, and #43 extends it to
both.

Neon supports `verify-full` and [recommends it](https://neon.com/docs/connect/connect-securely);
its certificates chain to the public **ISRG Root X1** (Let's Encrypt), which ships in Node's bundled
trust store, so **no `sslrootcert` is needed** — verified against the Neon `develop` branch (named
`dev` at the time) on 2026-09-02, chain `YR2 ← Root YR ← ISRG Root X1`, `authorized: true`, and
re-measured on both branches and both hosts on 2026-09-12. Keep `channel_binding=require` alongside it;
Neon documents it as SCRAM-SHA-256-PLUS mutual authentication and it is orthogonal to `sslmode`.

**`channel_binding` is a fact about the strings, not about the hosts, so it is checked differently
and is partly the owner's.** The Neon `develop` **direct** string is settled and stays settled:
`connection-string.test.ts` asserts it on every integration run, and that run is green. The other
three come from the dashboard and are confirmed by dumping **only their query parameters** — no host,
no role, no password — so the check can be made without a connection string entering an agent's
context or a shell history. #43 turns the result into the committed assertion for both variables.

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

**There is no fallback from `DATABASE_URL_UNPOOLED` to `DATABASE_URL`, and that absence is the
feature.** `requireDirectDatabaseUrl()` in `app/src/db/client.ts` throws, and `drizzle.config.ts`
carries the same refusal of its own — not an import, because importing the helper would pull `pg`,
`drizzle-orm` and the whole schema graph into whatever bundle drizzle-kit builds that config with. It
is a refusal at all rather than `?? ''` because **`pg` reads an empty connection string as *use the
`PG*` defaults***: a runner missing the secret would aim at localhost and report a connection error
rather than a missing credential. `drizzle-kit generate` writes SQL from the schema and opens nothing,
so it is the one command exempt.

**The seed holds its own pool, on the direct host**, rather than the app's handle from
`src/db/client.ts`. That handle is the pooled one and is imported by every route, page and query
helper; a `makeDb(url)` factory there would have saved one construction line and handed all of them a
way to build a handle pointing anywhere. Nothing under `src/` can reach the direct host.

**Both environments point `DATABASE_URL` at a pooled host**, local included, so the pooler is
exercised every day rather than only in the environment that cannot be debugged from. The integration
and browser suites therefore run over it too.

**`app/tests/integration/connection-string.test.ts` asserts both strings under one gate.** The gate is
`DATABASE_URL`, so a contributor with no Neon branch still gets a green run; but *given* a database,
both are required rather than each skipped when absent — a skipped half would report green over
exactly the state in which the seed refuses to run. It also asserts that the two hostnames differ by
precisely `-pooler` on the leftmost label, which is §2.1's structural finding turned into a check, and
which catches the mistake actually available when adding a second variable: pasting one string into
both names, which every parameter assertion would pass.

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
a runner where the environment supplies the variables. **`test:integration` moved with them**, which
was not a tidiness pass: under the mandatory form a missing `.env.local` makes the command itself exit
`ENOENT`, so doc 11 §5's standing claim that the app suites "skip cleanly when `DATABASE_URL` is
absent" could never actually be observed. Measured after the change: 18 files, 190 tests, all skipped,
nothing failed.

**`app/package.json` declares `engines.node` as `>=23.6.0`** — the true floor, because `npm run seed`
executes `scripts/seed.ts` directly and unflagged type stripping arrives in 23.6. One thing about that
is not obvious and is recorded rather than left to be discovered: **Root Directory is `app`, so this is
the manifest Vercel reads**, and Vercel offers only 20.x, 22.x and 24.x. Per its own documented
mapping a range like `>=20.0.0` resolves to the latest 24.x, so this pins the production build to 24.x
as a side effect. Harmless — Vercel runs only `next build`, which needs neither type stripping nor
`--env-file-if-exists` — but it is a decision the field makes, not a fact it merely states. `24.x`
was rejected as the value because it would warn on the owner's own Node 25.

**CI gates the deploy, and it is smaller than doc 11 §5 specifies:** the bank checks, `typecheck` and
the app's unit suite — the three that need no database. The integration suite and the Playwright run
stay local, because both need a seeded branch and a credential the test workflow deliberately does not
hold. Red suite, no deploy. Node is **pinned** in every workflow: `npm run seed` executes
`scripts/seed.ts` directly, which needs Node ≥23.6 for unflagged type stripping and fails as a parse
error on an older major.

**This section said "CI gates the deploy" from the day it was written, and it was not true until
2026-09-12** — there was no `.github/` directory in this repository at all. It is
`.github/workflows/ci.yml` now: one job on every push, the bank checks first, then `npm ci` and the
app's `typecheck` and unit suite. It holds **no repository secret**, which is the half that matters:
the gate cannot reach the database it gates.

**The pin is `24.x`, and that number is a consequence of the field above rather than a free choice.**
Root Directory is `app`, so `engines.node` is the manifest Vercel reads, and `>=23.6.0` resolves there
to the latest 24.x — so pinning 24.x in CI means the suites run under the major that compiles the
deploy they gate. It is **strictly above** the manifest's floor major on purpose: every version a
`24.x` pin can resolve to satisfies `>=23.6.0`, whereas a `23.x` pin could legally resolve to 23.0.0
and fall below it. `app/tests/unit/deploy-config.test.ts` asserts exactly that relationship, so the
pin and the manifest cannot drift — and it runs inside this workflow to do it.

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
PGSSLROOTCERT=system pg_dump "$DATABASE_URL_UNPOOLED" \
  --table=attempt --table=answer --table=attempt_question --table='"user"' --table=account \
  -Fc -f "lfca-$(date -u +%Y%m%d).dump"
```

Monthly, kept off Neon. Two hundred rows of attempt history is nothing to store and the only thing
here that cannot be regenerated from the repo.

**That command carried two defects until #44, and both were load-bearing rather than cosmetic**,
because doc 12 arranges for its first real use to be the operation that creates production.

**It did not name `attempt_question`.** That table arrived with the composed modes (doc 04 §5.4),
after this section was written, and it holds the frozen question set of every practice, domain and
holdout sitting — the one thing about a composed sitting that **cannot be recomposed**, because the
candidate ordering reads `max(answered_at)` and answering changes it. A restore without it produces
attempts whose `question_count` disagrees with zero rows, which breaks the assumption the navigator
rests on that a sitting's positions run 0…n-1, and renders a composed review empty. `session` and
`verification` stay out deliberately: a session is one browser, and signing in again is the
intended recovery rather than a loss.

**And it said `$DATABASE_URL`, which since #43 is the pooled host.** Neon states it directly —
*"Avoid using `pg_dump` over a pooled connection string … Use an unpooled connection string
instead"*, citing two PgBouncer issues — so the backup has to name `DATABASE_URL_UNPOOLED`, the same
host `drizzle-kit migrate` and the seed already take (§2.2). Before #43 the two were one variable and
the command was right by accident; splitting them is what made it wrong.

**Use a `pg_dump` whose major is at least the server's.** Neon serves **Postgres 18.6** here, and
`pg_dump` refuses a server newer than itself — on this machine `pg_dump` on `PATH` is Homebrew's
`postgresql@17` and aborts, while `/opt/homebrew/opt/libpq/bin/pg_dump` is 18.0 and works. A stale
client presents as a version-mismatch abort, which is loud; it is recorded here only so the next
reader does not spend the afternoon on it.

**And `PGSSLROOTCERT=system` is load-bearing, which only running the command reveals.** §2.1's
finding that Neon's chain ends at **ISRG Root X1** and needs no `sslrootcert` is a fact about
**node-postgres**, which verifies against Node's *bundled* trust store. `pg_dump` is libpq, and libpq
under `sslmode=verify-full` looks for **`~/.postgresql/root.crt`** and fails outright when it is
absent: *"root certificate file … does not exist"*. The same connection string therefore works from
the app and fails from the backup. The fix is to point libpq at the OS trust store, which already
holds that root — **not** to drop the string to `sslmode=require`, which is how this would usually
get "fixed" under time pressure, and which §2.1 exists to prevent. Measured 2026-09-12: with it, the
dump of Neon `develop` succeeded over `verify-full` with channel binding required.

**The restore has to be tested, once, before it matters** — and it is tested by being *used*. The
first production database was created on **2026-09-12** by running exactly the dump above against the
Neon `develop` branch and restoring it into the Neon `main` branch. **Order: migrate → seed →
restore**, never any other, because the user tables reference the content tables under `RESTRICT`.
The source branch was not deleted, so a bad restore cost nothing and can be looked at again.

**Restore the data in foreign-key order explicitly.** `pg_restore`'s default is the dump's own TOC
order, which is alphabetical — measured here, `account` is entry 3512 and `"user"` is 3513, so the
child would be restored before its parent, and `answer` likewise before `attempt`. The restore builds
a list with `pg_restore -l`, reorders it to `user, account, attempt, answer, attempt_question`, and
replays it with `--data-only -L`. `--data-only` is what lets a full dump be restored into a database
the migration has already given a schema.

**This section said "the owner's five first-attempt scores (exams 05, 07, 08, 10 and 14)". There were
nine, and none of them was a study sitting** — measured before the copy rather than trusted. Nine
rows carried `is_first_attempt`: exams 05, 07, 08, 09, 10, 11, 12, 13 and 14, every one created
between 2026-09-02 and 09-03 while driving features 3 and 4 through a browser. **Exams 12, 13 and 14
had zero answers**; 08, 09 and 11 had one each. Only exam-10 (52 of 60 answered, expired) resembles a
sitting at all.

So **production starts with no exam attempts.** The full fixed dump was restored — all five tables,
so the rehearsal exercised the command as documented — and then one explicit statement,
`DELETE FROM attempt WHERE mode = 'exam'`, removed the eleven development sittings, `answer` and
`attempt_question` cascading with them. What production holds is the account, and the three composed
sittings, which carry no first-attempt semantics and no score and whose answered questions are true
history that unseen-first selection can use. **All sixteen papers are still unsat**, which is the only
state in which the honest number this product exists to produce can still be produced. `develop` keeps
every row, so the record of what was done while building is not lost — it simply is not production.
See the decision log, 2026-09-12.

**Verified in SQL, not inferred from a screen**, on both branches: content 1150 / 4600 / 16 / 960 with
40 holdout marked; `user` and `account` identical to `develop`; **0** sessions copied, so signing in
to production mints a fresh one; **0** exam attempts, **0** rows carrying `is_first_attempt`, **0**
attempts carrying a score; all 100 `attempt_question` rows present with each sitting's `seq` running
0…n-1 with no gaps and `question_count` equal to its row count; **0** holdout ids among them; and
`develop` still at 14 attempts, 189 answers, 100 frozen rows and its nine first-attempt rows.

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

---

## 8. Neon tooling — the identifiers, and what an agent may do unattended

### 8.1 The identifiers, so no session rediscovers them

Read from the live account on 2026-09-12, not copied from an older note.

| | |
| --- | --- |
| Organization | `org-tiny-fire-00617341` |
| Project | `wispy-bird-80472699` — `lfca-simulator`, Postgres **18**, `aws-ap-southeast-1`, Free plan |
| Neon branch backing git `main` | `br-jolly-mode-b39c5rdo` — **named `main`**, the project's root and default branch |
| Neon branch backing local work | `br-noisy-credit-b37kait6` — **named `develop`**, child of the root |
| Endpoint for Neon `main` | `ep-weathered-base-b3vtd226` — direct `ep-weathered-base-b3vtd226.c-4.ap-southeast-1.aws.neon.tech`, pooled `ep-weathered-base-b3vtd226-pooler.c-4.…` |
| Endpoint for Neon `develop` | `ep-royal-butterfly-b37l4m4q` — direct `ep-royal-butterfly-b37l4m4q.c-4.ap-southeast-1.aws.neon.tech`, pooled `ep-royal-butterfly-b37l4m4q-pooler.c-4.…` |
| History retention | **21,600 seconds — 6 hours**, which is §5's measured figure, re-measured |

**The branches carried the names `production` and `dev` until 2026-09-12**, when they were renamed to
the git branches they serve, per `CONTEXT.md`'s rule that "which branch" should be answerable without
asking "whose branch". **The full branch ids carry a suffix** (`-b39c5rdo`, `-b37kait6`) that the
short forms in older notes drop. The API and the CLI want the full id, and the ids did not change
with the rename — which is why they are what is recorded here.

**What a rename does to the endpoint host was undocumented, so it was measured: nothing.** Both
endpoint records were captured in full before and after and compared — the hosts are identical, and
so is every other field including the endpoints' own `updated_at`, so the rename did not touch the
endpoint records at all. Only the branch rows' `updated_at` moved. The root also kept
`primary: true, default: true`. Connection strings carry the **endpoint** host, never the branch
name, so **nothing that holds a connection string needs re-pasting because of this rename** —
`app/.env.local` included. The four hosts were re-measured against `verify-full` afterwards anyway
(§2.1), because "the host is unchanged" and "it still verifies" are two claims.

**The endpoint hosts are recorded above and are not secrets.** A connection string is a secret
because it carries a role password; the host half of it is what `list_postgres_endpoints` returns
unprompted, and having it written down is what let §2.1's measurement happen without one.

The same organization holds two unrelated projects, `portfolio-v2` and `bugstack`. A rule written for
"the Neon project" therefore has to be a rule about *every* project, because the credential reaches
all three.

### 8.2 Reads are allowed; every write asks

`.claude/settings.json` gives the Neon CLI and the Neon MCP server the split the GitHub CLI has had
since 2026-08-30: listing and describing runs unattended, and anything that changes state, reveals a
secret, or executes SQL requires the owner's say-so.

Three things about how it is written are worth reading before editing it.

**The MCP rules wildcard the server segment** — `mcp__*__delete_branch`, not `mcp__Neon__delete_branch`.
The same Neon tools reach a session under two names: `mcp__Neon__…` from this repository's `.mcp.json`,
and under an opaque connector id from a claude.ai connector. A rule naming one of them guards the copy
that happens not to be in use.

**That it works was measured, not assumed** — the claim is worth nothing if the pattern is matched
segment by segment, since `*` would then be a server literally called `*`. Read out of the installed
CLI: a rule is compiled to a regular expression anchored over the **whole** tool name, its literal
parts escaped and its `*` joined with `.*`, so `mcp__*__delete_branch` becomes
`^mcp__.*__delete_branch$`. Claude Code's own documented example agrees — `mcp__*` is said to match
"every MCP tool across all servers", which it can only do by spanning the server segment.

**An `allow` rule cannot do the same, and that is a refusal rather than an omission.** The CLI rejects
a wildcard in an allow rule's *server* segment — *"An allow pattern must name the scope it widens"* —
while permitting one in its **tool** segment, so `mcp__Neon__list_*` is legal and `mcp__*__list_branches`
is discarded when settings load. A read arriving through a connector therefore prompts. **The allow
list still names every read in full rather than collapsing to `list_*` and `get_*`**, because
`get_connection_string` is itself at `ask`: a tidier `mcp__Neon__get_*` would put an allow rule and an
ask rule over the same tool, and nothing in this file should depend on which of the two wins.

**`run_sql`, `run_sql_transaction` and `neon psql` are writes**, whatever the statement says, because
nothing inspects the statement. So is **`explain_sql_statement`**: `EXPLAIN ANALYZE` executes what it
explains. And **`get_connection_string` and `neon connection-string` ask** although they change
nothing — they hand out a password, which is the one thing §2 keeps out of every file an agent reads.

**`neon auth` itself asks.** It opens a browser and waits; an agent that runs it hangs until it times
out, which is exactly what happened while this ticket was being written.

`app/tests/unit/neon-permissions.test.ts` asserts the file rather than trusting it — every destructive
command and tool resolves to a prompt under both server shapes, no allow rule reaches one, the reads
still run, and neither of the two traps above is open: no allow rule globs a server segment, and no
allowed read is also claimed by an ask rule. Every assertion was mutation-checked — removing an ask
rule, adding a broad `Bash(neon:*)` allow, adding `mcp__*__list_branches` to allow, and allowing
`get_connection_string` each turned it red.

**What this does not do, stated plainly.** A session running in bypass-permissions mode is not
prompted by any of it. These rules bind the sessions that prompt, which is every ordinary one; they
are not a substitute for the owner reading what a destructive command is about to do.

### 8.3 The two steps that are the owner's

1. **`neon auth`** — a browser flow. It was started on 2026-08-31 and abandoned, leaving
   `~/.config/neon/` empty, so every CLI command that talks to the API currently opens a browser
   instead of answering. Afterwards `neon me` returns without one, and `neon projects list` and
   `neon branches list --project-id wispy-bird-80472699` return the rows in §8.1.
2. **Watch a destructive command prompt.** In an ordinary (non-bypass) session, ask for
   `neon branches delete br-noisy-credit-b37kait6`, confirm the prompt appears, and decline it. The
   test above proves the rule matches; only a real session proves the prompt fires.
