import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// converte ? em $1, $2, ...
const toPg = (sql) => {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
};

const db = {
  async query(sql, params = []) {
    const isInsert = /^\s*insert/i.test(sql) && !/returning/i.test(sql);
    const text = toPg(sql) + (isInsert ? " RETURNING id" : "");
    const result = await pool.query(text, params);

    if (/^\s*select/i.test(sql)) return [result.rows];
    return [{ affectedRows: result.rowCount, insertId: result.rows?.[0]?.id }];
  },
};

export default db;