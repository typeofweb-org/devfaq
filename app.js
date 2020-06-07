// MyDevil.net specific
function loadDotEnv() {
  const fs = require('fs');
  const version = fs.readFileSync('.version', 'utf-8');
  process.env.ENV = version.split(':').shift();
  require('dotenv').config({
    path: `.env.${process.env.ENV}`,
  });
}
loadDotEnv();

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
      return handle(req, res);
    });

    const port = process.env.PORT || '3000';
    server.listen(port, () => console.log(`Server listening at localhost:${port}`));
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
