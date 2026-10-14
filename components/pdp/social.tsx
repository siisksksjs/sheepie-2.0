// components/pdp/social.tsx
import Image from "next/image";
import Link from "next/link";

import { FadeIn } from "@/components/site/fade-in";
import type { Locale } from "@/i18n/config";
import { getProduct, productPath } from "@/lib/catalog";
import { formatIdr } from "@/lib/catalog/price";
import { ReviewMore } from "@/components/site/review-more";
import { ReviewShots } from "@/components/site/review-shots";
import { getReviews } from "@/lib/catalog/reviews";
import type { Product } from "@/lib/catalog/types";
import { pdpCopy } from "@/lib/site/pdp-copy";

import styles from "./pdp.module.css";

export function ReviewGrid({ product, locale }: { product: Product; locale: Locale }) {
  const t = pdpCopy[locale];

  return (
    <section className={styles.block} data-section="reviews">
      <FadeIn><h2>{t.reviews.replace("{name}", product.name)}</h2></FadeIn>
      <div className={styles.shotsGap}>
        <ReviewShots reviews={getReviews(product.slug)} label={(r) => `${t.viewOriginal}: ${r.author}`} />
      </div>
      <ReviewMore slug={product.slug} locale={locale} />
    </section>
  );
}

export function FaqList({ product, locale }: { product: Product; locale: Locale }) {
  const t = pdpCopy[locale];

  return (
    <section className={`${styles.block} ${styles.faq}`} data-section="faq">
      <FadeIn>
        <h2>{t.faq}</h2>
        <p className={styles.intro}>{t.faqNote}</p>
      </FadeIn>
      <div>
        {product.faq.map((item) => (
          <details key={item.q} className={styles.acc}>
            <summary>{item.q}</summary>
            <div className={styles.accBody}><p>{item.a}</p></div>
          </details>
        ))}
      </div>
    </section>
  );
}

export function PairWith({ product, locale }: { product: Product; locale: Locale }) {
  const t = pdpCopy[locale];

  return (
    <section className={styles.block} data-section="pair">
      <FadeIn><h2>{t.pair}</h2></FadeIn>
      <div className={styles.pair}>
        {product.pairWith.map((slug, i) => {
          const other = getProduct(slug, locale);
          return (
            <FadeIn key={slug} index={i}>
              <Link href={productPath(locale, slug)}>
                <div className={styles.pairImg}><Image src={other.card.image} alt="" fill sizes="150px" className={styles.cover} /></div>
                <div>
                  <h3>{other.name}</h3>
                  <p>{other.card.line}</p>
                  <b>{formatIdr(other.options[0].price)}</b>
                </div>
              </Link>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
