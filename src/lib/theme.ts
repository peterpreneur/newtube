export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

/** A saved choice wins; otherwise follow the OS setting. */
export function preferredTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {}
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

export function saveTheme(theme: Theme) {
  applyTheme(theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {}
}

/**
 * Runs in <head> before first paint, so a dark-mode visit never flashes the light page.
 * Mirrors preferredTheme(), which can't be imported into an inline script.
 */
export const THEME_INIT_SCRIPT = `(function(){var t;try{t=localStorage.getItem("${STORAGE_KEY}")}catch(e){}if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t})()`;
