import type { StaticImageData } from "next/image";
import turboTimeAvatar from "@/assets/channels/turbo-time-avatar.jpg";
import turboTimeBanner from "@/assets/channels/turbo-time-banner.jpg";

export type ChannelIcon =
  | "turbo"
  | "classic"
  | "garage"
  | "electric"
  | "trail"
  | "race";

export type Channel = {
  handle: string;
  name: string;
  icon: ChannelIcon;
  subscribers: number;
  videoCount: number;
  tagline: string;
  about: string;
  joined: string;
  /** Optional artwork; channels without it fall back to their icon and no banner. */
  avatar?: StaticImageData;
  banner?: StaticImageData;
};

export const CHANNELS: Channel[] = [
  {
    handle: "TurboTime",
    name: "Turbo Time",
    icon: "turbo",
    subscribers: 128_000,
    videoCount: 86,
    tagline: "Drift days, dream builds, and everything automotive.",
    about:
      "Turbo Time is a car channel for people who like their weekends loud. We film drift days, build street cars in our own garage, and take them anywhere there's a road (and a few places there isn't). New videos every week.",
    joined: "Mar 14, 2019",
    avatar: turboTimeAvatar,
    banner: turboTimeBanner,
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
    joined: "Jun 2, 2018",
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
    joined: "Jan 21, 2020",
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
    joined: "Sep 9, 2021",
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
    joined: "Apr 30, 2019",
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
    joined: "Jul 17, 2017",
  },
];

export function findChannel(handle: string): Channel | undefined {
  return CHANNELS.find((channel) => channel.handle === handle);
}

export function getChannel(handle: string): Channel {
  const channel = findChannel(handle);
  if (!channel) {
    throw new Error(`Unknown channel: ${handle}`);
  }
  return channel;
}

export function channelHref(handle: string): string {
  return `/channel/${handle}`;
}
