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
  | "finish";

export type ChannelIcon =
  | "turbo"
  | "classic"
  | "garage"
  | "electric"
  | "trail"
  | "race";

export type Video = {
  id: string;
  title: string;
  channel: string;
  channelIcon: ChannelIcon;
  subscribers: string;
  views: string;
  published: string;
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
    channel: "Turbo Time",
    channelIcon: "turbo",
    subscribers: "128K subscribers",
    views: "248K views",
    published: "2 days ago",
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
    channel: "Classic Cruisers",
    channelIcon: "classic",
    subscribers: "94K subscribers",
    views: "176K views",
    published: "4 days ago",
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
    channel: "Garage Goals",
    channelIcon: "garage",
    subscribers: "206K subscribers",
    views: "312K views",
    published: "6 days ago",
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
    channel: "Electric Avenue",
    channelIcon: "electric",
    subscribers: "152K subscribers",
    views: "190K views",
    published: "1 week ago",
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
    channel: "Trail Riders",
    channelIcon: "trail",
    subscribers: "188K subscribers",
    views: "267K views",
    published: "1 week ago",
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
    channel: "Race Day",
    channelIcon: "race",
    subscribers: "174K subscribers",
    views: "221K views",
    published: "3 days ago",
    duration: "13:18",
    categories: ["Racing", "Sports Cars"],
    scene: "finish",
    likes: 11_000,
    description:
      "Two cars, one lap left, and a gap of 0.2 seconds. Watch the closing laps of the season finale.",
    commentCount: 402,
  },
];

export function getVideo(id: string): Video | undefined {
  return VIDEOS.find((video) => video.id === id);
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
      video.channel.toLowerCase().includes(normalized) ||
      video.categories.some((c) => c.toLowerCase().includes(normalized));

    return matchesCategory && matchesQuery;
  });
}

export function parseDuration(duration: string): number {
  return duration
    .split(":")
    .reduce((total, part) => total * 60 + Number(part), 0);
}

export function formatTime(totalSeconds: number): string {
  const seconds = Math.floor(totalSeconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = String(seconds % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

export function formatCount(count: number): string {
  if (count >= 1_000_000) {
    return `${Number((count / 1_000_000).toFixed(1))}M`;
  }
  if (count >= 1_000) {
    return `${Number((count / 1_000).toFixed(1))}K`;
  }
  return String(count);
}
