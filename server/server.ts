const isProduction =
  process.env.NODE_ENV === 'production' ||
  ((process.env.NODE_ENV as unknown) as string) === 'staging';
// tslint:disable-next-line:no-var-requires
require('dotenv').config({
  path: isProduction ? `.env.${process.env.NODE_ENV}` : '.env',
});

import http from 'http';
import express from 'express';
import cookieParser from 'cookie-parser';
import next from 'next';
import * as Sentry from '@sentry/node';
import { parse } from 'url';
import { join } from 'path';
import { readFileSync } from 'fs';

process.env.VERSION = readFileSync(__dirname + '/../.version', 'utf-8');

const port = process.env.PORT || '3000';

Sentry.init({ dsn: process.env.SENTRY_DSN, debug: !isProduction });

const app = next({ dev: !isProduction });

const staticFiles = ['/img/fefaq-cover-facebook.png'];

const favicons = [
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/manifest.json',
  '/safari-pinned-tab.svg',
  '/splash-iphone-8.png',
  '/mstile-144x144.png',
  '/android-chrome-512x512.png',
  '/android-chrome-192x192.png',
];

function getPathForStaticResource(pathname: string) {
  if (pathname === '/service-worker.js') {
    return join(__dirname, '..', '.next', pathname);
  } else if (favicons.includes(pathname)) {
    return join(__dirname, '..', 'static', 'favicons', pathname);
  } else if (staticFiles.includes(pathname)) {
    return join(__dirname, '..', 'static', pathname);
  } else if (pathname === '/robots.txt') {
    return join(__dirname, '..', 'static', !isProduction ? 'robots.dev.txt' : 'robots.prod.txt');
  }
  return undefined;
}

function generateSitemap(req: express.Request) {
  const sm = require('sitemap');

  const { hostname } = req;
  const urls = [
    { url: '/', changefreq: 'hourly', priority: 1 },
    { url: '/questions', changefreq: 'hourly', priority: 0.9 },
    { url: '/questions/html', changefreq: 'hourly', priority: 0.6 },
    { url: '/questions/js', changefreq: 'hourly', priority: 0.6 },
    { url: '/questions/css', changefreq: 'hourly', priority: 0.6 },
    { url: '/questions/react', changefreq: 'hourly', priority: 0.6 },
    { url: '/questions/angular', changefreq: 'hourly', priority: 0.6 },
    { url: '/questions/git', changefreq: 'hourly', priority: 0.6 },
    { url: '/questions/other', changefreq: 'hourly', priority: 0.6 },
    { url: '/selected-questions', changefreq: 'weekly', priority: 0.3 },
    { url: '/about', changefreq: 'weekly', priority: 0.5 },
    { url: '/authors', changefreq: 'weekly', priority: 0.5 },
    { url: '/regulations', changefreq: 'monthly', priority: 0.1 },
  ];

  const sitemap = sm.createSitemap({
    hostname: `https://${hostname}`,
    cacheTime: 600000,
    urls,
  });

  return sitemap.toString();
}

const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express()
      .use(Sentry.Handlers.requestHandler())
      .use(Sentry.Handlers.errorHandler())
      .use(cookieParser());

    server.use((req, res, next) => {
      const parsedUrl = parse(req.url, true);
      const { pathname = '', query } = parsedUrl;

      const staticPath = getPathForStaticResource(pathname);
      if (staticPath) {
        return app.serveStatic(req, res, staticPath);
      }

      return next();
    });

    server.get('/sitemap.xml', (req, res) => {
      const sitemap = generateSitemap(req);
      return res.header('Content-Type', 'application/xml').send(sitemap);
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(port, () => console.log(`Server listening at localhost:${port}`));
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
