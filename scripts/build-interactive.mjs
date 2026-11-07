import { build } from 'esbuild';
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { createRequire } from 'node:module';
const outdir = 'assets/interactive';
await rm(outdir, { recursive: true, force: true });
await mkdir(outdir, { recursive: true });
const result = await build({ entryPoints: ['src/main.tsx'], outdir, entryNames: 'main', chunkNames: '[name]-[hash]', bundle: true, minify: true, splitting: true, format: 'esm', target: 'es2022', metafile: true, legalComments: 'linked' });
// Pre-render the same React tree: meaningful product content survives script failures.
await build({ entryPoints: ['src/components/Dashboard.tsx'], outfile: '.build/dashboard.cjs', bundle: true, platform: 'node', format: 'cjs', packages: 'external' });
const require = createRequire(import.meta.url);
const { renderToString } = require('react-dom/server');
const { createElement } = require('react');
const { Dashboard } = require('../.build/dashboard.cjs');
await build({ entryPoints: ['src/components/BusinessStudio.tsx'], outfile: '.build/studio.cjs', bundle: true, platform: 'node', format: 'cjs', packages: 'external', loader: { '.css': 'empty' } });
const { BusinessStudio } = require('../.build/studio.cjs');
const html = await readFile('index.html', 'utf8');
await writeFile('index.html', html.replace(/<!-- business-studio:start -->[\s\S]*?<!-- business-studio:end -->/, `<!-- business-studio:start --><div id="business-studio-root">${renderToString(createElement(BusinessStudio))}</div><!-- business-studio:end -->`).replace(/<!-- product-preview:start -->[\s\S]*?<!-- product-preview:end -->/, `<!-- product-preview:start --><div id="product-preview">${renderToString(createElement(Dashboard))}</div><!-- product-preview:end -->`));
for (const [path, info] of Object.entries(result.metafile.outputs)) {
  if (path.endsWith('.js')) {
    const gzip = gzipSync(await readFile(path)).length;
    console.log(`${path}: ${(info.bytes / 1024).toFixed(1)} KB / ${(gzip / 1024).toFixed(1)} KB gzip`);
  }
}
await writeFile('.build/bundle-report.json', JSON.stringify(result.metafile, null, 2));
