"use client";

import { useActionState } from "react";
import { mutate, type ActionState } from "@/app/[table]/actions";

export default function DeleteButton({
  table,
  id,
}: {
  table: string;
  id: string;
}) {
  const [, formAction, pending] = useActionState<ActionState, FormData>(
    mutate,
    {},
  );
  return (
    <form
      className="inline"
      action={formAction}
      onSubmit={(e) => {
        if (!confirm("excluir?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="__table" value={table} />
      <input type="hidden" name="action" value="delete" />
      <input type="hidden" name="id" value={id} />
      <button type="submit" disabled={pending}>
        excluir
      </button>
    </form>
  );
}
