// components/pdp/sticky-buy-bar.tsx
"use client";

import { useEffect, useState } from "react";

import { buttonClass } from "@/components/site/button";
import { MarketplaceLink } from "@/components/site/marketplace-link";
import type { Locale } from "@/i18n/config";
import { formatIdr } from "@/lib/catalog/price";
import { siteCopy } from "@/lib/site/copy";

import { useSelectedOption } from "./option-context";
import styles from "./pdp.module.css";

/** Phones only (CSS): appears once the buy-box buttons have scrolled away. */
export function StickyBuyBar({ locale }: { locale: Locale }) {
  const { slug, name, option } = useSelectedOption();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const target = document.getElementById("buy-ctas");
    if (!target) return;
    const io = new IntersectionObserver(([entry]) => setShow(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return (
    <div className={styles.sticky} data-show={show} aria-hidden={!show}>
      <div><b>{formatIdr(option.price)}</b>{name}</div>
      <MarketplaceLink slug={slug} optionKey={option.key} value={option.price} marketplace="shopee" href={option.shopeeUrl} placement="sticky-bar" className={buttonClass("ink")}>
        {siteCopy[locale].buy.shopee}
      </MarketplaceLink>
    </div>
  );
}
