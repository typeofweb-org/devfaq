import Hapi from 'hapi';
import Boom from 'boom';
import { isRequestRole } from '../../utils/permissions';
import { USER_ROLE } from '../../models-consts';

declare module 'hapi' {
  interface PluginSpecificConfiguration {
    'devfaq-permissions'?: {
      validate(request: Hapi.Request): boolean | Promise<boolean>;
    };
  }
}

// tslint:disable-next-line:no-empty-interface
interface PermissionsPlugin {}

export const permissions: Hapi.Plugin<PermissionsPlugin> = {
  async register(server, _options) {
    server.ext('onPreHandler', async (request, h) => {
      if (isRequestRole(request, USER_ROLE.ADMIN)) {
        return h.continue; // admins can do anything
      }

      const routePermissionsSettings =
        request.route.settings.plugins && request.route.settings.plugins['devfaq-permissions'];
      if (!routePermissionsSettings) {
        return h.continue;
      }

      const result = await routePermissionsSettings.validate(request);

      if (!result) {
        throw Boom.unauthorized('Access not allowed');
      }

      return h.continue;
    });
  },
  multiple: false,
  name: 'devfaq-api Permissions Plugin',
  version: '1.0.0',
};
