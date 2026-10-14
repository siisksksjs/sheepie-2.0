import type { Attribution } from "@/lib/attribution";

/**
 * UTM-tagged marketplace URL for a click from the brand site.
 *
 * Without an ad behind the visit: utm_source=site, utm_medium=button,
 * utm_campaign=<button placement>, utm_content=<product>.
 *
 * When the visitor arrived from a tagged ad, the ad's tags are passed on:
 * utm_source/medium/campaign from the ad, utm_content=<product>_<placement>,
 * and utm_term = the ad's content (ad name) or term.
 */
export const marketplaceHref = (href: string, slug: string, placement: string, attribution: Attribution | null = null) => {
  const url = new URL(href);
  if (!attribution) {
    url.searchParams.set("utm_source", "site");
    url.searchParams.set("utm_medium", "button");
    url.searchParams.set("utm_campaign", placement);
    url.searchParams.set("utm_content", slug);
    return url.toString();
  }
  url.searchParams.set("utm_source", attribution.source);
  url.searchParams.set("utm_medium", attribution.medium ?? "referral");
  url.searchParams.set("utm_campaign", attribution.campaign ?? placement);
  url.searchParams.set("utm_content", `${slug}_${placement}`);
  const term = attribution.content ?? attribution.term;
  if (term) url.searchParams.set("utm_term", term);
  else url.searchParams.delete("utm_term");
  return url.toString();
};

/** Pass an incoming link's UTM tags on to the destination (used by /go redirects). */
export const forwardUtm = (href: string, incoming: URLSearchParams) => {
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  if (!keys.some((k) => incoming.get(k))) return href;
  const url = new URL(href);
  for (const key of keys) {
    const value = incoming.get(key)?.trim().slice(0, 100);
    if (value) url.searchParams.set(key, value);
  }
  return url.toString();
};
