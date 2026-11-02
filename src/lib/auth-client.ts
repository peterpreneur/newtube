import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "@/lib/auth";

// Browser-side auth: signIn, signUp, signOut and the useSession hook. Talks to /api/auth.
export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
});
