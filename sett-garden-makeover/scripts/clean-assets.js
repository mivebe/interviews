import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');
const ASSETS_DIR = path.join(ROOT, 'src', 'assets');
const SRC_DIRS = [path.join(ROOT, 'src'), path.join(ROOT, 'index.html')];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function collectCode(paths) {
  const exts = new Set(['.js', '.ts', '.html', '.css', '.json']);
  const out = [];
  for (const p of paths) {
    const stat = fs.statSync(p);
    if (stat.isFile() && exts.has(path.extname(p))) {
      out.push(p);
    } else if (stat.isDirectory()) {
      out.push(...walk(p).filter(f => exts.has(path.extname(f))));
    }
  }
  return out;
}

const dryRun = process.argv.includes('--dry-run');
const allCode = collectCode(SRC_DIRS).map(f => fs.readFileSync(f, 'utf-8')).join('\n');

const unused = walk(ASSETS_DIR).filter(asset => {
  const name = path.basename(asset);
  const stem = path.basename(asset, path.extname(asset));
  const rel = './' + path.relative(path.join(ROOT, 'src'), asset).replace(/\\/g, '/');
  return !allCode.includes(name) && !allCode.includes(rel) && !allCode.includes(stem);
});

if (!unused.length) {
  console.log('No unused assets.');
  process.exit(0);
}

console.log(`${unused.length} unused asset(s):\n`);
for (const f of unused) {
  const rel = path.relative(ROOT, f).replace(/\\/g, '/');
  if (dryRun) {
    console.log(`  ${rel}`);
  } else {
    fs.unlinkSync(f);
    console.log(`  deleted ${rel}`);
  }
}
if (dryRun) console.log('\nPass without --dry-run to delete.');
