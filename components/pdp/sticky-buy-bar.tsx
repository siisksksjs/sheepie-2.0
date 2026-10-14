// components/pdp/sticky-buy-bar.tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { buttonClass } from "@/components/site/button";
import { MarketplaceLink } from "@/components/site/marketplace-link";
import { MarketplaceLogo } from "@/components/site/marketplace-logo";
import type { Locale } from "@/i18n/config";
import { formatIdr } from "@/lib/catalog/price";
import { siteCopy } from "@/lib/site/copy";

import { useSelectedOption } from "./option-context";
import styles from "./pdp.module.css";

/**
 * A buy bar pinned to the bottom of the screen (phones and desktop), shown only
 * while the buy box's own buttons are out of view, above or below. It mirrors
 * the shopper's choice: name, colour and pack, price, and the marketplace buttons.
 */
export function StickyBuyBar({ locale, showOption, fallbackImage }: { locale: Locale; showOption: boolean; fallbackImage: string }) {
  const { slug, name, option, bundle, bundlePicked, price } = useSelectedOption();
  const [show, setShow] = useState(false);
  const buy = siteCopy[locale].buy;

  useEffect(() => {
    const target = document.getElementById("buy-ctas");
    if (!target) return;
    const io = new IntersectionObserver(([entry]) => setShow(!entry.isIntersecting));
    io.observe(target);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.stickyBar = show ? "true" : "false";
    return () => {
      delete document.documentElement.dataset.stickyBar;
    };
  }, [show]);

  const detail = [showOption ? option.label : null, bundlePicked && bundle ? bundle.label : null].filter(Boolean).join(" · ");
  const thumb = (bundlePicked && bundle ? (bundle.imageByOption[option.key] ?? bundle.image) : null) ?? fallbackImage;
  const now = formatIdr(price.price);

  return (
    <div className={styles.sticky} data-show={show} aria-hidden={!show} inert={!show}>
      <div className={styles.stickyIn}>
        <span className={styles.stickyImg}>
          <Image src={thumb} alt="" fill sizes="48px" style={{ objectFit: "cover" }} />
        </span>
        <div className={styles.stickyText}>
          <b>{name}</b>
          <small>
            {detail}
            {/* Phones fold the price into this line; desktop shows it on its own. */}
            <span className={styles.stickyInlinePrice}>{detail ? ` · ${now}` : now}</span>
          </small>
        </div>
        <div className={styles.stickyPrice}>
          <b>{now}</b>
          {price.originalPrice !== null && <s>{formatIdr(price.originalPrice)}</s>}
        </div>
        <MarketplaceLink slug={slug} optionKey={option.key} value={price.price} marketplace="shopee" href={option.shopeeUrl} placement="sticky-bar" className={buttonClass("ink")}>
          <MarketplaceLogo marketplace="shopee" size={20} />
          {buy.shopee}
        </MarketplaceLink>
        <MarketplaceLink slug={slug} optionKey={option.key} value={price.price} marketplace="tokopedia" href={option.tokopediaUrl} placement="sticky-bar" className={`${buttonClass("line")} ${styles.stickyToped}`}>
          <MarketplaceLogo marketplace="tokopedia" size={20} />
          {buy.tokopedia}
        </MarketplaceLink>
      </div>
    </div>
  );
}
