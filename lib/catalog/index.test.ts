import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { locales } from "@/i18n/config";
import { findOption, getProduct, getProducts, isProductSlug, productCopy, productPath } from "./index";
import { PRODUCT_SLUGS } from "./types";

function collectTexts(value: unknown, path: string, out: Array<[string, unknown]>) {
  if (Array.isArray(value)) {
    value.forEach((item, i) => collectTexts(item, `${path}[${i}]`, out));
  } else if (value && typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.length === 2 && keys.includes("id") && keys.includes("en")) {
      out.push([path, value]);
      return;
    }
    for (const [key, child] of Object.entries(value)) collectTexts(child, `${path}.${key}`, out);
  }
}

describe("product catalog", () => {
  it("has non-empty Indonesian and English for every piece of copy", () => {
    const texts: Array<[string, unknown]> = [];
    collectTexts(productCopy, "productCopy", texts);
    expect(texts.length).toBeGreaterThan(150);
    for (const [path, text] of texts) {
      const { id, en } = text as { id: string; en: string };
      expect(id.trim(), `${path}.id`).not.toBe("");
      expect(en.trim(), `${path}.en`).not.toBe("");
    }
  });

  it("resolves every product in every locale with priced, linked options", () => {
    for (const locale of locales) {
      for (const slug of PRODUCT_SLUGS) {
        const product = getProduct(slug, locale);
        expect(product.options.length).toBeGreaterThan(0);
        for (const option of product.options) {
          expect(option.price).toBeGreaterThan(0);
          expect(option.shopeeUrl).toMatch(/^https:\/\/shopee\.co\.id\//);
          expect(option.tokopediaUrl).toMatch(/^https:\/\/www\.tokopedia\.com\//);
        }
      }
    }
  });

  it("uses the variant price for the CerviCloud cover and shows no saving on it", () => {
    const cervi = getProduct("cervicloud", "id");
    const pillow = findOption(cervi, "pillow");
    const cover = findOption(cervi, "case");
    expect(pillow.price).toBe(838000);
    expect(pillow.originalPrice).toBe(1399000);
    expect(cover.price).toBe(198000);
    expect(cover.originalPrice).toBeNull();
  });

  it("offers LumiCloud in Blue and Apricot at the same price", () => {
    const lumi = getProduct("lumicloud", "en");
    expect(lumi.options.map((o) => o.key)).toEqual(["blue", "apricot"]);
    expect(new Set(lumi.options.map((o) => o.price)).size).toBe(1);
  });

  it("falls back to the first option for a missing or unknown key", () => {
    const cervi = getProduct("cervicloud", "id");
    expect(findOption(cervi, "nope").key).toBe("pillow");
    expect(findOption(cervi, null).key).toBe("pillow");
  });

  it("recognises only catalog slugs", () => {
    expect(isProductSlug("cervicloud")).toBe(true);
    expect(isProductSlug("bantal")).toBe(false);
    expect(isProductSlug("")).toBe(false);
  });

  it("builds locale-prefixed product paths", () => {
    expect(productPath("id", "cervicloud")).toBe("/id/products/cervicloud");
    expect(productPath("en", "cervicloud", "case")).toBe("/en/products/cervicloud?option=case");
  });

  it("returns products in catalog order", () => {
    expect(getProducts("id").map((p) => p.slug)).toEqual(["cervicloud", "lumicloud", "calmicloud"]);
  });

  it("pairs each product with other real products", () => {
    for (const slug of PRODUCT_SLUGS) {
      const { pairWith } = productCopy[slug];
      expect(pairWith).not.toContain(slug);
      for (const other of pairWith) expect(isProductSlug(other)).toBe(true);
    }
  });

  it("places four anatomy pins inside the image", () => {
    for (const slug of PRODUCT_SLUGS) {
      const { points } = productCopy[slug].anatomy;
      expect(points).toHaveLength(4);
      for (const p of points) {
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.x).toBeLessThanOrEqual(100);
        expect(p.y).toBeGreaterThanOrEqual(0);
        expect(p.y).toBeLessThanOrEqual(100);
      }
    }
  });

  it("points every image at a file that exists in public/", () => {
    for (const slug of PRODUCT_SLUGS) {
      const copy = productCopy[slug];
      const images = [
        copy.card.image,
        copy.card.hoverImage,
        copy.anatomy.image,
        ...copy.gallery.map((g) => g.src),
        ...copy.options.map((o) => o.image),
      ];
      for (const src of images) {
        expect(existsSync(join(process.cwd(), "public", src)), src).toBe(true);
      }
    }
  });
});
