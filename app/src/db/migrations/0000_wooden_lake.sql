CREATE TYPE "public"."attempt_mode" AS ENUM('exam', 'practice', 'domain', 'holdout');--> statement-breakpoint
CREATE TYPE "public"."domain" AS ENUM('linux', 'sysadmin', 'cloud', 'security', 'devops', 'pm');--> statement-breakpoint
CREATE TYPE "public"."pool" AS ENUM('exam', 'supplement');--> statement-breakpoint
CREATE TYPE "public"."question_type" AS ENUM('application', 'discrimination', 'diagnostic', 'command', 'recall');--> statement-breakpoint
CREATE TYPE "public"."submit_reason" AS ENUM('user', 'expired');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"issuer" text NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"allowlisted" boolean DEFAULT false NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "answer" (
	"attempt_id" uuid NOT NULL,
	"question_id" text NOT NULL,
	"option_ref" text,
	"is_correct" boolean,
	"flagged" boolean DEFAULT false NOT NULL,
	"answered_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "answer_attempt_id_question_id_pk" PRIMARY KEY("attempt_id","question_id"),
	CONSTRAINT "answer_correctness_iff_answered" CHECK (("answer"."option_ref" IS NULL) = ("answer"."is_correct" IS NULL))
);
--> statement-breakpoint
CREATE TABLE "attempt" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" text NOT NULL,
	"mode" "attempt_mode" NOT NULL,
	"exam_id" text,
	"domain" "domain",
	"question_count" smallint NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"time_limit_seconds" integer,
	"submitted_at" timestamp with time zone,
	"submit_reason" "submit_reason",
	"score" smallint,
	"is_first_attempt" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "attempt_exam_iff_exam_mode" CHECK (("attempt"."mode" = 'exam') = ("attempt"."exam_id" IS NOT NULL)),
	CONSTRAINT "attempt_domain_iff_domain_mode" CHECK (("attempt"."mode" = 'domain') = ("attempt"."domain" IS NOT NULL)),
	CONSTRAINT "attempt_limit_iff_timed_mode" CHECK (("attempt"."mode" IN ('exam','holdout')) = ("attempt"."time_limit_seconds" IS NOT NULL)),
	CONSTRAINT "attempt_reason_iff_submitted" CHECK (("attempt"."submitted_at" IS NULL) = ("attempt"."submit_reason" IS NULL)),
	CONSTRAINT "attempt_score_only_when_scored" CHECK ("attempt"."score" IS NULL OR "attempt"."mode" IN ('exam','holdout')),
	CONSTRAINT "attempt_score_within_length" CHECK ("attempt"."score" IS NULL OR "attempt"."score" BETWEEN 0 AND "attempt"."question_count")
);
--> statement-breakpoint
CREATE TABLE "exam" (
	"id" text PRIMARY KEY NOT NULL,
	"number" smallint NOT NULL,
	"question_count" smallint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exam_item" (
	"exam_id" text NOT NULL,
	"seq" smallint NOT NULL,
	"question_id" text NOT NULL,
	"correct_position" smallint NOT NULL,
	CONSTRAINT "exam_item_exam_id_seq_pk" PRIMARY KEY("exam_id","seq"),
	CONSTRAINT "exam_item_seq_range" CHECK ("exam_item"."seq" BETWEEN 0 AND 59),
	CONSTRAINT "exam_item_correct_position_range" CHECK ("exam_item"."correct_position" BETWEEN 0 AND 3)
);
--> statement-breakpoint
CREATE TABLE "question" (
	"id" text PRIMARY KEY NOT NULL,
	"concept_id" text NOT NULL,
	"competency" text NOT NULL,
	"domain" "domain" NOT NULL,
	"pool" "pool" NOT NULL,
	"type" "question_type" NOT NULL,
	"difficulty" smallint NOT NULL,
	"stem" text NOT NULL,
	"is_holdout" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "question_difficulty_range" CHECK ("question"."difficulty" BETWEEN 1 AND 5)
);
--> statement-breakpoint
CREATE TABLE "question_option" (
	"question_id" text NOT NULL,
	"ref" text NOT NULL,
	"position" smallint NOT NULL,
	"text" text NOT NULL,
	"correct" boolean NOT NULL,
	"why" text NOT NULL,
	"provenance_kind" text NOT NULL,
	"provenance_concept_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "question_option_question_id_ref_pk" PRIMARY KEY("question_id","ref"),
	CONSTRAINT "question_option_position_range" CHECK ("question_option"."position" BETWEEN 0 AND 3)
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answer" ADD CONSTRAINT "answer_attempt_id_attempt_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."attempt"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answer" ADD CONSTRAINT "answer_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempt" ADD CONSTRAINT "attempt_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempt" ADD CONSTRAINT "attempt_exam_id_exam_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exam"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_item" ADD CONSTRAINT "exam_item_exam_id_exam_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exam"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_item" ADD CONSTRAINT "exam_item_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_option" ADD CONSTRAINT "question_option_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "account_issuer_accountId_uidx" ON "account" USING btree ("issuer","account_id");--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "idx_answer_seen" ON "answer" USING btree ("question_id","answered_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_attempt_user_exam" ON "attempt" USING btree ("user_id","exam_id","submitted_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_attempt_open" ON "attempt" USING btree ("user_id","submitted_at") WHERE "attempt"."submitted_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "one_first_attempt_per_exam" ON "attempt" USING btree ("user_id","exam_id") WHERE "attempt"."is_first_attempt";--> statement-breakpoint
CREATE UNIQUE INDEX "exam_item_exam_question_uidx" ON "exam_item" USING btree ("exam_id","question_id");--> statement-breakpoint
CREATE INDEX "idx_exam_item_question" ON "exam_item" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "idx_question_selection" ON "question" USING btree ("domain","is_holdout","pool");