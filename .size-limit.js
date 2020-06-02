const Fs = require('fs');
const Path = require('path');

function readDirRecursively(paths) {
  return Fs.readdirSync(Path.join(...paths)).flatMap((dir) => {
    const dirPath = Path.join(...paths, dir);
    if (Fs.statSync(dirPath).isDirectory()) {
      return readDirRecursively([...paths, dir]);
    } else {
      return dirPath;
    }
  });
}

const base = ['.next', 'static'];
const pages = readDirRecursively(base)
  .map((path) => {
    // remove with or without trailing separator
    const relativePath = path
      .replace(Path.join(...base) + Path.sep, '')
      .replace(Path.join(...base), '');
    const segments = relativePath.split(Path.sep);
    return { segments, path };
  })
  .filter(({ segments, path }) => {
    return !['runtime', 'css', 'chunks'].includes(segments[0]);
  })
  .map(({ segments, path }) => {
    // if it's longer than 8 then we assume it's the directory Next.js
    // randomly generates and we want to skip its name
    if (segments[0].length > 8) {
      segments.shift();
    }
    return { segments, path };
  })
  .filter(({ segments, path }) => {
    return !['_buildManifest.js', '_ssgManifest.js'].includes(segments[0]);
  })
  .map(({ segments, path }) => {
    return {
      path,
      name: Path.join(...segments),
      running: false,
      gzip: true,
    };
  });

module.exports = [
  ...pages,
  ...['runtime', 'css', 'chunks'].map((name) => {
    return {
      path: Path.join(...base, name),
      name,
      running: false,
      gzip: true,
    };
  }),
];
