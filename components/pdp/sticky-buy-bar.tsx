// components/pdp/sticky-buy-bar.tsx
"use client";

import { useEffect } from "react";

import { buttonClass } from "@/components/site/button";
import { MarketplaceLink } from "@/components/site/marketplace-link";
import { MarketplaceLogo } from "@/components/site/marketplace-logo";
import type { Locale } from "@/i18n/config";
import { formatIdr } from "@/lib/catalog/price";
import { siteCopy } from "@/lib/site/copy";

import { useSelectedOption } from "./option-context";
import styles from "./pdp.module.css";

/** Phones only (CSS): a buy bar pinned to the bottom of the screen. */
export function StickyBuyBar({ locale }: { locale: Locale }) {
  const { slug, name, option, price } = useSelectedOption();
  // Phones (CSS) always show the bar, so a buy button is on the first screen.
  useEffect(() => {
    document.documentElement.dataset.stickyBar = "true";
    return () => {
      delete document.documentElement.dataset.stickyBar;
    };
  }, []);

  return (
    <div className={styles.sticky} data-show="true">
      <div><b>{formatIdr(price.price)}</b>{name}</div>
      <MarketplaceLink slug={slug} optionKey={option.key} value={price.price} marketplace="shopee" href={option.shopeeUrl} placement="sticky-bar" className={buttonClass("ink")}>
        <MarketplaceLogo marketplace="shopee" size={20} />
        {siteCopy[locale].buy.shopee}
      </MarketplaceLink>
    </div>
  );
}
