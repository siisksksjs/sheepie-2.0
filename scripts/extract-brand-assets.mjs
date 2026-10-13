// Rebuilds public/brand/* from the Sheepie brand book.
// Source is either the brand book PDF (needs poppler's `pdfimages` on PATH,
// macOS: `brew install poppler`) or a directory that already holds the
// pdfimages output (p5-000..p5-004.png, p14-000.png). The directory is only
// read, never modified or deleted.
// Usage:
//   node scripts/extract-brand-assets.mjs ~/Downloads/Sheepie_MTS.pdf
//   node scripts/extract-brand-assets.mjs /path/to/brand-book-images
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import sharp from "sharp";

const source = process.argv[2];
if (!source) {
  console.error(
    "Usage: node scripts/extract-brand-assets.mjs <brand-book.pdf | brand-book-images-dir>",
  );
  process.exit(1);
}

const out = resolve("public/brand");
mkdirSync(out, { recursive: true });
const work = mkdtempSync(join(tmpdir(), "sheepie-brand-"));

const isDir = statSync(source).isDirectory();
const imageDir = isDir ? resolve(source) : work;

function extractPage(page) {
  execFileSync("pdfimages", ["-png", "-f", String(page), "-l", String(page), source, join(work, `p${page}`)]);
}

// Page 5 holds the Mega Mendung tile (p5-002) and the lamb marks:
// p5-003 + mask p5-004 is the blue lamb, p5-000 + mask p5-001 is the white lamb.
// Page 14 holds the ice-silk fabric close-up (p14-000).
if (!isDir) {
  extractPage(5);
  extractPage(14);
}

const src = (name) => join(imageDir, name);

// The tile is light linework on a flat blue field. Lift the lines into alpha,
// then pre-tint so pages can use a plain background-image (no CSS masks).
async function patternTiles() {
  const { data, info } = await sharp(src("p5-002.png"))
    .resize({ width: 460 })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const sorted = Uint8Array.from(data).sort();
  const base = sorted[Math.floor(sorted.length * 0.5)];
  const top = sorted[Math.floor(sorted.length * 0.995)];
  const alpha = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    const t = Math.max(0, Math.min(1, (data[i] - base - 4) / Math.max(1, top - base - 4)));
    alpha[i] = Math.round(Math.pow(t, 0.8) * 255);
  }

  const tones = {
    "mendung-white": [255, 255, 255, 0.75],
    "mendung-sky": [163, 193, 224, 0.22],
    "mendung-ink": [29, 43, 68, 0.06],
  };
  for (const [name, [r, g, b, a]] of Object.entries(tones)) {
    const px = Buffer.alloc(info.width * info.height * 4);
    for (let i = 0; i < alpha.length; i++) {
      px[i * 4] = r;
      px[i * 4 + 1] = g;
      px[i * 4 + 2] = b;
      px[i * 4 + 3] = Math.round(alpha[i] * a);
    }
    await sharp(px, { raw: { width: info.width, height: info.height, channels: 4 } }).png({ palette: true, quality: 70, compressionLevel: 9 }).toFile(join(out, `${name}.png`));
    // WebP is what the CSS loads. Encoding the palette-quantised PNG losslessly
    // keeps identical pixels and is smaller than a lossy encode of fine linework.
    await sharp(join(out, `${name}.png`)).webp({ lossless: true, effort: 6 }).toFile(join(out, `${name}.webp`));
  }
}

async function lamb(color, mask, name) {
  const rgb = await sharp(src(color)).removeAlpha().toColourspace("srgb").raw().toBuffer({ resolveWithObject: true });
  const a = await sharp(src(mask)).greyscale().raw().toBuffer();
  const { width, height, channels } = rgb.info;
  const px = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    px[i * 4] = rgb.data[i * channels];
    px[i * 4 + 1] = rgb.data[i * channels + 1];
    px[i * 4 + 2] = rgb.data[i * channels + 2];
    px[i * 4 + 3] = a[i];
  }
  await sharp(px, { raw: { width, height, channels: 4 } }).png().toFile(join(out, `${name}.png`));
}

async function icesilk() {
  await sharp(src("p14-000.png")).resize({ width: 1200 }).jpeg({ quality: 80 }).toFile(join(out, "icesilk.jpg"));
}

try {
  await patternTiles();
  await lamb("p5-003.png", "p5-004.png", "lamb-blue");
  await lamb("p5-000.png", "p5-001.png", "lamb-white");
  await icesilk();
  console.log(`Brand assets written to ${out}`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
