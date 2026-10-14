import type { ProductSlug } from '@/lib/catalog/types';
import { contentId } from '@/lib/meta/events';

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
    gtag?: (command: 'event', eventName: string, parameters: Record<string, unknown>) => void;
  }
}

export const trackMarketplaceClick = ({ product_slug, marketplace, page_path }: MarketplaceEvent) => {
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

type GaItem = { slug: ProductSlug; optionKey: string; value: number };

/** One GA4 ecommerce item; the id matches the Meta content id (e.g. lumicloud-blue). */
const gaItems = ({ slug, optionKey, value }: GaItem) => [
  { item_id: contentId(slug, optionKey), item_name: slug, item_variant: optionKey, item_brand: 'Sheepie', price: value, quantity: 1 },
];

function ga(eventName: string, parameters: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.gtag) window.gtag('event', eventName, parameters);
}

/** GA4 `view_item`: a product page was opened or its colour/bundle changed (pairs with Meta ViewContent). */
export const trackViewItem = (item: GaItem) => ga('view_item', { currency: 'IDR', value: item.value, items: gaItems(item) });

/** GA4 `begin_checkout`: a Shopee/Tokopedia button was tapped (pairs with Meta InitiateCheckout). */
export const trackBeginCheckout = (
  item: GaItem & { marketplace: 'shopee' | 'tokopedia'; placement: string; adSource?: string; adCampaign?: string },
) =>
  ga('begin_checkout', {
    currency: 'IDR',
    value: item.value,
    items: gaItems(item),
    marketplace: item.marketplace,
    placement: item.placement,
    ad_source: item.adSource ?? 'site',
    ad_campaign: item.adCampaign ?? null,
  });
