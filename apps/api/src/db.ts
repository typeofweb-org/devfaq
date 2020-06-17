import { Sequelize, Model } from 'sequelize-typescript';

import { getConfig } from './config';
import { SentryCLS, getContext, USER_CONTEXT_KEY } from './plugins/cls/context';

// tslint:disable-next-line:no-var-requires
const config = require('./config/database.js');

export interface AnyModel extends Model<AnyModel> {}
export type RawModel<M> = Pick<M, Exclude<keyof M, keyof AnyModel>> & {
  id: number;
};

export const sequelizeConfig = {
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
    getConfig('NODE_ENV') !== 'production'
      ? // tslint:disable-next-line:no-any
        (sql: string, model?: Model<any>) => {
          SentryCLS.addBreadcrumb({
            category: 'SQL',
            message: sql,
            level: SentryCLS.Severity.Info,
            data: {
              model: model?.toJSON?.() || undefined,
              context: getContext(USER_CONTEXT_KEY),
            },
          });
        }
      : (sql: string, _model: unknown) => {
          if (getConfig('ENV') !== 'test') {
            console.log(
              [
                getContext(USER_CONTEXT_KEY)?.currentRequestID,
                'user: ' + getContext(USER_CONTEXT_KEY)?.userEmail,
                sql,
              ].join('\t')
            );
          }
        },
};

export const sequelize = new Sequelize(sequelizeConfig);

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
