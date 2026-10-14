// components/pdp/buy-box.tsx
"use client";

import Image from "next/image";

import { buttonClass } from "@/components/site/button";
import { MarketplaceLink } from "@/components/site/marketplace-link";
import { MarketplaceLogo } from "@/components/site/marketplace-logo";
import type { Locale } from "@/i18n/config";
import type { Product } from "@/lib/catalog/types";
import { WEBSITE_VOUCHER_CODE } from "@/lib/site/config";
import { siteCopy } from "@/lib/site/copy";
import { formatIdr } from "@/lib/catalog/price";
import { pdpCopy } from "@/lib/site/pdp-copy";

import { ProductIcon } from "./icons";
import { useSelectedOption } from "./option-context";
import styles from "./pdp.module.css";
import { PriceLine } from "./price-line";
import { VoucherLine } from "./voucher-line";

export function BuyBox({ product, locale }: { product: Product; locale: Locale }) {
  const t = pdpCopy[locale];
  const buy = siteCopy[locale].buy;
  const { option, select, bundle, selectBundle, price } = useSelectedOption();

  return (
    <div className={styles.buy}>
      <h1>{product.name}</h1>
      <p className={styles.sub}>{product.sub}</p>
      <PriceLine option={price} saveLabel={t.save} />

      <ul className={styles.icons}>
        {product.icons.map((item) => (
          <li key={item.label}>
            <span className={styles.iconTile}><ProductIcon name={item.icon} /></span>
            {item.label}
          </li>
        ))}
      </ul>

      {product.options.length > 1 && (
        <>
          <div className={styles.optLabel}>{product.optionLabel}</div>
          <div className={styles.options}>
            {product.options.map((o) => (
              <button key={o.key} type="button" className={styles.opt} data-option={o.key} aria-pressed={o.key === option.key} onClick={() => select(o.key)}>
                <span className={styles.optImg}><Image src={o.image} alt="" fill sizes="54px" style={{ objectFit: "cover" }} /></span>
                <span><b>{o.label}</b><small>{o.note}</small></span>
              </button>
            ))}
          </div>
        </>
      )}

      {product.bundles.length > 1 && bundle && (
        <>
          <div className={styles.optLabel}>{t.bundle}</div>
          <div className={styles.bundles}>
            {product.bundles.map((b) => (
              <button key={b.key} type="button" className={styles.bundle} data-bundle={b.key} aria-pressed={b.key === bundle.key} onClick={() => selectBundle(b.key)}>
                <b>{b.label}</b>
                <small>{b.qty > 1 ? t.perPiece.replace("{price}", formatIdr(Math.round(b.price / b.qty))) : formatIdr(b.price)}</small>
              </button>
            ))}
          </div>
        </>
      )}

      <div id="buy-ctas" className={styles.ctas}>
        <MarketplaceLink slug={product.slug} optionKey={option.key} value={price.price} marketplace="shopee" href={option.shopeeUrl} placement="buy-box" className={buttonClass("ink", true)}>
          <MarketplaceLogo marketplace="shopee" className={styles.mark} />{buy.shopee}
        </MarketplaceLink>
        <MarketplaceLink slug={product.slug} optionKey={option.key} value={price.price} marketplace="tokopedia" href={option.tokopediaUrl} placement="buy-box" className={buttonClass("line", true)}>
          <MarketplaceLogo marketplace="tokopedia" className={styles.mark} />{buy.tokopedia}
        </MarketplaceLink>
      </div>

      {WEBSITE_VOUCHER_CODE && <VoucherLine code={WEBSITE_VOUCHER_CODE} label={t.voucher} copy={t.copy} copied={t.copied} />}

      <div className={styles.assure}>
        <div>
          {t.assurances[0]}
        </div>
        <div>
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
