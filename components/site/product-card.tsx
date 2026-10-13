import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/i18n/config";
import { productPath } from "@/lib/catalog";
import { formatIdr } from "@/lib/catalog/price";
import type { Product } from "@/lib/catalog/types";

import { FadeIn } from "./fade-in";
import styles from "./site.module.css";

export function ProductCard({ product, locale, index = 0 }: { product: Product; locale: Locale; index?: number }) {
  const option = product.options[0];

  return (
    <FadeIn index={index}>
      <Link href={productPath(locale, product.slug)} className={styles.card} data-product-card={product.slug}>
        <div className={styles.cardPh}>
          <Image src={product.card.image} alt={product.name} fill sizes="(max-width: 760px) 82vw, 640px" className={styles.cardImg} />
          <Image src={product.card.hoverImage} alt="" fill sizes="(max-width: 760px) 82vw, 640px" className={`${styles.cardImg} ${styles.cardAlt}`} />
          <span className={styles.chip}>{product.card.chip}</span>
        </div>
        <div className={styles.cardRow}>
          <h3 className={styles.cardName}>{product.name}</h3>
          <div className={styles.price}>
            {formatIdr(option.price)}
            {option.originalPrice !== null && <s>{formatIdr(option.originalPrice)}</s>}
          </div>
        </div>
        <p className={styles.cardLine}>{product.card.line}</p>
      </Link>
    </FadeIn>
  );
}
