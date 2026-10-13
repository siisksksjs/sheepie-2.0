// components/pdp/buy-box.tsx
"use client";

import Image from "next/image";

import { buttonClass } from "@/components/site/button";
import { MarketplaceLink } from "@/components/site/marketplace-link";
import type { Locale } from "@/i18n/config";
import type { Product } from "@/lib/catalog/types";
import { WEBSITE_VOUCHER_CODE } from "@/lib/site/config";
import { siteCopy } from "@/lib/site/copy";
import { pdpCopy } from "@/lib/site/pdp-copy";

import { ProductIcon } from "./icons";
import { useSelectedOption } from "./option-context";
import styles from "./pdp.module.css";
import { PriceLine } from "./price-line";
import { VoucherLine } from "./voucher-line";

export function BuyBox({ product, locale }: { product: Product; locale: Locale }) {
  const t = pdpCopy[locale];
  const buy = siteCopy[locale].buy;
  const { option, select } = useSelectedOption();

  return (
    <div className={styles.buy}>
      <h1>{product.name}</h1>
      <p className={styles.sub}>{product.sub}</p>
      <PriceLine option={option} saveLabel={t.save} />

      <div className={styles.icons}>
        {product.icons.map((item) => (
          <div key={item.label}><ProductIcon name={item.icon} />{item.label}</div>
        ))}
      </div>

      <div className={styles.optLabel}>{product.optionLabel}</div>
      <div className={styles.options}>
        {product.options.map((o) => (
          <button key={o.key} type="button" className={styles.opt} data-option={o.key} aria-pressed={o.key === option.key} onClick={() => select(o.key)}>
            <span className={styles.optImg}><Image src={o.image} alt="" fill sizes="54px" style={{ objectFit: "cover" }} /></span>
            <span><b>{o.label}</b><small>{o.note}</small></span>
          </button>
        ))}
      </div>

      <div id="buy-ctas" className={styles.ctas}>
        <MarketplaceLink slug={product.slug} optionKey={option.key} value={option.price} marketplace="shopee" href={option.shopeeUrl} placement="buy-box" className={buttonClass("ink", true)}>
          <span className={`${styles.mark} ${styles.markShopee}`}>S</span>{buy.shopee}
        </MarketplaceLink>
        <MarketplaceLink slug={product.slug} optionKey={option.key} value={option.price} marketplace="tokopedia" href={option.tokopediaUrl} placement="buy-box" className={buttonClass("line", true)}>
          <span className={`${styles.mark} ${styles.markTokopedia}`}>T</span>{buy.tokopedia}
        </MarketplaceLink>
      </div>

      <VoucherLine code={WEBSITE_VOUCHER_CODE} label={t.voucher} copy={t.copy} copied={t.copied} />

      <div className={styles.assure}>
        <div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="17.5" r="1.6" /><circle cx="17.5" cy="17.5" r="1.6" /></svg>
          {t.assurances[0]}
        </div>
        <div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true"><path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" /><path d="M9 12l2 2 4-4" /></svg>
          {t.assurances[1]}
        </div>
      </div>

      {product.accordions.map((section, i) => (
        <details key={section.title} className={styles.acc} open={i === 0}>
          <summary>{section.title}</summary>
          <div className={styles.accBody}>
            {section.body.length > 1 ? (
              <ul>{section.body.map((line) => <li key={line}>{line}</li>)}</ul>
            ) : (
              <p>{section.body[0]}</p>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
