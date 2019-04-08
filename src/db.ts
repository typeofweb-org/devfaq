import { Sequelize, Model } from 'sequelize-typescript';
import { getConfig } from './config';
// tslint:disable-next-line:no-var-requires
const config = require('./config/database.js');

export interface AnyModel extends Model<AnyModel> {}
export type RawModel<M> = Pick<M, Exclude<keyof M, keyof AnyModel>> & { id: number };

export const sequelize = new Sequelize({
  ...config[getConfig('ENV')],
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false,
  // native: true,
  logging:
    getConfig('ENV') === 'test'
      ? false
      : (sql: string, _model: unknown) => {
          console.log(sql);
        },
});

export const initDb = async () => {
  await sequelize.addModels([__dirname + '/models']);
  await sequelize.authenticate();

  console.log('Connection to the database has been established successfully.');

  return sequelize;
};

export function getAllModels() {
  return (sequelize._ as unknown) as Sequelize['models'];
}

export function getModelByName(name: string) {
  return getAllModels()[name];
}
