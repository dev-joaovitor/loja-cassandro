import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import SearchBar from "@/components/SearchBar";
import DataTable from "@/components/DataTable";
import RecordForm from "@/components/RecordForm";
import { columnsOf, fkOptions, getRow, listRows } from "@/lib/queries";
import { TABLES, isValidTable, fieldsFromSpec } from "@/lib/tables";

export const dynamic = "force-dynamic";

export default async function TablePage({
  params,
  searchParams,
}: {
  params: Promise<{ table: string }>;
  searchParams: Promise<{ q?: string; edit?: string }>;
}) {
  const { table } = await params;
  if (!isValidTable(table)) notFound();

  const { q, edit } = await searchParams;
  const spec = TABLES[table];
  const cols = columnsOf(table);

  const [rows, fks, editRow] = await Promise.all([
    listRows(table, q),
    fkOptions(table),
    edit ? getRow(table, edit) : Promise.resolve(null),
  ]);

  return (
    <>
      <Breadcrumb table={table} />
      <h1>{table}</h1>

      <SearchBar table={table} />

      <DataTable table={table} cols={cols} rows={rows} />

      <RecordForm
        table={table}
        fields={fieldsFromSpec(spec)}
        fkOptions={fks}
        editRow={editRow}
      />
    </>
  );
}
