import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Add it to .env.local (see .env.example).");
}

// Reuse one pool across dev hot reloads instead of opening a new one on every edit.
const globalForDb = globalThis as unknown as { postgresClient?: postgres.Sql };

// Supabase's transaction-mode pooler can't keep prepared statements between queries, and
// queries pipelined onto a busy connection come back cancelled ("statement timeout"), so each
// query waits for a free connection instead. Pipelining kicks in under load, such as the
// production build prerendering many pages at once.
const client =
  globalForDb.postgresClient ??
  postgres(connectionString, { prepare: false, max_pipeline: 1 });
if (process.env.NODE_ENV !== "production") globalForDb.postgresClient = client;

export const db = drizzle(client, { schema });
