// @ts-nocheck
// Based on https://github.com/mui-org/material-ui/blob/3eb02f5498857bd01bb7924eed9b946f33e39052/dangerfile.js
// tslint:disable: no-implicit-dependencies
import { danger, markdown, fail } from 'danger';
import { exec } from 'child_process';
import prettyBytes from 'pretty-bytes';
import { lighthouseCheck } from '@foo-software/lighthouse-check';
import Path from 'path';
import { waitForVercel } from './scripts/waitForVercel';

const lighthouseAuditTitles = {
  accessibility: 'Accessibility',
  bestPractices: 'Best Practices',
  performance: 'Performance',
  progressiveWebApp: 'Progressive Web App',
  seo: 'SEO',
};

const getLighthouseScoreColor = ({ isHex, score }) => {
  if (typeof score !== 'number') {
    return !isHex ? 'lightgrey' : '#e0e0e0';
  }

  let scoreColor = !isHex ? 'green' : '#0cce6b';

  // medium range
  if (score < 90) {
    scoreColor = !isHex ? 'orange' : '#ffa400';
  }

  // bad
  if (score < 50) {
    scoreColor = !isHex ? 'red' : '#f74531';
  }

  return scoreColor;
};

const getBadge = ({ title, score }: { title: string; score: number }) =>
  `![](https://img.shields.io/badge/${title}-${score}-${getLighthouseScoreColor({
    isHex: false,
    score,
  })}?style=flat-square&logo=lighthouse) `;

type LighthouseResult = {
  code: 'SUCCESS';
  data: Array<{
    localReport: string;
    name: string;
    report: string;
    url: string;
    tag: string;
    scores: {
      accessibility: number;
      bestPractices: number;
      performance: number;
      progressiveWebApp: number;
      seo: number;
    };
  }>;
};

type Sizes = {
  parsed: {
    previous: number;
    current: number;
    absoluteDiff: number;
    relativeDiff: number;
  };
  children: Record<
    string,
    {
      parsed: {
        previous: number;
        current: number;
        absoluteDiff: number;
        relativeDiff: number;
      };
    }
  >;
};
type ComparisonBundleEntry = [string, Sizes];

const nullSnapshot = { parsed: 0, children: {} as Record<string, { parsed: number }> };

async function loadComparison() {
  const previousSnapshot = (await import('./previous-size-snapshot.json')).default;
  const currentSnapshot = (await import('./current-size-snapshot.json')).default;
  console.log(previousSnapshot);
  console.log(currentSnapshot);

  const bundleKeys = Object.keys({ ...currentSnapshot, ...previousSnapshot }) as Array<
    keyof typeof previousSnapshot | keyof typeof currentSnapshot
  >;

  return Object.fromEntries(
    bundleKeys.map((bundle) => {
      const current = currentSnapshot[bundle] || nullSnapshot;
      const previous = previousSnapshot[bundle] || nullSnapshot;

      const currentChildrenKeys = Object.keys(current.children);
      const previousChildrenKeys = Object.keys(previous.children);
      const allKeys = [...new Set([...currentChildrenKeys, ...previousChildrenKeys])];

      const children = Object.fromEntries(
        allKeys.map((key) => {
          const currentChild =
            current.children[key as keyof typeof current.children] || nullSnapshot;
          const previousChild =
            previous.children[key as keyof typeof previous.children] || nullSnapshot;
          return [
            key,
            {
              parsed: {
                previous: previousChild.parsed,
                current: currentChild.parsed,
                absoluteDiff: currentChild.parsed - previousChild.parsed,
                relativeDiff: currentChild.parsed / previousChild.parsed - 1,
              },
            },
          ];
        })
      );

      return [
        bundle,
        {
          parsed: {
            previous: previous.parsed,
            current: current.parsed,
            absoluteDiff: current.parsed - previous.parsed,
            relativeDiff: current.parsed / previous.parsed - 1,
          },
          children,
        },
      ];
    })
  ) as Record<typeof bundleKeys[number], Sizes>;
}

function git(args: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(`git ${args}`, (err, stdout) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

function addPercent(change: number, goodEmoji = '', badEmoji = ':small_red_triangle:') {
  const formatted = (change * 100).toFixed(2);
  if (/^-|^0(?:\.0+)$/.test(formatted)) {
    return `${formatted}% ${goodEmoji}`;
  }
  return `+${formatted}% ${badEmoji}`;
}

function formatDiff(absoluteChange: number, relativeChange: number) {
  if (absoluteChange === 0) {
    return '--';
  }

  const trendIcon = absoluteChange < 0 ? '▼' : '▲';

  return `${trendIcon} ${prettyBytes(absoluteChange, { signed: true })} (${addPercent(
    relativeChange,
    '',
    ''
  )})`;
}

function generateMDTable(
  headers: Array<{ label: string; align: 'left' | 'center' | 'right' }>,
  body: string[][]
): string {
  const headerRow = headers.map((header) => header.label);
  const alignmentRow = headers.map((header) => {
    if (header.align === 'right') {
      return ' ---:';
    }
    if (header.align === 'center') {
      return ':---:';
    }
    return ' --- ';
  });

  return [headerRow, alignmentRow, ...body].map((row) => row.join(' | ')).join('\n');
}

function createComparisonTable(
  entries: ComparisonBundleEntry[],
  options: { computeBundleLabel(x: string): string }
) {
  const { computeBundleLabel } = options;

  return generateMDTable(
    [
      { label: 'File', align: 'left' },
      { label: 'Size Change', align: 'right' },
      { label: 'Size', align: 'right' },
    ],
    entries
      .map(([bundleId, size]) => [computeBundleLabel(bundleId), size] as const)
      .sort(([labelA, statsA], [labelB, statsB]) => {
        const compareParsedDiff =
          Math.abs(statsB.parsed.absoluteDiff) - Math.abs(statsA.parsed.absoluteDiff);
        const compareName = labelA.localeCompare(labelB);

        if (compareParsedDiff === 0) {
          return compareName;
        }
        return compareParsedDiff;
      })
      .flatMap(([label, { parsed, children }]) => {
        const result = [
          [
            label,
            formatDiff(parsed.absoluteDiff, parsed.relativeDiff),
            prettyBytes(parsed.current),
          ],
          ...Object.entries(children).map(([childName, { parsed }]) => {
            return [
              `  └ ${childName}`,
              formatDiff(parsed.absoluteDiff, parsed.relativeDiff),
              prettyBytes(parsed.current),
            ];
          }),
        ];

        return result;
      })
  );
}

async function commentLightHouseReport() {
  const {
    DANGER_GITHUB_API_TOKEN,
    CIRCLE_PROJECT_USERNAME,
    CIRCLE_PROJECT_REPONAME,
    CIRCLE_PR_NUMBER,
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
  if (!CIRCLE_PR_NUMBER) {
    throw new Error(`Missing CIRCLE_PR_NUMBER!`);
  }
  if (!CIRCLE_BUILD_NUM) {
    throw new Error(`Missing CIRCLE_BUILD_NUM!`);
  }

  return waitForVercel()
    .then(async (url) => {
      const results: LighthouseResult = await lighthouseCheck({
        urls: [url],
        prCommentAccessToken: `${DANGER_GITHUB_API_TOKEN}`,
        prCommentEnabled: true,
        prCommentUrl: `https://api.github.com/repos/${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}/pulls/${CIRCLE_PR_NUMBER}/reviews`,
        outputDirectory: Path.join('/tmp/lighthouse/'),
      });
      const repo = await danger.github.api.repos.get({
        owner: CIRCLE_PROJECT_USERNAME,
        repo: CIRCLE_PROJECT_REPONAME,
      });

      const result = results.data[0];

      let mrkd = '';

      (Object.keys(result.scores) as Array<keyof typeof result.scores>).forEach((current) => {
        mrkd += getBadge({
          title: lighthouseAuditTitles[current].replace(/ /g, '%20'),
          score: result.scores[current],
        });
      });

      const artifactsUrl = `https://${CIRCLE_BUILD_NUM}-${repo.data.id}-gh.circle-artifacts.com/0${result.localReport}`;
      mrkd += `\n\n${result.url}`;
      mrkd += `\n\n[Full report](${artifactsUrl})`;
      markdown(
        `
# Lighthouse results
${mrkd}
`.trim()
      );
    })
    .catch((err) => {
      fail(err.message || err);
    });
}

async function commentSizesReport() {
  // const upstreamRepo = danger.github.pr.base.repo.full_name;
  const baseBranch = danger.github.pr.base.ref; // i.e. develop
  const prBranch = danger.github.pr.head.ref;

  const mergeBaseCommit = await git(`merge-base HEAD origin/${baseBranch}`);
  const commitRange = `${mergeBaseCommit}...${prBranch}`;
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
    computeBundleLabel: (bundleId) => {
      if (bundleId.startsWith('shared:')) {
        return bundleId;
      }

      const owner = danger.github.pr.head.repo.owner.login;

      const path = owner === 'typeofweb' ? '' : `fork-${owner}-`;

      // nicer URLs
      const page = bundleId.replace('[technology]', 'js').replace('[id]', '247');

      const host = `https://devfaq-www-git-${path}${danger.github.pr.head.ref}.typeofweb.now.sh`;
      return `[${bundleId}](${host}${page})`;
    },
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

async function run() {
  await commentSizesReport();
  await commentLightHouseReport();
}

(async () => {
  let exitCode = 0;
  try {
    await run();
  } catch (err) {
    console.error(err);
    exitCode = 1;
  }

  process.exit(exitCode);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
