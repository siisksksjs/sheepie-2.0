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

  it("is honest about who CerviCloud is not for", async () => {
    const html = await render("id", "cervicloud");
    expect(html).toContain("Tidur tengkurap");
    expect(html).toContain('data-fits="false"');
  });

  it("shows three full-text reviews with screenshot links", async () => {
    const html = await render("id", "lumicloud");
    expect((html.match(/Lihat ulasan asli/g) ?? []).length).toBe(3);
    expect(html).toContain("silent velcro nya");
    expect(html).not.toContain("…”");
  });

  it("pairs with the other products", async () => {
    const html = await render("en", "lumicloud");
    expect(html).toContain('href="/en/products/cervicloud"');
    expect(html).toContain('href="/en/products/calmicloud"');
  });

  it("titles the page after the product", async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ locale: "id", slug: "lumicloud" }) });
    expect(meta.title).toBe("LumiCloud | Sheepie.");
  });
});
