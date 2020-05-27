const isProduction = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';
require('dotenv').config({
  path: isProduction ? `.env.${process.env.NODE_ENV}` : '.env',
});

const withSass = require('@zeit/next-sass');
const withImages = require('next-images');
const withOffline = require('next-offline');

const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const withPolyfills = (module.exports = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      const originalEntry = config.entry;
      config.entry = function entry() {
        return Promise.resolve(originalEntry()).then(entries => {
          if (entries['main.js']) {
            entries['main.js'].unshift('./polyfills.js');
          }

          return entries;
        });
      };

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
});

const withWebpackAnalyze = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (process.env.ANALYZE && !options.isServer) {
        // only submit analysis for the frontend
        console.log('ANALYZE=YES');
        const BundleAnalyzerPlugin = require('@bundle-analyzer/webpack-plugin');
        config.plugins.push(new BundleAnalyzerPlugin());
      }

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
};

const config = withWebpackAnalyze(
  withPolyfills(
    withImages(
      withSass({
        sassLoaderOptions: {
          includePaths: ['styles/'],
        },
        webpack: (config, options) => {
          config.plugins.push(new LodashModuleReplacementPlugin());
          return config;
        },
      })
    )
  )
);

config.exportPathMap = function() {
  return {
    '/about': { page: '/about' },
    '/authors': { page: '/authors' },
    '/regulations': { page: '/regulations' },
  };
};

config.experimental = {
  publicDirectory: true,
};

module.exports = isProduction ? withOffline(config) : config;
