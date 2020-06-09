import { exec } from 'child_process';

import prettyBytes from 'pretty-bytes';

export type LighthouseResult = {
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

export const lighthouseAuditTitles = {
  accessibility: 'Accessibility',
  bestPractices: 'Best Practices',
  performance: 'Performance',
  progressiveWebApp: 'Progressive Web App',
  seo: 'SEO',
};
export const lighthouseAuditUrls = {
  accessibility: 'accessibility',
  bestPractices: 'best-practices',
  performance: 'performance',
  progressiveWebApp: 'pwa',
  seo: 'seo',
};

const getLighthouseScoreColor = ({ isHex, score }: { isHex: boolean; score?: number }) => {
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

export const getBadge = ({ title, score }: { title: string; score: number }) =>
  `![](https://img.shields.io/badge/${title}-${score}-${getLighthouseScoreColor({
    isHex: false,
    score,
  })}?style=flat-square&logo=lighthouse) `;

export function git(args: string): Promise<string> {
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

export function addPercent(change: number, goodEmoji = '', badEmoji = ':small_red_triangle:') {
  const formatted = (change * 100).toFixed(2);
  if (/^-|^0(?:\.0+)$/.test(formatted)) {
    return `${formatted}% ${goodEmoji}`;
  }
  return `+${formatted}% ${badEmoji}`;
}

export function formatDiff(absoluteChange: number, relativeChange: number) {
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

export function generateMDTable(
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

export function createComparisonTable(
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
const nullSnapshot = { parsed: 0, children: {} as Record<string, { parsed: number }> };

export function generateComparison({ previousSnapshot, currentSnapshot }: any) {
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
