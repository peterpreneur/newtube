"use client";

import { useEffect, useMemo, useState } from "react";
import { CategoryChips } from "@/components/category-chips";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { VideoGrid } from "@/components/video-grid";
import { VIDEOS, filterVideos, type Category } from "@/lib/videos";

export function HomePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const videos = useMemo(
    () => filterVideos(VIDEOS, category, query),
    [category, query],
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex min-h-full flex-col bg-white">
      <Header
        query={query}
        onQueryChange={(value) => {
          setQuery(value);
          if (value && category !== "All") {
            setCategory("All");
          }
        }}
        onToggleSidebar={() => setSidebarOpen((open) => !open)}
      />
      <div className="flex min-h-0 flex-1">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="min-w-0 flex-1 px-4 pt-3 pb-8 lg:px-6">
          <h1 className="sr-only">CarTube home</h1>
          <CategoryChips selected={category} onSelect={setCategory} />
          <VideoGrid videos={videos} />
        </main>
      </div>
    </div>
  );
}
