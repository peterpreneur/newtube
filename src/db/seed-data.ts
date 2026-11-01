// The original mock data, loaded into Postgres by `npm run db:seed`. The site reads from the database.
import type { ChannelIcon } from "@/lib/channels";
import type { Category, ThumbnailScene } from "@/lib/videos";

type SeedChannel = {
  handle: string;
  name: string;
  icon: ChannelIcon;
  subscribers: number;
  videoCount: number;
  tagline: string;
  about: string;
  joinedOn: string;
  /** Key into CHANNEL_ARTWORK for channels with a photo avatar and banner. */
  artwork?: string;
};

type SeedVideo = {
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

/** Comment authors become rows in `users`, matched by handle. */
type SeedComment = {
  author: string;
  avatarColor: string;
  hoursAgo: number;
  text: string;
  likes: number;
};

export const SEED_CHANNELS: SeedChannel[] = [
  {
    handle: "TurboTime",
    name: "Turbo Time",
    icon: "turbo",
    subscribers: 128_000,
    videoCount: 86,
    tagline: "Drift days, dream builds, and everything automotive.",
    about:
      "Turbo Time is a car channel for people who like their weekends loud. We film drift days, build street cars in our own garage, and take them anywhere there's a road (and a few places there isn't). New videos every week.",
    joinedOn: "2019-03-14",
    artwork: "turbo-time",
  },
  {
    handle: "ClassicCruisers",
    name: "Classic Cruisers",
    icon: "classic",
    subscribers: 94_000,
    videoCount: 41,
    tagline: "Timeless cars, scenic roads, and the stories behind them.",
    about:
      "Restorations, road trips, and the people who keep classic cars on the road.",
    joinedOn: "2018-06-02",
  },
  {
    handle: "GarageGoals",
    name: "Garage Goals",
    icon: "garage",
    subscribers: 206_000,
    videoCount: 112,
    tagline: "Garage builds, tool tours, and workshop upgrades.",
    about:
      "Building the garage of our dreams one upgrade at a time, plus tours of the best workshops we can find.",
    joinedOn: "2020-01-21",
  },
  {
    handle: "ElectricAvenue",
    name: "Electric Avenue",
    icon: "electric",
    subscribers: 152_000,
    videoCount: 58,
    tagline: "Real-world EV road trips, reviews, and charging tips.",
    about:
      "Long-distance EV trips, honest reviews, and practical charging advice from real owners.",
    joinedOn: "2021-09-09",
  },
  {
    handle: "TrailRiders",
    name: "Trail Riders",
    icon: "trail",
    subscribers: 188_000,
    videoCount: 73,
    tagline: "Off-road trails, overlanding builds, and muddy adventures.",
    about:
      "If there's mud, rocks, or a mountain pass involved, we're probably filming it.",
    joinedOn: "2019-04-30",
  },
  {
    handle: "RaceDay",
    name: "Race Day",
    icon: "race",
    subscribers: 174_000,
    videoCount: 95,
    tagline: "Race highlights, onboard laps, and paddock access.",
    about:
      "Highlights and onboard footage from club races to championship finales.",
    joinedOn: "2017-07-17",
  },
];

export const SEED_VIDEOS: SeedVideo[] = [
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

export const SEED_COMMENTS: Record<string, SeedComment[]> = {
  "drift-day": [
    {
      author: "GearHead42",
      avatarColor: "#2563eb",
      hoursAgo: 72,
      text: "That drift was incredibly smooth!",
      likes: 742,
    },
    {
      author: "SidewaysSally",
      avatarColor: "#db2777",
      hoursAgo: 48,
      text: "The angle on that second corner was unreal. What tire pressures were you running?",
      likes: 318,
    },
    {
      author: "BoostJunkie",
      avatarColor: "#ea580c",
      hoursAgo: 48,
      text: "Came for the cars, stayed for the tire smoke.",
      likes: 205,
    },
  ],
  "classic-style": [
    {
      author: "ChromeAndCoffee",
      avatarColor: "#0891b2",
      hoursAgo: 96,
      text: "That paint job deserves its own video.",
      likes: 512,
    },
    {
      author: "VintageVroom",
      avatarColor: "#65a30d",
      hoursAgo: 72,
      text: "My dad had one of these. Brought back so many memories.",
      likes: 287,
    },
  ],
  "dream-garage": [
    {
      author: "TorqueWrench",
      avatarColor: "#ca8a04",
      hoursAgo: 120,
      text: "Where did you get that tool chest? Need it.",
      likes: 433,
    },
    {
      author: "LiftLife",
      avatarColor: "#7c3aed",
      hoursAgo: 96,
      text: "The lighting upgrade alone is worth the watch.",
      likes: 198,
    },
  ],
  "electric-road-trip": [
    {
      author: "AmpedUp",
      avatarColor: "#16a34a",
      hoursAgo: 144,
      text: "Really helpful breakdown of the charging stops. Planning my own trip now!",
      likes: 276,
    },
  ],
  "mud-mountains": [
    {
      author: "DiffLocker",
      avatarColor: "#b45309",
      hoursAgo: 168,
      text: "That hill climb at 9:40 had me holding my breath.",
      likes: 389,
    },
    {
      author: "TrailMix",
      avatarColor: "#0f766e",
      hoursAgo: 120,
      text: "Respect to whoever has to wash that rig afterwards.",
      likes: 241,
    },
  ],
  "final-lap": [
    {
      author: "PitWallPete",
      avatarColor: "#dc2626",
      hoursAgo: 72,
      text: "0.2 seconds! Best finish of the season, no contest.",
      likes: 604,
    },
  ],
};
