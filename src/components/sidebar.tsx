"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HistoryIcon,
  HomeIcon,
  LikedIcon,
  ShortsIcon,
  SubscriptionsIcon,
  WatchLaterIcon,
} from "@/components/icons";

const NAV_ITEMS = [
  { label: "Home", icon: HomeIcon, href: "/" },
  { label: "Shorts", icon: ShortsIcon, href: null },
  { label: "Subscriptions", icon: SubscriptionsIcon, href: null },
  { label: "History", icon: HistoryIcon, href: null },
  { label: "Watch later", icon: WatchLaterIcon, href: null },
  { label: "Liked videos", icon: LikedIcon, href: null },
] as const;

type SidebarProps = {
  open: boolean;
  onClose: () => void;
  /** Docked sidebars sit beside the content on large screens; overlay ones are always a drawer. */
  variant: "docked" | "overlay";
};

export function Sidebar({ open, onClose, variant }: SidebarProps) {
  const pathname = usePathname();
  const docked = variant === "docked";

  return (
    <>
      {open ? (
        <button
          type="button"
          className={`fixed inset-0 z-30 bg-black/40 ${docked ? "lg:hidden" : ""}`}
          aria-label="Close navigation"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`fixed top-14 bottom-0 left-0 z-30 w-60 overflow-y-auto border-r border-zinc-200 bg-background px-3 py-3 transition-transform dark:border-zinc-800 ${
          docked
            ? "lg:sticky lg:z-0 lg:h-[calc(100vh-3.5rem)] lg:translate-x-0"
            : ""
        } ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <nav aria-label="Main">
          <ul className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const current = item.href === pathname;
              const className = `flex h-10 items-center gap-6 rounded-xl px-3 text-sm ${
                current
                  ? "bg-red-50 font-medium text-red-600 dark:bg-red-500/15 dark:text-red-400"
                  : "text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10"
              }`;
              const content = (
                <>
                  <Icon
                    className={`h-6 w-6 ${current ? "text-red-600 dark:text-red-400" : "text-zinc-800 dark:text-zinc-200"}`}
                  />
                  {item.label}
                </>
              );

              return (
                <li
                  key={item.label}
                  className={item.label === "History" ? "mt-3 border-t border-zinc-200 pt-3 dark:border-zinc-800" : undefined}
                >
                  {item.href ? (
                    <Link
                      href={item.href}
                      aria-current={current ? "page" : undefined}
                      className={className}
                      onClick={onClose}
                    >
                      {content}
                    </Link>
                  ) : (
                    <span className={`${className} cursor-default`}>
                      {content}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
