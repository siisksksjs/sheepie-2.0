// Build the 1200×630 JPG link previews for blog articles into public/og/blog/.
// Run after adding a blog post: node scripts/images/og-images.mjs
// JPG on purpose: link-preview crawlers read it more reliably than WebP.
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const pub = (p) => path.join(ROOT, "public", p);

// Every page shares public/og/sheepie.jpg (the brand card); only blog articles get their own preview.

async function render(src, out, focus) {
  await sharp(pub(src))
    .resize(1200, 630, { fit: "cover", position: focus === "attention" ? sharp.strategy.attention : focus })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(pub(out));
  console.log(`${out} <- ${src}`);
}

await mkdir(pub("og/blog"), { recursive: true });

const posts = JSON.parse(await readFile(path.join(ROOT, "data/blog.json"), "utf8"));
for (const post of posts) await render(post.image, `og/blog/${post.slug}.jpg`, "centre");
