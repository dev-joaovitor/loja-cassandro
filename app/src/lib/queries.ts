import type { PoolClient } from "pg";
import { pool } from "./db";
import { TABLES, type PostData, type TableSpec } from "./tables";

// All identifiers (table/column names) originate from the trusted TABLES spec,
// never from user input — matching the PHP design. Only values are parameterized.

export type Row = Record<string, unknown>;

export function columnsOf(table: string): string[] {
  return Object.keys(TABLES[table]);
}

// SELECT * (optionally filtered by a free-text search over id + all columns).
export async function listRows(table: string, q?: string): Promise<Row[]> {
  const cols = columnsOf(table);
  if (q && q.trim() !== "") {
    const term = q.trim();
    const searchable = ["id", ...cols];
    const where = searchable
      .map((c, i) => `CAST(${c} AS TEXT) ILIKE $${i + 1}`)
      .join(" OR ");
    const params = searchable.map(() => `%${term}%`);
    const { rows } = await pool.query(
      `SELECT * FROM ${table} WHERE ${where} ORDER BY id`,
      params,
    );
    return rows;
  }
  const { rows } = await pool.query(`SELECT * FROM ${table} ORDER BY id`);
  return rows;
}

export async function getRow(table: string, id: string): Promise<Row | null> {
  const { rows } = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
  return rows[0] ?? null;
}

// id => label pairs for each FK select column.
export async function fkOptions(
  table: string,
): Promise<Record<string, Array<{ id: unknown; label: unknown }>>> {
  const spec = TABLES[table];
  const result: Record<string, Array<{ id: unknown; label: unknown }>> = {};
  for (const [col, def] of Object.entries(spec)) {
    if (def.type === "select" && "from" in def) {
      const { rows } = await pool.query(
        `SELECT id, ${def.label} AS label FROM ${def.from} ORDER BY id`,
      );
      result[col] = rows.map((r) => ({ id: r.id, label: r.label }));
    }
  }
  return result;
}

// Collect column => value for insert/update, resolving auto columns.
// Mirrors the PHP buildValues(): '' becomes null, auto columns run their fn.
export async function buildValues(
  client: PoolClient,
  spec: TableSpec,
  post: PostData,
  mode: "insert" | "update",
): Promise<Record<string, unknown>> {
  const values: Record<string, unknown> = {};
  for (const [col, def] of Object.entries(spec)) {
    if (def.type === "auto") {
      const fn = def[mode];
      if (fn) {
        values[col] = await fn(client, post);
      }
      continue;
    }
    const raw = post[col] ?? "";
    values[col] = raw === "" ? null : raw;
  }
  return values;
}
