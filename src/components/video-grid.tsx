import { ChannelAvatar } from "@/components/channel-avatar";
import { VideoThumbnail } from "@/components/video-thumbnail";
import type { Video } from "@/lib/videos";

type VideoGridProps = {
  videos: Video[];
};

export function VideoGrid({ videos }: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <p className="px-2 py-16 text-center text-zinc-600">
        No car videos match that search.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
      {videos.map((video) => (
        <li key={video.id}>
          <article className="group cursor-pointer">
            <VideoThumbnail
              scene={video.scene}
              title={video.title}
              duration={video.duration}
            />
            <div className="mt-3 flex gap-3">
              <ChannelAvatar
                icon={video.channelIcon}
                className="mt-0.5 h-9 w-9 shrink-0"
              />
              <div className="min-w-0">
                <h3 className="line-clamp-2 text-[16px] leading-5 font-semibold text-zinc-900">
                  {video.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-600 hover:text-zinc-900">
                  {video.channel}
                </p>
                <p className="text-sm text-zinc-600">
                  {video.views} · {video.published}
                </p>
              </div>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
