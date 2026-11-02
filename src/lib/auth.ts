import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { headers } from "next/headers";
import { db } from "@/db";
import * as schema from "@/db/schema";

// Email-and-password auth backed by the users, sessions, accounts and verifications tables.
// BETTER_AUTH_SECRET and BETTER_AUTH_URL come from the environment.
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema, usePlural: true }),
  advanced: {
    // Match the schema's uuid primary keys.
    database: { generateId: "uuid" },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  user: {
    additionalFields: {
      avatarColor: { type: "string", required: false, defaultValue: "#2563eb", input: false },
      // input: false keeps sign-up and profile updates from granting admin.
      isAdmin: { type: "boolean", required: false, defaultValue: false, input: false },
    },
  },
});

export type Session = typeof auth.$Infer.Session;

/** The signed-in user's session in a server component, route handler or action; null if signed out. */
export async function getSession(): Promise<Session | null> {
  return auth.api.getSession({ headers: await headers() });
}
