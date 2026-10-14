"use client";

import type { MouseEvent, ReactNode } from "react";

import { trackBeginCheckout, trackMarketplaceClick } from "@/lib/analytics";
import { readAttribution } from "@/lib/attribution";
import type { Marketplace, ProductSlug } from "@/lib/catalog/types";
import { sendMetaEvent } from "@/lib/meta/client";
import { initiateCheckout } from "@/lib/meta/events";
import { marketplaceHref } from "@/lib/utm";

/** Every link out to a marketplace goes through here so each click is tracked once. */
export function MarketplaceLink({
  slug,
  optionKey,
  value,
  marketplace,
  href,
  placement,
  className,
  children,
}: {
  slug: ProductSlug;
  optionKey: string;
  value: number;
  marketplace: Marketplace;
  href: string;
  placement: string;
  className?: string;
  children: ReactNode;
}) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // The server-rendered link carries the site's own tags; if this visit came from an ad,
    // swap in the ad's tags just before the browser follows the link.
    const attribution = readAttribution();
    try {
      if (attribution) e.currentTarget.href = marketplaceHref(href, slug, placement, attribution);
    } catch {
      // ignore
    }
    // Fire-and-forget; never preventDefault, and a tracking error must not stop the
    // browser following the link, so each tracker is isolated.
    try {
      sendMetaEvent(initiateCheckout({ slug, optionKey, value, marketplace, placement }));
    } catch {
      // ignore
    }
    try {
      trackMarketplaceClick({ product_slug: slug, marketplace, page_path: window.location.pathname });
    } catch {
      // ignore
    }
    try {
      trackBeginCheckout({ slug, optionKey, value, marketplace, placement, adSource: attribution?.source, adCampaign: attribution?.campaign });
    } catch {
      // ignore
    }
  };

  return (
    <a
      href={marketplaceHref(href, slug, placement)}
      target="_blank"
      rel="noopener noreferrer"
      data-marketplace={marketplace}
      data-placement={placement}
      className={className}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
