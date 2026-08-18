import { randomUUID } from "node:crypto";
import { isIP } from "node:net";

import { bioConfig } from "@/data/bio";
import {
  BIO_EVENT_TEXT_LIMITS,
  normalizeText,
  type BioEventInput,
  type BioProductSlug,
} from "@/lib/bio-analytics/contracts";
import { createDailyRateKey, ingestBioEvent } from "@/lib/bio-analytics/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Tracked redirect for Instagram Story links.
 *
 * A story tap goes straight to the Shopee listing, so it never touches /bio and
 * would otherwise be invisible. This records the outbound click first, then
 * redirects. Recording never blocks or fails the redirect: a shopper always
 * reaches the listing, even if analytics is down.
 */

function shopeeUrlFor(slug: string): { slug: BioProductSlug; href: string } | null {
  const product = bioConfig.products.find((entry) => entry.slug === slug);
  if (!product) return null;

  const shopee = product.actions.find((action) => action.destination === "shopee");
  if (!shopee) return null;

  return { slug: product.slug, href: shopee.href };
}

function clientAddress(headers: Headers): string {
  const forwarded = headers.get("x-vercel-forwarded-for") ?? headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first && isIP(first) ? first : "unknown";
}

function campaignFrom(url: URL) {
  const read = (key: keyof typeof BIO_EVENT_TEXT_LIMITS) =>
    normalizeText(url.searchParams.get(key), BIO_EVENT_TEXT_LIMITS[key]);

  return {
    utm_source: read("utm_source"),
    utm_medium: read("utm_medium"),
    utm_campaign: read("utm_campaign"),
    utm_content: read("utm_content"),
    utm_term: read("utm_term"),
  };
}

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const target = shopeeUrlFor(slug);

  // An unknown slug should still land somewhere useful rather than erroring.
  if (!target) {
    return Response.redirect(new URL("/bio", request.url), 307);
  }

  const url = new URL(request.url);
  const now = new Date();

  const event: BioEventInput = {
    event_id: randomUUID(),
    occurred_at: now.toISOString(),
    schema_version: 1,
    event_name: "bio_outbound_click",
    visitor_id: randomUUID(),
    session_id: randomUUID(),
    sequence_no: 1,
    section_id: "story-link",
    product_slug: target.slug,
    cta_id: `story_${target.slug}`,
    cta_position: "ig-story",
    destination: "shopee",
    landing_path: "/go",
    referrer_category: null,
    ...campaignFrom(url),
    elapsed_ms: 0,
    is_returning: false,
    screen_category: null,
    language: null,
    timezone: null,
    scroll_depth: null,
  };

  try {
    const rateKey = createDailyRateKey(
      clientAddress(request.headers),
      now.toISOString().slice(0, 10),
    );
    await ingestBioEvent(event, rateKey);
  } catch {
    // Analytics must never stand between a shopper and the listing.
  }

  return Response.redirect(target.href, 307);
}
