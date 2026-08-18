import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  fileURLToPath(new URL("../../../public/sheepie-event-sw.js", import.meta.url)),
  "utf8",
);

/** Rebuilds the worker's scoping predicate so it can be exercised directly. */
function loadIsEventAsset(): (url: string, origin: string) => boolean {
  const declaration = source.match(/const EVENT_PATH = "[^"]+";/)?.[0];
  const start = source.indexOf("function isEventAsset");
  const end = source.indexOf("function isEventPage");

  if (!declaration || start === -1 || end === -1) {
    // Without the predicate the worker has no allowlist, which is the v3 bug.
    throw new Error("sheepie-event-sw.js must define EVENT_PATH and isEventAsset()");
  }

  return new Function(`${declaration}${source.slice(start, end)}; return isEventAsset;`)();
}

const ORIGIN = "https://sheepiesleep.com";

describe("event service worker scope", () => {
  it("exposes an allowlist predicate", () => {
    expect(() => loadIsEventAsset()).not.toThrow();
  });

  it.each([
    "/bio",
    "/id",
    "/id/products/cervicloud",
    "/id/blog/some-post",
    "/api/bio-events",
    "/images/bio/sheepie-banner.png",
    "/sitemap.xml",
  ])("never intercepts %s", (path) => {
    const isEventAsset = loadIsEventAsset();
    // The worker is registered at root scope, so anything it handles outside the
    // event bundle would be replayed from cache and freeze that page.
    expect(isEventAsset(`${ORIGIN}${path}`, ORIGIN)).toBe(false);
  });

  it.each([
    "/id/sheepie-x-yoga-spin",
    "/en/sheepie-x-yoga-spin",
    "/_next/static/chunks/main.js",
    "/images/event/sheepiesleep-id-instagram-qr.svg",
  ])("caches %s for offline use", (path) => {
    const isEventAsset = loadIsEventAsset();
    expect(isEventAsset(`${ORIGIN}${path}`, ORIGIN)).toBe(true);
  });

  it("ignores other origins and unparseable URLs", () => {
    const isEventAsset = loadIsEventAsset();

    expect(isEventAsset("https://evil.example/id/sheepie-x-yoga-spin", ORIGIN)).toBe(false);
    expect(isEventAsset("not a url", ORIGIN)).toBe(false);
  });
});

describe("event service worker caching policy", () => {
  it("returns early instead of responding for non-event requests", () => {
    expect(source).toMatch(
      /if \(!isEventAsset\(event\.request\.url, self\.location\.origin\)\) return;/,
    );
  });

  it("never caches an arbitrary proxied response", () => {
    // The v3 bug: every ok same-origin GET was written to the cache and then
    // served cache-first forever. Only allowlisted requests may be stored.
    const fetchHandler = source.slice(source.indexOf('self.addEventListener("fetch"'));
    const guardIndex = fetchHandler.indexOf("if (!isEventAsset(");
    const beforeGuard = fetchHandler.slice(0, guardIndex);
    expect(beforeGuard).not.toContain("cache.put");
  });

  it("keeps the event page network-first so a redeploy reaches the device", () => {
    expect(source).toMatch(/if \(isEventPage\([\s\S]*?fetch\(request\)/);
  });

  it("bumps the cache name so poisoned caches are purged on activate", () => {
    const version = source.match(/const CACHE_NAME = "sheepie-event-v(\d+)"/)?.[1];
    expect(Number(version)).toBeGreaterThanOrEqual(4);
    expect(source).toContain('key.startsWith("sheepie-event-") && key !== CACHE_NAME');
  });
});
