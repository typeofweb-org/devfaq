module.exports = {
  require: ['test/setup-env.js', 'source-map-support/register', 'tsconfig-paths/register'],
  timeout: 600000,
  bail: true,
  exit: true,
};
