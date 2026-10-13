export const generateMarketplaceUrl = (baseUrl: string, productSlug: string, source = 'site') => {
  const url = new URL(baseUrl);
  url.searchParams.append('utm_source', source);
  url.searchParams.append('utm_medium', 'button');
  url.searchParams.append('utm_campaign', 'pdp');
  url.searchParams.append('utm_content', productSlug);
  return url.toString();
};

/** UTM-tagged marketplace URL for a click from the brand site. */
export const marketplaceHref = (href: string, slug: string, placement: string) => {
  const url = new URL(href);
  url.searchParams.set("utm_source", "site");
  url.searchParams.set("utm_medium", "button");
  url.searchParams.set("utm_campaign", placement);
  url.searchParams.set("utm_content", slug);
  return url.toString();
};
