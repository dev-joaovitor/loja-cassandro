"use server";

import { revalidatePath } from "next/cache";
import { pool } from "@/lib/db";
import { buildValues } from "@/lib/queries";
import { TABLES, isValidTable, type PostData } from "@/lib/tables";

export type ActionState = { error?: string; ok?: boolean };

function postFromForm(form: FormData): PostData {
  const post: PostData = {};
  for (const [key, value] of form.entries()) {
    post[key] = typeof value === "string" ? value : undefined;
  }
  return post;
}

// insert / update / delete, dispatched by the form's `action` field —
// a faithful port of the PHP POST handler, including the item_pedido <-> pedido.total
// bookkeeping. Each runs in a transaction; returns { error } on failure.
export async function mutate(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const table = String(form.get("__table") ?? "");
  const action = String(form.get("action") ?? "");
  if (!isValidTable(table)) return { error: "tabela desconhecida" };

  const spec = TABLES[table];
  const post = postFromForm(form);
  const client = await pool.connect();

  try {
    if (action === "insert") {
      await client.query("BEGIN");
      const values = await buildValues(client, spec, post, "insert");
      const names = Object.keys(values);
      const placeholders = names.map((_, i) => `$${i + 1}`).join(", ");
      await client.query(
        `INSERT INTO ${table} (${names.join(", ")}) VALUES (${placeholders})`,
        Object.values(values),
      );
      if (table === "item_pedido") {
        await client.query(
          "UPDATE pedido SET total = COALESCE(total, 0) + $1 WHERE id = $2",
          [Number(values.quantidade) * Number(values.preco_unitario), values.id_pedido],
        );
      }
      await client.query("COMMIT");
    } else if (action === "update") {
      await client.query("BEGIN");
      let old: { id_pedido: unknown; quantidade: unknown; preco_unitario: unknown } | null = null;
      if (table === "item_pedido") {
        const { rows } = await client.query(
          "SELECT id_pedido, quantidade, preco_unitario FROM item_pedido WHERE id = $1",
          [post.id],
        );
        old = rows[0] ?? null;
      }
      const values = await buildValues(client, spec, post, "update");
      const names = Object.keys(values);
      const set = names.map((c, i) => `${c} = $${i + 1}`).join(", ");
      const params = [...Object.values(values), post.id];
      await client.query(
        `UPDATE ${table} SET ${set} WHERE id = $${names.length + 1}`,
        params,
      );
      if (table === "item_pedido") {
        if (old) {
          await client.query(
            "UPDATE pedido SET total = COALESCE(total, 0) - $1 WHERE id = $2",
            [Number(old.quantidade) * Number(old.preco_unitario), old.id_pedido],
          );
        }
        await client.query(
          "UPDATE pedido SET total = COALESCE(total, 0) + $1 WHERE id = $2",
          [Number(values.quantidade) * Number(values.preco_unitario), values.id_pedido],
        );
      }
      await client.query("COMMIT");
    } else if (action === "delete") {
      await client.query("BEGIN");
      if (table === "cliente") {
        // No FK cascade exists at the DB level, so remove the client's orders
        // and their items explicitly (deepest child first) before the client.
        await client.query(
          "DELETE FROM item_pedido WHERE id_pedido IN (SELECT id FROM pedido WHERE id_cliente = $1)",
          [post.id],
        );
        await client.query("DELETE FROM pedido WHERE id_cliente = $1", [post.id]);
      }
      if (table === "item_pedido") {
        const { rows } = await client.query(
          "SELECT id_pedido, quantidade, preco_unitario FROM item_pedido WHERE id = $1",
          [post.id],
        );
        const old = rows[0];
        if (old) {
          await client.query(
            "UPDATE pedido SET total = COALESCE(total, 0) - $1 WHERE id = $2",
            [Number(old.quantidade) * Number(old.preco_unitario), old.id_pedido],
          );
        }
      }
      await client.query(`DELETE FROM ${table} WHERE id = $1`, [post.id]);
      await client.query("COMMIT");
    }

    revalidatePath(`/${table}`);
    return { ok: true };
  } catch (e) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // ignore rollback failure
    }
    return { error: e instanceof Error ? e.message : String(e) };
  } finally {
    client.release();
  }
}
