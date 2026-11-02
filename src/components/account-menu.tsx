"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { InitialAvatar } from "@/components/user-avatar";
import { authClient } from "@/lib/auth-client";

/** Header account control: "Sign in" when signed out, an avatar with a menu when signed in. */
export function AccountMenu() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (isPending) {
    return <span className="ml-1 h-8 w-8 rounded-full bg-zinc-100 dark:bg-white/10" aria-hidden />;
  }

  if (!session) {
    return (
      <Link
        href="/login"
        className="ml-1 flex h-9 shrink-0 items-center rounded-full border border-zinc-300 px-3 text-sm font-medium text-sky-700 hover:bg-sky-50 dark:border-zinc-700 dark:text-sky-400 dark:hover:bg-sky-500/10"
      >
        Sign in
      </Link>
    );
  }

  const { user } = session;
  const color = user.avatarColor ?? "#2563eb";

  return (
    <div ref={menuRef} className="relative ml-1">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
        className="flex h-8 w-8 rounded-full"
      >
        <InitialAvatar name={user.name} color={color} className="h-8 w-8 text-sm" />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute top-10 right-0 z-40 w-64 rounded-xl border border-zinc-200 bg-background py-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-800"
        >
          <div className="flex items-center gap-3 px-4 pt-1 pb-3">
            <InitialAvatar name={user.name} color={color} className="h-10 w-10" />
            <div className="min-w-0">
              <p className="flex items-center gap-2 truncate font-medium text-zinc-900 dark:text-zinc-100">
                {user.name}
                {user.isAdmin ? (
                  <span className="rounded bg-red-600 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                    Admin
                  </span>
                ) : null}
              </p>
              <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">{user.email}</p>
            </div>
          </div>
          <div className="border-t border-zinc-200 pt-2 dark:border-zinc-700">
            <button
              type="button"
              role="menuitem"
              onClick={async () => {
                setOpen(false);
                await authClient.signOut();
                router.refresh();
              }}
              className="block w-full px-4 py-2 text-left text-sm text-zinc-900 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-white/10"
            >
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
