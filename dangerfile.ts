// https://github.com/mui-org/material-ui/blob/3eb02f5498857bd01bb7924eed9b946f33e39052/dangerfile.js
// tslint:disable: no-implicit-dependencies
import { danger, markdown } from 'danger';
import { exec } from 'child_process';
import prettyBytes from 'pretty-bytes';
import { loadComparison } from './scripts/sizeSnapshot';

const parsedSizeChangeThreshold = 300;
const gzipSizeChangeThreshold = 100;

type Sizes = {
  parsed: {
    previous: number;
    current: number;
    absoluteDiff: number;
    relativeDiff: number;
  };
  gzip: {
    previous: number;
    current: number;
    absoluteDiff: number;
    relativeDiff: number;
  };
};
type ComparisonBundleEntry = [string, Sizes];

type Comparison = {
  previous: string;
  current: 'HEAD';
  bundles: Record<string, Sizes>;
};

/**
 * executes a git subcommand
 */
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

const UPSTREAM_REMOTE = 'danger-upstream';

/**
 * This is mainly used for local development. It should be executed before the
 * scripts exit to avoid adding internal remotes to the local machine. This is
 * not an issue in CI.
 */
async function cleanup() {
  await git(`remote remove ${UPSTREAM_REMOTE}`);
}

/**
 * creates a callback for Object.entries(comparison).filter that excludes every
 * entry that does not exceed the given threshold values for parsed and gzip size
 */
function createComparisonFilter(parsedThreshold: number, gzipThreshold: number) {
  return (comparisonEntry: ComparisonBundleEntry) => {
    const [, snapshot] = comparisonEntry;
    return (
      Math.abs(snapshot.parsed.absoluteDiff) >= parsedThreshold ||
      Math.abs(snapshot.gzip.absoluteDiff) >= gzipThreshold
    );
  };
}

/**
 * checks if the bundle is of a package e.b. `@material-ui/core` but not
 * `@material-ui/core/Paper`
 */
function isPackageComparison(comparisonEntry: [string, Sizes]) {
  const [bundleKey] = comparisonEntry;
  return /^@[\w-]+\/[\w-]+$/.test(bundleKey);
}

/**
 * Generates a user-readable string from a percentage change
 */
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

/**
 * Generates a Markdown table
 */
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

function generateEmphasizedChange([bundle, { parsed, gzip }]: ComparisonBundleEntry) {
  // increase might be a bug fix which is a nice thing. reductions are always nice
  const changeParsed = addPercent(parsed.relativeDiff, ':heart_eyes:', '');
  const changeGzip = addPercent(gzip.relativeDiff, ':heart_eyes:', '');

  return `**${bundle}**: parsed: ${changeParsed}, gzip: ${changeGzip}`;
}

/**
 *
 */
function createComparisonTable(
  entries: ComparisonBundleEntry[],
  options: { computeBundleLabel(x: string): string }
) {
  const { computeBundleLabel } = options;

  return generateMDTable(
    [
      { label: 'bundle', align: 'left' },
      { label: 'Size Change', align: 'right' },
      { label: 'Size', align: 'right' },
      { label: 'Gzip Change', align: 'right' },
      { label: 'Gzip', align: 'right' },
    ],
    entries
      .map(([bundleId, size]) => [computeBundleLabel(bundleId), size] as const)
      // orderBy(|parsedDiff| DESC, |gzipDiff| DESC, name ASC)
      .sort(([labelA, statsA], [labelB, statsB]) => {
        const compareParsedDiff =
          Math.abs(statsB.parsed.absoluteDiff) - Math.abs(statsA.parsed.absoluteDiff);
        const compareGzipDiff =
          Math.abs(statsB.gzip.absoluteDiff) - Math.abs(statsA.gzip.absoluteDiff);
        const compareName = labelA.localeCompare(labelB);

        if (compareParsedDiff === 0 && compareGzipDiff === 0) {
          return compareName;
        }
        if (compareParsedDiff === 0) {
          return compareGzipDiff;
        }
        return compareParsedDiff;
      })
      .map(([label, { parsed, gzip }]) => {
        return [
          label,
          formatDiff(parsed.absoluteDiff, parsed.relativeDiff),
          prettyBytes(parsed.current),
          formatDiff(gzip.absoluteDiff, gzip.relativeDiff),
          prettyBytes(gzip.current),
        ];
      })
  );
}

/**
 * Puts results in different buckets wh
 */
function sieveResults(results: ComparisonBundleEntry[]) {
  const main: ComparisonBundleEntry[] = [];
  const pages: ComparisonBundleEntry[] = [];

  results.forEach((entry) => {
    const [bundleId] = entry;

    if (bundleId.startsWith('docs:')) {
      pages.push(entry);
    } else {
      main.push(entry);
    }
  });

  return { all: results, main, pages };
}

async function run() {
  // Use git locally to grab the commit which represents the place
  // where the branches differ
  const upstreamRepo = danger.github.pr.base.repo.full_name;
  const upstreamRef = danger.github.pr.base.ref;
  try {
    await git(`remote add ${UPSTREAM_REMOTE} https://github.com/${upstreamRepo}.git`);
  } catch (err) {
    // ignore if it already exist for local testing
  }
  await git(`fetch ${UPSTREAM_REMOTE}`);
  const mergeBaseCommit = await git(`merge-base HEAD ${UPSTREAM_REMOTE}/${upstreamRef}`);

  const commitRange = `${mergeBaseCommit}...${danger.github.pr.head.sha}`;

  const comparison: Comparison = await loadComparison(mergeBaseCommit, upstreamRef);

  const { all: allResults, main: mainResults, pages: pageResults } = sieveResults(
    Object.entries(comparison.bundles)
  );
  const anyResultsChanges = allResults.filter(createComparisonFilter(1, 1));

  if (anyResultsChanges.length > 0) {
    const importantChanges = mainResults
      .filter(createComparisonFilter(parsedSizeChangeThreshold, gzipSizeChangeThreshold))
      .filter(isPackageComparison)
      .map(generateEmphasizedChange);

    // have to guard against empty strings
    if (importantChanges.length > 0) {
      markdown(importantChanges.join('\n'));
    }

    const mainDetailsTable = createComparisonTable(mainResults, {
      computeBundleLabel: (bundleId) => {
        if (bundleId === 'packages/material-ui/build/umd/material-ui.production.min.js') {
          return '@material-ui/core[umd]';
        }
        if (bundleId === '@material-ui/core/Textarea') {
          return 'TextareaAutosize';
        }
        if (bundleId === 'docs.main') {
          return 'docs:/_app';
        }
        if (bundleId === 'docs.landing') {
          return 'docs:/';
        }
        return bundleId.replace(/^@material-ui\/core\//, '').replace(/\.esm$/, '');
      },
    });
    const pageDetailsTable = createComparisonTable(pageResults, {
      computeBundleLabel: (bundleId) => {
        // a page
        if (bundleId.startsWith('docs:/')) {
          const host = `https://deploy-preview-${danger.github.pr.number}--material-ui.netlify.app`;
          const page = bundleId.replace(/^docs:/, '');
          return `[${page}](${host}${page})`;
        }

        // shared
        return bundleId;
      },
    });

    const details = `
  <details>
  <summary>Details of bundle changes.</summary>

  <p>Comparing: ${commitRange}</p>

  <details>
  <summary>Details of page changes</summary>

  ${pageDetailsTable}
  </details>

  ${mainDetailsTable}

  </details>`;

    markdown(details);
  } else {
    // this can later be removed to reduce PR noise. It is kept for now for debug
    // purposes only. DangerJS will swallow console.logs if it completes successfully
    markdown(`No bundle size changes comparing ${commitRange}`);
  }
}

(async () => {
  let exitCode = 0;
  try {
    await run();
  } catch (err) {
    console.error(err);
    exitCode = 1;
  }

  try {
    await cleanup();
  } catch (err) {
    console.error(err);
    exitCode = 1;
  }

  process.exit(exitCode);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
