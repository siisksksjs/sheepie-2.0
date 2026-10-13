// components/pdp/buy-box.test.ts
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { findOption, getProduct } from "@/lib/catalog";

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
    const cover = findOption(getProduct("cervicloud", "id"), "case");
    const html = renderToStaticMarkup(createElement(PriceLine, { option: cover, saveLabel: "Hemat {n}%" }));
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

  it("shows the website voucher", () => {
    expect(renderBuyBox("calmicloud")).toContain("SHEEPIEWEB");
  });
});
