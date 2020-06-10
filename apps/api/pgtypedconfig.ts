import { getConfig } from './src/config';
import databaseconfig from './src/config/database.js';

const config = databaseconfig[getConfig('ENV')];

module.exports = {
  transforms: [
    {
      mode: 'sql',
      include: '**/*.sql',
      emitTemplate: '{{dir}}/{{name}}.queries.ts',
    },
  ],
  srcDir: './src/',
  db: {
    host: config.host,
    user: config.username,
    dbName: config.database,
    password: config.password,
  },
};
