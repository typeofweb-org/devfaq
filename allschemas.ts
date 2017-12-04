// @todo
// hack
// tslint:disable-next-line:no-var-requires
const requireGlob = require('require-glob');

const newExports = requireGlob.sync('./app/modules/**/*.schema.ts');

for (const i of Object.values(newExports)) {
  for (const j of Object.values(i)) {
    Object.assign(module.exports, j);
  }
}
