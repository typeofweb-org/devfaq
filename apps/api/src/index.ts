import Boom from '@hapi/boom';
import * as Sentry from '@sentry/node';
import dotenv from 'dotenv';

import { getConfig, isStaging, isProd } from './config';
import { initDb } from './db';
import { getServerWithPlugins } from './server';
import { handleException } from './utils/utils';

if (getConfig('NODE_ENV') !== 'production') {
  dotenv.config({ path: '.env.dev' });
} else {
  dotenv.config();
}

if (!getConfig('SENTRY_DSN')) {
  console.warn('SENTRY_DSN is missing. No errors will be reported!');
} else {
  Sentry.init({
    debug: false,
    dsn: getConfig('SENTRY_DSN'),
    environment: getConfig('ENV'),
  });
}

// tslint:disable-next-line:no-floating-promises
(async () => {
  try {
    await initDb();
    const devfaqServer = await getServerWithPlugins();
    await devfaqServer.start();

    console.info('Server running at:', devfaqServer.info.uri);
  } catch (err) {
    handleException(err, Sentry.Severity.Fatal);

    const client = Sentry.getCurrentHub().getClient();
    if (client) {
      client
        // tslint:disable-next-line:no-magic-numbers
        .close(2000)
        .then(() => process.exit(1));
    } else {
      process.exit(1);
    }
  }
})();
