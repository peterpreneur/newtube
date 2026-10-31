import { getChannel } from "@/lib/channels";
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
  channelHandle: string;
  viewCount: number;
  daysAgo: number;
  duration: string;
  categories: Exclude<Category, "All">[];
  scene: ThumbnailScene;
  likes: number;
  description: string;
  commentCount: number;
};

export const VIDEOS: Video[] = [
  {
    id: "drift-day",
    title: "Drift day: full throttle fun",
    channelHandle: "TurboTime",
    viewCount: 248_000,
    daysAgo: 2,
    duration: "12:34",
    categories: ["Racing", "Sports Cars"],
    scene: "drift",
    likes: 12_000,
    description:
      "Smoke, speed, and sideways action. Join us for a full-throttle day at the track!",
    commentCount: 486,
  },
  {
    id: "classic-style",
    title: "A classic never goes out of style",
    channelHandle: "ClassicCruisers",
    viewCount: 176_000,
    daysAgo: 4,
    duration: "10:21",
    categories: ["Classic Cars", "Road Trips"],
    scene: "coastal",
    likes: 8_400,
    description:
      "A restored '67 fastback, a winding coastal highway, and nowhere to be. Some things only get better with age.",
    commentCount: 312,
  },
  {
    id: "dream-garage",
    title: "Building my dream garage",
    channelHandle: "GarageGoals",
    viewCount: 312_000,
    daysAgo: 6,
    duration: "15:42",
    categories: ["Car Mods", "Sports Cars"],
    scene: "garage",
    likes: 21_000,
    description:
      "From empty concrete box to the garage of my dreams: lifts, lighting, tool storage, and one very yellow supercar.",
    commentCount: 741,
  },
  {
    id: "electric-road-trip",
    title: "Electric road trip adventure",
    channelHandle: "ElectricAvenue",
    viewCount: 190_000,
    daysAgo: 7,
    duration: "11:53",
    categories: ["Electric Cars", "Road Trips"],
    scene: "electric",
    likes: 9_800,
    description:
      "500 miles, three charging stops, and zero gas stations. Here's what a real EV road trip looks like.",
    commentCount: 268,
  },
  {
    id: "mud-mountains",
    title: "Mud, mountains & monster tires",
    channelHandle: "TrailRiders",
    viewCount: 267_000,
    daysAgo: 7,
    duration: "14:27",
    categories: ["Road Trips", "Car Mods"],
    scene: "offroad",
    likes: 15_000,
    description:
      "We aired down, locked the diffs, and took the rig up a mountain trail that did NOT want us there.",
    commentCount: 533,
  },
  {
    id: "final-lap",
    title: "The final lap showdown",
    channelHandle: "RaceDay",
    viewCount: 221_000,
    daysAgo: 3,
    duration: "13:18",
    categories: ["Racing", "Sports Cars"],
    scene: "finish",
    likes: 11_000,
    description:
      "Two cars, one lap left, and a gap of 0.2 seconds. Watch the closing laps of the season finale.",
    commentCount: 402,
  },
  {
    id: "street-build",
    title: "Our latest street build revealed",
    channelHandle: "TurboTime",
    viewCount: 182_000,
    daysAgo: 7,
    duration: "12:37",
    categories: ["Car Mods", "Sports Cars"],
    scene: "street-build",
    likes: 9_100,
    description:
      "Six months, one blue street car. Here's every part we changed, what it cost, and how it drives.",
    commentCount: 341,
  },
  {
    id: "ultimate-garage",
    title: "Inside the ultimate dream garage",
    channelHandle: "TurboTime",
    viewCount: 156_000,
    daysAgo: 14,
    duration: "11:15",
    categories: ["Car Mods"],
    scene: "ultimate-garage",
    likes: 7_800,
    description:
      "A two-post lift, a full tool wall, and a yellow supercar parked in the middle. We got the full tour.",
    commentCount: 219,
  },
  {
    id: "offroad-adventure",
    title: "Off-road adventure: mountains and mud",
    channelHandle: "TurboTime",
    viewCount: 98_000,
    daysAgo: 14,
    duration: "9:42",
    categories: ["Road Trips"],
    scene: "offroad-adventure",
    likes: 4_900,
    description:
      "We took the 4x4 into the mountains to find out how far a mostly stock truck can really go.",
    commentCount: 157,
  },
  {
    id: "race-day",
    title: "Race day: from grid to finish",
    channelHandle: "TurboTime",
    viewCount: 210_000,
    daysAgo: 21,
    duration: "13:28",
    categories: ["Racing"],
    scene: "race-day",
    likes: 10_400,
    description:
      "Onboard with the #23 car from the formation lap all the way to the checkered flag.",
    commentCount: 388,
  },
  {
    id: "diy-tune-up",
    title: "DIY tune-up: more power, less stress",
    channelHandle: "TurboTime",
    viewCount: 132_000,
    daysAgo: 21,
    duration: "8:56",
    categories: ["Car Mods"],
    scene: "diy-tune-up",
    likes: 6_600,
    description:
      "Plugs, filters, and a fresh tune: a weekend tune-up anyone can do in their own driveway.",
    commentCount: 274,
  },
];

export function getVideo(id: string): Video | undefined {
  return VIDEOS.find((video) => video.id === id);
}

export function getChannelVideos(handle: string): Video[] {
  return VIDEOS.filter((video) => video.channelHandle === handle);
}

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
      getChannel(video.channelHandle).name.toLowerCase().includes(normalized) ||
      video.categories.some((c) => c.toLowerCase().includes(normalized));

    return matchesCategory && matchesQuery;
  });
}

export function parseDuration(duration: string): number {
  return duration
    .split(":")
    .reduce((total, part) => total * 60 + Number(part), 0);
}
