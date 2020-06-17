import { Plugin } from '@hapi/hapi';
import * as Sentry from '@sentry/node';
import { setClsProxyValue } from 'cls-proxify';
import uuid from 'uuid';

import {
  contextNs,
  setContext,
  getContext,
  updateContext,
  USER_CONTEXT_KEY,
  SENTRY_BREADCRUMBS_KEY,
  SENTRY_KEY,
} from './context';

declare module '@hapi/hapi' {
  interface PluginProperties {
    cls: {
      setContext: typeof setContext;
      getContext: typeof getContext;
      updateContext: typeof updateContext;
    };
  }
}

export const cls: Plugin<{}> = {
  multiple: false,
  name: 'cls',
  version: '1.0.0',

  async register(server, _options) {
    server.expose('setContext', setContext);
    server.expose('getContext', getContext);
    server.expose('updateContext', updateContext);

    server.ext('onRequest', (request, h) => {
      contextNs.bindEmitter(request.raw.req);
      contextNs.bindEmitter(request.raw.res);
      return contextNs.runPromise(async () => {
        request.server.plugins.cls.setContext(USER_CONTEXT_KEY, { currentRequestID: uuid.v4() });
        setClsProxyValue(SENTRY_KEY, {
          addBreadcrumb(breadcrumb: Sentry.Breadcrumb) {
            const breadcrumbs = getContext(SENTRY_BREADCRUMBS_KEY) || [];
            breadcrumbs.push(breadcrumb);
            setContext(SENTRY_BREADCRUMBS_KEY, breadcrumbs);
          },
          Severity: Sentry.Severity,
          withScope: Sentry.withScope,
          captureException: Sentry.captureException,
          getCurrentHub: Sentry.getCurrentHub,
        });
        return h.continue;
      });
    });

    server.ext('onPostAuth', (request, h) => {
      if (request.auth.credentials.session._user?.email) {
        updateContext(USER_CONTEXT_KEY, {
          userEmail: request.auth.credentials.session._user?.email,
        });
      }
      return h.continue;
    });

    server.events.on('response', () => {
      // cleanup
      setContext(SENTRY_BREADCRUMBS_KEY, undefined);
    });
  },
};
