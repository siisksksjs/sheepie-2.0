import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const FILES = [
  "data/faqs.json",
  "data/products.json",
  "data/blog.json",
  "messages/en.json",
  "messages/id.json",
  "lib/catalog/content.ts",
  "lib/site/copy.ts",
  "lib/site/home-copy.ts",
  "lib/site/pdp-copy.ts",
  "app/[locale]/layout.tsx",
];

const BANNED: Array<[string, RegExp]> = [
  ["decibel claim", /\b\d+\s?dB\b/i],
  ["medical-grade", /medical[- ]grade|kelas medis/i],
  ["absolute blackout", /100% ?blackout|blackout 100%|total blackout|kegelapan total/i],
  ["absolute blackout (wording)", /menutup rapat|closes off light/i],
  ["3D eye cavities", /eye cavit|rongga mata/i],
  ["bamboo cover", /\bbamboo\b|\bbambu\b/i],
];

describe("positioning claims", () => {
  it.each(FILES)("%s avoids banned claims", (file) => {
    // URLs carry marketplace slugs (e.g. "...-medical-grade-...") that are not our copy.
    const text = readFileSync(join(process.cwd(), file), "utf8").replace(/https?:\/\/[^\s"')]+/g, "");
    for (const [label, pattern] of BANNED) {
      expect(text.match(pattern)?.[0], `${label} in ${file}`).toBeUndefined();
    }
  });
});
