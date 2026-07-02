import { Pool } from "pg";

// Single shared pool. In dev, Next.js hot-reloads modules, so cache the pool on
// globalThis to avoid opening a new pool on every reload.
const globalForPool = globalThis as unknown as { pgPool?: Pool };

export const pool =
  globalForPool.pgPool ??
  new Pool({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPool.pgPool = pool;
}
