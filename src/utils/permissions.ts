import Hapi from 'hapi';
import { USER_ROLE } from '../models-consts';

export const isRequestAuthed = (request: Hapi.Request) => Boolean(request.auth.credentials);

export const getRequestScope = (request: Hapi.Request) =>
  isRequestAuthed(request) ? request.auth.credentials.scope : undefined;

export const getRequestUserId = (request: Hapi.Request) =>
  Number(request.auth.credentials.session._user && request.auth.credentials.session._user.id);

export const isScopeRole = (scope: string[] = [], role: USER_ROLE): boolean => {
  return scope.includes(role);
};

export const isRequestRole = (request: Hapi.Request, role: USER_ROLE) => {
  return isScopeRole(getRequestScope(request), role);
};

export const isScopeJustAUser = (scope: string[] = []) => {
  const moreThanUserRoles = Object.values(USER_ROLE).filter(role => role !== 'user') as USER_ROLE[];
  return !moreThanUserRoles.some(role => isScopeRole(scope, role));
};

export const isRequestJustAUser = (request: Hapi.Request) => {
  return !isRequestAuthed(request) || isScopeJustAUser(getRequestScope(request));
};
