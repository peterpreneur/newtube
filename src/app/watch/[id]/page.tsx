import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { WatchPage, WatchPageSkeleton } from "@/components/watch-page";
import { getComments } from "@/lib/comments";
import { VIDEOS, getVideo } from "@/lib/videos";

export function generateStaticParams() {
  return VIDEOS.map((video) => ({ id: video.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/watch/[id]">): Promise<Metadata> {
  const { id } = await params;
  const video = getVideo(id);
  return video
    ? { title: video.title, description: video.description }
    : { title: "Video not found" };
}

export default function Watch({ params }: PageProps<"/watch/[id]">) {
  // Params are URL data, so read them behind a boundary to keep navigations instant.
  return (
    <Suspense fallback={<WatchPageSkeleton />}>
      <WatchContent params={params} />
    </Suspense>
  );
}

async function WatchContent({
  params,
}: {
  params: PageProps<"/watch/[id]">["params"];
}) {
  const { id } = await params;
  const video = getVideo(id);
  if (!video) {
    notFound();
  }

  return (
    <WatchPage
      // Remount per video so playback, votes and drafts don't carry over between videos.
      key={video.id}
      video={video}
      related={VIDEOS.filter((other) => other.id !== video.id)}
      comments={getComments(video.id)}
    />
  );
}
