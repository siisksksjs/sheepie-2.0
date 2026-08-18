import {
  classifyReferrer,
  getScreenCategory,
  DESTINATIONS,
  MAX_BIO_EVENT_INTEGER,
  normalizeText,
  PRODUCT_SLUGS,
  SCROLL_DEPTHS,
  BIO_EVENT_TEXT_LIMITS,
  type BioDestination,
  type BioEventInput,
  type BioProductSlug,
  type ScrollDepth,
} from "./contracts";
import type { BioSession } from "./session";

export const BIO_EVENTS_ENDPOINT = "/api/bio-events";

export type BioTransport = {
  sendBeacon?: (url: string, body: Blob) => boolean;
  fetch: (input: string, init?: RequestInit) => Promise<Response>;
};

type CommonEventKey =
  | "event_id"
  | "occurred_at"
  | "schema_version"
  | "visitor_id"
  | "session_id"
  | "sequence_no"
  | "landing_path"
  | "referrer_category"
  | "utm_source"
  | "utm_medium"
  | "utm_campaign"
  | "utm_content"
  | "utm_term"
  | "elapsed_ms"
  | "is_returning"
  | "screen_category"
  | "language"
  | "timezone";

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

/** The element-specific half of an event; the factory supplies everything else. */
export type BioEventDetails = DistributiveOmit<BioEventInput, CommonEventKey>;

export type BioEventEnvironment = {
  session: BioSession;
  startedAt: number;
  now: () => number;
  newEventId: () => string;
  language: string | null;
  timezone: string | null;
  screenWidth: () => number;
  referrer: string;
};

function defaultTransport(): BioTransport | null {
  if (typeof globalThis.fetch !== "function") return null;
  const beacon =
    typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function"
      ? (url: string, body: Blob) => navigator.sendBeacon(url, body)
      : undefined;
  return { sendBeacon: beacon, fetch: (input, init) => globalThis.fetch(input, init) };
}

/**
 * Delivers an event without ever blocking or failing the visitor's navigation.
 * Every transport error is swallowed on purpose: analytics must fail open.
 */
export function sendBioEvent(
  event: BioEventInput,
  transport: BioTransport | null = defaultTransport(),
): void {
  if (!transport) return;

  let body: string;
  try {
    body = JSON.stringify(event);
  } catch {
    return;
  }

  try {
    if (transport.sendBeacon?.(BIO_EVENTS_ENDPOINT, new Blob([body], { type: "application/json" }))) {
      return;
    }
  } catch {
    // A refused or unavailable beacon falls through to keepalive fetch.
  }

  try {
    void transport
      .fetch(BIO_EVENTS_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
        keepalive: true,
      })
      .catch(() => undefined);
  } catch {
    return;
  }
}

/** Set-backed guard so section, product, and scroll milestones emit once per page life. */
export function createOnce(): (key: string, fn: () => void) => void {
  const seen = new Set<string>();
  return (key, fn) => {
    if (seen.has(key)) return;
    fn();
    seen.add(key);
  };
}

export function createBioEventFactory(
  environment: BioEventEnvironment,
): (details: BioEventDetails) => BioEventInput {
  const referrerCategory = classifyReferrer(environment.referrer);

  return (details) => {
    const at = environment.now();
    const context = environment.session.allocateEventContext(at);
    const elapsed = Math.min(
      MAX_BIO_EVENT_INTEGER,
      Math.max(0, Math.round(at - environment.startedAt)),
    );

    return {
      ...details,
      event_id: environment.newEventId(),
      occurred_at: new Date(at).toISOString(),
      schema_version: 1,
      visitor_id: context.visitorId,
      session_id: context.sessionId,
      sequence_no: context.sequenceNo,
      landing_path: "/bio",
      referrer_category: referrerCategory,
      utm_source: context.campaign.utm_source,
      utm_medium: context.campaign.utm_medium,
      utm_campaign: context.campaign.utm_campaign,
      utm_content: context.campaign.utm_content,
      utm_term: context.campaign.utm_term,
      elapsed_ms: elapsed,
      is_returning: context.isReturning,
      screen_category: getScreenCategory(environment.screenWidth()),
      language: normalizeText(environment.language, BIO_EVENT_TEXT_LIMITS.language),
      timezone: normalizeText(environment.timezone, BIO_EVENT_TEXT_LIMITS.timezone),
    } as BioEventInput;
  };
}

/** Reads the `data-bio-*` contract off a CTA element without depending on the DOM. */
export function resolveCtaDetails(
  attribute: (name: string) => string | null | undefined,
): BioEventDetails | null {
  const ctaId = normalizeText(attribute("data-bio-cta"), BIO_EVENT_TEXT_LIMITS.cta_id);
  const sectionId = normalizeText(attribute("data-bio-section"), BIO_EVENT_TEXT_LIMITS.section_id);
  const position = normalizeText(attribute("data-bio-position"), BIO_EVENT_TEXT_LIMITS.cta_position);
  const destination = attribute("data-bio-destination") ?? null;
  const product = attribute("data-bio-product") ?? null;

  if (!ctaId || !sectionId || !position) return null;
  if (!DESTINATIONS.includes(destination as BioDestination)) return null;

  if (destination === "share") {
    return {
      event_name: "bio_share_click",
      section_id: sectionId,
      product_slug: null,
      cta_id: ctaId,
      cta_position: position,
      destination: "share",
      scroll_depth: null,
    };
  }

  return {
    event_name: "bio_outbound_click",
    section_id: sectionId,
    product_slug: PRODUCT_SLUGS.includes(product as BioProductSlug)
      ? (product as BioProductSlug)
      : null,
    cta_id: ctaId,
    cta_position: position,
    destination: destination as Exclude<BioDestination, "share">,
    scroll_depth: null,
  };
}

/** Milestones whose threshold the viewport bottom has passed, ascending. */
export function reachedScrollDepths(
  scrollY: number,
  viewportHeight: number,
  documentHeight: number,
): ScrollDepth[] {
  if (![scrollY, viewportHeight, documentHeight].every(Number.isFinite)) return [];
  if (documentHeight <= 0 || viewportHeight <= 0) return [];

  const scrollable = Math.max(documentHeight, viewportHeight);
  const visited = Math.min(scrollable, Math.max(0, scrollY) + viewportHeight);
  const percent = (visited / scrollable) * 100;

  return SCROLL_DEPTHS.filter((depth) => percent >= depth);
}
