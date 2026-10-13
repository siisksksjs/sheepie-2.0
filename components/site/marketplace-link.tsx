"use client";

import type { ReactNode } from "react";

import { trackMarketplaceClick } from "@/lib/analytics";
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
  const onClick = () => {
    // Fire-and-forget; the browser follows the link regardless.
    sendMetaEvent(initiateCheckout({ slug, optionKey, value, marketplace, placement }));
    trackMarketplaceClick({ product_slug: slug, marketplace, page_path: window.location.pathname });
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
