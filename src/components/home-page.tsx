"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { CategoryChips } from "@/components/category-chips";
import { VideoGrid } from "@/components/video-grid";
import { filterVideos, type Category, type Video } from "@/lib/videos";

type HomePageProps = {
  videos: Video[];
  initialQuery?: string;
};

export function HomePage({ videos: allVideos, initialQuery = "" }: HomePageProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<Category>("All");

  const videos = useMemo(
    () => filterVideos(allVideos, category, query),
    [allVideos, category, query],
  );

  return (
    <AppShell
      sidebar="docked"
      query={query}
      onQueryChange={(value) => {
        setQuery(value);
        if (value && category !== "All") {
          setCategory("All");
        }
      }}
    >
      <main className="min-w-0 flex-1 px-4 pt-3 pb-8 lg:px-6">
        <h1 className="sr-only">CarTube home</h1>
        <CategoryChips selected={category} onSelect={setCategory} />
        <VideoGrid videos={videos} />
      </main>
    </AppShell>
  );
}

/** Applies a `?q=` search arriving from another page's header. */
export function HomeWithQuery({ videos }: { videos: Video[] }) {
  const query = useSearchParams().get("q") ?? "";
  return <HomePage key={query} videos={videos} initialQuery={query} />;
}
