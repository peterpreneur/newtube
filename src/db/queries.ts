import "server-only";
import { asc, desc, eq, ne } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { channels, comments, users, videos } from "@/db/schema";
import { CHANNEL_ARTWORK, type Channel } from "@/lib/channels";
import type { Comment } from "@/lib/comments";
import { formatTime } from "@/lib/format";
import type { Video } from "@/lib/videos";

// Reads are cached (and become part of each page's static shell). Content changes only when
// the database is reseeded, so an hourly refresh is plenty; it also keeps "2 days ago" current.
// Call revalidateTag("content") after writing to show changes immediately.
const CONTENT_TAG = "content";

const HOUR_MS = 60 * 60 * 1000;

type ChannelRow = typeof channels.$inferSelect;
type VideoRow = typeof videos.$inferSelect;

function toChannel(row: ChannelRow): Channel {
  const artwork = row.artwork ? CHANNEL_ARTWORK[row.artwork] : undefined;
  return {
    handle: row.handle,
    name: row.name,
    icon: row.icon,
    subscribers: row.subscriberCount,
    videoCount: row.videoCount,
    tagline: row.tagline,
    about: row.about,
    joined: new Date(`${row.joinedOn}T00:00:00Z`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }),
    avatar: artwork?.avatar,
    banner: artwork?.banner,
  };
}

function toVideo(row: VideoRow, channel: ChannelRow, now: number): Video {
  return {
    id: row.id,
    title: row.title,
    channel: toChannel(channel),
    viewCount: row.viewCount,
    daysAgo: Math.floor((now - row.publishedAt.getTime()) / (24 * HOUR_MS)),
    duration: formatTime(row.durationSeconds),
    categories: row.categories,
    scene: row.thumbnail,
    likes: row.likeCount,
    description: row.description,
    commentCount: row.commentCount,
  };
}

const NEWEST_FIRST = [desc(videos.publishedAt), desc(videos.viewCount)];

/** Every video, newest first. */
export async function getVideos(): Promise<Video[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAG);

  const now = Date.now();
  const rows = await db
    .select()
    .from(videos)
    .innerJoin(channels, eq(videos.channelId, channels.id))
    .orderBy(...NEWEST_FIRST);
  return rows.map((row) => toVideo(row.videos, row.channels, now));
}

export async function getVideo(id: string): Promise<Video | undefined> {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAG);

  const [row] = await db
    .select()
    .from(videos)
    .innerJoin(channels, eq(videos.channelId, channels.id))
    .where(eq(videos.id, id))
    .limit(1);
  return row ? toVideo(row.videos, row.channels, Date.now()) : undefined;
}

/** Up next on the watch page: everything else, newest first. */
export async function getRelatedVideos(id: string): Promise<Video[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAG);

  const now = Date.now();
  const rows = await db
    .select()
    .from(videos)
    .innerJoin(channels, eq(videos.channelId, channels.id))
    .where(ne(videos.id, id))
    .orderBy(...NEWEST_FIRST);
  return rows.map((row) => toVideo(row.videos, row.channels, now));
}

export async function getVideoIds(): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAG);

  const rows = await db.select({ id: videos.id }).from(videos);
  return rows.map((row) => row.id);
}

export async function getChannelHandles(): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAG);

  const rows = await db.select({ handle: channels.handle }).from(channels);
  return rows.map((row) => row.handle);
}

export async function getChannel(handle: string): Promise<Channel | undefined> {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAG);

  const [row] = await db.select().from(channels).where(eq(channels.handle, handle)).limit(1);
  return row ? toChannel(row) : undefined;
}

export async function getChannelVideos(handle: string): Promise<Video[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAG);

  const now = Date.now();
  const rows = await db
    .select()
    .from(videos)
    .innerJoin(channels, eq(videos.channelId, channels.id))
    .where(eq(channels.handle, handle))
    .orderBy(...NEWEST_FIRST);
  return rows.map((row) => toVideo(row.videos, row.channels, now));
}

/** A video's comments, most liked first (the "Top" sort). */
export async function getComments(videoId: string): Promise<Comment[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAG);

  const now = Date.now();
  const rows = await db
    .select({
      id: comments.id,
      author: users.handle,
      avatarColor: users.avatarColor,
      createdAt: comments.createdAt,
      text: comments.body,
      likes: comments.likeCount,
    })
    .from(comments)
    .innerJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.videoId, videoId))
    .orderBy(desc(comments.likeCount), asc(comments.createdAt));
  return rows.map(({ createdAt, ...comment }) => ({
    ...comment,
    hoursAgo: Math.floor((now - createdAt.getTime()) / HOUR_MS),
  }));
}
