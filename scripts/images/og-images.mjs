// Build the 1200×630 JPG link previews (WhatsApp, Facebook, X) into public/og/.
// Run after adding a blog post or changing a source photo: node scripts/images/og-images.mjs
// JPG on purpose: link-preview crawlers read it more reliably than WebP.
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const pub = (p) => path.join(ROOT, "public", p);

/** Page previews: output name -> [source photo, crop focus]. */
const PAGES = {
  home: ["/images/hero/sleep-mask-pillow.webp", "attention"],
  products: ["/images/edited/DSC01139.webp", "attention"],
  about: ["/images/edited/DSC01334.webp", "attention"],
  guide: ["/images/edited/DSC01313.webp", "attention"],
  cervicloud: ["/images/edited/DSC01148.webp", "attention"],
  lumicloud: ["/images/edited/DSC01225.webp", "north"],
  calmicloud: ["/images/edited/DSC01241.webp", "centre"],
  bio: ["/images/bio/sheepie-sleep-system.webp", "attention"],
};

async function render(src, out, focus) {
  await sharp(pub(src))
    .resize(1200, 630, { fit: "cover", position: focus === "attention" ? sharp.strategy.attention : focus })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(pub(out));
  console.log(`${out} <- ${src}`);
}

await mkdir(pub("og/blog"), { recursive: true });
for (const [name, [src, focus]] of Object.entries(PAGES)) await render(src, `og/${name}.jpg`, focus);

const posts = JSON.parse(await readFile(path.join(ROOT, "data/blog.json"), "utf8"));
for (const post of posts) await render(post.image, `og/blog/${post.slug}.jpg`, "centre");
