/* eslint-disable import/order */
const newrelic = require('newrelic');

const { v4 } = require('uuid');

// MyDevil.net specific
function loadDotEnv() {
  const fs = require('fs');
  const version = fs.readFileSync('.version', 'utf-8').trim();
  process.env.ENV = version.split(':').shift();
  process.env.VERSION = version;
  process.env.SENTRY_VERSION = version.split(':').pop();
  console.log('process.env.ENV', process.env.ENV, process.env.NODE_ENV);
  require('dotenv').config({
    path: `.env.${process.env.ENV}`,
  });
}
loadDotEnv();

const Sentry = require('@sentry/node');
const isDev = process.env.NODE_ENV !== 'production';
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  debug: isDev,
  environment: process.env.ENV,
  release: process.env.SENTRY_VERSION,
});

const Url = require('url');

const cookieParser = require('cookie-parser');
const express = require('express');
const helmet = require("helmet");
const next = require('next');

const app = next({ dev: false });

const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    loadDotEnv();
    const server = express()
    server.use(Sentry.Handlers.requestHandler());
    server.use(Sentry.Handlers.errorHandler());
    server.use(helmet());

    server.use((req, res, next) => {
      res.locals.nonce = v4();

      res.setHeader('Report-To', JSON.stringify({
        "group": "csp-group",
        "max_age": 10886400,
        "endpoints": [
          { "url": `${process.env.API_URL}/csp` }
        ]
      }))
      helmet({
        contentSecurityPolicy: ({
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: [
              "'self'",
              "https://fonts.googleapis.com",
            ],
            scriptSrc: [(_req, res) => `'nonce-${res.locals.nonce}'`, `'strict-dynamic'`],
            fontSrc: [
              "'self'",
              "data:",
              "https://fonts.gstatic.com",
            ],
            reportUri: `${process.env.API_URL}/csp`,
            reportTo: `csp-group`
          },
          reportOnly: true,
        })
      })(req, res, next)
    })
    server.use(cookieParser());

    server.get('*', (req, res) => {
      const parsedUrl = Url.parse(req.url, true);
      const { pathname, query } = parsedUrl;
      newrelic.setTransactionName(pathname);

      return handle(req, res);
    });

    const port = process.env.PORT || '3000';
    server.listen(port, () => console.log(`Server listening at localhost:${port}`));
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
