/* eslint-disable react/no-children-prop -- createElement props are type-checked, children is required */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { getProduct } from "@/lib/catalog";
import { siteCopy } from "@/lib/site/copy";
import { marketplaceHref } from "@/lib/utm";

import { ButtonLink } from "./button";
import { FadeIn } from "./fade-in";
import { MarketplaceLink } from "./marketplace-link";
import { Mendung } from "./mendung";
import { ProductCard } from "./product-card";

describe("shared site UI", () => {
  it("has the same copy keys in both languages", () => {
    const keys = (value: unknown, prefix = ""): string[] =>
      value && typeof value === "object"
        ? Object.entries(value).flatMap(([k, v]) => keys(v, `${prefix}${k}.`))
        : [prefix];
    expect(keys(siteCopy.en)).toEqual(keys(siteCopy.id));
  });

  it("tags marketplace links with site UTM parameters", () => {
    const url = new URL(marketplaceHref("https://shopee.co.id/product/1/2/", "cervicloud", "buy-box"));
    expect(url.searchParams.get("utm_source")).toBe("site");
    expect(url.searchParams.get("utm_medium")).toBe("button");
    expect(url.searchParams.get("utm_campaign")).toBe("buy-box");
    expect(url.searchParams.get("utm_content")).toBe("cervicloud");
  });

  it("opens marketplaces in a new tab and labels the placement", () => {
    const html = renderToStaticMarkup(
      createElement(MarketplaceLink, {
        slug: "cervicloud",
        optionKey: "pillow",
        value: 838000,
        marketplace: "shopee",
        href: "https://shopee.co.id/product/1/2/",
        placement: "buy-box",
        children: "Beli di Shopee",
      }),
    );
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('data-marketplace="shopee"');
    expect(html).toContain('data-placement="buy-box"');
    expect(html).toContain("utm_campaign=buy-box");
  });

  it("renders button links and decorative patterns", () => {
    expect(renderToStaticMarkup(createElement(ButtonLink, { href: "/id", variant: "ink", children: "Go" }))).toContain('href="/id"');
    expect(renderToStaticMarkup(createElement(Mendung, { tone: "sky" }))).toContain('aria-hidden="true"');
  });

  it("marks fade-in content so it can be revealed once", () => {
    const html = renderToStaticMarkup(createElement(FadeIn, { section: "products", children: "x" }));
    expect(html).toContain("data-fade");
    expect(html).toContain('data-section="products"');
  });

  it("renders a product card with price, saving and a product link", () => {
    const html = renderToStaticMarkup(createElement(ProductCard, { product: getProduct("cervicloud", "id"), locale: "id" }));
    expect(html).toContain('data-product-card="cervicloud"');
    expect(html).toContain('href="/id/products/cervicloud"');
    expect(html).toContain("Rp838.000");
    expect(html).toContain("Rp1.399.000");
    expect(html).toContain("data-fade");
  });

  it("renders an eager product card without the fade-in wrapper", () => {
    const html = renderToStaticMarkup(createElement(ProductCard, { product: getProduct("cervicloud", "id"), locale: "id", eager: true }));
    expect(html).toContain('data-product-card="cervicloud"');
    expect(html).not.toContain("data-fade");
  });
});
