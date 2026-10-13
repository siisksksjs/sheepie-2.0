import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SiteHeader } from "./site-header";

describe("site header", () => {
  it("links each product and section in Indonesian", () => {
    const html = renderToStaticMarkup(createElement(SiteHeader, { locale: "id" }));
    expect(html).toContain('id="site-header"');
    expect(html).toContain('data-overlay="false"');
    expect(html).toContain("Belanja resmi Sheepie di Shopee &amp; Tokopedia");
    for (const href of ["/id/products/cervicloud", "/id/products/lumicloud", "/id/products/calmicloud", "/id/about", "/id/blog"]) {
      expect(html).toContain(`href="${href}"`);
    }
    expect(html).toContain('data-panel-trigger="shop"');
    expect(html).toContain('data-panel-trigger="menu"');
  });

  it("starts transparent over the hero on the home page", () => {
    const html = renderToStaticMarkup(createElement(SiteHeader, { locale: "en", overlay: true }));
    expect(html).toContain('data-overlay="true"');
    expect(html).toContain('data-over="true"');
    expect(html).toContain(">Shop<");
  });
});
