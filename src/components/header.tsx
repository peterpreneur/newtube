import Link from "next/link";
import {
  BellIcon,
  MenuIcon,
  MicIcon,
  SearchIcon,
  UploadIcon,
} from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAvatar } from "@/components/user-avatar";

type HeaderProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch?: (value: string) => void;
  onToggleSidebar: () => void;
};

export function Header({
  query,
  onQueryChange,
  onSearch,
  onToggleSidebar,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-zinc-200 bg-background px-3 sm:px-4 dark:border-zinc-800">
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-full p-2 text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10"
          aria-label="Toggle navigation"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
        <Link href="/" className="flex items-center gap-1 pr-2" aria-label="CarTube home">
          <span className="flex h-6 w-9 items-center justify-center rounded-[7px] bg-[#ff0000]">
            <svg viewBox="0 0 12 12" className="h-3 w-3 text-white" aria-hidden>
              <polygon points="3,2 10,6 3,10" fill="currentColor" />
            </svg>
          </span>
          <span className="relative pt-1.5 text-xl font-extrabold tracking-tight text-zinc-900 italic dark:text-zinc-100">
            <svg
              viewBox="0 0 80 14"
              className="absolute -top-0.5 left-0 h-3 w-full text-[#ff0000]"
              fill="none"
              aria-hidden
            >
              <path
                d="M2 13 C10 10 14 9 22 8 C28 2 40 1 50 3 C56 4 62 7 66 9 C72 10 76 11 78 13"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            CarTube
          </span>
        </Link>
      </div>

      <form
        className="mx-auto hidden min-w-0 flex-1 items-center justify-center gap-2 md:flex"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch?.(query);
        }}
      >
        <div className="flex h-10 w-full max-w-xl">
          <label className="sr-only" htmlFor="search-car-videos">
            Search car videos
          </label>
          <input
            id="search-car-videos"
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search car videos"
            className="h-10 min-w-0 flex-1 rounded-l-full border border-zinc-300 px-4 text-base text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-sky-500 dark:border-zinc-700 dark:text-zinc-100"
          />
          <button
            type="submit"
            className="flex h-10 w-16 items-center justify-center rounded-r-full border border-l-0 border-zinc-300 bg-zinc-50 text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
            aria-label="Search"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
        </div>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-white/10 dark:text-zinc-200 dark:hover:bg-white/20"
          aria-label="Search with voice"
        >
          <MicIcon className="h-5 w-5" />
        </button>
      </form>

      <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
        <button
          type="button"
          className="rounded-full p-2 text-zinc-800 hover:bg-zinc-100 md:hidden dark:text-zinc-200 dark:hover:bg-white/10"
          aria-label="Search"
        >
          <SearchIcon className="h-6 w-6" />
        </button>
        <button
          type="button"
          className="rounded-full p-2 text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10"
          aria-label="Upload"
        >
          <UploadIcon className="h-6 w-6" />
        </button>
        <button
          type="button"
          className="rounded-full p-2 text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10"
          aria-label="Notifications"
        >
          <BellIcon className="h-6 w-6" />
        </button>
        <ThemeToggle />
        <button
          type="button"
          className="ml-1 h-8 w-8 overflow-hidden rounded-full"
          aria-label="Your channel"
        >
          <UserAvatar className="h-full w-full" />
        </button>
      </div>
    </header>
  );
}
