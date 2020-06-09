/* eslint-disable */
// @t s-nocheck
import { danger } from 'danger';
import { run as apiDanger } from './apps/api/dangerfile';
import { run as wwwDanger } from './apps/www/dangerfile';

(async () => {
  let exitCode = 0;
  try {
    const shouldRunForApi =
      danger.git.modified_files.some((file) => file.includes('apps/api/')) ||
      danger.git.created_files.some((file) => file.includes('apps/api/'));
    const shouldRunForWww =
      danger.git.modified_files.some((file) => file.includes('apps/www/')) ||
      danger.git.created_files.some((file) => file.includes('apps/www/'));

    if (shouldRunForApi) {
      await apiDanger();
    }
    if (shouldRunForWww) {
      await wwwDanger();
    }
  } catch (err) {
    console.error(err);
    exitCode = 1;
  }

  process.exit(exitCode);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
