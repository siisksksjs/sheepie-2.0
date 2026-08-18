import { describe, expect, it, vi } from "vitest";

import { parseBioEvent } from "./contracts";
import {
  createBioEventFactory,
  createOnce,
  reachedScrollDepths,
  resolveCtaDetails,
  sendBioEvent,
} from "./client";
import { createBioSession } from "./session";

function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key: string) => map.get(key) ?? null,
    key: (index: number) => [...map.keys()][index] ?? null,
    removeItem: (key: string) => void map.delete(key),
    setItem: (key: string, value: string) => void map.set(key, value),
  } as Storage;
}

function fakeUuid(seed: number): string {
  const hex = seed.toString(16).padStart(12, "0");
  return `00000000-0000-4000-8000-${hex}`;
}

function transportWithBeacon(result: boolean) {
  return {
    sendBeacon: vi.fn((_url: string, _body: Blob) => result),
    fetch: vi.fn(async (_input: string, _init?: RequestInit) => new Response(null, { status: 202 })),
  };
}

describe("sendBioEvent", () => {
  const event = { event_name: "bio_page_view" } as never;

  it("prefers navigator.sendBeacon", () => {
    const transport = transportWithBeacon(true);

    sendBioEvent(event, transport);

    expect(transport.sendBeacon).toHaveBeenCalledTimes(1);
    expect(transport.sendBeacon.mock.calls[0]?.[0]).toBe("/api/bio-events");
    expect(transport.fetch).not.toHaveBeenCalled();
  });

  it("falls back to keepalive fetch when the beacon is refused", () => {
    const transport = transportWithBeacon(false);

    sendBioEvent(event, transport);

    expect(transport.fetch).toHaveBeenCalledTimes(1);
    const [url, init] = transport.fetch.mock.calls[0]!;
    expect(url).toBe("/api/bio-events");
    expect(init?.method).toBe("POST");
    expect(init?.keepalive).toBe(true);
    expect(init?.body).toBe(JSON.stringify(event));
  });

  it("falls back to fetch when no beacon transport exists", () => {
    const transport = {
      fetch: vi.fn(async (_input: string, _init?: RequestInit) => new Response(null, { status: 202 })),
    };

    sendBioEvent(event, transport);

    expect(transport.fetch).toHaveBeenCalledTimes(1);
  });

  it("never throws when the beacon throws", () => {
    const transport = {
      sendBeacon: vi.fn((_url: string, _body: Blob): boolean => {
        throw new Error("beacon blocked");
      }),
      fetch: vi.fn(async (_input: string, _init?: RequestInit) => new Response(null, { status: 202 })),
    };

    expect(() => sendBioEvent(event, transport)).not.toThrow();
    expect(transport.fetch).toHaveBeenCalledTimes(1);
  });

  it("never throws when fetch rejects", async () => {
    const transport = {
      sendBeacon: vi.fn((_url: string, _body: Blob) => false),
      fetch: vi.fn((_input: string, _init?: RequestInit) => Promise.reject(new Error("offline"))),
    };

    expect(() => sendBioEvent(event, transport)).not.toThrow();
    await Promise.resolve();
  });

  it("never throws when the event cannot be serialized", () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    const transport = transportWithBeacon(true);

    expect(() => sendBioEvent(circular as never, transport)).not.toThrow();
    expect(transport.sendBeacon).not.toHaveBeenCalled();
    expect(transport.fetch).not.toHaveBeenCalled();
  });
});

describe("createOnce", () => {
  it("runs each key exactly once", () => {
    const once = createOnce();
    const fn = vi.fn();

    once("bio-hero", fn);
    once("bio-hero", fn);
    once("bio-hub", fn);

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("does not mark a key as used when the callback throws", () => {
    const once = createOnce();
    let calls = 0;
    const failing = () => {
      calls += 1;
      throw new Error("nope");
    };

    expect(() => once("bio-hero", failing)).toThrow();
    expect(() => once("bio-hero", failing)).toThrow();
    expect(calls).toBe(2);
  });
});

describe("createBioEventFactory", () => {
  function factory(now: () => number) {
    let seed = 0;
    const session = createBioSession(
      memoryStorage(),
      memoryStorage(),
      1_000,
      new URL("https://sheepiesleep.com/bio?utm_source=instagram&utm_medium=bio"),
      { randomUUID: () => fakeUuid((seed += 1)) as `${string}-${string}-${string}-${string}-${string}` },
    );

    return createBioEventFactory({
      session,
      startedAt: 1_000,
      now,
      newEventId: () => fakeUuid((seed += 1)),
      language: "id-ID",
      timezone: "Asia/Jakarta",
      screenWidth: () => 390,
      referrer: "https://www.instagram.com/",
    });
  }

  it("produces an event the server contract accepts", () => {
    const create = factory(() => 4_500);

    const event = create({
      event_name: "bio_page_view",
      section_id: null,
      product_slug: null,
      cta_id: null,
      cta_position: null,
      destination: null,
      scroll_depth: null,
    });

    expect(parseBioEvent(event)).toMatchObject({ success: true });
    expect(event).toMatchObject({
      event_name: "bio_page_view",
      landing_path: "/bio",
      schema_version: 1,
      elapsed_ms: 3_500,
      screen_category: "mobile",
      language: "id-ID",
      timezone: "Asia/Jakarta",
      referrer_category: "instagram",
      utm_source: "instagram",
      utm_medium: "bio",
    });
  });

  it("increments the sequence and issues a new event id per event", () => {
    const create = factory(() => 2_000);

    const first = create({
      event_name: "bio_section_view",
      section_id: "bio-hero",
      product_slug: null,
      cta_id: null,
      cta_position: null,
      destination: null,
      scroll_depth: null,
    });
    const second = create({
      event_name: "bio_scroll_depth",
      section_id: null,
      product_slug: null,
      cta_id: null,
      cta_position: null,
      destination: null,
      scroll_depth: 50,
    });

    expect(second.sequence_no).toBe(first.sequence_no + 1);
    expect(second.event_id).not.toBe(first.event_id);
    expect(second.session_id).toBe(first.session_id);
    expect(parseBioEvent(second)).toMatchObject({ success: true });
  });

  it("clamps elapsed time to a non-negative integer", () => {
    const create = factory(() => 500);

    const event = create({
      event_name: "bio_page_view",
      section_id: null,
      product_slug: null,
      cta_id: null,
      cta_position: null,
      destination: null,
      scroll_depth: null,
    });

    expect(event.elapsed_ms).toBe(0);
    expect(parseBioEvent(event)).toMatchObject({ success: true });
  });
});

describe("resolveCtaDetails", () => {
  const attributes = (record: Record<string, string>) => (name: string) => record[name] ?? null;

  it("maps a marketplace CTA to an outbound click", () => {
    expect(
      resolveCtaDetails(
        attributes({
          "data-bio-cta": "bio-cervicloud-shopee",
          "data-bio-section": "bio-product-alignment",
          "data-bio-position": "product-primary",
          "data-bio-destination": "shopee",
          "data-bio-product": "cervicloud",
        }),
      ),
    ).toEqual({
      event_name: "bio_outbound_click",
      section_id: "bio-product-alignment",
      product_slug: "cervicloud",
      cta_id: "bio-cervicloud-shopee",
      cta_position: "product-primary",
      destination: "shopee",
      scroll_depth: null,
    });
  });

  it("maps the share CTA to a share click without a product", () => {
    expect(
      resolveCtaDetails(
        attributes({
          "data-bio-cta": "header_share",
          "data-bio-section": "bio-header",
          "data-bio-position": "header",
          "data-bio-destination": "share",
          "data-bio-product": "cervicloud",
        }),
      ),
    ).toMatchObject({ event_name: "bio_share_click", destination: "share", product_slug: null });
  });

  it("drops unknown destinations and incomplete CTAs", () => {
    expect(
      resolveCtaDetails(
        attributes({
          "data-bio-cta": "hub_unknown",
          "data-bio-section": "bio-hub",
          "data-bio-position": "hub-1",
          "data-bio-destination": "lazada",
        }),
      ),
    ).toBeNull();
    expect(
      resolveCtaDetails(attributes({ "data-bio-cta": "hub_shopee", "data-bio-destination": "shopee" })),
    ).toBeNull();
  });

  it("ignores an unknown product rather than rejecting the click", () => {
    expect(
      resolveCtaDetails(
        attributes({
          "data-bio-cta": "hub_shopee",
          "data-bio-section": "bio-hub",
          "data-bio-position": "hub-2",
          "data-bio-destination": "shopee",
          "data-bio-product": "sheepcloud",
        }),
      ),
    ).toMatchObject({ product_slug: null });
  });
});

describe("reachedScrollDepths", () => {
  it("reports milestones already passed", () => {
    expect(reachedScrollDepths(0, 800, 3_200)).toEqual([25]);
    expect(reachedScrollDepths(800, 800, 3_200)).toEqual([25, 50]);
    expect(reachedScrollDepths(2_400, 800, 3_200)).toEqual([25, 50, 75, 100]);
  });

  it("treats a page shorter than the viewport as fully seen", () => {
    expect(reachedScrollDepths(0, 900, 600)).toEqual([25, 50, 75, 100]);
  });

  it("returns nothing for degenerate measurements", () => {
    expect(reachedScrollDepths(0, 0, 0)).toEqual([]);
    expect(reachedScrollDepths(Number.NaN, 800, 3_200)).toEqual([]);
  });
});
