import { describe, expect, it } from "vitest";

import { GET } from "./route";
import { bioConfig } from "@/data/bio";

function request(path: string, userAgent?: string) {
  return new Request(`https://www.sheepiesleep.com${path}`, userAgent ? { headers: { "user-agent": userAgent } } : undefined);
}

const IG_IOS =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 350.0.0.0";
const SAFARI_IOS =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const IG_ANDROID =
  "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36 Instagram 350.0.0.0 Android";

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

describe("tracked story redirect", () => {
  it("sends each product to its Shopee listing", async () => {
    for (const product of bioConfig.products) {
      const response = await GET(request(`/go/${product.slug}`), params(product.slug));
      const shopee = product.actions.find((action) => action.destination === "shopee")!;

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe(shopee.href);
    }
  });

  it("sends storefront and profile slugs to their own destinations", async () => {
    const expected: Array<[string, string]> = [
      ["shopee", "bio-hub-shopee"],
      ["tokopedia", "bio-hub-tokopedia"],
      ["tiktok", "bio-hub-tiktok"],
      ["instagram", "bio-hub-instagram"],
      ["website", "bio-hub-website"],
    ];

    for (const [slug, id] of expected) {
      const response = await GET(request(`/go/${slug}`), params(slug));
      const hub = bioConfig.hubActions.find((action) => action.id === id)!;

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe(hub.href);
    }
  });

  it("redirects an unknown slug to the bio page instead of erroring", async () => {
    const response = await GET(request("/go/nonsense"), params("nonsense"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://www.sheepiesleep.com/bio");
  });

  it("still redirects when analytics is unavailable", async () => {
    // No Supabase credentials are configured in the test environment, so the
    // ingest call throws; the shopper must reach the listing regardless.
    const response = await GET(request("/go/cervicloud?utm_campaign=agustus"), params("cervicloud"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("shopee.co.id");
  });

  describe("on phones", () => {
    const shopeeHref = (slug: string) =>
      bioConfig.products.find((p) => p.slug === slug)!.actions.find((a) => a.destination === "shopee")!.href;

    it("opens the Shopee app through an Android intent and records only a PageView", async () => {
      const response = await GET(request("/go/cervicloud", IG_ANDROID), params("cervicloud"));
      const html = await response.text();

      expect(response.status).toBe(200);
      expect(response.headers.get("cache-control")).toBe("no-store");
      expect(html).toContain("intent://shopee.co.id/");
      expect(html).toContain("package=com.shopee.id");
      expect(html).toContain('"event_name":"PageView"');
      expect(html).not.toContain("InitiateCheckout");
      expect(html).toContain(`href="${shopeeHref("cervicloud").replace(/&/g, "&amp;").replace(/"/g, "&quot;")}"`);
    });

    it("shows iPhones a product card with one tap-to-open Shopee button and no redirect", async () => {
      for (const ua of [IG_IOS, SAFARI_IOS]) {
        const response = await GET(request("/go/lumicloud?utm_campaign=okt", ua), params("lumicloud"));
        const html = await response.text();
        // The ad's utm_campaign travels on to the Shopee listing.
        const tagged = new URL(shopeeHref("lumicloud"));
        tagged.searchParams.set("utm_campaign", "okt");
        const href = tagged.toString().replace(/&/g, "&amp;").replace(/"/g, "&quot;");

        expect(response.status).toBe(200);
        expect(html).toContain(`class="cta" href="${href}"`);
        expect(html).toContain("var openHref = null;");
        expect(html).toContain("LumiCloud");
        expect(html).toContain("/_next/image?url=");
        expect(html).not.toContain("Lanjut di browser");
        expect(html).toContain('"event_name":"PageView"');
      }
    });

    it("shows the storefront button without a product card on iPhone", async () => {
      const response = await GET(request("/go/shopee", IG_IOS), params("shopee"));
      const html = await response.text();

      expect(response.status).toBe(200);
      expect(html).not.toContain('class="card"');
      expect(html).toContain("Toko resmi Sheepie di Shopee");
    });

    it("plain-redirects when ?s=1 is set", async () => {
      const response = await GET(request("/go/lumicloud?s=1", SAFARI_IOS), params("lumicloud"));

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe(shopeeHref("lumicloud"));
    });

    it("keeps plain redirects for non-Shopee destinations", async () => {
      const response = await GET(request("/go/tiktok", IG_IOS), params("tiktok"));

      expect(response.status).toBe(307);
    });

    it("records a PageView for the storefront link too", async () => {
      const response = await GET(request("/go/shopee", IG_ANDROID), params("shopee"));
      const html = await response.text();

      expect(html).toContain('"event_name":"PageView"');
    });
  });
});
