import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { BuyBox } from "@/components/pdp/buy-box";
import { AnatomyPanel, CompareTable, FitGrid } from "@/components/pdp/details";
import { OptionProvider } from "@/components/pdp/option-context";
import styles from "@/components/pdp/pdp.module.css";
import { ProductGallery } from "@/components/pdp/product-gallery";
import { FaqList, PairWith, ReviewGrid } from "@/components/pdp/social";
import { StickyBuyBar } from "@/components/pdp/sticky-buy-bar";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import site from "@/components/site/site.module.css";
import { isLocale, locales } from "@/i18n/config";
import { getProduct, isProductSlug } from "@/lib/catalog";
import { PRODUCT_SLUGS } from "@/lib/catalog/types";
import { localeHref } from "@/lib/site/copy";
import { pdpCopy } from "@/lib/site/pdp-copy";

type Params = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return locales.flatMap((locale) => PRODUCT_SLUGS.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isProductSlug(slug)) return {};
  const product = getProduct(slug, locale);
  return {
    title: `${product.name} | Sheepie.`,
    description: product.sub,
    openGraph: { images: [product.gallery[0].src] },
  };
}

export default async function ProductPage({ params }: Params) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isProductSlug(slug)) notFound();
  setRequestLocale(locale);

  const product = getProduct(slug, locale);
  const t = pdpCopy[locale];

  return (
    <div className={site.page}>
      <SiteHeader locale={locale} />
      <OptionProvider product={{ slug: product.slug, name: product.name, options: product.options }}>
        <main className={site.shell}>
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            <Link href={localeHref(locale, "/")}>{t.home}</Link> / <Link href={localeHref(locale, "/products")}>{t.products}</Link> / {product.name}
          </nav>
          <section className={styles.top} data-section="buy">
            <ProductGallery images={product.gallery} name={t.gallery} />
            <BuyBox product={product} locale={locale} />
          </section>
          <AnatomyPanel product={product} locale={locale} />
          <FitGrid product={product} locale={locale} />
          <CompareTable product={product} locale={locale} />
          <ReviewGrid product={product} locale={locale} />
          <FaqList product={product} locale={locale} />
          <PairWith product={product} locale={locale} />
          <div className={styles.end} />
        </main>
        <StickyBuyBar locale={locale} />
      </OptionProvider>
      <SiteFooter locale={locale} />
    </div>
  );
}
