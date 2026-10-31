"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { ChannelAvatar } from "@/components/channel-avatar";
import { CloseIcon, SearchIcon } from "@/components/icons";
import { VideoGrid } from "@/components/video-grid";
import { VideoThumbnail } from "@/components/video-thumbnail";
import type { Channel } from "@/lib/channels";
import { formatCount } from "@/lib/format";
import { videoMeta, type Video } from "@/lib/videos";

const TABS = ["Home", "Videos", "Shorts", "Playlists", "Community"] as const;
type Tab = (typeof TABS)[number];

const SORTS = {
  Latest: (a: Video, b: Video) => a.daysAgo - b.daysAgo,
  Popular: (a: Video, b: Video) => b.viewCount - a.viewCount,
  Oldest: (a: Video, b: Video) => b.daysAgo - a.daysAgo,
};
type Sort = keyof typeof SORTS;

// The channel grid uses wide cards, matching the channel artwork's shape.
const CHANNEL_CARD_ASPECT = 22 / 7;

type ChannelPageProps = {
  channel: Channel;
  videos: Video[];
};

export function ChannelPage({ channel, videos }: ChannelPageProps) {
  const [headerQuery, setHeaderQuery] = useState("");
  const [tab, setTab] = useState<Tab>("Videos");
  const [sort, setSort] = useState<Sort>("Latest");
  const [subscribed, setSubscribed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [channelQuery, setChannelQuery] = useState("");
  const aboutRef = useRef<HTMLDialogElement>(null);

  const normalized = channelQuery.trim().toLowerCase();
  const searching = normalized.length > 0;
  const matching = videos.filter((video) =>
    video.title.toLowerCase().includes(normalized),
  );
  const sorted = [...videos].sort(SORTS[sort]);
  const latest = [...videos].sort(SORTS.Latest)[0];
  const popular = [...videos].sort(SORTS.Popular).slice(0, 3);

  return (
    <AppShell
      sidebar="docked"
      query={headerQuery}
      onQueryChange={setHeaderQuery}
    >
      <main className="min-w-0 flex-1 px-4 pt-2 pb-10 lg:px-6">
        {channel.banner ? (
          <div
            className="relative w-full overflow-hidden rounded-xl bg-zinc-200"
            style={{ aspectRatio: channel.banner.width / channel.banner.height }}
          >
            <Image
              src={channel.banner}
              alt=""
              fill
              preload
              sizes="(min-width: 1024px) calc(100vw - 288px), 100vw"
              placeholder="blur"
              className="object-cover"
            />
          </div>
        ) : null}

        <header className="mt-4 flex items-center gap-4 sm:gap-6">
          <ChannelAvatar
            channel={channel}
            sizes="160px"
            className="h-[72px] w-[72px] shrink-0 sm:h-32 sm:w-32 lg:h-40 lg:w-40"
          />
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-zinc-900 sm:text-4xl">
              {channel.name}
            </h1>
            <p className="mt-1 text-sm text-zinc-600 sm:mt-2">
              <span className="font-medium text-zinc-900">@{channel.handle}</span>
              {" · "}
              {formatCount(channel.subscribers)} subscribers
              {" · "}
              {channel.videoCount} videos
            </p>
            <button
              type="button"
              onClick={() => aboutRef.current?.showModal()}
              className="mt-1 flex max-w-full items-center gap-2 text-left text-sm text-zinc-600 hover:text-zinc-900"
            >
              <span className="truncate">{channel.tagline}</span>
              <span aria-hidden className="text-lg leading-none">
                ›
              </span>
              <span className="sr-only">More about this channel</span>
            </button>
            <button
              type="button"
              onClick={() => setSubscribed((value) => !value)}
              aria-pressed={subscribed}
              className={`mt-3 h-9 rounded-full px-5 text-sm font-medium sm:h-10 ${
                subscribed
                  ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                  : "bg-zinc-900 text-white hover:bg-zinc-700"
              }`}
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>
        </header>

        <div className="mt-4 flex items-center gap-2 border-b border-zinc-200">
          <div role="tablist" aria-label="Channel sections" className="flex overflow-x-auto">
            {TABS.map((name) => {
              const active = name === tab && !searching;
              return (
                <button
                  key={name}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setTab(name);
                    setChannelQuery("");
                    setSearchOpen(false);
                  }}
                  className={`relative h-12 shrink-0 px-3 text-base font-medium sm:px-5 ${
                    active ? "text-zinc-900" : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  {name}
                  {active ? (
                    <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-zinc-900 sm:inset-x-5" />
                  ) : null}
                </button>
              );
            })}
          </div>
          <form
            role="search"
            className="flex shrink-0 items-center"
            onSubmit={(event) => event.preventDefault()}
          >
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="rounded-full p-2 text-zinc-700 hover:bg-zinc-100"
              aria-label={`Search ${channel.name}`}
            >
              <SearchIcon className="h-6 w-6" />
            </button>
            {searchOpen ? (
              <div className="flex items-center border-b border-zinc-900">
                <input
                  autoFocus
                  value={channelQuery}
                  onChange={(event) => setChannelQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      setChannelQuery("");
                      setSearchOpen(false);
                    }
                  }}
                  placeholder="Search"
                  aria-label={`Search ${channel.name}`}
                  className="w-28 py-1 text-sm outline-none sm:w-48"
                />
                <button
                  type="button"
                  onClick={() => {
                    setChannelQuery("");
                    setSearchOpen(false);
                  }}
                  className="rounded-full p-1 text-zinc-600 hover:bg-zinc-100"
                  aria-label="Clear search"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>
            ) : null}
          </form>
        </div>

        <div className="mt-4">
          {searching ? (
            <VideoGrid
              videos={matching}
              showChannel={false}
              thumbnailAspect={CHANNEL_CARD_ASPECT}
              emptyMessage={`This channel has no videos matching "${channelQuery.trim()}".`}
            />
          ) : tab === "Videos" ? (
            <>
              <div className="flex gap-3 pb-4">
                {(Object.keys(SORTS) as Sort[]).map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSort(name)}
                    aria-pressed={sort === name}
                    className={`h-8 rounded-lg px-3 text-sm font-medium ${
                      sort === name
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
              <VideoGrid
                videos={sorted}
                showChannel={false}
                thumbnailAspect={CHANNEL_CARD_ASPECT}
                emptyMessage="This channel hasn't posted any videos yet."
              />
            </>
          ) : tab === "Home" && latest ? (
            <div className="flex flex-col gap-8">
              <Link
                href={`/watch/${latest.id}`}
                className="group flex flex-col gap-4 border-b border-zinc-200 pb-6 sm:flex-row"
              >
                <div className="w-full shrink-0 sm:w-[424px]">
                  <VideoThumbnail
                    scene={latest.scene}
                    title={latest.title}
                    duration={latest.duration}
                    sizes="(min-width: 640px) 424px, 100vw"
                    eager
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-zinc-900">{latest.title}</h2>
                  <p className="mt-1 text-sm text-zinc-600">{videoMeta(latest)}</p>
                  <p className="mt-3 text-sm text-zinc-700">{latest.description}</p>
                </div>
              </Link>
              <section>
                <h2 className="mb-4 text-xl font-bold text-zinc-900">Popular videos</h2>
                <VideoGrid
                  videos={popular}
                  showChannel={false}
                  thumbnailAspect={CHANNEL_CARD_ASPECT}
                />
              </section>
            </div>
          ) : (
            <p className="py-16 text-center text-zinc-600">
              {channel.name} hasn&apos;t posted any {tab.toLowerCase()} yet.
            </p>
          )}
        </div>

        <dialog
          ref={aboutRef}
          aria-labelledby="about-title"
          className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-2xl p-0 shadow-2xl backdrop:bg-black/50"
          onClick={(event) => {
            if (event.target === event.currentTarget) event.currentTarget.close();
          }}
        >
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <h2 id="about-title" className="text-xl font-bold text-zinc-900">
                About
              </h2>
              <button
                type="button"
                onClick={() => aboutRef.current?.close()}
                className="-mt-1 -mr-2 rounded-full p-2 text-zinc-700 hover:bg-zinc-100"
                aria-label="Close"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-800">{channel.about}</p>
            <h3 className="mt-6 text-base font-bold text-zinc-900">Channel details</h3>
            <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
              <dt className="text-zinc-600">Handle</dt>
              <dd className="text-zinc-900">@{channel.handle}</dd>
              <dt className="text-zinc-600">Subscribers</dt>
              <dd className="text-zinc-900">{channel.subscribers.toLocaleString()}</dd>
              <dt className="text-zinc-600">Videos</dt>
              <dd className="text-zinc-900">{channel.videoCount}</dd>
              <dt className="text-zinc-600">Joined</dt>
              <dd className="text-zinc-900">{channel.joined}</dd>
            </dl>
          </div>
        </dialog>
      </main>
    </AppShell>
  );
}

/** Instant-navigation shell shown while the route's params resolve. */
export function ChannelPageSkeleton() {
  const [query, setQuery] = useState("");

  return (
    <AppShell sidebar="docked" query={query} onQueryChange={setQuery}>
      <main className="min-w-0 flex-1 px-4 pt-2 pb-10 lg:px-6" aria-busy="true">
        <div className="aspect-[7.8] w-full animate-pulse rounded-xl bg-zinc-200" />
        <div className="mt-4 flex items-center gap-6">
          <div className="h-[72px] w-[72px] rounded-full bg-zinc-200 sm:h-32 sm:w-32 lg:h-40 lg:w-40" />
          <div className="flex flex-col gap-3">
            <div className="h-8 w-56 rounded bg-zinc-200" />
            <div className="h-4 w-72 rounded bg-zinc-200" />
            <div className="h-10 w-28 rounded-full bg-zinc-200" />
          </div>
        </div>
        <div className="mt-6 h-12 border-b border-zinc-200" />
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="aspect-[22/7] rounded-xl bg-zinc-200" />
          ))}
        </div>
      </main>
    </AppShell>
  );
}
