import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/site/product-card";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import site from "@/components/site/site.module.css";
import { isLocale } from "@/i18n/config";
import { getProducts } from "@/lib/catalog";
import { siteCopy } from "@/lib/site/copy";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "ProductsPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div className={site.page}>
      <SiteHeader locale={locale} />
      <main className={site.shell} style={{ padding: "56px var(--sp-gutter) 120px" }}>
        <h1 style={{ font: "700 46px/1.05 var(--font-display), serif", letterSpacing: "-0.015em", marginBottom: 36 }}>
          {siteCopy[locale].nav.allProducts}
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))", gap: 24 }}>
          {getProducts(locale).map((product, i) => (
            <ProductCard key={product.slug} product={product} locale={locale} index={i} />
          ))}
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
