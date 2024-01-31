import { pkg } from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'vidal',
  password: 'aaa',
  host: 'localhost',
  port: 5432,
  database: 'appareils_4mtec'
});

// export function query(text, params) { return pool.query(text, params); }
module.exports = { pool };