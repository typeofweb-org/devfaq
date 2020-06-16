import pg, { Pool } from 'pg';

import { getConfig } from './config';
import database from './config/database.js';

// pg.on('query' as any, (...args) => {
//   console.log(...args);
// });

let pool: Promise<Pool>;
export const initDb = async () => {
  const poolInstance = await pool;
  if (poolInstance) {
    await poolInstance.end();
  }
  const dbconfig = database[getConfig('ENV')];
  pool = (async () =>
    new Pool({
      host: dbconfig.host,
      user: dbconfig.username,
      password: dbconfig.password,
      database: dbconfig.database,
    }))();
};

export const getDb = () => pool;
