"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { MonitorIcon, PhoneIcon } from "@/components/icons";
import { applyTheme, preferredTheme } from "@/lib/theme";
import {
  PHONE_VIEWPORT,
  isPhonePreview,
  setPhonePreview,
  subscribePhonePreview,
} from "@/lib/phone-preview";

function usePhonePreview() {
  return useSyncExternalStore(subscribePhonePreview, isPhonePreview, () => false);
}

/** Wraps the whole app; swaps it for a framed phone-sized copy while preview is on. */
export function PhonePreview({ children }: { children: ReactNode }) {
  const on = usePhonePreview();
  // data-app lets the head script's CSS hide the desktop page until this mounts.
  return on ? <PhoneFrame /> : <div data-app className="flex min-h-full flex-1 flex-col">{children}</div>;
}

function PhoneFrame() {
  const router = useRouter();
  const frameRef = useRef<HTMLIFrameElement>(null);
  // The frame opens on whatever page preview was turned on from.
  const [src] = useState(() => location.pathname + location.search);

  // The theme toggle lives inside the frame; follow it so the backdrop matches.
  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === "theme") applyTheme(preferredTheme());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function exit() {
    // Land on the page the phone was showing, not the one preview started from.
    const framed = frameRef.current?.contentWindow?.location;
    const path = framed ? framed.pathname + framed.search : src;
    setPhonePreview(false);
    if (path !== location.pathname + location.search) router.push(path);
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 bg-zinc-100 px-4 py-6 dark:bg-zinc-950">
      <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
        <PhoneIcon className="h-5 w-5" />
        <span>
          Phone view · {PHONE_VIEWPORT.width}×{PHONE_VIEWPORT.height}
        </span>
        <button
          type="button"
          onClick={exit}
          className="flex h-9 items-center gap-2 rounded-full bg-zinc-900 px-4 font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          <MonitorIcon className="h-5 w-5" />
          Exit phone view
        </button>
      </div>
      <div className="rounded-[3rem] bg-zinc-900 p-3 shadow-2xl ring-1 ring-zinc-700">
        <iframe
          ref={frameRef}
          src={src}
          title="CarTube on a phone"
          className="block rounded-[2.25rem] bg-background"
          style={{
            width: PHONE_VIEWPORT.width,
            // Shorter windows get a shorter phone; the width (what breakpoints see) never changes.
            height: `min(${PHONE_VIEWPORT.height}px, calc(100vh - 7.5rem))`,
          }}
        />
      </div>
    </div>
  );
}

/** Header button that turns phone view on. Desktop only: on narrow screens it's already a phone. */
export function PhonePreviewToggle() {
  return (
    <button
      type="button"
      onClick={() => setPhonePreview(true)}
      className="hidden rounded-full p-2 text-zinc-800 hover:bg-zinc-100 md:block dark:text-zinc-200 dark:hover:bg-white/10"
      aria-label="Phone view"
      title="Phone view"
    >
      <PhoneIcon className="h-6 w-6" />
    </button>
  );
}
