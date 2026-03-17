/* eslint-disable no-console */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();

function shouldFix(text) {
  // Common mojibake markers when UTF-8 was decoded as Latin-1/Windows-1252.
  return /�|�|�|�"|�S|��|�x/.test(text);
}

function fixText(text) {
  // Re-interpret the current JS string as Latin-1 bytes, then decode as UTF-8.
  // This reliably fixes sequences like "Añadir" -> "A�adir".
  return Buffer.from(text, 'latin1').toString('utf8');
}

function walk(dir, out) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.next' || e.name === '.git') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
}

function main() {
  const targets = process.argv.slice(2);
  const files = [];

  if (targets.length === 0) {
    walk(path.join(ROOT, 'src'), files);
    walk(path.join(ROOT, 'scripts'), files);
  } else {
    for (const t of targets) files.push(path.isAbsolute(t) ? t : path.join(ROOT, t));
  }

  const exts = new Set(['.ts', '.tsx', '.js', '.sql', '.txt', '.md']);
  let changed = 0;

  for (const f of files) {
    const ext = path.extname(f).toLowerCase();
    if (!exts.has(ext)) continue;
    if (!fs.existsSync(f)) continue;
    const raw = fs.readFileSync(f);
    // Strip UTF-8 BOM if present
    const bytes = raw.length >= 3 && raw[0] === 0xef && raw[1] === 0xbb && raw[2] === 0xbf ? raw.slice(3) : raw;
    const text = bytes.toString('utf8');
    if (!shouldFix(text)) continue;
    const fixed = fixText(text);
    if (fixed !== text) {
      fs.writeFileSync(f, fixed, { encoding: 'utf8' });
      changed++;
      console.log('fixed:', path.relative(ROOT, f));
    }
  }

  console.log(`Done. Files fixed: ${changed}`);
}

main();

