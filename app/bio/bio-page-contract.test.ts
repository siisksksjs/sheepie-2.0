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

    expect(ctaIds).toHaveLength(10);
    expect(new Set(ctaIds).size).toBe(ctaIds.length);
    expect(ctaIds).toEqual(
      expect.arrayContaining([
        "bio-cervicloud-shopee",
        "bio-lumicloud-shopee",
        "bio-calmicloud-shopee",
        "hub_shopee",
        "hub_tokopedia",
        "hub_tiktok",
        "connect_instagram",
        "connect_email",
        "connect_website",
        "connect_tiktok",
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
      "bio-testimonials",
      "bio-hub",
      "bio-footer",
    ]);
  });

  it("renders every outbound CTA as a safe normal anchor", () => {
    const outboundAnchors = markup.match(/<a [^>]*data-bio-cta="[^"]+"[^>]*>/g) ?? [];

    expect(outboundAnchors).toHaveLength(10);
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
    // Review cards show the screenshot alone, so no handle is rendered at all.
    for (const review of config.testimonials) {
      expect(markup).not.toContain(`>${review.author}<`);
    }
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
    for (const name of ["CerviCloud Pillow", "LumiCloud EyeMask", "CalmiCloud Earplug"]) {
      expect(markup).toMatch(new RegExp(`role="tab"[^>]*>${name}<`));
    }
    expect((markup.match(/role="tab"/g) ?? [])).toHaveLength(3);
  });

  it("renders the review screenshot with its text as alt", () => {
    const cards = markup.match(/<li class="[^"]*testimonialCard[^"]*"[\s\S]*?<\/li>/g) ?? [];

    // Only the active tab renders, which keeps the section short.
    expect(cards.length).toBeGreaterThanOrEqual(2);
    expect(cards.length).toBeLessThanOrEqual(3);
    for (const card of cards) {
      expect(card).toMatch(/testimonials(?:%2F|\/)[^"']+\.jpg/);
      // The quote is carried as alt text for assistive technology and search.
      expect(card).toMatch(/alt="[^"]{40,}"/);
      // The screenshot opens in a modal, so nothing targets a new tab.
      expect(card).not.toContain('target="_blank"');
    }
  });

  it("gives every product a browsable gallery and a Shopee CTA", () => {
    const cards = markup.match(/<article [^>]*data-bio-product="[^"]+"[\s\S]*?<\/article>/g) ?? [];

    expect(cards).toHaveLength(3);
    for (const card of cards) {
      // One frame at a time, stepped with arrows rather than scrolled.
      expect(card).toMatch(/aria-label="Gambar sebelumnya/);
      expect(card).toMatch(/aria-label="Gambar berikutnya/);
      expect(card).toContain('data-bio-destination="shopee"');
      expect(card).toContain("Buy now");
    }

    // Every listing image is available to step through.
    for (const product of createBioConfig().products) {
      expect(product.gallery.length).toBeGreaterThanOrEqual(9);
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
    for (const removed of [".hero", ".trustGrid", ".finalCta", ".productStories", ".ambientCloud", ".secondaryButton", ".hubGrid", ".productCard"]) {
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
    const tapTargets = [".buyButton {", ".shopLink {", ".connectLink {"];

    for (const selector of tapTargets) {
      const block = cssSource.slice(cssSource.indexOf(selector));
      const minHeight = block.match(/min-height:\s*([\d.]+)rem/)?.[1];
      expect(Number(minHeight)).toBeGreaterThanOrEqual(2.75);
    }
  });
});
