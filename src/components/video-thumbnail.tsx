import Image, { type StaticImageData } from "next/image";
import coastal from "@/assets/thumbnails/coastal.jpg";
import drift from "@/assets/thumbnails/drift.jpg";
import electric from "@/assets/thumbnails/electric.jpg";
import finish from "@/assets/thumbnails/finish.jpg";
import garage from "@/assets/thumbnails/garage.jpg";
import offroad from "@/assets/thumbnails/offroad.jpg";
import type { ThumbnailScene } from "@/lib/videos";

export const THUMBNAILS: Record<ThumbnailScene, StaticImageData> = {
  drift,
  coastal,
  garage,
  electric,
  offroad,
  finish,
};

type VideoThumbnailProps = {
  scene: ThumbnailScene;
  title: string;
  duration: string;
  eager?: boolean;
  sizes?: string;
};

export function VideoThumbnail({
  scene,
  title,
  duration,
  eager = false,
  sizes = "(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw",
}: VideoThumbnailProps) {
  return (
    <div className="@container relative aspect-video overflow-hidden rounded-xl bg-zinc-200">
      <Image
        src={THUMBNAILS[scene]}
        alt={title}
        fill
        sizes={sizes}
        placeholder="blur"
        loading={eager ? "eager" : "lazy"}
        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
      {/* Sized in container units (with a readable floor) so it always covers the badge baked into the artwork. */}
      <span className="absolute right-[1.1cqw] bottom-[1.1cqw] flex h-[max(6.4cqw,18px)] min-w-[max(13cqw,38px)] items-center justify-center rounded-[max(1cqw,4px)] bg-black/90 px-[max(1cqw,4px)] text-[max(3.4cqw,11px)] font-semibold text-white">
        {duration}
      </span>
    </div>
  );
}
