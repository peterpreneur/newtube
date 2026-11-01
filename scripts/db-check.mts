// Checks that DATABASE_URL reaches Postgres: `npm run db:check`.
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Add it to .env.local (see .env.example).");
  process.exit(1);
}
if (url.includes("[YOUR-PASSWORD]")) {
  console.error("DATABASE_URL still has the [YOUR-PASSWORD] placeholder. Paste your database password in .env.local.");
  process.exit(1);
}

const client = postgres(url, { prepare: false, max: 1, connect_timeout: 10 });
const db = drizzle(client);

try {
  const started = performance.now();
  const [row] = await db.execute<{ version: string; database: string; user: string }>(
    sql`select version() as version, current_database() as database, current_user as user`,
  );
  const ms = Math.round(performance.now() - started);
  console.log(`Connected in ${ms}ms`);
  console.log(`  database: ${row.database} as ${row.user}`);
  console.log(`  server:   ${row.version.split(" on ")[0]}`);
} catch (error) {
  // Drizzle wraps driver errors; the cause says why (bad password, unreachable host, ...).
  const cause = error instanceof Error && error.cause instanceof Error ? error.cause : error;
  console.error("Connection failed:", cause instanceof Error ? cause.message : cause);
  process.exitCode = 1;
} finally {
  await client.end();
}
