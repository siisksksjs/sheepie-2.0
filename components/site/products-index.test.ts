import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ProductsPage from "@/app/[locale]/products/page";

describe("products index", () => {
  it("lists every product as a card", async () => {
    const html = renderToStaticMarkup(await ProductsPage({ params: Promise.resolve({ locale: "id" }) }));
    for (const slug of ["cervicloud", "lumicloud", "calmicloud"]) {
      expect(html).toContain(`data-product-card="${slug}"`);
    }
    expect(html).toContain("<h1");
  });

  it("renders the first row of cards without waiting on the fade-in script", async () => {
    const html = renderToStaticMarkup(await ProductsPage({ params: Promise.resolve({ locale: "id" }) }));
    expect(html).not.toContain("data-fade");
  });
});
