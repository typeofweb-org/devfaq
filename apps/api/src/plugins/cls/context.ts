import * as Sentry from '@sentry/node';
import { clsProxifyNamespace, clsProxify } from 'cls-proxify';

export const USER_CONTEXT_KEY = 'USER_CONTEXT';
type USER_CONTEXT_KEY = typeof USER_CONTEXT_KEY;
export const SENTRY_BREADCRUMBS_KEY = 'SENTRY_BREADCRUMBS';
type SENTRY_BREADCRUMBS_KEY = typeof SENTRY_BREADCRUMBS_KEY;
export const contextNs = clsProxifyNamespace;

export const SENTRY_KEY = 'SENTRY_KEY';
export const SentryCLS = clsProxify(SENTRY_KEY, Sentry);

interface ContextData {
  currentRequestID?: string;
  userEmail?: string;
  key?: string;
}

type KeyToValue = {
  [SENTRY_BREADCRUMBS_KEY]: Sentry.Breadcrumb[] | undefined;
  [USER_CONTEXT_KEY]: ContextData | undefined;
};

export function setContext<N extends keyof KeyToValue>(
  name: N,
  values: KeyToValue[N]
): KeyToValue[N] {
  return contextNs.active ? contextNs.set(name, values) : undefined;
}

export function updateContext<N extends keyof KeyToValue>(
  name: N,
  updates: KeyToValue[N]
): KeyToValue[N] {
  const context = getContext(name) ?? setContext(name, updates);
  if (!context) {
    return undefined;
  }
  Object.assign(context, updates);
  return context;
}

export function getContext<N extends keyof KeyToValue>(name: N): KeyToValue[N] {
  return contextNs.active ? contextNs.get(name) : undefined;
}
