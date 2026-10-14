import { randomUUID } from "node:crypto";
import { isIP } from "node:net";

import { bioConfig } from "@/data/bio";
import {
  BIO_EVENT_TEXT_LIMITS,
  normalizeText,
  type BioDestination,
  type BioEventInput,
  type BioProductSlug,
} from "@/lib/bio-analytics/contracts";
import { createDailyRateKey, ingestBioEvent } from "@/lib/bio-analytics/server";
import { androidIntent, isShopeeUrl, platformOf } from "@/lib/go/app-link";
import { openerPageHtml } from "@/lib/go/opener-page";
import { pageView } from "@/lib/meta/events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Tracked redirect for Instagram Story links and Meta ads.
 *
 * A story tap goes straight to the Shopee listing, so it never touches /bio and
 * would otherwise be invisible. This records the outbound click first, then
 * redirects. Recording never blocks or fails the redirect: a shopper always
 * reaches the listing, even if analytics is down.
 *
 * On phones, Shopee links get a tiny opener page instead of a bare redirect: it
 * sends a Meta PageView (for retargeting audiences; InitiateCheckout is kept
 * for real buy-button taps on product pages) and opens the Shopee app (see
 * lib/go/app-link.ts), because Shopee's web page asks in-app browsers to log in.
 * `?s=1` skips the page and recording: a plain redirect.
 */

/** Storefront and profile links, addressable by a short readable slug. */
const HUB_TARGETS: Record<string, string> = {
  shopee: "bio-hub-shopee",
  tokopedia: "bio-hub-tokopedia",
  tiktok: "bio-hub-tiktok",
  instagram: "bio-hub-instagram",
  website: "bio-hub-website",
};

type Target = {
  href: string;
  productSlug: BioProductSlug | null;
  destination: Exclude<BioDestination, "share">;
};

/**
 * A slug is either a product, which goes to that product's Shopee listing, or
 * one of the storefront/profile links.
 */
function targetFor(slug: string): Target | null {
  const product = bioConfig.products.find((entry) => entry.slug === slug);
  if (product) {
    const shopee = product.actions.find((action) => action.destination === "shopee");
    if (shopee) {
      return { href: shopee.href, productSlug: product.slug, destination: "shopee" };
    }
  }

  const hubId = HUB_TARGETS[slug];
  const hub = hubId ? bioConfig.hubActions.find((entry) => entry.id === hubId) : undefined;
  if (hub) {
    return { href: hub.href, productSlug: null, destination: hub.destination };
  }

  return null;
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
  const target = targetFor(slug);

  // An unknown slug should still land somewhere useful rather than erroring.
  if (!target) {
    return Response.redirect(new URL("/bio", request.url), 307);
  }

  const url = new URL(request.url);

  if (url.searchParams.get("s") === "1") {
    return Response.redirect(target.href, 307);
  }

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
    product_slug: target.productSlug,
    cta_id: `story_${slug}`,
    cta_position: "ig-story",
    destination: target.destination,
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

  const userAgent = request.headers.get("user-agent");
  const platform = platformOf(userAgent);
  if (platform === "other" || !isShopeeUrl(target.href)) {
    return Response.redirect(target.href, 307);
  }

  // Android: an intent opens the app straight away. iOS: go straight to the
  // Shopee link (the owner chose no extra tap over a tap-to-open button).
  const openHref = platform === "android" ? androidIntent(target.href) : target.href;

  return new Response(openerPageHtml({ openHref, webHref: target.href, event: pageView() }), {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}
