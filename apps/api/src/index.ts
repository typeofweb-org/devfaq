import Boom from '@hapi/boom';
import * as Sentry from '@sentry/node';
import dotenv from 'dotenv';
import Winston from 'winston';
// @ts-expect-error
import WinstonLogsene from 'winston-logsene';

import { getConfig } from './config';
import { initDb } from './db';
import { getServerWithPlugins } from './server';
import { handleException } from './utils/utils';

if (getConfig('NODE_ENV') !== 'production') {
  dotenv.config({ path: '.env.dev' });
} else {
  dotenv.config();
}

require('spm-agent-nodejs');
const logger = Winston.createLogger({
  levels: Winston.config.npm.levels,
  transports: [
    new WinstonLogsene({
      token: process.env.LOGS_TOKEN,
      level: 'debug',
      type: 'test_logs',
      url: 'http://logsene-receiver.sematext.com/_bulk',
    }),
  ],
});

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

    const env = getConfig('ENV');
    devfaqServer.events.on('response', ({ url, method, info, response }) => {
      const responseTime =
        (info.completed !== undefined ? info.completed : info.responded) - info.received;

      const contentLength = Boom.isBoom(response)
        ? (response.output.headers as Record<string, string | number>)['content-length']
        : response.headers['content-length'];
      const status = Boom.isBoom(response) ? response.output.statusCode : response.statusCode;

      logger.info('response', {
        responseTime: responseTime,
        contentLength: contentLength,
        method: method.toUpperCase(),
        url: url.toString(),
        status: status,
        env,
      });
    });
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
