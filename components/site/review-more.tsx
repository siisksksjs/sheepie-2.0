import type { Locale } from "@/i18n/config";
import { getProduct } from "@/lib/catalog";
import type { Marketplace, ProductSlug } from "@/lib/catalog/types";

import { buttonClass } from "./button";
import { FadeIn } from "./fade-in";
import { MarketplaceLink } from "./marketplace-link";
import styles from "./site.module.css";

/** Where each product's reviews pile up: CerviCloud sells most on Tokopedia, the others on Shopee. */
const REVIEW_HOME: Record<ProductSlug, Marketplace> = {
  cervicloud: "tokopedia",
  lumicloud: "shopee",
  calmicloud: "shopee",
};

const COPY: Record<Locale, { line: string; cta: string }> = {
  id: { line: "Masih banyak ulasan lain dari pembeli kami di {m}.", cta: "Baca semua ulasan di {m}" },
  en: { line: "Plenty more reviews from our customers on {m}.", cta: "Read all reviews on {m}" },
};

/** The line under the review screenshots that sends readers to the full marketplace reviews. */
export function ReviewMore({ slug, locale, tone = "day" }: { slug: ProductSlug; locale: Locale; tone?: "day" | "night" }) {
  const marketplace = REVIEW_HOME[slug];
  const name = marketplace === "shopee" ? "Shopee" : "Tokopedia";
  const option = getProduct(slug, locale).options[0];
  const t = COPY[locale];

  return (
    <FadeIn className={`${styles.reviewMore} ${tone === "night" ? styles.reviewMoreNight : ""}`}>
      <p>{t.line.replace("{m}", name)}</p>
      <MarketplaceLink
        slug={slug}
        optionKey={option.key}
        value={option.price}
        marketplace={marketplace}
        href={marketplace === "shopee" ? option.shopeeUrl : option.tokopediaUrl}
        placement="reviews"
        className={buttonClass(tone === "night" ? "lineLight" : "line")}
      >
        {t.cta.replace("{m}", name)} →
      </MarketplaceLink>
    </FadeIn>
  );
}
