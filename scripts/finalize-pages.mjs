import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const base = '/hikesafepresentaition/';
async function finalize(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await finalize(path);
    else if (/\.(html|js)$/.test(entry.name)) {
      let text = await readFile(path, 'utf8');
      // The genuine Expo export is retained unchanged in public/prototype.
      // Rebase its absolute asset paths only in the Pages deployment output.
      if (path.includes('prototype')) text = text.replaceAll('/prototype/', `${base}prototype/`);
      if (path.endsWith(join('prototype', 'index.html'))) text = text.replace('</head>', '<script src="../isolation.js"></script></head>');
      await writeFile(path, text);
    }
  }
}
await finalize('docs');
await writeFile('docs/.nojekyll', '');
console.log('GitHub Pages output ready: docs/');
