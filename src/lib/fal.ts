import "server-only";
import { fal } from "@fal-ai/client";

// The client reads FAL_KEY from the environment (.env.local). Importing this file from a
// client component fails the build, so the key can't reach the browser.

/** Generates one image with FLUX.1 [dev] and returns its URL on fal's CDN. */
export async function generateImage(prompt: string): Promise<string> {
  const result = await fal.subscribe("fal-ai/flux/dev", {
    input: { prompt },
  });
  const image = result.data.images[0];
  if (!image) {
    throw new Error(`fal returned no image (request ${result.requestId})`);
  }
  return image.url;
}
