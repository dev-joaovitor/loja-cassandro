"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mutate, type ActionState } from "@/app/[table]/actions";
import type { ColumnDef, FieldSpec } from "@/lib/tables";

type FkOptions = Record<string, Array<{ id: unknown; label: unknown }>>;

function Field({
  col,
  def,
  fkOptions,
  current,
}: {
  col: string;
  def: ColumnDef;
  fkOptions: FkOptions;
  current: unknown;
}) {
  if (def.type === "select") {
    const cur = current == null ? "" : String(current);
    const opts =
      "options" in def
        ? def.options.map((o) => ({ value: o, text: o }))
        : (fkOptions[col] ?? []).map((o) => ({
            value: String(o.id),
            text: `${o.id} - ${o.label}`,
          }));
    return (
      <select name={col} defaultValue={cur}>
        <option value="" />
        {opts.map((o) => (
          <option key={o.value} value={o.value}>
            {o.text}
          </option>
        ))}
      </select>
    );
  }
  return <input name={col} defaultValue={current == null ? "" : String(current)} />;
}

export default function RecordForm({
  table,
  fields,
  fkOptions,
  editRow,
}: {
  table: string;
  fields: FieldSpec[];
  fkOptions: FkOptions;
  editRow: Record<string, unknown> | null;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    mutate,
    {},
  );
  const router = useRouter();

  // After a successful edit, drop the ?edit= param so the form resets to "novo".
  useEffect(() => {
    if (state.ok && editRow) router.replace(`/${table}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <>
      <h2>{editRow ? `editar #${String(editRow.id)}` : "novo"}</h2>
      {state.error && <p className="error">{state.error}</p>}
      {state.ok && !editRow && <p className="success">salvo.</p>}
      <form className="record" action={formAction}>
        <input type="hidden" name="__table" value={table} />
        <input type="hidden" name="action" value={editRow ? "update" : "insert"} />
        {editRow && <input type="hidden" name="id" value={String(editRow.id)} />}
        {fields.map(({ col, def }) => (
          <label key={col}>
            {col}
            <Field
              col={col}
              def={def}
              fkOptions={fkOptions}
              current={editRow ? editRow[col] : ""}
            />
          </label>
        ))}
        <button type="submit" disabled={pending}>
          {editRow ? "salvar" : "adicionar"}
        </button>
        {editRow && <a href={`/${table}`}>cancelar</a>}
      </form>
    </>
  );
}
