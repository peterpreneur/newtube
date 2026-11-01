// Loads the mock data into Postgres: `npm run db:seed`.
// Replaces everything in users, channels, videos and comments, so it's safe to rerun.
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { channels, comments, users, videos } from "../src/db/schema.ts";
import { SEED_CHANNELS, SEED_COMMENTS, SEED_VIDEOS } from "../src/db/seed-data.ts";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Add it to .env.local (see .env.example).");
  process.exit(1);
}

const HOUR_MS = 60 * 60 * 1000;
const now = Date.now();
const ago = (hours: number) => new Date(now - hours * HOUR_MS);
// "12:34" -> 754
const toSeconds = (duration: string) =>
  duration.split(":").reduce((total, part) => total * 60 + Number(part), 0);

const client = postgres(url, { prepare: false, max: 1, max_pipeline: 1 });
const db = drizzle(client);

try {
  await db.transaction(async (tx) => {
    await tx.delete(comments);
    await tx.delete(videos);
    await tx.delete(channels);
    await tx.delete(users);

    const authors = new Map(
      Object.values(SEED_COMMENTS)
        .flat()
        .map((comment) => [comment.author, comment.avatarColor]),
    );
    const userRows = await tx
      .insert(users)
      .values([...authors].map(([handle, avatarColor]) => ({ handle, avatarColor })))
      .returning({ id: users.id, handle: users.handle });
    const userId = new Map(userRows.map((row) => [row.handle, row.id]));

    const channelRows = await tx
      .insert(channels)
      .values(
        SEED_CHANNELS.map((channel) => ({
          handle: channel.handle,
          name: channel.name,
          icon: channel.icon,
          artwork: channel.artwork ?? null,
          subscriberCount: channel.subscribers,
          videoCount: channel.videoCount,
          tagline: channel.tagline,
          about: channel.about,
          joinedOn: channel.joinedOn,
        })),
      )
      .returning({ id: channels.id, handle: channels.handle });
    const channelId = new Map(channelRows.map((row) => [row.handle, row.id]));

    await tx.insert(videos).values(
      SEED_VIDEOS.map((video) => ({
        id: video.id,
        channelId: channelId.get(video.channelHandle)!,
        title: video.title,
        description: video.description,
        durationSeconds: toSeconds(video.duration),
        thumbnail: video.scene,
        categories: video.categories,
        viewCount: video.viewCount,
        likeCount: video.likes,
        commentCount: video.commentCount,
        publishedAt: ago(video.daysAgo * 24),
      })),
    );

    await tx.insert(comments).values(
      Object.entries(SEED_COMMENTS).flatMap(([videoId, list]) =>
        list.map((comment) => ({
          videoId,
          userId: userId.get(comment.author)!,
          body: comment.text,
          likeCount: comment.likes,
          createdAt: ago(comment.hoursAgo),
        })),
      ),
    );

    console.log(
      `Seeded ${userRows.length} users, ${channelRows.length} channels, ` +
        `${SEED_VIDEOS.length} videos, ${Object.values(SEED_COMMENTS).flat().length} comments.`,
    );
  });
} catch (error) {
  const cause = error instanceof Error && error.cause instanceof Error ? error.cause : error;
  console.error("Seeding failed:", cause instanceof Error ? cause.message : cause);
  process.exitCode = 1;
} finally {
  await client.end();
}
