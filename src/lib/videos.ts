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
  views: string;
  published: string;
  duration: string;
  categories: Exclude<Category, "All">[];
  scene: ThumbnailScene;
};

export const VIDEOS: Video[] = [
  {
    id: "drift-day",
    title: "Drift day: full throttle fun",
    channel: "Turbo Time",
    channelIcon: "turbo",
    views: "248K views",
    published: "2 days ago",
    duration: "12:34",
    categories: ["Sports Cars", "Racing"],
    scene: "drift",
  },
  {
    id: "classic-style",
    title: "A classic never goes out of style",
    channel: "Classic Cruisers",
    channelIcon: "classic",
    views: "176K views",
    published: "4 days ago",
    duration: "10:21",
    categories: ["Classic Cars", "Road Trips"],
    scene: "coastal",
  },
  {
    id: "dream-garage",
    title: "Building my dream garage",
    channel: "Garage Goals",
    channelIcon: "garage",
    views: "312K views",
    published: "6 days ago",
    duration: "15:42",
    categories: ["Car Mods", "Sports Cars"],
    scene: "garage",
  },
  {
    id: "electric-road-trip",
    title: "Electric road trip adventure",
    channel: "Electric Avenue",
    channelIcon: "electric",
    views: "190K views",
    published: "1 week ago",
    duration: "11:53",
    categories: ["Electric Cars", "Road Trips"],
    scene: "electric",
  },
  {
    id: "mud-mountains",
    title: "Mud, mountains & monster tires",
    channel: "Trail Riders",
    channelIcon: "trail",
    views: "267K views",
    published: "1 week ago",
    duration: "14:27",
    categories: ["Road Trips", "Car Mods"],
    scene: "offroad",
  },
  {
    id: "final-lap",
    title: "The final lap showdown",
    channel: "Race Day",
    channelIcon: "race",
    views: "221K views",
    published: "3 days ago",
    duration: "13:18",
    categories: ["Racing", "Sports Cars"],
    scene: "finish",
  },
];

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
