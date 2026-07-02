import Link from "next/link";
import type { Row } from "@/lib/queries";
import DeleteButton from "./DeleteButton";

// pg returns `date` columns as JS Date objects; render them as YYYY-MM-DD
// (matching the PHP output) instead of the verbose Date.toString().
function display(value: unknown): string {
  if (value == null) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}

export default function DataTable({
  table,
  cols,
  rows,
}: {
  table: string;
  cols: string[];
  rows: Row[];
}) {
  return (
    <table>
      <tbody>
        <tr>
          <th>id</th>
          {cols.map((c) => (
            <th key={c}>{c}</th>
          ))}
          <th />
        </tr>
        {rows.map((row) => {
          const id = String(row.id);
          return (
            <tr key={id}>
              <td>{id}</td>
              {cols.map((c) => (
                <td key={c}>{display(row[c])}</td>
              ))}
              <td>
                <Link href={`/${table}?edit=${id}`}>editar</Link>{" "}
                <DeleteButton table={table} id={id} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
