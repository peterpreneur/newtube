"use client";

import { useLayoutEffect } from "react";
import { MoonIcon, SunIcon } from "@/components/icons";
import { applyTheme, preferredTheme, saveTheme } from "@/lib/theme";

export function ThemeToggle() {
  // The head script sets the theme before paint; React's dev remount clears it, so re-apply.
  useLayoutEffect(() => {
    applyTheme(preferredTheme());
  }, []);

  function toggle() {
    saveTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  }

  // Both icons render and CSS picks one, so server and client markup always match.
  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-full p-2 text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10"
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
    >
      <MoonIcon className="h-6 w-6 dark:hidden" />
      <SunIcon className="hidden h-6 w-6 dark:block" />
    </button>
  );
}
