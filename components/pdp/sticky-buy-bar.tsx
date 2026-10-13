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
    // Extend the root downward so an element below the viewport counts as intersecting;
    // only crossing the top edge flips the state, even on a one-jump flick past it.
    const io = new IntersectionObserver(([entry]) => setShow(!entry.isIntersecting), { rootMargin: "0px 0px 100000px 0px" });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.stickyBar = show ? "true" : "false";
    return () => {
      delete document.documentElement.dataset.stickyBar;
    };
  }, [show]);

  return (
    <div className={styles.sticky} data-show={show} aria-hidden={!show} inert={!show}>
      <div><b>{formatIdr(option.price)}</b>{name}</div>
      <MarketplaceLink slug={slug} optionKey={option.key} value={option.price} marketplace="shopee" href={option.shopeeUrl} placement="sticky-bar" className={buttonClass("ink")}>
        {siteCopy[locale].buy.shopee}
      </MarketplaceLink>
    </div>
  );
}
