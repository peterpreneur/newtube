import type { Channel } from "@/lib/channels";
import { formatAge, formatViews } from "@/lib/format";

export const CATEGORIES = [
  "All",
  "Sports Cars",
  "Classic Cars",
  "Racing",
  "Car Mods",
  "Electric Cars",
  "Road Trips",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type ThumbnailScene =
  | "drift"
  | "coastal"
  | "garage"
  | "electric"
  | "offroad"
  | "finish"
  | "street-build"
  | "ultimate-garage"
  | "offroad-adventure"
  | "race-day"
  | "diy-tune-up";

export type Video = {
  id: string;
  title: string;
  channel: Channel;
  viewCount: number;
  daysAgo: number;
  duration: string;
  categories: Exclude<Category, "All">[];
  scene: ThumbnailScene;
  likes: number;
  description: string;
  commentCount: number;
};

/** "248K views · 2 days ago" */
export function videoMeta(video: Video): string {
  return `${formatViews(video.viewCount)} · ${formatAge(video.daysAgo * 24)}`;
}

export function filterVideos(
  videos: Video[],
  category: Category,
  query: string,
): Video[] {
  const normalized = query.trim().toLowerCase();

  return videos.filter((video) => {
    const matchesCategory =
      category === "All" || video.categories.includes(category);
    const matchesQuery =
      normalized.length === 0 ||
      video.title.toLowerCase().includes(normalized) ||
      video.channel.name.toLowerCase().includes(normalized) ||
      video.categories.some((c) => c.toLowerCase().includes(normalized));

    return matchesCategory && matchesQuery;
  });
}

export function parseDuration(duration: string): number {
  return duration
    .split(":")
    .reduce((total, part) => total * 60 + Number(part), 0);
}
