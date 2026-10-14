import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ProductPage, { dynamicParams, generateMetadata, generateStaticParams } from "@/app/[locale]/products/[slug]/page";

async function render(locale: string, slug: string) {
  const element = await ProductPage({ params: Promise.resolve({ locale, slug }) });
  return renderToStaticMarkup(element);
}

describe("product page", () => {
  it("prebuilds every product in every locale and nothing else", async () => {
    const params = await generateStaticParams();
    expect(params).toHaveLength(6);
    expect(params).toContainEqual({ locale: "id", slug: "cervicloud" });
    expect(params).toContainEqual({ locale: "en", slug: "calmicloud" });
    expect(dynamicParams).toBe(false);
  });

  it("lays out the sections in order", async () => {
    const html = await render("id", "cervicloud");
    const order = [...html.matchAll(/data-section="([^"]+)"/g)].map((m) => m[1]).filter((s) => s !== "footer");
    expect(order).toEqual(["buy", "anatomy", "fit", "compare", "reviews", "faq", "pair"]);
  });

  it("lists stomach sleepers as a good fit for CerviCloud", async () => {
    const html = await render("id", "cervicloud");
    expect(html).toContain("Tidur tengkurap");
    expect(html).not.toContain('data-fits="false"');
  });

  it("shows the three real review screenshots, each linking to the full image", async () => {
    const html = await render("id", "lumicloud");
    for (const n of [1, 2, 3]) expect(html).toContain(`href="/images/bio/testimonials/lumicloud-${n}-review.jpg"`);
    expect((html.match(/aria-label="Lihat ulasan asli:/g) ?? []).length).toBe(3);
  });

  it("pairs with the other products", async () => {
    const html = await render("en", "lumicloud");
    expect(html).toContain('href="/en/products/cervicloud"');
    expect(html).toContain('href="/en/products/calmicloud"');
  });

  it("titles the page after the product", async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ locale: "id", slug: "lumicloud" }) });
    expect(meta.title).toBe("LumiCloud Eye Mask | Sheepie.");
  });
});
