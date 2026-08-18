import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { BioPage } from "@/components/bio/bio-page";
import { executeShare } from "@/components/bio/share-button";
import { createBioConfig } from "@/data/bio";

function attributes(markup: string, name: string) {
  return [...markup.matchAll(new RegExp(`${name}="([^"]+)"`, "g"))].map((match) => match[1]);
}

describe("bio page rendered contract", () => {
  const markup = renderToStaticMarkup(createElement(BioPage, { config: createBioConfig() }));

  it("renders a unique placement ID for every CTA", () => {
    const ctaIds = attributes(markup, "data-bio-cta");

    expect(ctaIds).toHaveLength(14);
    expect(new Set(ctaIds).size).toBe(ctaIds.length);
    expect(ctaIds).toEqual(
      expect.arrayContaining([
        "header_instagram",
        "header_tiktok",
        "header_share",
        "bio-cervicloud-shopee",
        "bio-cervicloud-tokopedia",
        "hub_instagram",
        "hub_tiktok",
      ]),
    );
    // The closing CTA block duplicated the link hub and was removed.
    expect(ctaIds).not.toContain("final_shopee");
    expect(ctaIds).not.toContain("final_tokopedia");
  });

  it("marks the share destination and all meaningful page sections", () => {
    expect(markup).toContain('data-bio-cta="header_share"');
    expect(markup).toContain('data-bio-destination="share"');

    for (const section of [
      "bio-header",
      "bio-trust",
      "bio-product-alignment",
      "bio-product-darkness",
      "bio-product-silence",
      "bio-hub",
      "bio-footer",
    ]) {
      expect(markup).toContain(`data-bio-section="${section}"`);
    }
  });

  it("exposes unique observer targets without tracking CTAs", () => {
    const trackedSections = attributes(markup, "data-bio-track-section");

    expect(trackedSections).toHaveLength(7);
    expect(new Set(trackedSections).size).toBe(trackedSections.length);
    expect(markup).not.toMatch(/<(?:a|button) [^>]*data-bio-track-section=/);
    expect(trackedSections).toEqual([
      "bio-header",
      "bio-trust",
      "bio-product-alignment",
      "bio-product-darkness",
      "bio-product-silence",
      "bio-hub",
      "bio-footer",
    ]);
  });

  it("renders every outbound CTA as a safe normal anchor", () => {
    const outboundAnchors = markup.match(/<a [^>]*data-bio-cta="[^"]+"[^>]*>/g) ?? [];

    expect(outboundAnchors).toHaveLength(13);
    for (const anchor of outboundAnchors) {
      expect(anchor).toContain('target="_blank"');
      expect(anchor).toContain('rel="noopener noreferrer"');
    }
  });

  it("puts a price and both marketplace buttons inside every product card", () => {
    const cards = markup.match(/<article [^>]*data-bio-product="[^"]+"[\s\S]*?<\/article>/g) ?? [];

    expect(cards).toHaveLength(3);
    for (const card of cards) {
      expect(card).toMatch(/(?:Rp|IDR)\s*[\d.]+/);
      expect(card).toContain('data-bio-destination="shopee"');
      expect(card).toContain('data-bio-destination="tokopedia"');
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

  it("hydrates only the share control", () => {
    const bioPageSource = readFileSync(
      new URL("../../components/bio/bio-page.tsx", import.meta.url),
      "utf8",
    );
    const marketplaceSource = readFileSync(
      new URL("../../components/bio/marketplace-button.tsx", import.meta.url),
      "utf8",
    );
    const shareSource = readFileSync(
      new URL("../../components/bio/share-button.tsx", import.meta.url),
      "utf8",
    );

    expect(bioPageSource).not.toContain('"use client"');
    expect(marketplaceSource).not.toContain('"use client"');
    expect(shareSource).toContain('"use client"');
    expect(shareSource).toContain('data-bio-destination="share"');
  });

  it("renders one narrow column and keeps the mobile safety contracts", () => {
    const cssSource = readFileSync(
      new URL("../../components/bio/bio-page.module.css", import.meta.url),
      "utf8",
    );

    // A link hub is a single column at every width; no multi-column editorial grid.
    expect(cssSource).toMatch(/\.shell\s*\{[\s\S]*?width:\s*min\(100% - 2rem, 30rem\)/);
    for (const removed of [".hero", ".trustGrid", ".finalCta", ".productStories", ".ambientCloud"]) {
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
    const tapTargets = [".iconButton,\n.shareButton", ".primaryButton,\n.secondaryButton", ".hubLink"];

    for (const selector of tapTargets) {
      const block = cssSource.slice(cssSource.indexOf(selector));
      const minHeight = block.match(/min-height:\s*([\d.]+)rem/)?.[1];
      expect(Number(minHeight)).toBeGreaterThanOrEqual(2.75);
    }
  });
});

describe("share fallback contract", () => {
  it("uses native sharing first", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const writeClipboard = vi.fn();

    await expect(executeShare("https://sheepiesleep.com/bio", { share, writeClipboard })).resolves.toBe(
      "shared",
    );
    expect(writeClipboard).not.toHaveBeenCalled();
  });

  it("falls back from failed sharing to the clipboard and then document copy", async () => {
    const share = vi.fn().mockRejectedValue(new Error("share failed"));
    const writeClipboard = vi.fn().mockRejectedValue(new Error("clipboard failed"));
    const copyWithDocument = vi.fn().mockReturnValue(true);

    await expect(
      executeShare("https://sheepiesleep.com/bio", { share, writeClipboard, copyWithDocument }),
    ).resolves.toBe("copied");
    expect(copyWithDocument).toHaveBeenCalledWith("https://sheepiesleep.com/bio");
  });

  it("returns explicit outcomes for cancellation and unsupported environments", async () => {
    const cancelled = Object.assign(new Error("cancelled"), { name: "AbortError" });

    await expect(
      executeShare("https://sheepiesleep.com/bio", {
        share: vi.fn().mockRejectedValue(cancelled),
      }),
    ).resolves.toBe("cancelled");
    await expect(executeShare("https://sheepiesleep.com/bio", {})).resolves.toBe("unsupported");
  });

  it("renders an accessible live status region", () => {
    const markup = renderToStaticMarkup(createElement(BioPage, { config: createBioConfig() }));

    expect(markup).toContain('role="status"');
    expect(markup).toContain('aria-live="polite"');
  });
});
