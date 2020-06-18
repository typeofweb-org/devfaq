// @ts-nocheck
import path from 'path';

import fse from 'fs-extra';

const workspaceRoot = path.join(__dirname, '../../');
const snapshotDestPath = path.join(workspaceRoot, 'size-snapshot.json');

type SizeUnit = 'B' | 'kB' | 'MB' | 'GB' | 'TB' | 'PB';

/**
 * Inverse to `pretty-bytes`
 */
function prettyBytesInverse(n: string, unit: SizeUnit): number {
  const metrixPrefix = unit.length < 2 ? '' : unit[0];
  const metricPrefixes = ['', 'k', 'M', 'G', 'T', 'P'];
  const metrixPrefixIndex = metricPrefixes.indexOf(metrixPrefix);
  if (metrixPrefixIndex === -1) {
    throw new TypeError(
      `unrecognized metric prefix '${metrixPrefix}' in unit '${unit}'. only '${metricPrefixes.join(
        "', '"
      )}' are allowed`
    );
  }

  const power = metrixPrefixIndex * 3;
  return Number(n) * 10 ** power;
}

/**
 * parses output from next build to size snapshot format
 */

async function getNextPagesSize(): Promise<
  ReadonlyArray<
    readonly [
      string,
      {
        parsed: number;
        count?: number | undefined;
      }
    ]
  >
> {
  const consoleOutput = await fse.readFile(path.join(__dirname, '../../analyze.next'), {
    encoding: 'utf8',
  });
  const pageRegex = /(?<treeViewPresentation>┌|├|└)\s+((?<subTree>┌|├|└)\s+)?((?<fileType>λ|○|●)\s+)?(?<pageUrl>[^\s]+)\s+(?<sizeFormatted>[0-9.]+)\s+(?<sizeUnit>\w+)/gm;

  const jsChunks: number[] = [];
  const cssChunks: number[] = [];

  type Group = {
    treeViewPresentation: string;
    subTree?: string;
    fileType?: string;
    pageUrl: string;
    sizeFormatted: string;
    sizeUnit: SizeUnit;
    children: Group[];
  };

  const rows = (Array.from(consoleOutput.matchAll(pageRegex)) as unknown) as Array<{
    groups: Group;
  }>;

  const groupedRows = rows
    .map((r) => r.groups)
    .reduce<Group[]>((acc, group, index) => {
      if (group.pageUrl === '/_app') {
        // skip because it's included later on as /static/pages/_app so this is a duplicate
        return acc;
      }
      if (group.subTree && index > 0) {
        for (let i = acc.length - 1; i >= 0; --i) {
          if (!acc[i].subTree) {
            acc[i].children = acc[i].children || [];
            acc[i].children?.push(group);
            return acc;
          }
        }
      }
      acc.push({ ...group, children: [] });
      return acc;
    }, []);

  const entries = groupedRows.map((row) => {
    const { pageUrl, sizeFormatted, sizeUnit, children } = row;
    let snapshotId = `${pageUrl}`;

    if (pageUrl.startsWith('css/')) {
      cssChunks.push(prettyBytesInverse(sizeFormatted, sizeUnit));
      return null;
    } else if (pageUrl.includes('pages/_app.')) {
      snapshotId = 'shared:_app.js';
    } else if (/^runtime\/main\.(.+)\.js$/.test(pageUrl)) {
      snapshotId = 'shared:runtime/main';
    } else if (/^runtime\/webpack\.(.+)\.js$/.test(pageUrl)) {
      snapshotId = 'shared:runtime/webpack';
    } else if (/^chunks\/commons\.(.+)\.js$/.test(pageUrl)) {
      snapshotId = 'shared:chunk/commons';
    } else if (/^chunks\/MarkdownText\.(.+)\.js$/.test(pageUrl)) {
      snapshotId = 'shared:MarkdownText';
    } else if (/^chunks\/framework\.(.+)\.js$/.test(pageUrl)) {
      snapshotId = 'shared:chunk/framework';
    } else if (/^chunks\/(.*)\.js$/.test(pageUrl)) {
      // shared chunks are unnamed and only have a hash
      // we just track their count and summed size
      jsChunks.push(prettyBytesInverse(sizeFormatted, sizeUnit));
      // and not each chunk individually
      return null;
    }

    const childrenSizeSum = children.reduce((acc, group) => {
      return acc + prettyBytesInverse(group.sizeFormatted, group.sizeUnit);
    }, 0);

    return [
      snapshotId,
      {
        parsed: prettyBytesInverse(sizeFormatted, sizeUnit),
        childrenSize: childrenSizeSum,
        children: children.reduce((acc, c) => {
          const key = c.pageUrl.replace(/\/[a-z0-9]{20}/, '/[hash]');
          acc[key] = acc[key] || { parsed: 0 };
          acc[key].parsed += prettyBytesInverse(c.sizeFormatted, c.sizeUnit);
          return acc;
        }, {} as Record<string, { parsed: number }>),
      } as {
        parsed: number;
        childrenSize: number;
        children: Record<string, { parsed: number }>;
        count?: number;
      },
    ] as const;
  });

  type NonNullableArray<A extends any[]> = Array<NonNullable<A[number]>>;

  const nonEmptyEntries = entries.filter((entry) => entry != null) as NonNullableArray<
    typeof entries
  >;

  nonEmptyEntries.push([
    'shared:js',
    {
      parsed: jsChunks.reduce((sum, size) => sum + size, 0),
      count: jsChunks.length,
      childrenSize: 0,
      children: {},
    },
  ]);
  nonEmptyEntries.push([
    'shared:css',
    {
      parsed: cssChunks.reduce((sum, size) => sum + size, 0),
      count: cssChunks.length,
      childrenSize: 0,
      children: {},
    },
  ]);

  return nonEmptyEntries;
}

async function run() {
  await fse.writeJSON(snapshotDestPath, Object.fromEntries(await getNextPagesSize()), {
    spaces: 2,
  });
}

console.log('Running');
run().catch((err) => {
  console.error(err);
  process.exit(1);
});
