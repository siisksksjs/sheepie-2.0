import Link from "next/link";

import { FadeIn } from "@/components/site/fade-in";
import { ProductCard } from "@/components/site/product-card";
import site from "@/components/site/site.module.css";
import type { Locale } from "@/i18n/config";
import { getProducts } from "@/lib/catalog";
import { localeHref } from "@/lib/site/copy";
import { homeCopy } from "@/lib/site/home-copy";

import { CompanionRow } from "./companion-row";
import styles from "./home.module.css";

export function ProductDuo({ locale }: { locale: Locale }) {
  const t = homeCopy[locale].products;
  const heroes = getProducts(locale).filter((p) => p.role === "hero");

  return (
    <section className={`${site.shell} ${styles.collection}`} data-section="products">
      <FadeIn className={styles.head}>
        <h2>{t.title}</h2>
        <Link className={styles.link} href={localeHref(locale, "/products")}>{t.all}</Link>
      </FadeIn>
      <div className={styles.duo}>
        {heroes.map((product, i) => (
          <ProductCard key={product.slug} product={product} locale={locale} index={i} />
        ))}
      </div>
      <CompanionRow locale={locale} />
    </section>
  );
}
