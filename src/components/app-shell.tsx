"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";

type AppShellProps = {
  children: ReactNode;
  sidebar: "docked" | "overlay";
  query: string;
  onQueryChange: (value: string) => void;
  onSearch?: (value: string) => void;
};

export function AppShell({
  children,
  sidebar,
  query,
  onQueryChange,
  onSearch,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex min-h-full flex-col bg-white">
      <Header
        query={query}
        onQueryChange={onQueryChange}
        onSearch={onSearch}
        onToggleSidebar={() => setSidebarOpen((open) => !open)}
      />
      <div className="flex min-h-0 flex-1">
        <Sidebar
          variant={sidebar}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        {children}
      </div>
    </div>
  );
}
