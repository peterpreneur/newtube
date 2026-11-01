"use client";

/**
 * A script that runs during HTML parsing only. On the client it renders as inert text/plain,
 * which keeps React from warning about script tags; suppressHydrationWarning covers the type swap.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
