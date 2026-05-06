"use server";

import Sql from "@/lib/sql";

export async function getSlogans() {
  const rows = await Sql.client`SELECT text FROM wendigo.slogans ORDER BY id`;
  return rows.map((r) => r.text);
}
