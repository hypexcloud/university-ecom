CREATE TABLE "availability_exceptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mentor_uid" uuid NOT NULL,
	"date" text NOT NULL,
	"type" text NOT NULL,
	"start_time" text,
	"end_time" text,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "availability_exceptions" ADD CONSTRAINT "availability_exceptions_mentor_uid_customers_uid_fk" FOREIGN KEY ("mentor_uid") REFERENCES "public"."customers"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_avail_exceptions_mentor_date" ON "availability_exceptions" USING btree ("mentor_uid","date");