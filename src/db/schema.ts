import { sql } from "drizzle-orm";
import { date, index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { ChannelIcon } from "@/lib/channels";
import type { Category, ThumbnailScene } from "@/lib/videos";

// Row-level security is on for every table: Supabase exposes the public schema through its
// Data API, and with no policies that API can't read or write anything. The app connects as
// the `postgres` role, which bypasses RLS.

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  handle: text("handle").notNull().unique(),
  avatarColor: text("avatar_color").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}).enableRLS();

export const channels = pgTable("channels", {
  id: uuid("id").primaryKey().defaultRandom(),
  handle: text("handle").notNull().unique(),
  name: text("name").notNull(),
  icon: text("icon").$type<ChannelIcon>().notNull(),
  /** Key into CHANNEL_ARTWORK (images ship with the app); null means icon and no banner. */
  artwork: text("artwork"),
  subscriberCount: integer("subscriber_count").notNull().default(0),
  /** The channel's published total, which can exceed the videos stored here. */
  videoCount: integer("video_count").notNull().default(0),
  tagline: text("tagline").notNull(),
  about: text("about").notNull(),
  joinedOn: date("joined_on").notNull(),
}).enableRLS();

export const videos = pgTable(
  "videos",
  {
    /** URL slug, as in /watch/drift-day. */
    id: text("id").primaryKey(),
    channelId: uuid("channel_id")
      .notNull()
      .references(() => channels.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    durationSeconds: integer("duration_seconds").notNull(),
    /** Key into THUMBNAILS (images ship with the app). */
    thumbnail: text("thumbnail").$type<ThumbnailScene>().notNull(),
    categories: text("categories")
      .array()
      .$type<Exclude<Category, "All">[]>()
      .notNull()
      .default(sql`'{}'::text[]`),
    viewCount: integer("view_count").notNull().default(0),
    likeCount: integer("like_count").notNull().default(0),
    /** The published total, which can exceed the comments stored here. */
    commentCount: integer("comment_count").notNull().default(0),
    publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("videos_channel_id_idx").on(table.channelId),
    index("videos_published_at_idx").on(table.publishedAt),
  ],
).enableRLS();

export const comments = pgTable(
  "comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    videoId: text("video_id")
      .notNull()
      .references(() => videos.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    likeCount: integer("like_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("comments_video_id_idx").on(table.videoId)],
).enableRLS();
