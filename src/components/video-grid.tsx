import Link from "next/link";
import { ChannelAvatar } from "@/components/channel-avatar";
import { VideoThumbnail } from "@/components/video-thumbnail";
import { channelHref, getChannel } from "@/lib/channels";
import { videoMeta, type Video } from "@/lib/videos";

type VideoGridProps = {
  videos: Video[];
  /** Channel pages drop the avatar and channel name, since every video shares them. */
  showChannel?: boolean;
  thumbnailAspect?: number;
  emptyMessage?: string;
};

export function VideoGrid({
  videos,
  showChannel = true,
  thumbnailAspect,
  emptyMessage = "No car videos match that search.",
}: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <p className="px-2 py-16 text-center text-zinc-600">{emptyMessage}</p>
    );
  }

  return (
    <ul
      className={`grid grid-cols-1 gap-x-4 sm:grid-cols-2 xl:grid-cols-3 ${
        showChannel ? "gap-y-10" : "gap-y-6"
      }`}
    >
      {videos.map((video, index) => {
        const channel = getChannel(video.channelHandle);
        const href = `/watch/${video.id}`;

        return (
          <li key={video.id}>
            <article className="group">
              <Link href={href} className="block" tabIndex={-1} aria-hidden>
                <VideoThumbnail
                  scene={video.scene}
                  title={video.title}
                  duration={video.duration}
                  eager={index < 6}
                  aspect={thumbnailAspect}
                />
              </Link>
              <div className={`flex gap-3 ${showChannel ? "mt-3" : "mt-2"}`}>
                {showChannel ? (
                  <Link href={channelHref(channel.handle)} className="mt-0.5 shrink-0">
                    <ChannelAvatar channel={channel} className="h-9 w-9" sizes="36px" />
                    <span className="sr-only">{channel.name}</span>
                  </Link>
                ) : null}
                <div className="min-w-0">
                  <h3
                    className={`line-clamp-2 font-semibold text-zinc-900 ${
                      showChannel ? "text-[16px] leading-5" : "text-sm leading-5"
                    }`}
                  >
                    <Link href={href}>{video.title}</Link>
                  </h3>
                  {showChannel ? (
                    <Link
                      href={channelHref(channel.handle)}
                      className="mt-1 block text-sm text-zinc-600 hover:text-zinc-900"
                    >
                      {channel.name}
                    </Link>
                  ) : null}
                  <p className={`text-zinc-600 ${showChannel ? "text-sm" : "text-xs"}`}>
                    {videoMeta(video)}
                  </p>
                </div>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
