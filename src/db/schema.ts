import { sql } from "drizzle-orm";
import { boolean, date, index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { ChannelIcon } from "@/lib/channels";
import type { Category, ThumbnailScene } from "@/lib/videos";

// Row-level security is on for every table: Supabase exposes the public schema through its
// Data API, and with no policies that API can't read or write anything. The app connects as
// the `postgres` role, which bypasses RLS.

// users, sessions, accounts and verifications are Better Auth's tables (see lib/auth.ts); the
// property names are the ones it expects. Comment authors are users without a password.

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** Display name, shown on comments. */
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  avatarColor: text("avatar_color").notNull().default("#2563eb"),
  /** Set only by `npm run admin:create`; sign-up can't touch it. */
  isAdmin: boolean("is_admin").notNull().default(false),
  ...timestamps,
}).enableRLS();

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    ...timestamps,
  },
  (table) => [index("sessions_user_id_idx").on(table.userId)],
).enableRLS();

/** Sign-in methods; email-and-password logins are providerId "credential" with a password hash. */
export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    password: text("password"),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    ...timestamps,
  },
  (table) => [index("accounts_user_id_idx").on(table.userId)],
).enableRLS();

export const verifications = pgTable(
  "verifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (table) => [index("verifications_identifier_idx").on(table.identifier)],
).enableRLS();

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
