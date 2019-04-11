import { initDb } from './db';
import { getServerWithPlugins } from './server';
import dotenv from 'dotenv';
import { getConfig } from './config';
import * as Sentry from '@sentry/node';
import { handleException } from './utils/utils';

if (!getConfig('SENTRY_DSN')) {
  console.warn('SENTRY_DSN is missing. No errors will be reported!');
} else {
  Sentry.init({
    debug: false,
    dsn: getConfig('SENTRY_DSN'),
    environment: getConfig('ENV'),
  });
}

if (getConfig('NODE_ENV') !== 'production') {
  dotenv.config({ path: '.env.dev' });
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
        .then(() => process.exit(1))
        .catch(() => process.exit(1));
    } else {
      process.exit(1);
    }
  }
})();
