// The simulator's own tables: the bank projected into Postgres, and the
// sittings taken against it.
//
// Two halves with different rules, and the difference is not a convention —
// it is the thing that keeps the irreplaceable data safe:
//
//   * **Content** — question, question_option, exam, exam_item. Read-only to
//     the app, rewritten wholesale by the seed, and a projection of the repo.
//     Losing all of it costs one `npm run seed`.
//   * **User data** — attempt, answer. Never touched by the seed, never deleted
//     by the app. The first-attempt scores live here and cannot be regenerated
//     from anything.
//
// The auth tables are Better Auth's and are generated, not written here.

import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { user } from './auth.ts';

/** Always UTC. A 90-minute clock that drifts on a DST boundary is a bug this rules out by type. */
const utc = (name: string) => timestamp(name, { withTimezone: true });
const createdAt = () => utc('created_at').defaultNow().notNull();

export const domainEnum = pgEnum('domain', [
  'linux',
  'sysadmin',
  'cloud',
  'security',
  'devops',
  'pm',
]);
export const poolEnum = pgEnum('pool', ['exam', 'supplement']);
export const questionTypeEnum = pgEnum('question_type', [
  'application',
  'discrimination',
  'diagnostic',
  'command',
  'recall',
]);
export const attemptModeEnum = pgEnum('attempt_mode', [
  'exam',
  'practice',
  'domain',
  'holdout',
]);
export const submitReasonEnum = pgEnum('submit_reason', ['user', 'expired']);

// ── Content ───────────────────────────────────────────────────────────────

export const question = pgTable(
  'question',
  {
    /** The bank's own id. Renaming one is a destructive act — see the answer table. */
    id: text('id').primaryKey(),
    conceptId: text('concept_id').notNull(),
    competency: text('competency').notNull(),
    domain: domainEnum('domain').notNull(),
    pool: poolEnum('pool').notNull(),
    type: questionTypeEnum('type').notNull(),
    difficulty: smallint('difficulty').notNull(),
    stem: text('stem').notNull(),
    /**
     * True for exactly the 40 ids pinned in `data/holdout.json`. The seed sets
     * it from that file and aborts unless exactly 40 rows are marked; every
     * selection query filters on it rather than trusting that this happened.
     */
    isHoldout: boolean('is_holdout').default(false).notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    check('question_difficulty_range', sql`${t.difficulty} BETWEEN 1 AND 5`),
    // The one hot query in the app that is not a primary-key lookup.
    index('idx_question_selection').on(t.domain, t.isHoldout, t.pool),
  ],
);

export const questionOption = pgTable(
  'question_option',
  {
    questionId: text('question_id')
      .notNull()
      .references(() => question.id, { onDelete: 'cascade' }),
    /** `o1`–`o4`, the bank's own reference. */
    ref: text('ref').notNull(),
    /** 0–3, the option's index in authored order. */
    position: smallint('position').notNull(),
    text: text('text').notNull(),
    correct: boolean('correct').notNull(),
    /**
     * The explanation — present on wrong options too. The review screen shows
     * all four, and the wrong-option text is the most valuable content in the
     * bank, so an empty one is a data defect rather than a cosmetic gap.
     */
    why: text('why').notNull(),
    provenanceKind: text('provenance_kind').notNull(),
    provenanceConceptId: text('provenance_concept_id'),
    createdAt: createdAt(),
  },
  (t) => [
    primaryKey({ columns: [t.questionId, t.ref] }),
    check('question_option_position_range', sql`${t.position} BETWEEN 0 AND 3`),
  ],
);

export const exam = pgTable('exam', {
  /** `exam-01` … `exam-16`. */
  id: text('id').primaryKey(),
  number: smallint('number').notNull(),
  questionCount: smallint('question_count').notNull(),
  createdAt: createdAt(),
});

export const examItem = pgTable(
  'exam_item',
  {
    examId: text('exam_id')
      .notNull()
      .references(() => exam.id, { onDelete: 'cascade' }),
    /** 0–59: the question's position on the paper. */
    seq: smallint('seq').notNull(),
    /**
     * Restrict, not cascade. A question one of the sixteen papers uses must
     * never be deletable without the deleter confronting it.
     */
    questionId: text('question_id')
      .notNull()
      .references(() => question.id, { onDelete: 'restrict' }),
    /** 0–3: where the correct option sits on the generated paper. */
    correctPosition: smallint('correct_position').notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.examId, t.seq] }),
    uniqueIndex('exam_item_exam_question_uidx').on(t.examId, t.questionId),
    index('idx_exam_item_question').on(t.questionId),
    check('exam_item_seq_range', sql`${t.seq} BETWEEN 0 AND 59`),
    check('exam_item_correct_position_range', sql`${t.correctPosition} BETWEEN 0 AND 3`),
  ],
);

// ── User data ─────────────────────────────────────────────────────────────

export const attempt = pgTable(
  'attempt',
  {
    /**
     * Assigned by Postgres, never by the app. Postgres 18 ships `uuidv7()`, so
     * the id is time-sortable — `ORDER BY id` is attempt history — and an id
     * the database mints cannot be minted twice by two racing callers.
     */
    id: uuid('id').primaryKey().default(sql`uuidv7()`),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    mode: attemptModeEnum('mode').notNull(),
    examId: text('exam_id').references(() => exam.id, { onDelete: 'restrict' }),
    domain: domainEnum('domain'),
    /** Frozen at start. A later change to the length selector never rewrites a past sitting. */
    questionCount: smallint('question_count').notNull(),
    /** The clock's only authority. Written once, never updated. */
    startedAt: utc('started_at').defaultNow().notNull(),
    /** 5400 exam, 3600 holdout, null for practice and domain — null means no expiry, ever. */
    timeLimitSeconds: integer('time_limit_seconds'),
    submittedAt: utc('submitted_at'),
    submitReason: submitReasonEnum('submit_reason'),
    score: smallint('score'),
    /**
     * Set when the attempt is **created**, never at submit. An abandoned first
     * sitting is still the first attempt, and this flag being a property of
     * being earliest is what makes that true regardless of the order sittings
     * are finalised in.
     */
    isFirstAttempt: boolean('is_first_attempt').default(false).notNull(),
    createdAt: createdAt(),
    updatedAt: utc('updated_at').defaultNow().notNull(),
  },
  (t) => [
    // These are the schema, not decoration: they make the nullable columns
    // honest rather than conventional.
    check('attempt_exam_iff_exam_mode', sql`(${t.mode} = 'exam') = (${t.examId} IS NOT NULL)`),
    check('attempt_domain_iff_domain_mode', sql`(${t.mode} = 'domain') = (${t.domain} IS NOT NULL)`),
    check(
      'attempt_limit_iff_timed_mode',
      sql`(${t.mode} IN ('exam','holdout')) = (${t.timeLimitSeconds} IS NOT NULL)`,
    ),
    check(
      'attempt_reason_iff_submitted',
      sql`(${t.submittedAt} IS NULL) = (${t.submitReason} IS NULL)`,
    ),
    check('attempt_score_only_when_scored', sql`${t.score} IS NULL OR ${t.mode} IN ('exam','holdout')`),
    check(
      'attempt_score_within_length',
      sql`${t.score} IS NULL OR ${t.score} BETWEEN 0 AND ${t.questionCount}`,
    ),
    index('idx_attempt_user_exam').on(t.userId, t.examId, t.submittedAt.desc()),
    index('idx_attempt_open').on(t.userId, t.submittedAt).where(sql`${t.submittedAt} IS NULL`),
    /**
     * The one index that protects a number that cannot be recovered. Two
     * simultaneous starts both read "no earlier attempt exists" as true; this
     * makes the second a database error rather than a second honest score.
     */
    uniqueIndex('one_first_attempt_per_exam')
      .on(t.userId, t.examId)
      .where(sql`${t.isFirstAttempt}`),
  ],
);

export const answer = pgTable(
  'answer',
  {
    attemptId: uuid('attempt_id')
      .notNull()
      .references(() => attempt.id, { onDelete: 'cascade' }),
    /**
     * Restrict. This is the constraint that turns renaming a bank id into a
     * loud failure instead of orphaned history.
     */
    questionId: text('question_id')
      .notNull()
      .references(() => question.id, { onDelete: 'restrict' }),
    /** Null means seen-and-flagged but never answered. */
    optionRef: text('option_ref'),
    /**
     * Denormalised on write. Stored rather than joined so that a future
     * correction to the bank cannot silently rewrite a past score — the sitting
     * records what was true when it was sat.
     */
    isCorrect: boolean('is_correct'),
    flagged: boolean('flagged').default(false).notNull(),
    /** Set on the first non-null answer; never advanced by a later change. This is what least-recently-seen reads. */
    answeredAt: utc('answered_at'),
    createdAt: createdAt(),
    updatedAt: utc('updated_at').defaultNow().notNull(),
  },
  (t) => [
    // This composite key *is* the upsert key the answer endpoint writes
    // through. A second answer to the same question in the same sitting is not
    // a thing that exists.
    primaryKey({ columns: [t.attemptId, t.questionId] }),
    check(
      'answer_correctness_iff_answered',
      sql`(${t.optionRef} IS NULL) = (${t.isCorrect} IS NULL)`,
    ),
    index('idx_answer_seen').on(t.questionId, t.answeredAt.desc()),
  ],
);
