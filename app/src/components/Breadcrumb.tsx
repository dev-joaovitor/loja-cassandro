import Link from "next/link";

export default function Breadcrumb({ table }: { table: string }) {
  return (
    <div className="breadcrumb">
      <Link href="/">home</Link> / {table}
    </div>
  );
}
