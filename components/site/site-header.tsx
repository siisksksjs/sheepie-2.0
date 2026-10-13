// components/site/site-header.tsx
import type { Locale } from "@/i18n/config";
import { getProducts } from "@/lib/catalog";
import { formatIdr } from "@/lib/catalog/price";
import { siteCopy } from "@/lib/site/copy";

import { HeaderBar, type ShopItem } from "./header-bar";
import { HeaderOverHero } from "./header-over-hero";
import styles from "./header.module.css";

export function SiteHeader({ locale, overlay = false }: { locale: Locale; overlay?: boolean }) {
  const shopItems: ShopItem[] = getProducts(locale).map((product) => {
    const option = product.options[0];
    return {
      slug: product.slug,
      name: product.name,
      image: product.card.image,
      price: formatIdr(option.price),
      optionKey: option.key,
      value: option.price,
      shopeeUrl: option.shopeeUrl,
      tokopediaUrl: option.tokopediaUrl,
    };
  });

  return (
    <header id="site-header" className={styles.header} data-overlay={String(overlay)} data-over={String(overlay)}>
      <div className={styles.notice}>{siteCopy[locale].notice}</div>
      <div style={{ maxWidth: "var(--sp-max)", margin: "0 auto", padding: "0 var(--sp-gutter)" }}>
        <HeaderBar locale={locale} shopItems={shopItems} />
      </div>
      {overlay && <HeaderOverHero />}
    </header>
  );
}
