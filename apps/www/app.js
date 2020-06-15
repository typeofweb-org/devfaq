// eslint-disable-next-line import/order
const newrelic = require('newrelic')

// MyDevil.net specific
function loadDotEnv() {
  const fs = require('fs');
  const version = fs.readFileSync('.version', 'utf-8');
  process.env.ENV = version.split(':').shift();
  console.log('process.env.ENV', process.env.ENV);
  require('dotenv').config({
    path: `.env.${process.env.ENV}`,
  });
}
loadDotEnv();

const Url = require('url');

const cookieParser = require('cookie-parser');
const express = require('express');
const next = require('next');

const app = next({ dev: false });

const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    loadDotEnv();
    const server = express().use(cookieParser());

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
