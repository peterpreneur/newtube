import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ChannelPage, ChannelPageSkeleton } from "@/components/channel-page";
import { getChannel, getChannelHandles, getChannelVideos } from "@/db/queries";

export async function generateStaticParams() {
  const handles = await getChannelHandles();
  return handles.map((handle) => ({ handle }));
}

export async function generateMetadata({
  params,
}: PageProps<"/channel/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const channel = await getChannel(handle);
  return channel
    ? { title: channel.name, description: channel.tagline }
    : { title: "Channel not found" };
}

export default function Channel({ params }: PageProps<"/channel/[handle]">) {
  // Params are URL data, so read them behind a boundary to keep navigations instant.
  return (
    <Suspense fallback={<ChannelPageSkeleton />}>
      <ChannelContent params={params} />
    </Suspense>
  );
}

async function ChannelContent({
  params,
}: {
  params: PageProps<"/channel/[handle]">["params"];
}) {
  const { handle } = await params;
  const [channel, videos] = await Promise.all([
    getChannel(handle),
    getChannelVideos(handle),
  ]);
  if (!channel) {
    notFound();
  }

  return <ChannelPage key={channel.handle} channel={channel} videos={videos} />;
}
