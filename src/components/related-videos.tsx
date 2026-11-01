"use client";

import Link from "next/link";
import { useState } from "react";
import { MoreVerticalIcon } from "@/components/icons";
import { VideoThumbnail } from "@/components/video-thumbnail";
import { getChannel } from "@/lib/channels";
import { videoMeta, type Video } from "@/lib/videos";

type RelatedVideosProps = {
  video: Video;
  candidates: Video[];
  className?: string;
};

export function RelatedVideos({ video, candidates, className }: RelatedVideosProps) {
  const primary = video.categories[0];
  const filters = [
    {
      label: "All",
      match: () => true,
    },
    {
      label: primary,
      match: (other: Video) => other.categories.includes(primary),
    },
    {
      label: "Related",
      match: (other: Video) =>
        other.categories.some((category) => video.categories.includes(category)),
    },
  ];
  const [selected, setSelected] = useState(filters[0].label);
  const active = filters.find((filter) => filter.label === selected) ?? filters[0];
  const videos = candidates.filter(active.match);

  return (
    <aside className={className} aria-label="Up next">
      <div className="flex gap-3 overflow-x-auto px-4 pb-3 sm:px-0">
        {filters.map((filter) => {
          const isSelected = filter.label === selected;
          return (
            <button
              key={filter.label}
              type="button"
              onClick={() => setSelected(filter.label)}
              aria-pressed={isSelected}
              className={`h-8 shrink-0 rounded-full px-3.5 text-sm ${
                isSelected
                  ? "bg-zinc-900 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-white/10 dark:text-zinc-100 dark:hover:bg-white/20"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {videos.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-zinc-600 sm:px-0 dark:text-zinc-400">
          No more {selected.toLowerCase()} videos yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-2 px-4 sm:px-0">
          {videos.map((other) => (
            <li key={other.id} className="group relative flex gap-2 rounded-xl">
              <Link
                href={`/watch/${other.id}`}
                className="flex min-w-0 flex-1 gap-2"
              >
                <div className="w-[168px] shrink-0">
                  <VideoThumbnail
                    scene={other.scene}
                    title={other.title}
                    duration={other.duration}
                    sizes="168px"
                  />
                </div>
                <div className="min-w-0 flex-1 py-0.5 pr-6">
                  <h3 className="line-clamp-2 text-sm leading-5 font-semibold text-zinc-900 dark:text-zinc-100">
                    {other.title}
                  </h3>
                  <p className="mt-1 truncate text-xs text-zinc-600 dark:text-zinc-400">
                    {getChannel(other.channelHandle).name}
                  </p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">{videoMeta(other)}</p>
                </div>
              </Link>
              <button
                type="button"
                className="absolute top-0 right-0 rounded-full p-1.5 text-zinc-900 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-white/10"
                aria-label={`More actions for ${other.title}`}
              >
                <MoreVerticalIcon className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
