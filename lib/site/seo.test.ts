import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { describe, expect, it } from "vitest";

import { locales } from "@/i18n/config";
import { getProducts } from "@/lib/catalog";
import { journalPosts } from "@/lib/site/journal";
import { type PageKey, pageMetadata, postOgImage, productLd, productMetadata } from "@/lib/site/seo";

const PAGES: PageKey[] = ["home", "products", "about", "contact", "faq", "blog", "guide"];
const SITE = "https://www.sheepiesleep.com";

function check(meta: Metadata) {
  const title = String(meta.title);
  expect(title.length).toBeLessThanOrEqual(60);
  expect(String(meta.description).length).toBeLessThanOrEqual(160);
  expect(String(meta.alternates?.canonical)).toMatch(new RegExp(`^${SITE}/(id|en)`));
  expect(meta.alternates?.languages).toHaveProperty("x-default");
  const og = meta.openGraph as { url?: string; images?: { url: string }[] };
  expect(og.url).toBe(meta.alternates?.canonical);
  const image = og.images?.[0]?.url ?? "";
  expect(image).toMatch(/^https:\/\/www\.sheepiesleep\.com\/og\/.+\.jpg$/);
  expect(existsSync(join(process.cwd(), "public", image.replace(SITE, "")))).toBe(true);
  return title;
}

describe("SEO metadata", () => {
  it("every page has a short title, description, canonical, hreflang and a JPG link preview", () => {
    const titles = new Set<string>();
    for (const locale of locales) {
      for (const page of PAGES) titles.add(check(pageMetadata(page, locale)));
      for (const product of getProducts(locale)) titles.add(check(productMetadata(product, locale)));
    }
    // Every page/locale pair has its own title.
    expect(titles.size).toBe(locales.length * (PAGES.length + 3));
  });

  it("pages that exist in both languages list both as alternates", () => {
    const meta = pageMetadata("about", "id");
    expect(meta.alternates?.languages).toEqual({
      id: `${SITE}/id/about`,
      en: `${SITE}/en/about`,
      "x-default": `${SITE}/id/about`,
    });
  });

  it("every blog post has a short search title and a JPG link preview", () => {
    for (const post of journalPosts) {
      expect((post.seoTitle ?? `${post.title} | Sheepie`).length).toBeLessThanOrEqual(60);
      expect(existsSync(join(process.cwd(), "public", postOgImage(post.slug)))).toBe(true);
    }
  });

  it("products carry a price in rupiah", () => {
    for (const product of getProducts("id")) {
      const ld = productLd(product, "id") as { offers: { priceCurrency: string; price?: number; lowPrice?: number } };
      expect(ld.offers.priceCurrency).toBe("IDR");
      expect(ld.offers.price ?? ld.offers.lowPrice).toBeGreaterThan(0);
    }
  });
});
