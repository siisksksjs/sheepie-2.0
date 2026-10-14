import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SiteHeader } from "./site-header";

describe("site header", () => {
  it("keeps the bar to menu, logo, language and shop", () => {
    const html = renderToStaticMarkup(createElement(SiteHeader, { locale: "id" }));
    expect(html).toContain('id="site-header"');
    expect(html).toContain('data-overlay="false"');
    expect(html).toContain("Belanja resmi Sheepie di Shopee &amp; Tokopedia");
    expect(html).toContain('data-panel-trigger="menu"');
    expect(html).toContain('href="/id"');
    expect(html).toContain('aria-current="true" data-language-switch="id"');
    expect(html).toContain('data-language-switch="en"');
    expect(html).toContain('data-panel-trigger="shop"');
    // Section links live in the menu now, not the bar.
    expect(html).not.toContain('href="/id/about"');
  });

  it("starts transparent over the hero on the home page", () => {
    const html = renderToStaticMarkup(createElement(SiteHeader, { locale: "en", overlay: true }));
    expect(html).toContain('data-overlay="true"');
    expect(html).toContain('data-over="true"');
    expect(html).toContain(">Shop<");
  });

  it("marks both panel triggers as collapsed dialog openers", () => {
    const html = renderToStaticMarkup(createElement(SiteHeader, { locale: "id" }));
    for (const name of ["menu", "shop"]) {
      const tag = html.match(new RegExp(`<button[^>]*data-panel-trigger="${name}"[^>]*>`))?.[0] ?? "";
      expect(tag).toContain('aria-haspopup="dialog"');
      expect(tag).toContain('aria-expanded="false"');
    }
  });
});
