// MyDevil.net specific

const match = process.cwd().match(/\/(\w+)\.devfaq\.pl/i);
if (match && match[1]) {
  if (match[1] === 'app') {
    require('dotenv').config({
      path: `.env.production`,
    });
  } else if (match[1] === 'staging') {
    require('dotenv').config({
      path: `.env.staging`,
    });
  }
}

const cookieParser = require('cookie-parser');
const express = require('express');
const next = require('next');

const app = next({ dev: false });

const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
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
