import {
  HistoryIcon,
  HomeIcon,
  LikedIcon,
  ShortsIcon,
  SubscriptionsIcon,
  WatchLaterIcon,
} from "@/components/icons";

const NAV_ITEMS = [
  { label: "Home", icon: HomeIcon, current: true },
  { label: "Shorts", icon: ShortsIcon, current: false },
  { label: "Subscriptions", icon: SubscriptionsIcon, current: false },
  { label: "History", icon: HistoryIcon, current: false },
  { label: "Watch later", icon: WatchLaterIcon, current: false },
  { label: "Liked videos", icon: LikedIcon, current: false },
] as const;

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          aria-label="Close navigation"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`fixed top-14 bottom-0 left-0 z-20 w-60 overflow-y-auto bg-white border-r border-zinc-200 px-3 py-3 transition-transform lg:sticky lg:h-[calc(100vh-3.5rem)] lg:z-0 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav aria-label="Main">
          <ul className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <a
                    href={item.current ? "/" : undefined}
                    aria-current={item.current ? "page" : undefined}
                    className={`flex h-10 items-center gap-6 rounded-xl px-3 text-sm ${
                      item.current
                        ? "bg-red-50 font-medium text-red-600"
                        : "text-zinc-800 hover:bg-zinc-100"
                    } ${item.current ? "" : "pointer-events-none"}`}
                  >
                    <Icon
                      className={`h-6 w-6 ${item.current ? "text-red-600" : "text-zinc-800"}`}
                    />
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
