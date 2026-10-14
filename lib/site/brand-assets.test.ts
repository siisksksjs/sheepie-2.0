import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const publicDir = join(process.cwd(), "public");
const brand = (name: string) => join(publicDir, "brand", name);

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));
}

/** Social link previews (WhatsApp, Facebook) still read JPG most reliably. */
const JPG_ALLOWED = new Set(["/images/bio/sheepie-hero-v2.jpg"]);

describe("brand assets", () => {
  it.each(["mendung-white", "mendung-sky", "mendung-ink"])("ships the %s pattern tile small enough to repeat cheaply", (name) => {
    expect(statSync(brand(`${name}.webp`)).size).toBeLessThan(120_000);
  });

  it.each(["lamb-blue.webp", "lamb-white.webp", "icesilk.webp"])("ships %s", (name) => {
    expect(statSync(brand(name)).size).toBeGreaterThan(1_000);
  });

  it("serves every site image as WebP (except social previews)", () => {
    const heavy = walk(publicDir)
      .map((f) => "/" + relative(publicDir, f).split("\\").join("/"))
      .filter((url) => /\.(jpe?g|png)$/i.test(url) && (url.startsWith("/images/") || url.startsWith("/brand/")))
      .filter((url) => !JPG_ALLOWED.has(url));
    expect(heavy).toEqual([]);
  });

  it("every image path in the code points at a file that exists", () => {
    const sources = ["app", "components", "lib", "data", "messages"].flatMap((d) => walk(join(process.cwd(), d)).filter((f) => /\.(tsx?|json|css)$/.test(f) && !f.includes(".test.")));
    const missing = new Set<string>();
    for (const file of sources) {
      for (const [url] of readFileSync(file, "utf8").matchAll(/\/(?:images|brand)\/[\w./-]+\.(?:webp|jpe?g|png|svg)/gi)) {
        if (!existsSync(join(publicDir, url))) missing.add(url);
      }
    }
    expect([...missing]).toEqual([]);
  });
});
