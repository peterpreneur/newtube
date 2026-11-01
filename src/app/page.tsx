import { Suspense } from "react";
import { HomePage, HomeWithQuery } from "@/components/home-page";
import { getVideos } from "@/db/queries";

export default async function Home() {
  const videos = await getVideos();

  // The unfiltered grid is the static shell; a `?q=` search from another page fills in on the client.
  return (
    <Suspense fallback={<HomePage videos={videos} />}>
      <HomeWithQuery videos={videos} />
    </Suspense>
  );
}
