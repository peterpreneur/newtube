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

/** Channel artwork ships with the app; the database stores which set a channel uses. */
export const CHANNEL_ARTWORK: Record<string, { avatar: StaticImageData; banner: StaticImageData }> = {
  "turbo-time": { avatar: turboTimeAvatar, banner: turboTimeBanner },
};

export function channelHref(handle: string): string {
  return `/channel/${handle}`;
}
