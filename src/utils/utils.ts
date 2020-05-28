import moment from 'moment';
import { isUndefined, omitBy, upperFirst, camelCase } from 'lodash';
import { getConfig } from '../config';
import { withScope, Severity, captureException } from '@sentry/node';
import Hapi, { RequestRoute } from '@hapi/hapi';
import { User } from '../models/User';
import { Model } from 'sequelize-typescript';

type Nil<T> = T | undefined | null;
export function defaultToAny<T>(v1: T): T;
export function defaultToAny<T>(v1: Nil<T>, v2: T): T;
export function defaultToAny(v1: Nil<boolean>, v2: boolean): boolean;
export function defaultToAny<T>(v1: Nil<T>, v2: Nil<T>, v3: T): T;
export function defaultToAny(v1: Nil<boolean>, v2: Nil<boolean>, v3: boolean): boolean;
export function defaultToAny<T>(...defaults: Array<Nil<T>>) {
  return defaults.reduce((prev, next) => {
    if (prev === undefined || prev === null || Number.isNaN((prev as unknown) as number)) {
      return next;
    }
    return prev;
  });
}

// tslint:disable-next-line:no-any
export function handleException(err: any, level?: Severity) {
  if (!getConfig('SENTRY_DSN')) {
    return console.error(err, level);
  }

  if (level) {
    withScope((scope) => {
      scope.setLevel(level);
      captureException(err);
    });
  } else {
    captureException(err);
  }
}

// tslint:disable-next-line:no-any
export const isEmptyES6 = (obj: any): obj is {} => {
  return (
    obj &&
    Object.getOwnPropertyNames(obj).length === 0 &&
    Object.getOwnPropertySymbols(obj).length === 0
  );
};

export const omitUndefined = <T extends object>(obj: T): Partial<T> =>
  omitBy(obj, isUndefined) as Partial<T>;

export function getNewSessionValidUntil(keepMeSignedIn: boolean): Date {
  const now = moment();

  // tslint:disable-next-line:no-magic-numbers
  return keepMeSignedIn ? now.add(7, 'days').toDate() : now.add(2, 'hours').toDate();
}

export const getCurrentUser = (request: Hapi.Request): User | undefined => {
  return (
    request &&
    request.auth &&
    request.auth.credentials &&
    request.auth.credentials.session &&
    request.auth.credentials.session._user
  );
};

export const isAdmin = (request: Hapi.Request): boolean => {
  const user = getCurrentUser(request);
  return Boolean(user && user._roleId === 'admin');
};

// tslint:disable-next-line:no-any
export const arrayToJSON = <T extends Model<any>>(entities: Array<Model<T>>) => {
  return entities.map((entity) => entity.toJSON());
};

export const routeToLabel = ({ method, path }: RequestRoute): string => {
  const prefix = method.toLowerCase();
  const label = upperFirst(camelCase(path));
  return prefix + label;
};
