import moment from 'moment';
import { isUndefined, omitBy, isString } from 'lodash';
import { getConfig } from '../config';
import { withScope, Severity, captureException } from '@sentry/node';
import Joi from 'joi';
import Hapi from 'hapi';
import { USER_ROLE } from '../models-consts';

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
    withScope(scope => {
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
export const CustomJoi = Joi.extend({
  base: Joi.array(),
  name: 'stringArray',
  coerce: (value, _state, _options) => (isString(value) ? value.split(',') : value),
}) as (typeof Joi) & { stringArray: typeof Joi.array };

// tslint:disable-next-line:no-any
export const isAdmin = (request: Hapi.Request<any, any>): boolean => {
  return Boolean(
    request &&
      request.auth &&
      request.auth.credentials &&
      request.auth.credentials.session &&
      request.auth.credentials.session._user &&
      request.auth.credentials.session._user._roleId === USER_ROLE.ADMIN
  );
};
