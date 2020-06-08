#!/usr/bin/env ts-node-script

import { Sequelize } from 'sequelize';
// tslint:disable-next-line: no-implicit-dependencies
import { Umzug, SequelizeStorage, Migration } from 'umzug';
import { sequelizeConfig } from './src/db';
import Path from 'path';

const sequelize = new Sequelize({ ...sequelizeConfig, logging: undefined });

const storageTableName = {
  migration: { modelName: 'SequelizeMeta', path: './src/migrations' },
  seeder: { modelName: 'SequelizeData', path: './src/seeders' },
} as const;

const getUmzug = (type: keyof typeof storageTableName) => {
  return new Umzug({
    logging: console.info,
    migrations: {
      path: storageTableName[type].path,
      pattern: /\.ts$/,
      params: [sequelize.getQueryInterface(), Sequelize],
      nameFormatter(path) {
        // ignore file extension to make it compatible with older .js migrations
        return Path.basename(path, Path.extname(path));
      },
    },
    storage: new SequelizeStorage({
      sequelize,
      modelName: storageTableName[type].modelName,
    }),
  });
};

const execute = async (fn: () => Promise<Migration[]>, msg: string) => {
  fn()
    .then((result) => {
      console.log(
        msg,
        result.map((r) => r?.file ?? r)
      );
      process.exit();
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
};

export const seedUp = () => execute(() => getUmzug('seeder').up(), 'Executed seeds:');
export const seedDown = () => execute(() => getUmzug('seeder').down(), 'Reverted seeds:');
export const migrateUp = () => execute(() => getUmzug('migration').up(), 'Executed migrations:');
export const migrateDown = () => execute(() => getUmzug('migration').down(), 'Reverted migration:');
