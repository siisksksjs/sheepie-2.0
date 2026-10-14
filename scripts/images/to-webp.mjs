// Convert every JPG/PNG under public/images and public/brand to WebP, then point the code at the new files.
// Run: node scripts/images/to-webp.mjs
// - Long edge capped at 2400px; camera orientation (EXIF) is applied before encoding.
// - Social preview images stay JPG (WhatsApp/Facebook link previews): see KEEP.
// - Sources are removed after conversion (they stay in git history).
import { readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const PUBLIC = path.join(ROOT, "public");
const SCAN = ["images", "brand"];
const KEEP = new Set(["/images/bio/sheepie-hero-v2.jpg"]);
const CODE_DIRS = ["app", "components", "lib", "data", "messages"];
const MAX = 2400;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const exists = (p) => stat(p).then(() => true, () => false);

const renames = new Map(); // "/images/a.JPG" -> "/images/a.webp"
let before = 0;
let after = 0;

for (const top of SCAN) {
  for (const file of await walk(path.join(PUBLIC, top))) {
    if (!/\.(jpe?g|png)$/i.test(file)) continue;
    const url = "/" + path.relative(PUBLIC, file).split(path.sep).join("/");
    if (KEEP.has(url)) continue;
    const target = file.replace(/\.(jpe?g|png)$/i, ".webp");
    const size = (await stat(file)).size;
    before += size;
    if (!(await exists(target))) {
      const png = /\.png$/i.test(file);
      await sharp(file)
        .rotate()
        .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true })
        .webp(png ? { quality: 90, alphaQuality: 100, effort: 5 } : { quality: 82, effort: 5 })
        .toFile(target);
    }
    after += (await stat(target)).size;
    await rm(file);
    renames.set(url, url.replace(/\.(jpe?g|png)$/i, ".webp"));
  }
}

// Point the code at the new files.
let touched = 0;
for (const dir of CODE_DIRS) {
  for (const file of await walk(path.join(ROOT, dir))) {
    if (!/\.(tsx?|json|css|mjs|js)$/.test(file)) continue;
    const text = await readFile(file, "utf8");
    let next = text;
    for (const [from, to] of renames) next = next.split(from).join(to);
    if (next !== text) {
      await writeFile(file, next);
      touched++;
    }
  }
}

const mb = (n) => (n / 1e6).toFixed(1);
console.log(`${renames.size} images converted: ${mb(before)} MB -> ${mb(after)} MB; ${touched} source files updated`);
