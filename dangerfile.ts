/* eslint-disable */
// @ts-nocheck
import { apiDanger } from './scripts/api-dangerfile';
import { wwwDanger } from './scripts/www-dangerfile';

(async () => {
  let exitCode = 0;
  try {
    await apiDanger();
    await wwwDanger();
  } catch (err) {
    console.error(err);
    exitCode = 1;
  }

  process.exit(exitCode);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
