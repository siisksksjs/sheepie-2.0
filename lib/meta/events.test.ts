// lib/meta/events.test.ts
import { describe, expect, it } from "vitest";

import { contentId, initiateCheckout, isMetaEvent, pageView, viewContent } from "./events";

describe("meta events", () => {
  it("gives every event a fresh id", () => {
    const a = pageView();
    const b = pageView();
    expect(a.event_id).not.toBe(b.event_id);
    expect(a.event_id).toMatch(/^[\w-]{8,64}$/);
  });

  it("describes a product view in IDR", () => {
    const event = viewContent({ slug: "cervicloud", optionKey: "pillow", value: 838000 });
    expect(event.event_name).toBe("ViewContent");
    expect(event.custom_data).toEqual({
      content_ids: ["cervicloud:pillow"],
      content_type: "product",
      value: 838000,
      currency: "IDR",
    });
  });

  it("records the marketplace and placement of a buy click", () => {
    const event = initiateCheckout({ slug: "lumicloud", optionKey: "blue", value: 218000, marketplace: "shopee", placement: "buy-box" });
    expect(event.event_name).toBe("InitiateCheckout");
    expect(event.custom_data.marketplace).toBe("shopee");
    expect(event.custom_data.placement).toBe("buy-box");
    expect(contentId("lumicloud", "blue")).toBe("lumicloud:blue");
  });

  it("accepts what the builders produce, plus a source URL", () => {
    expect(isMetaEvent(pageView())).toBe(true);
    expect(isMetaEvent({ ...viewContent({ slug: "cervicloud", optionKey: "pillow", value: 1 }), event_source_url: "https://sheepiesleep.com/id" })).toBe(true);
  });

  it.each([
    ["null", null],
    ["unknown event", { event_name: "Purchase", event_id: "abcdefgh12", custom_data: {} }],
    ["bad id", { event_name: "PageView", event_id: "x", custom_data: {} }],
    ["extra top-level key", { event_name: "PageView", event_id: "abcdefgh12", custom_data: {}, user_data: { em: "x" } }],
    ["extra custom key", { event_name: "PageView", event_id: "abcdefgh12", custom_data: { email: "a@b.c" } }],
    ["negative value", { event_name: "ViewContent", event_id: "abcdefgh12", custom_data: { value: -1 } }],
    ["wrong currency", { event_name: "ViewContent", event_id: "abcdefgh12", custom_data: { currency: "USD" } }],
    ["too many ids", { event_name: "ViewContent", event_id: "abcdefgh12", custom_data: { content_ids: ["a", "b", "c", "d", "e", "f"] } }],
    ["long placement", { event_name: "InitiateCheckout", event_id: "abcdefgh12", custom_data: { placement: "x".repeat(41) } }],
    ["non-string source url", { event_name: "PageView", event_id: "abcdefgh12", custom_data: {}, event_source_url: 5 }],
  ])("rejects %s", (_label, value) => {
    expect(isMetaEvent(value)).toBe(false);
  });
});
