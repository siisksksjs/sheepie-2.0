type MarketplaceEvent = {
  product_slug: string;
  marketplace: 'shopee' | 'tokopedia';
  page_path: string;
};

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, data?: Record<string, string | number | boolean | null>) => void;
    };
    gtag?: (
      command: 'event',
      eventName: string,
      parameters: Record<string, string | number | boolean | null>
    ) => void;
  }
}

export const trackMarketplaceClick = ({ product_slug, marketplace, page_path }: MarketplaceEvent) => {
  console.log(`[Analytics] Marketplace Click: ${marketplace} for ${product_slug} on ${page_path}`);
  
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track('marketplace_click', {
      product: product_slug,
      marketplace,
      page_path,
    });
  }

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'marketplace_click', {
      event_category: 'conversion',
      event_label: product_slug,
      marketplace,
      page_path
    });
  }
};
