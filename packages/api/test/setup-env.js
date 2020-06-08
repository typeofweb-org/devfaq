var chai = require('chai');
chai.use(require('sinon-chai'));

require('ts-node').register({
  project: './tsconfig.json',
  transpileOnly: true,
});
