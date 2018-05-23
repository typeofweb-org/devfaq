require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
});

const withTypescript = require('@zeit/next-typescript');
const withSass = require('@zeit/next-sass');
const withImages = require('next-images');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const { ANALYZE } = process.env;

const withPolyfills = (module.exports = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();

        if (entries['main.js']) {
          entries['main.js'].unshift('./polyfills.js');
        }

        return entries;
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
      if (ANALYZE) {
        console.log('ANALYZE=YES');
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerPort: options.isServer ? 8888 : 8889,
            openAnalyzer: true,
          })
        );
      } else {
        console.log('ANALYZE=NO');
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
      withTypescript(
        withSass({
          sassLoaderOptions: {
            includePaths: ['styles/'],
          },
          webpack: (config, options) => {
            if (options.isServer && process.env.NODE_ENV !== 'production') {
              config.plugins.push(new ForkTsCheckerWebpackPlugin());
            }
            config.plugins.push(new LodashModuleReplacementPlugin());
            return config;
          },
        })
      )
    )
  )
);
config.useFileSystemPublicRoutes = false;

config.exportPathMap = function() {
  return {
    '/': { page: '/' },
  };
};

module.exports = config;
