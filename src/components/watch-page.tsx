"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Comments } from "@/components/comments";
import { RelatedVideos } from "@/components/related-videos";
import { VideoDetails } from "@/components/video-details";
import { VideoPlayer } from "@/components/video-player";
import type { Comment } from "@/lib/comments";
import type { Video } from "@/lib/videos";

type WatchPageProps = {
  video: Video;
  related: Video[];
  comments: Comment[];
};

export function WatchPage({ video, related, comments }: WatchPageProps) {
  const [query, setQuery] = useState("");
  const [theater, setTheater] = useState(false);

  return (
    <AppShell
      sidebar="overlay"
      query={query}
      onQueryChange={setQuery}
    >
      <main className="min-w-0 flex-1">
        {/* One player instance moves between grid cells, so theater mode keeps playback state. */}
        <div
          className={`mx-auto grid w-full max-w-[1760px] grid-cols-[minmax(0,1fr)] gap-x-6 pb-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_402px] xl:grid-cols-[minmax(0,1fr)_426px] ${
            theater ? "" : "sm:pt-6"
          }`}
        >
          <div
            className={
              theater
                ? "bg-black sm:-mx-6 lg:col-span-2"
                : "lg:col-start-1 lg:row-start-1"
            }
          >
            <VideoPlayer
              video={video}
              theater={theater}
              onToggleTheater={() => setTheater((value) => !value)}
            />
          </div>
          <div className="min-w-0 lg:col-start-1">
            <VideoDetails video={video} />
            <Comments initialComments={comments} totalCount={video.commentCount} />
          </div>
          <RelatedVideos
            video={video}
            candidates={related}
            className={`mt-2 lg:col-start-2 lg:mt-0 ${
              theater ? "lg:row-start-2 lg:pt-3" : "lg:row-span-2 lg:row-start-1"
            }`}
          />
        </div>
      </main>
    </AppShell>
  );
}

/** Instant-navigation shell shown while the route's params resolve. */
export function WatchPageSkeleton() {
  const [query, setQuery] = useState("");

  return (
    <AppShell sidebar="overlay" query={query} onQueryChange={setQuery}>
      <main className="min-w-0 flex-1" aria-busy="true">
        <div className="mx-auto grid w-full max-w-[1760px] grid-cols-[minmax(0,1fr)] gap-x-6 pb-10 sm:px-6 sm:pt-6 lg:grid-cols-[minmax(0,1fr)_402px] xl:grid-cols-[minmax(0,1fr)_426px]">
          <div className="min-w-0">
            <div className="aspect-[12/5] min-h-56 animate-pulse bg-zinc-200 sm:rounded-xl dark:bg-zinc-800" />
            <div className="mt-4 flex flex-col gap-3 px-4 sm:px-0">
              <div className="h-6 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
              <div className="h-20 rounded-xl bg-zinc-100 dark:bg-white/10" />
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-2 px-4 sm:px-0 lg:mt-0">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="flex gap-2">
                <div className="aspect-video w-[168px] shrink-0 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                <div className="flex flex-1 flex-col gap-2 py-1">
                  <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-3 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </AppShell>
  );
}
