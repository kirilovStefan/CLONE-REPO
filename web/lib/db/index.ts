import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Drizzle client backed by Neon's serverless HTTP driver.
 *
 * DATABASE_URL comes from the Neon dashboard (a postgres:// connection
 * string). It is server-only — never import this module from a "use
 * client" component. Set it in .env.local for local dev and in the
 * Render dashboard for production.
 */
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  // Surfaced only on the server; keeps the build from silently using
  // an undefined connection.
  console.warn(
    "[db] DATABASE_URL is not set — database calls will fail until it is configured."
  );
}

const sql = neon(databaseUrl ?? "");

export const db = drizzle(sql, { schema });

export { schema };
