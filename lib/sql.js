import postgres from "postgres";

const globalForSql = globalThis;

const client =
  globalForSql.__sql ||
  postgres(process.env.POSTGRES_POOL_URL, {
    idle_timeout: 20,
    max_lifetime: 60 * 30,
    max: 1,
  });

if (process.env.NODE_ENV !== "production") {
  globalForSql.__sql = client;
}

export default class Sql {
  static client = client;
}
