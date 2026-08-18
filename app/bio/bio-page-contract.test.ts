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

    expect(ctaIds).toHaveLength(16);
    expect(new Set(ctaIds).size).toBe(ctaIds.length);
    expect(ctaIds).toEqual(
      expect.arrayContaining([
        "header_instagram",
        "header_tiktok",
        "header_share",
        "hub_instagram",
        "hub_tiktok",
        "final_shopee",
        "final_tokopedia",
      ]),
    );
  });

  it("marks the share destination and all meaningful page sections", () => {
    expect(markup).toContain('data-bio-cta="header_share"');
    expect(markup).toContain('data-bio-destination="share"');

    for (const section of [
      "bio-header",
      "bio-hero",
      "bio-system-intro",
      "bio-products",
      "bio-product-alignment",
      "bio-product-darkness",
      "bio-product-silence",
      "bio-hub",
      "bio-trust",
      "bio-final",
      "bio-footer",
    ]) {
      expect(markup).toContain(`data-bio-section="${section}"`);
    }
  });

  it("exposes unique observer targets without tracking the product wrapper or CTAs", () => {
    const trackedSections = attributes(markup, "data-bio-track-section");

    expect(trackedSections).toHaveLength(10);
    expect(new Set(trackedSections).size).toBe(trackedSections.length);
    expect(trackedSections).not.toContain("bio-products");
    expect(markup).not.toMatch(/<(?:a|button) [^>]*data-bio-track-section=/);
    expect(trackedSections).toEqual(
      expect.arrayContaining([
        "bio-header",
        "bio-hero",
        "bio-system-intro",
        "bio-product-alignment",
        "bio-product-darkness",
        "bio-product-silence",
        "bio-hub",
        "bio-trust",
        "bio-final",
        "bio-footer",
      ]),
    );
  });

  it("renders every outbound CTA as a safe normal anchor", () => {
    const outboundAnchors = markup.match(/<a [^>]*data-bio-cta="[^"]+"[^>]*>/g) ?? [];

    expect(outboundAnchors).toHaveLength(15);
    for (const anchor of outboundAnchors) {
      expect(anchor).toContain('target="_blank"');
      expect(anchor).toContain('rel="noopener noreferrer"');
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

  it("keeps tablet trust content stacked and defines contrast and motion contracts", () => {
    const cssSource = readFileSync(
      new URL("../../components/bio/bio-page.module.css", import.meta.url),
      "utf8",
    );
    const tabletBlock = cssSource.match(
      /@media \(min-width: 640px\)([\s\S]*?)@media \(min-width: 768px\)/,
    )?.[1];

    expect(tabletBlock).toBeDefined();
    expect(tabletBlock).not.toContain(".trustGrid");
    expect(cssSource).toMatch(
      /@media \(min-width: 1100px\)[\s\S]*?\.trustGrid\s*\{[\s\S]*?repeat\(3/,
    );
    expect(cssSource).toContain("--bio-text-secondary:");
    expect(cssSource).toContain("--bio-text-on-dark:");
    expect(cssSource).not.toMatch(/color:\s*color-mix/);
    expect(cssSource).toContain("@media (prefers-reduced-motion: reduce)");
    expect(cssSource).toContain("env(safe-area-inset-left)");
    expect(cssSource).toContain("env(safe-area-inset-bottom)");
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
