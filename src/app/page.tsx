"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { HomePage } from "@/components/home-page";

function HomeWithQuery() {
  const query = useSearchParams().get("q") ?? "";
  return <HomePage key={query} initialQuery={query} />;
}

export default function Home() {
  // The unfiltered grid is the static shell; a `?q=` search from another page fills in on the client.
  return (
    <Suspense fallback={<HomePage />}>
      <HomeWithQuery />
    </Suspense>
  );
}
