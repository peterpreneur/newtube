// Creates an admin who signs in with email and password, or resets an existing user's password
// and makes them admin: `npm run admin:create -- [email] [name]`. Prints a new random password.
import { randomBytes } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { accounts, users } from "../src/db/schema.ts";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Add it to .env.local (see .env.example).");
  process.exit(1);
}

const email = (process.argv[2] ?? "admin@cartube.dev").toLowerCase();
const name = process.argv[3] ?? "Admin";
const password = randomBytes(15).toString("base64url"); // 20 characters

const client = postgres(url, { prepare: false, max: 1, max_pipeline: 1 });
const db = drizzle(client);

try {
  const passwordHash = await hashPassword(password);

  await db.transaction(async (tx) => {
    const [user] = await tx
      .insert(users)
      .values({ name, email, isAdmin: true, emailVerified: true })
      .onConflictDoUpdate({ target: users.email, set: { isAdmin: true } })
      .returning({ id: users.id });

    // Better Auth keeps email-and-password logins as a "credential" account holding the hash.
    const credential = and(eq(accounts.userId, user.id), eq(accounts.providerId, "credential"));
    const [existing] = await tx.select({ id: accounts.id }).from(accounts).where(credential);
    if (existing) {
      await tx.update(accounts).set({ password: passwordHash }).where(eq(accounts.id, existing.id));
    } else {
      await tx.insert(accounts).values({
        userId: user.id,
        accountId: user.id,
        providerId: "credential",
        password: passwordHash,
      });
    }
  });

  console.log("Admin ready. Sign in at /login with:");
  console.log(`  email:    ${email}`);
  console.log(`  password: ${password}`);
} catch (error) {
  const cause = error instanceof Error && error.cause instanceof Error ? error.cause : error;
  console.error("Creating the admin failed:", cause instanceof Error ? cause.message : cause);
  process.exitCode = 1;
} finally {
  await client.end();
}
