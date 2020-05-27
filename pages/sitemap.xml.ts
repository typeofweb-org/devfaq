import { NextPageContext } from 'next';
import env from '../utils/env';

type Item = {
  path: string;
  changefreq: 'daily' | 'monthly' | 'always' | 'hourly' | 'weekly' | 'yearly' | 'never';
  priority: number;
};

const itemsToXml = (items: ReadonlyArray<Item>) => {
  return items.reduce((postsXml, item) => {
    return (
      postsXml +
      `
    <url>
      <loc>${env.ABSOLUTE_URL}${item.path}</loc>
      <changefreq>${item.changefreq}</changefreq>
      <priority>${item.priority}</priority>
    </url>`
    );
  }, '');
};

const sitemapXml = (items: ReadonlyArray<Item>) => {
  const xml = itemsToXml(items);
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
    ${xml}
  </urlset>`;
};

const Sitemap = () => {
  // nothing
};

Sitemap.getInitialProps = async ({ res }: NextPageContext) => {
  if (!res) {
    return;
  }

  const items = [
    { path: '/', changefreq: 'hourly', priority: 1 },
    { path: '/questions', changefreq: 'hourly', priority: 0.9 },
    { path: '/questions/html', changefreq: 'hourly', priority: 0.6 },
    { path: '/questions/js', changefreq: 'hourly', priority: 0.6 },
    { path: '/questions/css', changefreq: 'hourly', priority: 0.6 },
    { path: '/questions/react', changefreq: 'hourly', priority: 0.6 },
    { path: '/questions/angular', changefreq: 'hourly', priority: 0.6 },
    { path: '/questions/git', changefreq: 'hourly', priority: 0.6 },
    { path: '/questions/other', changefreq: 'hourly', priority: 0.6 },
    { path: '/selected-questions', changefreq: 'weekly', priority: 0.3 },
    { path: '/about', changefreq: 'weekly', priority: 0.5 },
    { path: '/authors', changefreq: 'weekly', priority: 0.5 },
    { path: '/regulations', changefreq: 'monthly', priority: 0.1 },
  ] as const;

  // @todo generate links for every question here
  // const blogPosts = getBlogPosts();
  res.setHeader('Content-Type', 'application/xml');
  res.write(sitemapXml(items));
  res.end();
};

export default Sitemap;
