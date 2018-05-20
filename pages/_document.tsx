import Document, { Main, Head, NextScript } from 'next/document';
import { unsafe_getEnvScriptForDocument } from '../utils/env';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      absoluteUrl: ctx.pathname,
    };
  }

  render() {
    return (
      <html
        lang="pl-PL"
        prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb#"
        itemScope
        itemType="http://schema.org/WebPage"
      >
        <Head>
          <base href="/" />

          <meta
            name="viewport"
            content="width=device-width, user-scalable=yes, initial-scale=1.0, viewport-fit=cover"
          />

          <meta property="og:type" content="website" />

          <meta property="og:url" content={this.props.absoluteUrl} />

          <meta property="og:image" content="https://fefaq.pl/img/fefaq-cover-facebook.png" />

          <meta property="og:site_name" content="Fefaq.pl" />

          <meta property="fb:app_id" content="2005583769700691" />
          <meta property="og:locale" content="pl_PL" />

          <link rel="apple-touch-icon" sizes="180x180" href="/static/favicons/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/static/favicons/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/static/favicons/favicon-16x16.png" />
          <link rel="manifest" href="/static/favicons/manifest.json" />
          <link rel="mask-icon" href="/static/favicons/safari-pinned-tab.svg" color="#673ab7" />
          <link rel="apple-touch-startup-image" href="/static/favicons/splash-iphone-8.png" />
          <meta name="msapplication-TileColor" content="#673ab7" />
          <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
          <meta name="theme-color" content="#ffffff" />

          <link rel="stylesheet" href="/_next/static/style.css" />

          <link
            rel="stylesheet"
            href="https://cdn.rawgit.com/konpa/devicon/df6431e323547add1b4cf45992913f15286456d3/devicon.min.css"
          />

          <link
            href="https://fonts.googleapis.com/css?family=Fira+Sans:200,400,700&amp;subset=latin-ext"
            rel="stylesheet"
          />

          <script dangerouslySetInnerHTML={unsafe_getEnvScriptForDocument()} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
