"use client";

import { useEffect, useRef, useState } from "react";
import { ChannelAvatar } from "@/components/channel-avatar";
import {
  MoreHorizontalIcon,
  SaveIcon,
  SavedIcon,
  ShareIcon,
  ThumbDownIcon,
  ThumbUpIcon,
} from "@/components/icons";
import Link from "next/link";
import { channelHref, getChannel } from "@/lib/channels";
import { formatCount } from "@/lib/format";
import { videoMeta, type Video } from "@/lib/videos";

type Vote = "like" | "dislike" | null;

const PILL = "flex h-9 shrink-0 items-center gap-2 rounded-full bg-zinc-100 px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-200";

export function VideoDetails({ video }: { video: Video }) {
  const [subscribed, setSubscribed] = useState(false);
  const [vote, setVote] = useState<Vote>(null);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  function showToast(message: string) {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard");
    } catch {
      showToast("Couldn't copy link");
    }
  }

  const likes = video.likes + (vote === "like" ? 1 : 0);
  const channel = getChannel(video.channelHandle);

  return (
    <section className="mt-3 px-4 sm:px-0">
      <h1 className="text-xl leading-7 font-bold text-zinc-900 sm:text-[22px]">
        {video.title}
      </h1>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <Link href={channelHref(channel.handle)} className="flex min-w-0 items-center gap-3">
            <ChannelAvatar channel={channel} className="h-10 w-10 shrink-0" />
            <div className="min-w-0">
              <p className="truncate font-semibold text-zinc-900">{channel.name}</p>
              <p className="text-xs text-zinc-600">
                {formatCount(channel.subscribers)} subscribers
              </p>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setSubscribed((value) => !value)}
            aria-pressed={subscribed}
            className={`ml-3 h-9 shrink-0 rounded-full px-4 text-sm font-medium ${
              subscribed
                ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                : "bg-zinc-900 text-white hover:bg-zinc-700"
            }`}
          >
            {subscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 sm:pb-0">
          <div className="flex h-9 shrink-0 items-center rounded-full bg-zinc-100 text-sm font-medium text-zinc-900">
            <button
              type="button"
              onClick={() => setVote((value) => (value === "like" ? null : "like"))}
              aria-pressed={vote === "like"}
              aria-label={`Like this video along with ${likes.toLocaleString()} other people`}
              className="flex h-full items-center gap-2 rounded-l-full pr-3 pl-4 hover:bg-zinc-200"
            >
              <ThumbUpIcon filled={vote === "like"} className="h-5 w-5" />
              {formatCount(likes)}
            </button>
            <span className="h-6 w-px bg-zinc-300" aria-hidden />
            <button
              type="button"
              onClick={() => setVote((value) => (value === "dislike" ? null : "dislike"))}
              aria-pressed={vote === "dislike"}
              aria-label="Dislike this video"
              className="flex h-full items-center rounded-r-full pr-4 pl-3 hover:bg-zinc-200"
            >
              <ThumbDownIcon filled={vote === "dislike"} className="h-5 w-5" />
            </button>
          </div>
          <button type="button" onClick={share} className={PILL}>
            <ShareIcon className="h-5 w-5" />
            Share
          </button>
          <button
            type="button"
            onClick={() => {
              setSaved((value) => !value);
              showToast(saved ? "Removed from Watch later" : "Saved to Watch later");
            }}
            aria-pressed={saved}
            className={PILL}
          >
            {saved ? <SavedIcon className="h-5 w-5" /> : <SaveIcon className="h-5 w-5" />}
            {saved ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
            aria-label="More actions"
          >
            <MoreHorizontalIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-zinc-100 p-3 text-sm text-zinc-900">
        <p className="font-semibold">
          {videoMeta(video)}
        </p>
        <p className="mt-1 whitespace-pre-line">{video.description}</p>
      </div>

      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-6 left-6 z-50 rounded-lg bg-zinc-900 px-4 py-3 text-sm text-white shadow-lg transition-all ${
          toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        {toast}
      </div>
    </section>
  );
}
