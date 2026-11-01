CREATE TABLE "channels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"handle" text NOT NULL,
	"name" text NOT NULL,
	"icon" text NOT NULL,
	"artwork" text,
	"subscriber_count" integer DEFAULT 0 NOT NULL,
	"video_count" integer DEFAULT 0 NOT NULL,
	"tagline" text NOT NULL,
	"about" text NOT NULL,
	"joined_on" date NOT NULL,
	CONSTRAINT "channels_handle_unique" UNIQUE("handle")
);
--> statement-breakpoint
ALTER TABLE "channels" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"video_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"body" text NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"handle" text NOT NULL,
	"avatar_color" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_handle_unique" UNIQUE("handle")
);
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "videos" (
	"id" text PRIMARY KEY NOT NULL,
	"channel_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"duration_seconds" integer NOT NULL,
	"thumbnail" text NOT NULL,
	"categories" text[] DEFAULT '{}'::text[] NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"comment_count" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "videos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "comments_video_id_idx" ON "comments" USING btree ("video_id");--> statement-breakpoint
CREATE INDEX "videos_channel_id_idx" ON "videos" USING btree ("channel_id");--> statement-breakpoint
CREATE INDEX "videos_published_at_idx" ON "videos" USING btree ("published_at");