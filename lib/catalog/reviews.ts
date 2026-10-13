import { createBioConfig } from "@/data/bio";

import type { Marketplace, ProductSlug } from "./types";

export interface Review {
  id: string;
  slug: ProductSlug;
  author: string;
  marketplace: Marketplace;
  quote: string;
  screenshot: string;
}

/** Bio testimonials, already masked at config-build time. */
export function getReviews(slug: ProductSlug): Review[] {
  return createBioConfig()
    .testimonials.filter((t) => t.product === slug)
    .map((t) => ({
      id: t.id,
      slug,
      author: t.author,
      marketplace: t.marketplace,
      quote: t.quote,
      screenshot: t.screenshot.src,
    }));
}

/** Shortens on a word boundary; a cut is always marked with an ellipsis. */
export function excerpt(text: string, maxWords: number): string {
  const trimmed = text.trim();
  const words = trimmed.split(/\s+/);
  if (words.length <= maxWords) return trimmed;
  return `${words.slice(0, maxWords).join(" ").replace(/[,.;:!?]+$/, "")}…`;
}
