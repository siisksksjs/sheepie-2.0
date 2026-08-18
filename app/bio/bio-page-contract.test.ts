import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { BioPage } from "@/components/bio/bio-page";
import { createBioConfig } from "@/data/bio";

function attributes(markup: string, name: string) {
  return [...markup.matchAll(new RegExp(`${name}="([^"]+)"`, "g"))].map((match) => match[1]);
}

describe("bio page rendered contract", () => {
  const markup = renderToStaticMarkup(createElement(BioPage, { config: createBioConfig() }));

  it("renders a unique placement ID for every CTA", () => {
    const ctaIds = attributes(markup, "data-bio-cta");

    expect(ctaIds).toHaveLength(9);
    expect(new Set(ctaIds).size).toBe(ctaIds.length);
    expect(ctaIds).toEqual(
      expect.arrayContaining([
        "bio-cervicloud-shopee",
        "bio-lumicloud-shopee",
        "bio-calmicloud-shopee",
        "hub_tokopedia",
        "hub_shopee",
        "hub_tiktok",
        "hub_instagram",
        "hub_email",
        "hub_website",
      ]),
    );
    // The closing CTA block duplicated the link hub and was removed.
    expect(ctaIds).not.toContain("final_shopee");
    expect(ctaIds).not.toContain("final_tokopedia");
  });

  it("marks every meaningful page section", () => {
    for (const section of [
      "bio-header",
      "bio-banner",
      "bio-trust",
      "bio-product-alignment",
      "bio-product-darkness",
      "bio-product-silence",
      "bio-hub",
      "bio-testimonials",
      "bio-footer",
    ]) {
      expect(markup).toContain(`data-bio-section="${section}"`);
    }
  });

  it("exposes unique observer targets without tracking CTAs", () => {
    const trackedSections = attributes(markup, "data-bio-track-section");

    expect(trackedSections).toHaveLength(9);
    expect(new Set(trackedSections).size).toBe(trackedSections.length);
    expect(markup).not.toMatch(/<(?:a|button) [^>]*data-bio-track-section=/);
    expect(trackedSections).toEqual([
      "bio-header",
      "bio-banner",
      "bio-trust",
      "bio-product-alignment",
      "bio-product-darkness",
      "bio-product-silence",
      "bio-hub",
      "bio-testimonials",
      "bio-footer",
    ]);
  });

  it("renders every outbound CTA as a safe normal anchor", () => {
    const outboundAnchors = markup.match(/<a [^>]*data-bio-cta="[^"]+"[^>]*>/g) ?? [];

    expect(outboundAnchors).toHaveLength(9);
    for (const anchor of outboundAnchors) {
      // mailto: hands off to a mail app, so it must not leave a blank tab behind.
      if (anchor.includes('href="mailto:')) {
        expect(anchor).not.toContain("target=");
        continue;
      }
      expect(anchor).toContain('target="_blank"');
      expect(anchor).toContain('rel="noopener noreferrer"');
    }
    expect(outboundAnchors.filter((anchor) => anchor.includes('href="mailto:'))).toHaveLength(1);
  });

  it("masks every reviewer handle", () => {
    const config = createBioConfig();

    for (const review of config.testimonials) {
      expect(review.author).toMatch(/^.\*{3,5}.$/);
    }
    // The active tab's handles are rendered, and they are masked.
    const rendered = config.testimonials.filter((review) => markup.includes(review.author));
    expect(rendered.length).toBeGreaterThanOrEqual(2);
    // No raw handle should survive into the rendered page.
    for (const raw of ["indoshop_lokal", "saalsabilaadinda", "bennettonlin", "bluenavy89", "steve969"]) {
      expect(markup).not.toContain(raw);
    }
  });

  it("shows two to three reviews for every product", () => {
    const config = createBioConfig();

    for (const slug of ["cervicloud", "lumicloud", "calmicloud"] as const) {
      const reviews = config.testimonials.filter((review) => review.product === slug);
      expect(reviews.length).toBeGreaterThanOrEqual(2);
      expect(reviews.length).toBeLessThanOrEqual(3);
    }
    // One tab per product, so only one product's reviews are on screen at a time.
    for (const name of ["CerviCloud", "LumiCloud", "CalmiCloud"]) {
      expect(markup).toMatch(new RegExp(`role="tab"[^>]*>${name}<`));
    }
    expect((markup.match(/role="tab"/g) ?? [])).toHaveLength(3);
  });

  it("renders each review as readable text with a link to the original screenshot", () => {
    const cards = markup.match(/<li class="[^"]*testimonialCard[^"]*"[\s\S]*?<\/li>/g) ?? [];

    // Only the active tab renders, which keeps the section short.
    expect(cards.length).toBeGreaterThanOrEqual(2);
    expect(cards.length).toBeLessThanOrEqual(3);
    for (const card of cards) {
      // The quote must be real text, not a downscaled screenshot nobody can read.
      expect(card).toMatch(/testimonialQuote[^>]*>[^<]{40,}/);
      expect(card).toMatch(/href="\/images\/bio\/testimonials\/[^"]+\.png"/);
      // The screenshot opens in a modal, so it must not target a new tab.
      expect(card).not.toContain('target="_blank"');
    }
  });

  it("puts a price and a Shopee CTA inside every product card", () => {
    const cards = markup.match(/<article [^>]*data-bio-product="[^"]+"[\s\S]*?<\/article>/g) ?? [];

    expect(cards).toHaveLength(3);
    for (const card of cards) {
      expect(card).toMatch(/(?:Rp|IDR)\s*[\d.]+/);
      expect(card).toContain('data-bio-destination="shopee"');
    }
  });
});

describe("standalone bio routing contract", () => {
  it("excludes only the exact /bio boundary while retaining middleware elsewhere", () => {
    const middlewareSource = readFileSync(new URL("../../middleware.ts", import.meta.url), "utf8");
    const matcherLiteral = middlewareSource.match(/matcher:\s*\[\s*'([^']+)'\s*\]/)?.[1];
    expect(matcherLiteral).toBeDefined();
    const matcher = matcherLiteral!.replaceAll("\\\\", "\\");
    const routeMatcher = new RegExp(`^${matcher}$`);

    expect(routeMatcher.test("/bio")).toBe(false);
    expect(routeMatcher.test("/bio/products")).toBe(false);
    expect(routeMatcher.test("/biofoo")).toBe(true);
    expect(routeMatcher.test("/biography")).toBe(true);
    expect(routeMatcher.test("/api/bio-events")).toBe(false);
    expect(routeMatcher.test("/_next/static/file.js")).toBe(false);
    expect(routeMatcher.test("/id/products")).toBe(true);
  });

  it("keeps the /bio root layout isolated and Indonesian", () => {
    const layoutSource = readFileSync(new URL("./layout.tsx", import.meta.url), "utf8");

    for (const forbidden of [
      "UmamiAnalytics",
      "MotionProvider",
      "Navbar",
      "Footer",
      "LanguageModal",
      "Lenis",
    ]) {
      expect(layoutSource).not.toContain(forbidden);
    }
    expect(layoutSource).toContain('<html lang="id">');
    expect(layoutSource).toContain("<body");
    expect(layoutSource).toContain('import "../globals.css"');
  });

  it("keeps the public markup server-rendered", () => {
    const bioPageSource = readFileSync(
      new URL("../../components/bio/bio-page.tsx", import.meta.url),
      "utf8",
    );
    const marketplaceSource = readFileSync(
      new URL("../../components/bio/marketplace-button.tsx", import.meta.url),
      "utf8",
    );

    expect(bioPageSource).not.toContain('"use client"');
    expect(marketplaceSource).not.toContain('"use client"');
  });

  it("renders one narrow column and keeps the mobile safety contracts", () => {
    const cssSource = readFileSync(
      new URL("../../components/bio/bio-page.module.css", import.meta.url),
      "utf8",
    );

    // A link hub is a single column at every width; no multi-column editorial grid.
    expect(cssSource).toMatch(/\.shell\s*\{[\s\S]*?width:\s*min\(100% - 2rem, 30rem\)/);
    for (const removed of [".hero", ".trustGrid", ".finalCta", ".productStories", ".ambientCloud", ".secondaryButton"]) {
      expect(cssSource).not.toContain(`${removed} {`);
    }

    expect(cssSource).toContain("--bio-text-secondary:");
    // color-mix is fine for surfaces and borders, never for text color.
    expect(cssSource).not.toMatch(/(?<![-\w])color:\s*color-mix/);
    expect(cssSource).toContain("@media (prefers-reduced-motion: reduce)");
    expect(cssSource).toContain("env(safe-area-inset-left)");
    expect(cssSource).toContain("env(safe-area-inset-bottom)");
  });

  it("keeps every tap target at least 44px tall", () => {
    const cssSource = readFileSync(
      new URL("../../components/bio/bio-page.module.css", import.meta.url),
      "utf8",
    );
    const tapTargets = [".primaryButton {", ".hubLink {"];

    for (const selector of tapTargets) {
      const block = cssSource.slice(cssSource.indexOf(selector));
      const minHeight = block.match(/min-height:\s*([\d.]+)rem/)?.[1];
      expect(Number(minHeight)).toBeGreaterThanOrEqual(2.75);
    }
  });
});
