// lib/meta/events.ts
import type { Marketplace, ProductSlug } from "@/lib/catalog/types";

export const META_EVENT_NAMES = ["PageView", "ViewContent", "InitiateCheckout"] as const;
export type MetaEventName = (typeof META_EVENT_NAMES)[number];

export type MetaCustomData = {
  content_ids?: string[];
  content_type?: "product";
  value?: number;
  currency?: "IDR";
  marketplace?: Marketplace;
  placement?: string;
};

export type MetaEvent = {
  event_name: MetaEventName;
  event_id: string;
  custom_data: MetaCustomData;
};

export function newEventId(): string {
  return globalThis.crypto.randomUUID();
}

export function contentId(slug: ProductSlug, optionKey: string): string {
  return `${slug}:${optionKey}`;
}

export function pageView(): MetaEvent {
  return { event_name: "PageView", event_id: newEventId(), custom_data: {} };
}

export function viewContent(input: { slug: ProductSlug; optionKey: string; value: number }): MetaEvent {
  return {
    event_name: "ViewContent",
    event_id: newEventId(),
    custom_data: {
      content_ids: [contentId(input.slug, input.optionKey)],
      content_type: "product",
      value: input.value,
      currency: "IDR",
    },
  };
}

export function initiateCheckout(input: {
  slug: ProductSlug;
  optionKey: string;
  value: number;
  marketplace: Marketplace;
  placement: string;
}): MetaEvent {
  const event = viewContent(input);
  return {
    event_name: "InitiateCheckout",
    event_id: event.event_id,
    custom_data: { ...event.custom_data, marketplace: input.marketplace, placement: input.placement },
  };
}

const TOP_KEYS = new Set(["event_name", "event_id", "custom_data", "event_source_url"]);
const CUSTOM_KEYS = new Set(["content_ids", "content_type", "value", "currency", "marketplace", "placement"]);
const SAFE = /^[\w:-]+$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Strict allow-list check for anything arriving at /api/meta-events. */
export function isMetaEvent(value: unknown): value is MetaEvent & { event_source_url?: string } {
  if (!isRecord(value)) return false;
  if (!Object.keys(value).every((k) => TOP_KEYS.has(k))) return false;
  if (!(META_EVENT_NAMES as readonly unknown[]).includes(value.event_name)) return false;
  if (typeof value.event_id !== "string" || !/^[\w-]{8,64}$/.test(value.event_id)) return false;
  if ("event_source_url" in value && (typeof value.event_source_url !== "string" || value.event_source_url.length > 500)) return false;

  const data = value.custom_data;
  if (!isRecord(data)) return false;
  if (!Object.keys(data).every((k) => CUSTOM_KEYS.has(k))) return false;
  if ("content_ids" in data) {
    const ids = data.content_ids;
    if (!Array.isArray(ids) || ids.length > 5) return false;
    if (!ids.every((id) => typeof id === "string" && id.length <= 60 && SAFE.test(id))) return false;
  }
  if ("content_type" in data && data.content_type !== "product") return false;
  if ("value" in data && (typeof data.value !== "number" || !Number.isFinite(data.value) || data.value < 0 || data.value > 1e9)) return false;
  if ("currency" in data && data.currency !== "IDR") return false;
  if ("marketplace" in data && data.marketplace !== "shopee" && data.marketplace !== "tokopedia") return false;
  if ("placement" in data && (typeof data.placement !== "string" || data.placement.length > 40 || !SAFE.test(data.placement))) return false;
  return true;
}
