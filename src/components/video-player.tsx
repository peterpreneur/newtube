"use client";

import Image, { type StaticImageData } from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import driftPlayer from "@/assets/thumbnails/drift-player.jpg";
import {
  CloseIcon,
  FullscreenExitIcon,
  FullscreenIcon,
  MiniplayerIcon,
  PauseIcon,
  PlayIcon,
  ReplayIcon,
  SettingsIcon,
  TheaterIcon,
  VolumeIcon,
  VolumeOffIcon,
} from "@/components/icons";
import { THUMBNAILS } from "@/components/video-thumbnail";
import { formatTime, parseDuration, type Video } from "@/lib/videos";

// Wide-format stills for the player; scenes without one fall back to their thumbnail.
const POSTERS: Partial<Record<Video["scene"], StaticImageData>> = {
  drift: driftPlayer,
};

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const TICK_MS = 250;
const IDLE_MS = 2500;

type VideoPlayerProps = {
  video: Video;
  theater: boolean;
  onToggleTheater: () => void;
};

export function VideoPlayer({
  video,
  theater,
  onToggleTheater,
}: VideoPlayerProps) {
  const duration = parseDuration(video.duration);
  const playerRef = useRef<HTMLDivElement>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mini, setMini] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [idle, setIdle] = useState(false);
  const [hoverRatio, setHoverRatio] = useState<number | null>(null);

  const ended = current >= duration;
  const isPlaying = playing && !ended;
  const controlsVisible = !isPlaying || !idle || settingsOpen;

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setCurrent((time) => Math.min(time + (TICK_MS / 1000) * speed, duration));
    }, TICK_MS);
    return () => clearInterval(id);
  }, [isPlaying, speed, duration]);

  useEffect(() => {
    function onChange() {
      setFullscreen(document.fullscreenElement === playerRef.current);
    }
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => () => clearTimeout(idleTimer.current), []);

  function wake() {
    setIdle(false);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIdle(true), IDLE_MS);
  }

  function togglePlay() {
    if (ended) {
      setCurrent(0);
      setPlaying(true);
    } else {
      setPlaying((value) => !value);
    }
    wake();
  }

  function seekTo(time: number) {
    setCurrent(Math.max(0, Math.min(time, duration)));
    wake();
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      setMini(false);
      void playerRef.current?.requestFullscreen();
    }
  }

  function ratioFromPointer(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return Math.max(0, Math.min((event.clientX - rect.left) / rect.width, 1));
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const actions: Record<string, () => void> = {
      " ": togglePlay,
      k: togglePlay,
      m: () => setMuted((value) => !value),
      f: toggleFullscreen,
      t: onToggleTheater,
      i: () => setMini((value) => !value),
      ArrowLeft: () => seekTo(current - 5),
      ArrowRight: () => seekTo(current + 5),
      j: () => seekTo(current - 10),
      l: () => seekTo(current + 10),
    };
    const action = actions[event.key];
    // Let a focused control handle its own Space press instead of double-toggling.
    const onButton = (event.target as HTMLElement).closest("button") !== null;
    if (action && !(event.key === " " && onButton)) {
      event.preventDefault();
      action();
    }
  }

  const progress = (current / duration) * 100;
  const poster = POSTERS[video.scene] ?? THUMBNAILS[video.scene];

  return (
    <div
      className={`relative w-full ${theater ? "h-[min(56.25vw,calc(100vh-10rem))] min-h-60" : "aspect-[12/5] min-h-56"}`}
    >
      {mini ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-zinc-100 text-sm text-zinc-600">
          Playing in miniplayer
          <button
            type="button"
            onClick={() => setMini(false)}
            className="rounded-full bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-700"
          >
            Return to player
          </button>
        </div>
      ) : null}

      <div
        ref={playerRef}
        tabIndex={0}
        role="region"
        aria-label={`Video player: ${video.title}`}
        onKeyDown={onKeyDown}
        onPointerMove={wake}
        onPointerLeave={() => isPlaying && setIdle(true)}
        className={`group/player overflow-hidden bg-black outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
          mini
            ? "fixed right-4 bottom-4 z-40 aspect-[12/5] w-[min(400px,calc(100vw-2rem))] rounded-xl shadow-2xl"
            : `absolute inset-0 ${theater || fullscreen ? "" : "sm:rounded-xl"}`
        } ${controlsVisible ? "" : "cursor-none"}`}
      >
        <Image
          src={poster}
          alt=""
          fill
          preload
          sizes={theater ? "100vw" : "(min-width: 1024px) 70vw, 100vw"}
          placeholder="blur"
          className={fullscreen || theater ? "object-contain" : "object-cover"}
        />

        {/* Click surface only; keyboard users get the same actions from the controls and shortcuts. */}
        <div
          className="absolute inset-0"
          aria-hidden
          onClick={togglePlay}
          onDoubleClick={toggleFullscreen}
        />

        {mini ? (
          <button
            type="button"
            onClick={() => setMini(false)}
            className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
            aria-label="Close miniplayer"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        ) : null}

        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 pt-12 pb-1.5 transition-opacity duration-200 sm:px-4 ${
            controlsVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            role="slider"
            tabIndex={-1}
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={Math.floor(current)}
            aria-valuetext={`${formatTime(current)} of ${formatTime(duration)}`}
            className="group/seek pointer-events-auto relative flex h-4 cursor-pointer items-center"
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              seekTo(ratioFromPointer(event) * duration);
            }}
            onPointerMove={(event) => {
              const ratio = ratioFromPointer(event);
              setHoverRatio(ratio);
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                seekTo(ratio * duration);
              }
            }}
            onPointerLeave={() => setHoverRatio(null)}
          >
            <div className="relative h-1 w-full rounded-full bg-white/30 transition-[height] group-hover/seek:h-1.5">
              {hoverRatio !== null ? (
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-white/40"
                  style={{ width: `${hoverRatio * 100}%` }}
                />
              ) : null}
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-[#ff0000]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div
              className="absolute h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[#ff0000] shadow"
              style={{ left: `${progress}%` }}
            />
            {hoverRatio !== null ? (
              <span
                className="absolute bottom-6 -translate-x-1/2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white"
                style={{ left: `${hoverRatio * 100}%` }}
              >
                {formatTime(hoverRatio * duration)}
              </span>
            ) : null}
          </div>

          <div className="pointer-events-auto flex items-center gap-1 text-white sm:gap-2">
            <ControlButton
              label={ended ? "Replay" : isPlaying ? "Pause (k)" : "Play (k)"}
              onClick={togglePlay}
            >
              {ended ? (
                <ReplayIcon className="h-7 w-7" />
              ) : isPlaying ? (
                <PauseIcon className="h-7 w-7" />
              ) : (
                <PlayIcon className="h-7 w-7" />
              )}
            </ControlButton>
            <ControlButton
              label={muted ? "Unmute (m)" : "Mute (m)"}
              onClick={() => setMuted((value) => !value)}
            >
              {muted ? (
                <VolumeOffIcon className="h-7 w-7" />
              ) : (
                <VolumeIcon className="h-7 w-7" />
              )}
            </ControlButton>
            <span className="ml-1 text-sm font-medium tabular-nums">
              {formatTime(current)} / {formatTime(duration)}
            </span>

            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              <div className="relative">
                <ControlButton
                  label="Settings"
                  onClick={() => setSettingsOpen((value) => !value)}
                  expanded={settingsOpen}
                >
                  <SettingsIcon
                    className={`h-6 w-6 transition-transform ${settingsOpen ? "rotate-45" : ""}`}
                  />
                </ControlButton>
                {settingsOpen ? (
                  <div
                    role="menu"
                    aria-label="Playback speed"
                    className="absolute right-0 bottom-12 w-44 rounded-xl bg-zinc-900/95 py-2 text-sm shadow-xl"
                  >
                    <p className="px-4 pb-1 text-xs text-zinc-400">
                      Playback speed
                    </p>
                    {SPEEDS.map((value) => (
                      <button
                        key={value}
                        type="button"
                        role="menuitemradio"
                        aria-checked={value === speed}
                        onClick={() => {
                          setSpeed(value);
                          setSettingsOpen(false);
                        }}
                        className="flex w-full items-center justify-between px-4 py-1.5 text-left hover:bg-white/10"
                      >
                        {value === 1 ? "Normal" : `${value}×`}
                        {value === speed ? <span aria-hidden>✓</span> : null}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <ControlButton
                label="Miniplayer (i)"
                onClick={() => setMini((value) => !value)}
                className="hidden sm:flex"
              >
                <MiniplayerIcon className="h-6 w-6" />
              </ControlButton>
              <ControlButton
                label={theater ? "Default view (t)" : "Theater mode (t)"}
                onClick={onToggleTheater}
                className="hidden lg:flex"
              >
                <TheaterIcon className="h-6 w-6" />
              </ControlButton>
              <ControlButton
                label={fullscreen ? "Exit full screen (f)" : "Full screen (f)"}
                onClick={toggleFullscreen}
              >
                {fullscreen ? (
                  <FullscreenExitIcon className="h-6 w-6" />
                ) : (
                  <FullscreenIcon className="h-6 w-6" />
                )}
              </ControlButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type ControlButtonProps = {
  label: string;
  onClick: () => void;
  children: ReactNode;
  className?: string;
  expanded?: boolean;
};

function ControlButton({
  label,
  onClick,
  children,
  className = "flex",
  expanded,
}: ControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-expanded={expanded}
      className={`${className} h-10 w-10 items-center justify-center rounded-full hover:bg-white/10`}
    >
      {children}
    </button>
  );
}
