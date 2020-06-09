/* eslint-disable */
// @t s-nocheck
// Based on https://github.com/mui-org/material-ui/blob/3eb02f5498857bd01bb7924eed9b946f33e39052/dangerfile.js

import { danger, markdown, fail } from 'danger';

import Path from 'path';

import { lighthouseCheck } from '@foo-software/lighthouse-check';
import prettyBytes from 'pretty-bytes';

import { waitForVercel } from './scripts/waitForVercel';
import {
  LighthouseResult,
  getBadge,
  lighthouseAuditTitles,
  lighthouseAuditUrls,
  git,
  generateComparison,
  createComparisonTable,
  formatDiff,
} from './scripts/lighthouse';

const apiDanger = async () => {
  /**
   * Check if yarn.lock is updated when package.json is changed
   */
  {
    const packageChanged = danger.git.modified_files.includes('package.json');
    const lockfileChanged = danger.git.modified_files.includes('yarn.lock');
    if (packageChanged && !lockfileChanged) {
      const text = 'Changes were made to package.json, but not to yarn.lock!';
      const idea = 'Perhaps you need to run `yarn install`?';
      warn(`${text} - <i>${idea}</i>`, 'package.json');
    } else if (!packageChanged && lockfileChanged) {
      const text = 'Changes were made to yarn.lock, but not to package.json!';
      const idea = 'Please revert yarn.lock';
      fail(`${text} - <i>${idea}</i>`, 'yarn.lock');
    }
  }

  /**
   * Prevent modifying migrations
   */
  {
    const migrationsChanged = danger.git.modified_files.find((file) =>
      file.includes('src/migrations')
    );

    if (migrationsChanged) {
      fail(
        `Don't edit existing migration files! Create a new migration script instead.`,
        migrationsChanged
      );
    }
  }

  /**
   * Add new migrations
   */
  {
    const modelsChanged = danger.git.modified_files.find((file) => file.includes('src/models'));
    const modelsAdded = danger.git.created_files.find((file) => file.includes('src/models'));
    const migrationsAdded = danger.git.created_files.find((file) =>
      file.includes('src/migrations')
    );

    if ((modelsChanged || modelsAdded) && !migrationsAdded) {
      warn(
        `Changes were made to models but no migrations were added. Perhaps you should create a new migration?`,
        modelsChanged || modelsAdded
      );
    }
  }

  /**
   * Add new migrations when consts are changed
   */
  {
    const modelsConstsChanged = danger.git.modified_files.find(
      (file) => file === 'src/models-consts.ts'
    );
    const migrationsAdded = danger.git.created_files.find((file) =>
      file.includes('src/migrations')
    );

    if (modelsConstsChanged && !migrationsAdded) {
      warn(
        `Changes were made to models-consts but no migrations were added. Perhaps you should create a new migration?`,
        modelsConstsChanged
      );
    }
  }
};

async function loadComparison() {
  const previousSnapshot = (await import('../previous-size-snapshot.json')).default;
  const currentSnapshot = (await import('../current-size-snapshot.json')).default;
  console.log(previousSnapshot);
  console.log(currentSnapshot);
  return generateComparison({ previousSnapshot, currentSnapshot });
}

async function commentLightHouseReport() {
  const {
    DANGER_GITHUB_API_TOKEN,
    CIRCLE_PROJECT_USERNAME,
    CIRCLE_PROJECT_REPONAME,
    CIRCLE_BUILD_NUM,
  } = process.env;

  if (!DANGER_GITHUB_API_TOKEN) {
    throw new Error(`Missing DANGER_GITHUB_API_TOKEN!`);
  }
  if (!CIRCLE_PROJECT_USERNAME) {
    throw new Error(`Missing CIRCLE_PROJECT_USERNAME!`);
  }
  if (!CIRCLE_PROJECT_REPONAME) {
    throw new Error(`Missing CIRCLE_PROJECT_REPONAME!`);
  }
  if (!CIRCLE_BUILD_NUM) {
    throw new Error(`Missing CIRCLE_BUILD_NUM!`);
  }

  return waitForVercel()
    .then(async (url) => {
      const results: LighthouseResult = await lighthouseCheck({
        urls: [url],
        outputDirectory: Path.join('/tmp/lighthouse/'),
      });
      const repo = await danger.github.api.repos.get({
        owner: CIRCLE_PROJECT_USERNAME,
        repo: CIRCLE_PROJECT_REPONAME,
      });

      const result = results.data[0];
      const artifactsUrl = `https://${CIRCLE_BUILD_NUM}-${repo.data.id}-gh.circle-artifacts.com/0${result.localReport}`;

      let mrkd = '';

      ([
        'performance',
        'accessibility',
        'bestPractices',
        'seo',
        'progressiveWebApp',
      ] as const).forEach((current) => {
        const badge = getBadge({
          title: lighthouseAuditTitles[current].replace(/ /g, '%20'),
          score: result.scores[current],
        });
        mrkd += `[${badge}](${artifactsUrl}#${lighthouseAuditUrls[current]})`;
      });

      mrkd += `\n\n[Open full report](${artifactsUrl})`;
      mrkd += `\n\nVercel preview deploy: ${result.url}`;
      markdown(
        `
# Lighthouse results
${mrkd}
`.trim()
      );
    })
    .catch((err) => {
      fail(`Couldn't show Lighthouse results because: ` + (err.message || err));
    });
}

async function commentSizesReport() {
  // const upstreamRepo = danger.github.pr.base.repo.full_name;
  const baseBranch = danger.github.pr.base.ref; // i.e. develop

  const mergeBaseCommit = await git(`merge-base HEAD origin/${baseBranch}`);
  const commitRange = `${mergeBaseCommit}...${danger.github.pr.head.sha}`;
  const comparison = await loadComparison();

  const results = Object.entries(comparison);

  const summary = results.reduce(
    (acc, x) => {
      acc.current += x[1].parsed.current || 0;
      acc.previous += x[1].parsed.previous || 0;
      return acc;
    },
    { current: 0, previous: 0 }
  );

  const pageDetailsTable = createComparisonTable(results, {
    computeBundleLabel: (bundleId) => bundleId,
  });

  const summaryOfResults = {
    previous: summary.previous,
    current: summary.current,
    absoluteDiff: summary.current - summary.previous,
    relativeDiff: summary.current / summary.previous - 1,
  };

  const details = `
  # Bundle size changes

  <p>Comparing: ${commitRange}</p>
  
  ## Summary
  * Size change: ${formatDiff(summaryOfResults.absoluteDiff, summaryOfResults.relativeDiff)}
  * Size: ${prettyBytes(summaryOfResults.current)}

  <details>
  <summary>Details of page changes</summary>

  ${pageDetailsTable}
  </details>
`;

  markdown(details);
}

const wwwDanger = async () => {
  await commentSizesReport();
  // @todo reenable after creating builds for each PR
  // await commentLightHouseReport();
};

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
