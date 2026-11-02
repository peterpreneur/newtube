"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

type Mode = "sign-in" | "sign-up";

const FIELD =
  "h-11 w-full rounded-lg border border-zinc-300 bg-background px-3 text-base text-zinc-900 outline-none focus:border-sky-500 dark:border-zinc-700 dark:text-zinc-100";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const signingUp = mode === "sign-up";

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error } = signingUp
      ? await authClient.signUp.email({ name: name.trim(), email, password })
      : await authClient.signIn.email({ email, password });
    setSubmitting(false);
    if (error) {
      setError(error.message ?? "Something went wrong. Try again.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-zinc-50 px-4 py-10 dark:bg-zinc-950">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-background p-8 shadow-sm dark:border-zinc-800">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-zinc-900 italic dark:text-zinc-100">
          CarTube
        </Link>
        <h1 className="mt-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          {signingUp ? "Create your account" : "Sign in"}
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {signingUp ? "Join CarTube to comment and subscribe." : "Welcome back to CarTube."}
        </p>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          {signingUp ? (
            <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Name
              <input
                required
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={FIELD}
              />
            </label>
          ) : null}
          <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Email
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={FIELD}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Password
            <input
              required
              type="password"
              minLength={8}
              autoComplete={signingUp ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={FIELD}
            />
          </label>

          {error ? (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/15 dark:text-red-300">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 h-11 rounded-full bg-zinc-900 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {submitting ? "Please wait…" : signingUp ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          {signingUp ? "Already have an account?" : "New to CarTube?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(signingUp ? "sign-in" : "sign-up");
              setError(null);
            }}
            className="font-medium text-sky-700 hover:underline dark:text-sky-400"
          >
            {signingUp ? "Sign in" : "Create an account"}
          </button>
        </p>
      </div>
    </main>
  );
}
