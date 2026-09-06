CREATE TABLE "attempt_question" (
	"attempt_id" uuid NOT NULL,
	"seq" smallint NOT NULL,
	"question_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "attempt_question_attempt_id_seq_pk" PRIMARY KEY("attempt_id","seq"),
	CONSTRAINT "attempt_question_seq_non_negative" CHECK ("attempt_question"."seq" >= 0)
);
--> statement-breakpoint
ALTER TABLE "attempt_question" ADD CONSTRAINT "attempt_question_attempt_id_attempt_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."attempt"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempt_question" ADD CONSTRAINT "attempt_question_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "attempt_question_attempt_question_uidx" ON "attempt_question" USING btree ("attempt_id","question_id");--> statement-breakpoint
CREATE INDEX "idx_attempt_question_question" ON "attempt_question" USING btree ("question_id");