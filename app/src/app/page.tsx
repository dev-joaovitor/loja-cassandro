import Link from "next/link";
import { TABLE_NAMES } from "@/lib/tables";

export default function Home() {
  return (
    <>
      <h1>Loja Cassandro</h1>
      <p>selecione uma tabela:</p>
      <div className="home-grid">
        {TABLE_NAMES.map((t) => (
          <Link key={t} href={`/${t}`} className="card">
            {t}
          </Link>
        ))}
      </div>
    </>
  );
}
