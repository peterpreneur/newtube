import Image, { type StaticImageData } from "next/image";
import coastal from "@/assets/thumbnails/coastal.jpg";
import diyTuneUp from "@/assets/thumbnails/diy-tune-up.jpg";
import drift from "@/assets/thumbnails/drift.jpg";
import electric from "@/assets/thumbnails/electric.jpg";
import finish from "@/assets/thumbnails/finish.jpg";
import garage from "@/assets/thumbnails/garage.jpg";
import offroadAdventure from "@/assets/thumbnails/offroad-adventure.jpg";
import offroad from "@/assets/thumbnails/offroad.jpg";
import raceDay from "@/assets/thumbnails/race-day.jpg";
import streetBuild from "@/assets/thumbnails/street-build.jpg";
import ultimateGarage from "@/assets/thumbnails/ultimate-garage.jpg";
import type { ThumbnailScene } from "@/lib/videos";

export const THUMBNAILS: Record<ThumbnailScene, StaticImageData> = {
  drift,
  coastal,
  garage,
  electric,
  offroad,
  finish,
  "street-build": streetBuild,
  "ultimate-garage": ultimateGarage,
  "offroad-adventure": offroadAdventure,
  "race-day": raceDay,
  "diy-tune-up": diyTuneUp,
};

// Pixel box [left, top, right, bottom] of the duration badge baked into each artwork,
// measured from the source images. The live badge is drawn exactly over it.
const BAKED_BADGES: Record<ThumbnailScene, [number, number, number, number]> = {
  drift: [374, 214, 428, 239],
  coastal: [374, 214, 427, 238],
  garage: [374, 214, 428, 238],
  electric: [374, 213, 427, 238],
  offroad: [374, 213, 427, 238],
  finish: [374, 213, 428, 238],
  "street-build": [393, 114, 434, 137],
  "ultimate-garage": [394, 114, 435, 137],
  "offroad-adventure": [391, 107, 425, 134],
  "race-day": [383, 111, 424, 133],
  "diy-tune-up": [389, 103, 424, 133],
};

// Extra cover around the baked badge (in % of frame width) so anti-aliased edges never peek out.
const BADGE_BLEED = 0.6;

// Below this relative difference, cropping to fill is unnoticeable, so skip the letterbox.
const FILL_TOLERANCE = 0.04;

type VideoThumbnailProps = {
  scene: ThumbnailScene;
  title: string;
  duration: string;
  eager?: boolean;
  sizes?: string;
  /** Width / height of the frame. Artwork of a different shape is letterboxed over a blurred fill. */
  aspect?: number;
};

export function VideoThumbnail({
  scene,
  title,
  duration,
  eager = false,
  sizes = "(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw",
  aspect = 16 / 9,
}: VideoThumbnailProps) {
  const image = THUMBNAILS[scene];
  const ratio = image.width / image.height;
  const fills = Math.abs(ratio - aspect) / aspect < FILL_TOLERANCE;
  const wider = ratio > aspect;

  // Badge geometry in container-width units (cqw), so it scales with the artwork.
  const [left, top, right, bottom] = BAKED_BADGES[scene];
  const toCqw = (px: number) => (px / image.width) * 100;
  const badgeStyle = {
    right: `${Math.max(toCqw(image.width - right) - BADGE_BLEED, 0)}cqw`,
    bottom: `${Math.max(toCqw(image.height - bottom) - BADGE_BLEED, 0)}cqw`,
    // Floors keep the label readable on small thumbnails; growing only enlarges the cover.
    minWidth: `max(${toCqw(right - left) + 2 * BADGE_BLEED}cqw, 38px)`,
    height: `max(${toCqw(bottom - top) + 2 * BADGE_BLEED}cqw, 18px)`,
  };

  return (
    <div
      className="relative overflow-hidden rounded-xl bg-zinc-900"
      style={{ aspectRatio: aspect }}
    >
      {fills ? null : (
        <Image
          src={image}
          alt=""
          fill
          sizes="64px"
          aria-hidden
          className="scale-125 object-cover opacity-80 blur-xl"
        />
      )}
      {/* The frame matches the artwork, so the badge geometry below maps onto it directly. */}
      <div
        className={`@container absolute ${
          fills
            ? "inset-0"
            : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        }`}
        style={
          fills
            ? undefined
            : {
                aspectRatio: ratio,
                width: wider ? "100%" : "auto",
                height: wider ? "auto" : "100%",
              }
        }
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes={sizes}
          placeholder="blur"
          loading={eager ? "eager" : "lazy"}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span
          className="absolute flex items-center justify-center rounded-[max(1.2cqw,4px)] bg-black px-[max(1cqw,4px)] text-[max(3.4cqw,11px)] font-semibold text-white"
          style={badgeStyle}
        >
          {duration}
        </span>
      </div>
    </div>
  );
}
