import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { WatchPage, WatchPageSkeleton } from "@/components/watch-page";
import { getComments, getRelatedVideos, getVideo, getVideoIds } from "@/db/queries";

export async function generateStaticParams() {
  const ids = await getVideoIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/watch/[id]">): Promise<Metadata> {
  const { id } = await params;
  const video = await getVideo(id);
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
  const [video, related, comments] = await Promise.all([
    getVideo(id),
    getRelatedVideos(id),
    getComments(id),
  ]);
  if (!video) {
    notFound();
  }

  return (
    <WatchPage
      // Remount per video so playback, votes and drafts don't carry over between videos.
      key={video.id}
      video={video}
      related={related}
      comments={comments}
    />
  );
}
