// @ts-nocheck
// Based on https://github.com/mui-org/material-ui/blob/3eb02f5498857bd01bb7924eed9b946f33e39052/dangerfile.js
// tslint:disable: no-implicit-dependencies
import { danger, markdown } from 'danger';
import { exec } from 'child_process';
import prettyBytes from 'pretty-bytes';

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

async function run() {
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

      // nicer URLs
      const page = bundleId.replace('[technology]', 'js').replace('[id]', '247');

      const host = `https://devfaq-www-git-${danger.github.pr.head.ref}.typeofweb.now.sh`;
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
  ## Bundle size changes

  <p>Comparing: ${commitRange}</p>
  
  ### Summary
  * Size change: ${formatDiff(summaryOfResults.absoluteDiff, summaryOfResults.relativeDiff)}
  * Size: ${prettyBytes(summaryOfResults.current)}

  <details>
  <summary>Details of page changes</summary>

  ${pageDetailsTable}
  </details>
`;

  markdown(details);
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
