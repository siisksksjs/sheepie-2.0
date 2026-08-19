import { describe, expect, it } from "vitest";

import { GET } from "./route";
import { bioConfig } from "@/data/bio";

function request(path: string) {
  return new Request(`https://sheepiesleep.com${path}`);
}

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
    expect(response.headers.get("location")).toBe("https://sheepiesleep.com/bio");
  });

  it("still redirects when analytics is unavailable", async () => {
    // No Supabase credentials are configured in the test environment, so the
    // ingest call throws; the shopper must reach the listing regardless.
    const response = await GET(request("/go/cervicloud?utm_campaign=agustus"), params("cervicloud"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("shopee.co.id");
  });
});
