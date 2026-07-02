import type { PoolClient } from "pg";

// Brazilian state capitals, retrieved from the IBGE public API:
// https://servicodados.ibge.gov.br/api/v1/localidades/municipios
export const capitais = [
  "Aracaju", "Belo Horizonte", "Belém", "Boa Vista", "Brasília",
  "Campo Grande", "Cuiabá", "Curitiba", "Florianópolis", "Fortaleza",
  "Goiânia", "João Pessoa", "Macapá", "Maceió", "Manaus",
  "Natal", "Palmas", "Porto Alegre", "Porto Velho", "Recife",
  "Rio Branco", "Rio de Janeiro", "Salvador", "São Luís", "São Paulo",
  "Teresina", "Vitória",
];

// A record's submitted values, keyed by column name.
export type PostData = Record<string, string | undefined>;

// Server-side value computers for `auto` columns: given the current
// transaction client and the submitted data, return the column value.
// Returning undefined would leave the column untouched, but every auto fn here
// returns a concrete value.
export type AutoFn = (client: PoolClient, post: PostData) => Promise<unknown> | unknown;

// Column specs:
//   { type: 'text' }                                  free input
//   { type: 'select', options: [...] }                static select
//   { type: 'select', from: t, label: c }             FK select over table t
//   { type: 'auto', insert?: fn, update?: fn }         hidden; value computed
//     server-side (client, post) -> value; missing key = column untouched
export type ColumnDef =
  | { type: "text" }
  | { type: "select"; options: string[] }
  | { type: "select"; from: string; label: string }
  | { type: "auto"; insert?: AutoFn; update?: AutoFn };

export type TableSpec = Record<string, ColumnDef>;

const today: AutoFn = () => new Date().toISOString().slice(0, 10);

const precoProduto: AutoFn = async (client, post) => {
  const { rows } = await client.query(
    "SELECT preco FROM produto WHERE id = $1",
    [post["id_produto"] ?? null],
  );
  return rows[0]?.preco ?? null;
};

export const TABLES: Record<string, TableSpec> = {
  cliente: {
    nome: { type: "text" },
    email: { type: "text" },
    cidade: { type: "select", options: capitais },
    data_cadastro: { type: "auto", insert: today },
  },
  fornecedor: {
    nome: { type: "text" },
    cnpj: { type: "text" },
    cidade: { type: "select", options: capitais },
  },
  produto: {
    nome: { type: "text" },
    preco: { type: "text" },
    id_fornecedor: { type: "select", from: "fornecedor", label: "nome" },
  },
  custo_produto: {
    id_produto: { type: "select", from: "produto", label: "nome" },
    custo: { type: "text" },
    data_atualizacao: { type: "auto", insert: today, update: today },
  },
  pedido: {
    id_cliente: { type: "select", from: "cliente", label: "nome" },
    data: { type: "auto", insert: today },
    total: { type: "auto", insert: () => 0 },
  },
  item_pedido: {
    id_pedido: { type: "select", from: "pedido", label: "data" },
    id_produto: { type: "select", from: "produto", label: "nome" },
    quantidade: { type: "text" },
    preco_unitario: { type: "auto", insert: precoProduto, update: precoProduto },
  },
};

export const TABLE_NAMES = Object.keys(TABLES);

export function isValidTable(table: string): boolean {
  return Object.prototype.hasOwnProperty.call(TABLES, table);
}

export type FieldSpec = { col: string; def: ColumnDef };

// The editable (non-auto) columns of a table, in declaration order.
export function fieldsFromSpec(spec: TableSpec): FieldSpec[] {
  return Object.entries(spec)
    .filter(([, def]) => def.type !== "auto")
    .map(([col, def]) => ({ col, def }));
}
