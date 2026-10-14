// components/pdp/buy-box.test.ts
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { getProduct } from "@/lib/catalog";

import { BuyBox } from "./buy-box";
import { OptionProvider } from "./option-context";
import { PriceLine } from "./price-line";

function renderBuyBox(slug: "cervicloud" | "lumicloud" | "calmicloud", locale: "id" | "en" = "id") {
  const product = getProduct(slug, locale);
  return renderToStaticMarkup(
    // eslint-disable-next-line react/no-children-prop -- OptionProvider requires children in its props type
    createElement(OptionProvider, { product, children: createElement(BuyBox, { product, locale }) }),
  );
}

describe("product buy box", () => {
  it("prices the first option with its saving", () => {
    const html = renderBuyBox("cervicloud");
    expect(html).toContain("<h1");
    expect(html).toContain("Rp838.000");
    expect(html).toContain("Rp1.399.000");
    expect(html).toContain("Hemat 40%");
  });

  it("shows no strikethrough or 0% chip when there is nothing to save", () => {
    const html = renderToStaticMarkup(createElement(PriceLine, { option: { price: 198000, originalPrice: null }, saveLabel: "Hemat {n}%" }));
    expect(html).toContain("Rp198.000");
    expect(html).not.toContain("<s>");
    expect(html).not.toContain("Hemat");
  });

  it("offers both marketplaces from the buy box", () => {
    const html = renderBuyBox("lumicloud");
    expect(html).toContain('id="buy-ctas"');
    expect(html).toContain('data-marketplace="shopee"');
    expect(html).toContain('data-marketplace="tokopedia"');
    expect(html).toContain('data-placement="buy-box"');
  });

  it("lists every option as a pressable choice", () => {
    const html = renderBuyBox("lumicloud", "en");
    expect(html).toContain('data-option="blue"');
    expect(html).toContain('data-option="apricot"');
    expect(html).toContain('aria-pressed="true"');
  });

});

describe("website voucher", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  // The code is read from the environment at module load, so re-import per case.
  async function renderWithVoucherEnv(value: string) {
    vi.stubEnv("NEXT_PUBLIC_WEBSITE_VOUCHER_CODE", value);
    vi.resetModules();
    const [{ BuyBox: FreshBuyBox }, { OptionProvider: FreshProvider }, catalog] = await Promise.all([
      import("./buy-box"),
      import("./option-context"),
      import("@/lib/catalog"),
    ]);
    const product = catalog.getProduct("calmicloud", "id");
    return renderToStaticMarkup(
      // eslint-disable-next-line react/no-children-prop -- OptionProvider requires children in its props type
      createElement(FreshProvider, { product, children: createElement(FreshBuyBox, { product, locale: "id" }) }),
    );
  }

  it("shows the website voucher when one is configured", async () => {
    const html = await renderWithVoucherEnv("SHEEPIEWEB");
    expect(html).toContain("Kode khusus website:");
    expect(html).toContain("<code>SHEEPIEWEB</code>");
  });

  it("shows no voucher when none is configured", async () => {
    const html = await renderWithVoucherEnv("   ");
    expect(html).not.toContain("Kode khusus website:");
    expect(html).not.toContain("SHEEPIEWEB");
  });
});
