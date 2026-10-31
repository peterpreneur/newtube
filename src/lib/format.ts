export function formatCount(count: number): string {
  if (count >= 1_000_000) {
    return `${Number((count / 1_000_000).toFixed(1))}M`;
  }
  if (count >= 1_000) {
    return `${Number((count / 1_000).toFixed(1))}K`;
  }
  return String(count);
}

export function formatViews(count: number): string {
  return `${formatCount(count)} ${count === 1 ? "view" : "views"}`;
}

export function formatTime(totalSeconds: number): string {
  const seconds = Math.floor(totalSeconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = String(seconds % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

export function formatAge(hoursAgo: number): string {
  if (hoursAgo < 1) return "just now";
  const units: [number, string][] = [
    [24 * 365, "year"],
    [24 * 30, "month"],
    [24 * 7, "week"],
    [24, "day"],
    [1, "hour"],
  ];
  const [size, label] = units.find(([unit]) => hoursAgo >= unit)!;
  const n = Math.floor(hoursAgo / size);
  return `${n} ${label}${n === 1 ? "" : "s"} ago`;
}
