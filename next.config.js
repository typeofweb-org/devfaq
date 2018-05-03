const withTypescript = require('@zeit/next-typescript');
const withSass = require('@zeit/next-sass');
const withImages = require('next-images');

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

const config = withPolyfills(withImages(withTypescript(withSass())));
config.useFileSystemPublicRoutes = false;

module.exports = config;

module.exports.exportPathMap = function() {
  return {
    '/': { page: '/' },
  };
};
