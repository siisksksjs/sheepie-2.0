import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import Home, { generateMetadata } from "@/app/[locale]/page";
import { getProduct } from "@/lib/catalog";
import { homeCopy } from "@/lib/site/home-copy";

async function render(locale: "id" | "en") {
  const element = await Home({ params: Promise.resolve({ locale }) });
  return renderToStaticMarkup(element);
}

describe("home page", () => {
  it("runs the night arc in the owner's order", async () => {
    const html = await render("id");
    const order = [...html.matchAll(/data-section="([^"]+)"/g)].map((m) => m[1]).filter((s) => s !== "footer");
    expect(order).toEqual(["hero", "products", "cervicloud", "cervicloud-reviews", "lumicloud", "lumicloud-reviews"]);
    expect(html.indexOf('data-section="lumicloud-reviews"')).toBeLessThan(html.indexOf('data-section="footer"'));
  });

  it("leads with both hero products", async () => {
    const html = await render("id");
    expect(html).toContain('id="hero"');
    expect(html).toContain("Leher tertopang, mata tetap gelap.");
    expect(html).toContain('href="/id/products/cervicloud"');
    expect(html).toContain('href="/id/products/lumicloud"');
    expect(html).toContain('data-overlay="true"');
  });

  it("shows CerviCloud and LumiCloud as equal cards and CalmiCloud as a companion", async () => {
    const html = await render("id");
    expect(html).toContain('data-product-card="cervicloud"');
    expect(html).toContain('data-product-card="lumicloud"');
    expect(html).not.toContain('data-product-card="calmicloud"');
    expect(html).toContain('data-companion="calmicloud"');
    expect(html).toContain('href="/id/products/cervicloud?option=case"');
  });

  it("quotes masked reviewers with a link to the original screenshot", async () => {
    const html = await render("id");
    expect(html).toContain("/images/bio/testimonials/cervicloud-3-review.jpg");
    expect(html).toContain("/images/bio/testimonials/lumicloud-1-review.jpg");
    expect(html).not.toContain("steve969");
  });

  it("renders the LumiCloud night band without the scroll effect", async () => {
    const html = await render("id");
    expect(html).toContain('id="lights"');
    expect(html).not.toContain("data-lights=");
  });

  it("takes the LumiCloud swatch colours from the catalog", async () => {
    const html = await render("id");
    const swatches = getProduct("lumicloud", "id").options.map((o) => o.swatch);
    expect(swatches).toEqual(["#a9c6e3", "#d8cbb4"]);
    for (const swatch of swatches) expect(html).toContain(`background:${swatch}`);
    expect(html).not.toContain("#f3c8a8");
  });

  it("renders English copy on /en", async () => {
    const html = await render("en");
    expect(html).toContain("Neck supported, eyes kept dark.");
    expect(html).toContain('href="/en/products/lumicloud"');
  });

  it.each([
    ["id", "Sheepie. | Bantal ergonomis & masker mata blackout"],
    ["en", "Sheepie. | Ergonomic pillows & blackout eye masks"],
  ] as const)("has localized metadata on /%s", async (locale, title) => {
    const meta = await generateMetadata({ params: Promise.resolve({ locale }) });
    expect(meta.title).toBe(title);
    expect(meta.description).toBe(homeCopy[locale].hero.sub);
    expect(meta.openGraph?.url).toBe(`https://sheepiesleep.com/${locale}`);
  });
});
