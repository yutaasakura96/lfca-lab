# CONTEXT

Shared vocabulary for the LFCA exam simulator. The words below were settled during planning and are
used with these exact meanings in `docs/`, in commit messages, in code, and in conversation. Where a
word has a loose everyday sense and a precise sense here, the precise one wins.

Product: [docs/02-product-requirements.md](docs/02-product-requirements.md) ·
Architecture: [docs/03-technical-design.md](docs/03-technical-design.md) ·
Schema: [docs/04-database-schema.md](docs/04-database-schema.md) ·
Status: [docs/00-status.md](docs/00-status.md)

---

## The two halves

**The bank** — the question content in this repo: `questions/**/*.json`, `exams/index.json`,
`data/`, and the tooling that validates and builds it. Built first, stable, and **source of truth**.

**The simulator** — the Next.js app in `app/`. It **reads** the bank and never writes it. If you
find yourself adding a screen that edits a question, you have crossed the line the project is
organised around.

The join between them is **the seed**: `npm run seed` projects the bank into Postgres content tables.
Content tables are read-only to the app; user tables are never touched by the seed.

---

## Words about content

| Term | Means |
| --- | --- |
| **Item** / **question** | One question. Identified by its bank id (`q.linux.command-line.awk.03`), which is also its primary key. Renaming an id is destructive — see doc 03 §3. |
| **Option** | One of a question's four choices. Always four. Exactly one is correct. |
| **`why` text** | The per-option explanation. **Every** option has one, including wrong ones — the wrong-option text is the most valuable content in the bank, and any screen that shows only the correct answer's explanation is wrong. |
| **Provenance** | How a distractor was constructed: `key`, `sibling`, `misconception`, `variant`, `confusable`. Authored, seeded, not yet shown in the UI. |
| **Pool** | `exam` (1,000 items) or `supplement` (150). Only the exam pool composes exams, practice and domain sessions. |
| **Domain** | One of six, always by slug: `linux`, `sysadmin`, `cloud`, `security`, `devops`, `pm`. Never "category", never "section". |
| **Competency** | The finer grouping inside a domain (`Linux Fundamentals :: Command Line`). 22 of them. Not a level anything is selected by. |
| **Concept** | A `concept_id` from `data/topics/`. The study guide's unit. The simulator carries it but does not select by it. |
| **Paper** / **exam** | One of the sixteen fixed sets of 60, `exam-01`…`exam-16`. Fixed composition, fixed order. Never generated on the fly. |
| **The holdout** | The **40 exam-pool items pinned by id in `data/holdout.json`.** A committed decision, never served in practice or domain mode, sat exactly once. It is the project's only defence against its riskiest assumption. Treat any change near it as a change to the project's thesis. |
| **`unused`** | The `unused` key in `exams/index.json` — **the items the sixteen papers happened not to use**, recomputed by every `npm run build-exams`. A residue, not a decision. It is equal to the holdout today and `npm run validate` fails if it ever stops being; **the two words are never interchangeable**, because the whole point of pinning is that a residue can drift and a commitment cannot. |

## Words about sitting

| Term | Means |
| --- | --- |
| **Attempt** | One sitting, in any mode — the database row and the thing the URL points at. Exam, practice, domain and holdout are all attempts. Prefer "attempt" in code, "sitting" in prose. |
| **Mode** | `exam` \| `practice` \| `domain` \| `holdout`. The whole product is these four ways of answering the same questions. |
| **Best score** | The highest score across attempts at an exam. Drifts to 100% by construction once re-sits are allowed. |
| **First-attempt score** | The score of the **earliest** attempt at an exam. Never overwritten, never dodgeable by abandoning — the flag is set when the attempt is *created*. The honest number, and the one thing here that cannot be regenerated. |
| **Unseen-first** | The selection ordering: questions never answered before questions answered, then least-recently-seen. It is **ordering only**. It is explicitly **not** adaptive or spaced-repetition selection, which is ruled out for v1. If a proposal starts using past performance to decide *what* to serve, it is out of scope. |
| **The derived clock** | Remaining time is always computed from `started_at`, on the server. It is never stored as a countdown and never extended. The browser counts down to a server-issued deadline for display only. |
| **Auto-submit** | What happens to an expired attempt — finalised **lazily**, on the next read. There is no cron in this system. |
| **The outbox** | The in-memory queue of failed answer writes, retried with backoff behind an idempotent upsert. Deliberately not persisted. |
| **The chip** | The "Not saved — retrying" indicator. Non-dismissible, never blocks answering, never pauses the clock. |

---

## Standing constraints

These came out of Phase 1 and Phase 4 and are settled. Reopening one needs a decision-log entry, not
a conversation in a pull request.

- **The app never writes question content.** No authoring screen, no admin role, no code path.
- **No adaptive selection in v1.** Unseen-first ordering is the whole of it.
- **The study guide stays outside the app.** 32 markdown files, read on GitHub.
- **The holdout is pinned by identity**, filtered in three independent places, and never served early.
- **First-attempt scoring cannot be dodged.** There is no "discard this attempt" action anywhere.
- **Postgres and Google sign-in from day one.** Both were challenged and upheld; do not re-propose
  SQLite or deferring auth.
- **`design/tokens.css` is the source of truth for every visual value** and is copied into the app
  verbatim. No new colours, no off-scale spacing, no second font, no gradients, no emoji in UI.
- **The design system has no animated primitive.** Loading states are a disabled button and a changed
  label. Do not introduce a spinner without deciding to.

---

## Conventions

- **Database:** snake_case columns, singular table names, `timestamptz` always UTC, bank ids as
  content primary keys, UUIDv7 for user data.
- **Code:** `app/src/domain/` is pure — no I/O, no React, no `Date.now()` (time is a parameter).
  Anything that decides a number lives there and is unit-tested. Everything else gets one end-to-end
  test and a manual checklist.
- **Reads are server components; writes are route handlers.** No client data-fetching library.
- **Errors:** one response shape, a stable `snake_case` `code`, and 404 (never 403) for another
  user's attempt.
- **Git:** subject line only, `<type>: <short imperative>`.
