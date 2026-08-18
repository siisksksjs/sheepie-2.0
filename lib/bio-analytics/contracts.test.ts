import { afterEach, describe, expect, it, vi } from "vitest";

import {
  BIO_EVENT_NAMES,
  BIO_EVENT_TEXT_LIMITS,
  DESTINATIONS,
  MAX_BIO_EVENT_BODY_BYTES,
  PRODUCT_SLUGS,
  classifyReferrer,
  getScreenCategory,
  normalizeText,
  parseBioEvent,
} from "./contracts";

const validEvent = {
  event_id: "123e4567-e89b-42d3-a456-426614174000",
  occurred_at: "2026-08-17T02:00:00.000Z",
  schema_version: 1,
  event_name: "bio_page_view",
  visitor_id: "123e4567-e89b-42d3-a456-426614174001",
  session_id: "123e4567-e89b-42d3-a456-426614174002",
  sequence_no: 1,
  section_id: null,
  product_slug: null,
  cta_id: null,
  cta_position: null,
  destination: null,
  landing_path: "/bio",
  referrer_category: "instagram",
  utm_source: "instagram",
  utm_medium: "social",
  utm_campaign: "launch",
  utm_content: null,
  utm_term: null,
  elapsed_ms: 0,
  is_returning: false,
  screen_category: "mobile",
  language: "id-ID",
  timezone: "Asia/Jakarta",
  scroll_depth: null,
} as const;

afterEach(() => {
  vi.useRealTimers();
});

describe("bio analytics allowlists", () => {
  it("exposes the database-aligned literal values", () => {
    expect(BIO_EVENT_NAMES).toEqual([
      "bio_page_view",
      "bio_section_view",
      "bio_scroll_depth",
      "bio_product_view",
      "bio_outbound_click",
      "bio_share_click",
    ]);
    expect(PRODUCT_SLUGS).toEqual(["cervicloud", "lumicloud", "calmicloud"]);
    expect(DESTINATIONS).toEqual([
      "shopee",
      "tokopedia",
      "website",
      "whatsapp",
      "instagram",
      "tiktok",
      "email",
      "share",
    ]);
    expect(MAX_BIO_EVENT_BODY_BYTES).toBe(8192);
    expect(BIO_EVENT_TEXT_LIMITS).toEqual({
      section_id: 100,
      cta_id: 100,
      cta_position: 100,
      referrer_category: 100,
      timezone: 100,
      language: 35,
      utm_source: 200,
      utm_medium: 200,
      utm_campaign: 200,
      utm_content: 200,
      utm_term: 200,
    });
  });
});

describe("parseBioEvent", () => {
  it("accepts a valid event and normalizes its text fields", () => {
    const result = parseBioEvent({
      ...validEvent,
      event_name: "bio_section_view",
      section_id: "  hero  ",
      utm_campaign: "  launch  ",
      language: "  id-ID  ",
    });

    expect(result).toEqual({
      success: true,
      data: {
        ...validEvent,
        event_name: "bio_section_view",
        section_id: "hero",
        utm_campaign: "launch",
        language: "id-ID",
      },
    });
  });

  it("canonicalizes only UUID identifiers to lowercase", () => {
    const result = parseBioEvent({
      ...validEvent,
      event_id: validEvent.event_id.toUpperCase(),
      visitor_id: validEvent.visitor_id.toUpperCase(),
      session_id: validEvent.session_id.toUpperCase(),
      utm_source: "KeepCASE",
      language: "ID-id",
    });

    expect(result).toMatchObject({
      success: true,
      data: {
        event_id: validEvent.event_id,
        visitor_id: validEvent.visitor_id,
        session_id: validEvent.session_id,
        utm_source: "KeepCASE",
        language: "ID-id",
      },
    });
  });

  it.each([null, [], "event", 7])("rejects non-object input: %j", (value) => {
    expect(parseBioEvent(value).success).toBe(false);
  });

  it("rejects unknown event names and unknown keys", () => {
    expect(parseBioEvent({ ...validEvent, event_name: "purchase" }).success).toBe(false);
    expect(parseBioEvent({ ...validEvent, arbitrary: "value" }).success).toBe(false);
  });

  it("rejects missing required fields and invalid UUIDs", () => {
    const missingEventId: Record<string, unknown> = { ...validEvent };
    delete missingEventId.event_id;

    expect(parseBioEvent(missingEventId).success).toBe(false);
    expect(parseBioEvent({ ...validEvent, visitor_id: "not-a-uuid" }).success).toBe(false);
  });

  it("rejects invalid and excessively future timestamps", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-17T02:00:00.000Z"));

    expect(parseBioEvent({ ...validEvent, occurred_at: "today" }).success).toBe(false);
    expect(
      parseBioEvent({ ...validEvent, occurred_at: "2026-08-17T02:05:00.001Z" }).success,
    ).toBe(false);
    expect(
      parseBioEvent({ ...validEvent, occurred_at: "2026-08-17T02:05:00.000Z" }).success,
    ).toBe(true);

  });

  it("validates ISO calendar dates, times, leap years, and offsets", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-17T02:00:00.000Z"));

    for (const occurred_at of [
      "2026-02-29T00:00:00Z",
      "2026-13-01T00:00:00Z",
      "2026-04-31T00:00:00Z",
      "2026-01-01T24:00:00Z",
      "2026-01-01T00:60:00Z",
      "2026-01-01T00:00:60Z",
      "2026-01-01T00:00:00+14:01",
      "2026-01-01T00:00:00+15:00",
    ]) {
      expect(parseBioEvent({ ...validEvent, occurred_at }).success).toBe(false);
    }

    expect(
      parseBioEvent({ ...validEvent, occurred_at: "2024-02-29T00:00:00Z" }).success,
    ).toBe(true);
    expect(
      parseBioEvent({ ...validEvent, occurred_at: "2026-08-17T09:00:00+07:00" }).success,
    ).toBe(true);
    expect(
      parseBioEvent({ ...validEvent, occurred_at: "2024-01-01T00:00:00+14:00" }).success,
    ).toBe(true);

  });

  it("rejects unsupported enums", () => {
    expect(parseBioEvent({ ...validEvent, product_slug: "dreamcloud" }).success).toBe(false);
    expect(parseBioEvent({ ...validEvent, destination: "amazon" }).success).toBe(false);
    expect(parseBioEvent({ ...validEvent, screen_category: "watch" }).success).toBe(false);
    expect(parseBioEvent({ ...validEvent, scroll_depth: 10 }).success).toBe(false);
    expect(parseBioEvent({ ...validEvent, landing_path: "/en/bio" }).success).toBe(false);
  });

  it("accepts the strict shape for every event variant", () => {
    const variants = [
      validEvent,
      { ...validEvent, event_name: "bio_section_view", section_id: "hero" },
      { ...validEvent, event_name: "bio_scroll_depth", scroll_depth: 25 },
      {
        ...validEvent,
        event_name: "bio_product_view",
        section_id: "cervicloud",
        product_slug: "cervicloud",
      },
      {
        ...validEvent,
        event_name: "bio_outbound_click",
        section_id: "cervicloud",
        product_slug: "cervicloud",
        cta_id: "buy-cervicloud",
        cta_position: "product-card",
        destination: "shopee",
      },
      {
        ...validEvent,
        event_name: "bio_share_click",
        section_id: "header",
        cta_id: "share-bio",
        cta_position: "header",
        destination: "share",
      },
    ];

    for (const variant of variants) expect(parseBioEvent(variant).success).toBe(true);
  });

  it("rejects incompatible fields for every event variant", () => {
    const invalidVariants = [
      { ...validEvent, section_id: "hero" },
      { ...validEvent, event_name: "bio_section_view", section_id: null },
      { ...validEvent, event_name: "bio_section_view", section_id: "hero", destination: "website" },
      { ...validEvent, event_name: "bio_scroll_depth", scroll_depth: null },
      { ...validEvent, event_name: "bio_scroll_depth", scroll_depth: 25, section_id: "hero" },
      {
        ...validEvent,
        event_name: "bio_product_view",
        section_id: null,
        product_slug: "cervicloud",
      },
      {
        ...validEvent,
        event_name: "bio_product_view",
        section_id: "cervicloud",
        product_slug: "cervicloud",
        cta_id: "forbidden",
      },
      {
        ...validEvent,
        event_name: "bio_outbound_click",
        section_id: "cervicloud",
        cta_id: "buy",
        cta_position: null,
        destination: "shopee",
      },
      {
        ...validEvent,
        event_name: "bio_outbound_click",
        section_id: "cervicloud",
        cta_id: "buy",
        cta_position: "product-card",
        destination: "shopee",
        scroll_depth: 25,
      },
      {
        ...validEvent,
        event_name: "bio_outbound_click",
        section_id: "header",
        cta_id: "share",
        cta_position: "header",
        destination: "share",
      },
      {
        ...validEvent,
        event_name: "bio_share_click",
        section_id: "header",
        cta_id: "share",
        cta_position: "header",
        destination: "instagram",
      },
      {
        ...validEvent,
        event_name: "bio_share_click",
        section_id: "header",
        product_slug: "cervicloud",
        cta_id: "share",
        cta_position: "header",
        destination: "share",
      },
    ];

    for (const variant of invalidVariants) expect(parseBioEvent(variant).success).toBe(false);
  });

  it("rejects invalid numeric bounds and types", () => {
    for (const sequence_no of [0, -1, 1.5]) {
      expect(parseBioEvent({ ...validEvent, sequence_no }).success).toBe(false);
    }
    for (const elapsed_ms of [-1, 1.5]) {
      expect(parseBioEvent({ ...validEvent, elapsed_ms }).success).toBe(false);
    }
  });

  it("matches the database text-field boundaries without truncating accepted input", () => {
    const sectionEvent = {
      ...validEvent,
      event_name: "bio_section_view",
      section_id: "x".repeat(100),
    };
    expect(parseBioEvent(sectionEvent)).toMatchObject({
      success: true,
      data: { section_id: "x".repeat(100) },
    });
    expect(parseBioEvent({ ...sectionEvent, section_id: "x".repeat(101) }).success).toBe(false);

    const clickEvent = {
      ...validEvent,
      event_name: "bio_outbound_click",
      section_id: "x".repeat(100),
      cta_id: "x".repeat(100),
      cta_position: "x".repeat(100),
      destination: "shopee",
    };
    expect(parseBioEvent(clickEvent).success).toBe(true);
    expect(parseBioEvent({ ...clickEvent, cta_id: "x".repeat(101) }).success).toBe(false);
    expect(parseBioEvent({ ...clickEvent, cta_position: "x".repeat(101) }).success).toBe(false);

    for (const key of ["timezone"] as const) {
      expect(parseBioEvent({ ...validEvent, [key]: "x".repeat(100) }).success).toBe(true);
      expect(parseBioEvent({ ...validEvent, [key]: "x".repeat(101) }).success).toBe(false);
    }
    expect(parseBioEvent({ ...validEvent, language: "x".repeat(35) }).success).toBe(true);
    expect(parseBioEvent({ ...validEvent, language: "x".repeat(36) }).success).toBe(false);

    for (const key of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ] as const) {
      const boundary = parseBioEvent({ ...validEvent, [key]: "x".repeat(200) });
      expect(boundary).toMatchObject({ success: true, data: { [key]: "x".repeat(200) } });
      expect(parseBioEvent({ ...validEvent, [key]: "x".repeat(201) }).success).toBe(false);
    }
  });
});

describe("contract helpers", () => {
  it("normalizes nullable text and caps it to the requested length", () => {
    expect(normalizeText("  Sheepie  ")).toBe("Sheepie");
    expect(normalizeText(" x ".repeat(200), 64)?.length).toBe(64);
    expect(normalizeText("   ")).toBeNull();
    expect(normalizeText(42)).toBeNull();
    expect(normalizeText("x", 0)).toBeNull();
    expect(normalizeText("abc   def", 6)).toBe("abc");
  });

  it.each([
    ["", "direct"],
    ["https://www.instagram.com/", "instagram"],
    ["https://l.instagram.com/?u=example", "instagram"],
    ["https://www.tiktok.com/@sheepie", "tiktok"],
    ["https://www.google.co.id/search?q=sheepie", "google"],
    ["https://news.google.com/", "google"],
    ["https://google.evil.com/", "other"],
    ["https://google.com.evil.example/", "other"],
    ["https://instagram.com.evil.example/", "other"],
    ["https://tiktok.com.evil.example/", "other"],
    ["javascript:https://instagram.com", "other"],
    ["ftp://google.com/", "other"],
    ["not a url", "other"],
    ["https://example.com/path", "other"],
  ])("classifies referrer %j as %s", (value, expected) => {
    expect(classifyReferrer(value)).toBe(expected);
  });

  it.each([
    [0, "mobile"],
    [639, "mobile"],
    [640, "tablet"],
    [1023, "tablet"],
    [1024, "desktop"],
  ])("maps width %d to %s", (width, expected) => {
    expect(getScreenCategory(width)).toBe(expected);
  });
});
