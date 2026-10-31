import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ChannelPage, ChannelPageSkeleton } from "@/components/channel-page";
import { CHANNELS, findChannel } from "@/lib/channels";
import { getChannelVideos } from "@/lib/videos";

export function generateStaticParams() {
  return CHANNELS.map((channel) => ({ handle: channel.handle }));
}

export async function generateMetadata({
  params,
}: PageProps<"/channel/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const channel = findChannel(handle);
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
  const channel = findChannel(handle);
  if (!channel) {
    notFound();
  }

  return (
    <ChannelPage
      key={channel.handle}
      channel={channel}
      videos={getChannelVideos(channel.handle)}
    />
  );
}
