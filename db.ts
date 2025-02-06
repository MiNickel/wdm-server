import { Pool, QueryResult, QueryResultRow } from "pg";

const pool = new Pool({
  user: "app_spundwand",
  password: "app_spundwand",
  host: "localhost",
  port: 5432,
  database: "spundwand_restructure",
});

export const query = <T extends QueryResultRow>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> => {
  return pool.query<T>(text, params);
};
