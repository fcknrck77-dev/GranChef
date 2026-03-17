/* eslint-disable no-console */

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

async function exists(p) {
  try {
    await fsp.access(p);
    return true;
  } catch {
    return false;
  }
}

async function copyRecursive(src, dest) {
  const stat = await fsp.stat(src);
  if (stat.isDirectory()) {
    await fsp.mkdir(dest, { recursive: true });
    const entries = await fsp.readdir(src);
    for (const entry of entries) {
      await copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }
  await fsp.mkdir(path.dirname(dest), { recursive: true });
  await fsp.copyFile(src, dest);
}

async function main() {
  const root = process.cwd();
  const srcOut = path.join(root, 'out');
  const destOut = path.join(root, 'out-landing');

  if (!(await exists(srcOut))) {
    console.error('No existe la carpeta out/. Ejecuta primero el build estático.');
    process.exit(1);
  }

  await fsp.rm(destOut, { recursive: true, force: true });
  await fsp.mkdir(destOut, { recursive: true });

  const allowDirs = [
    '_next',
    'assets',
    '404',
    '_not-found',
    'pricing',
    'policies',
    'login',
  ];

  for (const d of allowDirs) {
    const from = path.join(srcOut, d);
    if (fs.existsSync(from)) {
      await copyRecursive(from, path.join(destOut, d));
    }
  }

  // Root files needed by the landing and basic SEO/assets.
  const rootFiles = await fsp.readdir(srcOut);
  for (const name of rootFiles) {
    const from = path.join(srcOut, name);
    const st = await fsp.stat(from);
    if (!st.isFile()) continue;

    const lower = name.toLowerCase();
    const keep =
      lower === 'index.html' ||
      lower === '404.html' ||
      lower === 'favicon.ico' ||
      lower === 'robots.txt' ||
      lower === 'sitemap.xml' ||
      lower.endsWith('.svg') ||
      lower.endsWith('.png') ||
      lower.endsWith('.jpg') ||
      lower.endsWith('.jpeg') ||
      lower.endsWith('.webp') ||
      lower.endsWith('.webmanifest');

    if (keep) {
      await copyRecursive(from, path.join(destOut, name));
    }
  }

  console.log(`OK: generado ${path.relative(root, destOut)} con contenido de landing.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

