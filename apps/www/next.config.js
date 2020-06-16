const fs = require('fs');
const path = require('path');

const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const withSourceMaps = require('@zeit/next-source-maps')();
const dotenv = require('dotenv');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const withImages = require('next-images');
const withOffline = require('next-offline');

const isProduction = process.env.NODE_ENV === 'production';

const envConfig = dotenv.parse(
  fs.readFileSync(isProduction ? `.env.${process.env.ENV || 'staging'}` : '.env')
);
for (const k in envConfig) {
  // force override next.js env variables
  process.env[k] = envConfig[k];
}

const withBundleAnalyzer = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (process.env.ANALYZE && !options.isServer) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            defaultSizes: 'gzip',
            openAnalyzer: true,
            statsFilename: './analyze/client.html',

            // analyzerMode: 'json',
            // generateStatsFile: true,
            // statsFilename: options.isServer ? '../analyze/server.json' : './analyze/client.json',
          })
        );
      }

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }
      return config;
    },
  });
};

const regexEqual = (x, y) => {
  return (
    x instanceof RegExp &&
    y instanceof RegExp &&
    x.source === y.source &&
    x.global === y.global &&
    x.ignoreCase === y.ignoreCase &&
    x.multiline === y.multiline
  );
};

const withPolyfills = (module.exports = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      const originalEntry = config.entry;
      config.entry = function entry() {
        return Promise.resolve(originalEntry()).then((entries) => {
          if (entries['main.js'] && !entries['main.js'].includes('./polyfills.js')) {
            entries['main.js'].unshift('./polyfills.js');
          }

          return entries;
        });
      };

      const oneOf = config.module.rules.find((rule) => typeof rule.oneOf === 'object');

      if (oneOf) {
        const moduleSassRule = oneOf.oneOf.find((rule) =>
          regexEqual(rule.test, /\.module\.(scss|sass)$/)
        );

        if (moduleSassRule) {
          const cssLoader = moduleSassRule.use.find(({ loader }) => loader.includes('css-loader'));
          if (cssLoader) {
            cssLoader.options.localsConvention = 'camelCase';
          }
        }
      }

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
});

const config = withSourceMaps(
  withBundleAnalyzer(
    withPolyfills(
      withImages({
        webpack: (config, options) => {
          config.plugins.push(new LodashModuleReplacementPlugin());

          // So ask Webpack to replace @sentry/node imports with @sentry/browser when
          // building the browser's bundle
          if (!options.isServer) {
            config.resolve.alias['@sentry/node'] = '@sentry/browser';
          }

          // When all the Sentry configuration env variables are available/configured
          // The Sentry webpack plugin gets pushed to the webpack plugins to build
          // and upload the source maps to sentry.
          // This is an alternative to manually uploading the source maps
          // Note: This is disabled in development mode.
          if (
            process.env.SENTRY_DSN &&
            process.env.SENTRY_ORG &&
            process.env.SENTRY_PROJECT &&
            process.env.SENTRY_AUTH_TOKEN &&
            process.env.NODE_ENV === 'production'
          ) {
            config.plugins.push(
              new SentryWebpackPlugin({
                include: '.next',
                ignore: ['node_modules'],
                urlPrefix: '~/_next',
                release: options.buildId,
              })
            );
          }

          return config;
        },
      })
    )
  )
);

config.exportPathMap = function () {
  return {
    '/about': { page: '/about' },
    '/authors': { page: '/authors' },
    '/regulations': { page: '/regulations' },
  };
};

config.env = {
  API_URL: process.env.API_URL,
  VERSION: process.env.VERSION,
  GA_TRACKING_ID: process.env.GA_TRACKING_ID,
  ABSOLUTE_URL: process.env.ABSOLUTE_URL || 'https://' + process.env.VERCEL_URL,
  SENTRY_DSN: process.env.SENTRY_DSN,
  ENV: process.env.ENV,
};

config.reactStrictMode = true;
config.experimental = {
  modern: true,
};

config.sassOptions = {
  includePaths: [path.join(__dirname, 'styles')],
};

module.exports = isProduction ? withOffline(config) : config;
