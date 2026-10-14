import { beforeEach, describe, expect, it } from "vitest";

import { attributionFromSearch, captureAttribution, readAttribution } from "@/lib/attribution";
import { forwardUtm, marketplaceHref } from "@/lib/utm";

const store = new Map<string, string>();
beforeEach(() => {
  store.clear();
  (globalThis as { sessionStorage?: unknown }).sessionStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
  };
});

describe("ad attribution", () => {
  it("reads an ad's UTM tags from the landing URL", () => {
    expect(attributionFromSearch("?utm_source=meta&utm_medium=paid_social&utm_campaign=Lumi-Okt&utm_content=Video-A")).toEqual({
      source: "meta",
      medium: "paid_social",
      campaign: "Lumi-Okt",
      content: "Video-A",
      term: undefined,
    });
    expect(attributionFromSearch("?fbclid=abc123")).toEqual({ source: "meta", medium: "social" });
    expect(attributionFromSearch("?option=blue")).toBeNull();
  });

  it("remembers the latest tagged landing for the session and ignores untagged pages", () => {
    captureAttribution("?utm_source=meta&utm_campaign=A");
    captureAttribution("?option=blue");
    expect(readAttribution()?.campaign).toBe("A");
    captureAttribution("?utm_source=google&utm_campaign=B");
    expect(readAttribution()).toMatchObject({ source: "google", campaign: "B" });
  });

  it("tags marketplace links with the site's own tags when there is no ad", () => {
    const url = new URL(marketplaceHref("https://shopee.co.id/product/1/2/", "lumicloud", "sticky-bar"));
    expect(Object.fromEntries(url.searchParams)).toEqual({ utm_source: "site", utm_medium: "button", utm_campaign: "sticky-bar", utm_content: "lumicloud" });
  });

  it("passes an ad's tags on to the marketplace, keeping product and button", () => {
    const attribution = { source: "meta", medium: "paid_social", campaign: "Lumi-Okt", content: "Video-A" };
    const url = new URL(marketplaceHref("https://shopee.co.id/product/1/2/", "lumicloud", "sticky-bar", attribution));
    expect(Object.fromEntries(url.searchParams)).toEqual({
      utm_source: "meta",
      utm_medium: "paid_social",
      utm_campaign: "Lumi-Okt",
      utm_content: "lumicloud_sticky-bar",
      utm_term: "Video-A",
    });
  });

  it("forwards /go link tags and leaves untagged links alone", () => {
    const base = "https://shopee.co.id/product/1/2/";
    expect(forwardUtm(base, new URLSearchParams("s=1"))).toBe(base);
    expect(new URL(forwardUtm(base, new URLSearchParams("utm_source=meta&utm_campaign=Okt"))).searchParams.get("utm_campaign")).toBe("Okt");
  });
});
