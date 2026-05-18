CREATE TABLE "admin_permissions" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"perms" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"discord_username" text,
	"whatsapp" text,
	"status" text DEFAULT 'active' NOT NULL,
	"billing" jsonb,
	"discord_user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "customers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "mentors" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"specialties" jsonb,
	"bio" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"code" text NOT NULL,
	"price_cents" integer NOT NULL,
	"currency" text DEFAULT 'EUR' NOT NULL,
	"features" jsonb,
	"release_strategy" jsonb,
	CONSTRAINT "uq_plans_product_code" UNIQUE("product_id","code")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" text NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "entitlements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_uid" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"source_order_id" uuid,
	"granted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "giftcards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"initial_cents" integer NOT NULL,
	"balance_cents" integer NOT NULL,
	"buyer_uid" uuid,
	"recipient_email" text,
	"status" text DEFAULT 'active',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "giftcards_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"number" text NOT NULL,
	"pdf_url" text,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "invoices_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"price_cents" integer NOT NULL,
	"is_upgrade" boolean DEFAULT false,
	"upgrade_from_plan_id" uuid
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_uid" uuid NOT NULL,
	"total_cents" integer NOT NULL,
	"currency" text DEFAULT 'EUR' NOT NULL,
	"status" text NOT NULL,
	"provider" text NOT NULL,
	"provider_ref" text,
	"giftcard_applied_cents" integer DEFAULT 0,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_modules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"order_index" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "course_resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"week_id" uuid NOT NULL,
	"title" text NOT NULL,
	"type" text NOT NULL,
	"url" text,
	"duration" integer,
	"metadata" jsonb,
	"order_index" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_weeks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"order_index" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"slug" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "courses_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_uid" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"enrolled_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "module_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_uid" uuid NOT NULL,
	"resource_id" uuid NOT NULL,
	"completed" boolean DEFAULT false,
	"progress_pct" integer DEFAULT 0,
	"quiz_score" integer,
	"completed_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "availability" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mentor_uid" uuid NOT NULL,
	"day_of_week" text NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_uid" uuid NOT NULL,
	"mentor_uid" uuid NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"scheduled_at" timestamp with time zone NOT NULL,
	"notes" text,
	"meeting_url" text,
	"customer_proposal" timestamp with time zone,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ticket_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticket_id" uuid NOT NULL,
	"author_uid" uuid NOT NULL,
	"body" text NOT NULL,
	"attachments" jsonb,
	"is_internal" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_uid" uuid NOT NULL,
	"category" text NOT NULL,
	"subject" text NOT NULL,
	"status" text DEFAULT 'offen' NOT NULL,
	"assignee_uid" uuid,
	"last_message_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "affiliate_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_uid" uuid NOT NULL,
	"code" text NOT NULL,
	"commission_rate" numeric(5, 4) DEFAULT '0.1500',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "affiliate_links_customer_uid_unique" UNIQUE("customer_uid"),
	CONSTRAINT "affiliate_links_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "affiliate_referrals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"link_id" uuid NOT NULL,
	"referred_customer_uid" uuid,
	"order_id" uuid,
	"amount_cents" integer,
	"status" text DEFAULT 'pending',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"affiliate_uid" uuid NOT NULL,
	"amount_cents" integer NOT NULL,
	"status" text DEFAULT 'pending',
	"paid_at" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipient_uid" uuid NOT NULL,
	"event" text NOT NULL,
	"title" text NOT NULL,
	"body" text,
	"link" text,
	"read_at" timestamp with time zone,
	"channels" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_uid" uuid NOT NULL,
	"category" text NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"media_urls" jsonb,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"video_url" text NOT NULL,
	"thumbnail_url" text,
	"category" text,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kundenerfolge" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_uid" uuid,
	"title" text NOT NULL,
	"description" text,
	"media_type" text NOT NULL,
	"media_url" text NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "certificates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_uid" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"issued_by_uid" uuid NOT NULL,
	"pdf_url" text,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_uid" uuid NOT NULL,
	"author_uid" uuid NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "analytics_events" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"customer_uid" uuid,
	"name" text NOT NULL,
	"props" jsonb,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"actor_uid" uuid,
	"action" text NOT NULL,
	"target_type" text,
	"target_id" text,
	"before" jsonb,
	"after" jsonb,
	"ip" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consent_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_uid" uuid NOT NULL,
	"consent_type" text NOT NULL,
	"granted" boolean NOT NULL,
	"ip" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admin_permissions" ADD CONSTRAINT "admin_permissions_uid_customers_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."customers"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentors" ADD CONSTRAINT "mentors_uid_customers_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."customers"("uid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plans" ADD CONSTRAINT "plans_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entitlements" ADD CONSTRAINT "entitlements_customer_uid_customers_uid_fk" FOREIGN KEY ("customer_uid") REFERENCES "public"."customers"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entitlements" ADD CONSTRAINT "entitlements_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entitlements" ADD CONSTRAINT "entitlements_source_order_id_orders_id_fk" FOREIGN KEY ("source_order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "giftcards" ADD CONSTRAINT "giftcards_buyer_uid_customers_uid_fk" FOREIGN KEY ("buyer_uid") REFERENCES "public"."customers"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_upgrade_from_plan_id_plans_id_fk" FOREIGN KEY ("upgrade_from_plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_uid_customers_uid_fk" FOREIGN KEY ("customer_uid") REFERENCES "public"."customers"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_modules" ADD CONSTRAINT "course_modules_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_resources" ADD CONSTRAINT "course_resources_week_id_course_weeks_id_fk" FOREIGN KEY ("week_id") REFERENCES "public"."course_weeks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_weeks" ADD CONSTRAINT "course_weeks_module_id_course_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."course_modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_customer_uid_customers_uid_fk" FOREIGN KEY ("customer_uid") REFERENCES "public"."customers"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "module_progress" ADD CONSTRAINT "module_progress_customer_uid_customers_uid_fk" FOREIGN KEY ("customer_uid") REFERENCES "public"."customers"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "module_progress" ADD CONSTRAINT "module_progress_resource_id_course_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."course_resources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "availability" ADD CONSTRAINT "availability_mentor_uid_customers_uid_fk" FOREIGN KEY ("mentor_uid") REFERENCES "public"."customers"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_customer_uid_customers_uid_fk" FOREIGN KEY ("customer_uid") REFERENCES "public"."customers"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_mentor_uid_customers_uid_fk" FOREIGN KEY ("mentor_uid") REFERENCES "public"."customers"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_messages" ADD CONSTRAINT "ticket_messages_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_messages" ADD CONSTRAINT "ticket_messages_author_uid_customers_uid_fk" FOREIGN KEY ("author_uid") REFERENCES "public"."customers"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_customer_uid_customers_uid_fk" FOREIGN KEY ("customer_uid") REFERENCES "public"."customers"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_assignee_uid_customers_uid_fk" FOREIGN KEY ("assignee_uid") REFERENCES "public"."customers"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affiliate_links" ADD CONSTRAINT "affiliate_links_customer_uid_customers_uid_fk" FOREIGN KEY ("customer_uid") REFERENCES "public"."customers"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affiliate_referrals" ADD CONSTRAINT "affiliate_referrals_link_id_affiliate_links_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."affiliate_links"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affiliate_referrals" ADD CONSTRAINT "affiliate_referrals_referred_customer_uid_customers_uid_fk" FOREIGN KEY ("referred_customer_uid") REFERENCES "public"."customers"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affiliate_referrals" ADD CONSTRAINT "affiliate_referrals_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_affiliate_uid_customers_uid_fk" FOREIGN KEY ("affiliate_uid") REFERENCES "public"."customers"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_uid_customers_uid_fk" FOREIGN KEY ("recipient_uid") REFERENCES "public"."customers"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_author_uid_customers_uid_fk" FOREIGN KEY ("author_uid") REFERENCES "public"."customers"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kundenerfolge" ADD CONSTRAINT "kundenerfolge_customer_uid_customers_uid_fk" FOREIGN KEY ("customer_uid") REFERENCES "public"."customers"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_customer_uid_customers_uid_fk" FOREIGN KEY ("customer_uid") REFERENCES "public"."customers"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_issued_by_uid_customers_uid_fk" FOREIGN KEY ("issued_by_uid") REFERENCES "public"."customers"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_notes" ADD CONSTRAINT "admin_notes_customer_uid_customers_uid_fk" FOREIGN KEY ("customer_uid") REFERENCES "public"."customers"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_notes" ADD CONSTRAINT "admin_notes_author_uid_customers_uid_fk" FOREIGN KEY ("author_uid") REFERENCES "public"."customers"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_customer_uid_customers_uid_fk" FOREIGN KEY ("customer_uid") REFERENCES "public"."customers"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_uid_customers_uid_fk" FOREIGN KEY ("actor_uid") REFERENCES "public"."customers"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consent_log" ADD CONSTRAINT "consent_log_customer_uid_customers_uid_fk" FOREIGN KEY ("customer_uid") REFERENCES "public"."customers"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uq_active_entitlement" ON "entitlements" USING btree ("customer_uid","plan_id") WHERE revoked_at IS NULL;--> statement-breakpoint
CREATE INDEX "idx_entitlements_customer" ON "entitlements" USING btree ("customer_uid");--> statement-breakpoint
CREATE INDEX "idx_orders_customer_created" ON "orders" USING btree ("customer_uid","created_at");--> statement-breakpoint
CREATE INDEX "idx_orders_status" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_sessions_customer_scheduled" ON "sessions" USING btree ("customer_uid","scheduled_at");--> statement-breakpoint
CREATE INDEX "idx_tickets_customer_status" ON "tickets" USING btree ("customer_uid","status");--> statement-breakpoint
CREATE INDEX "idx_notifications_recipient_read" ON "notifications" USING btree ("recipient_uid","read_at");--> statement-breakpoint
CREATE INDEX "idx_audit_target" ON "audit_log" USING btree ("target_type","target_id","created_at");