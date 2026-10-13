import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SiteFooter } from "./site-footer";

describe("site footer", () => {
  it("says goodnight and links shop, brand and store pages", () => {
    const html = renderToStaticMarkup(createElement(SiteFooter, { locale: "id" }));
    expect(html).toContain('data-section="footer"');
    expect(html).toContain("Selamat tidur, sampai besok pagi.");
    expect(html).toContain('href="/id/products/cervicloud?option=case"');
    expect(html).toContain('href="https://shopee.co.id/sheepie.sleep"');
    expect(html).toContain('href="https://www.tokopedia.com/sheepie"');
    expect(html).toContain('href="/id/faq"');
  });
});
