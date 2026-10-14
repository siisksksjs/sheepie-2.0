import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { FeatureBand } from "@/components/home/feature-band";
import { HomeHero } from "@/components/home/home-hero";
import { LightsOutBand } from "@/components/home/lights-out-band";
import { ProductDuo } from "@/components/home/product-duo";
import { ReviewSection } from "@/components/home/review-section";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import site from "@/components/site/site.module.css";
import { JsonLd } from "@/components/site/json-ld";
import { isLocale } from "@/i18n/config";
import { organizationLd, pageMetadata, websiteLd } from "@/lib/site/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata("home", locale);
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  return (
    <div className={site.page}>
      <SiteHeader locale={locale} />
      <main>
        <HomeHero locale={locale} />
        <ProductDuo locale={locale} />
        <FeatureBand locale={locale} />
        <ReviewSection locale={locale} slug="cervicloud" tone="day" />
        <LightsOutBand locale={locale} />
        <ReviewSection locale={locale} slug="lumicloud" tone="night" />
      </main>
      <JsonLd data={[organizationLd(), websiteLd(locale)]} />
      <SiteFooter locale={locale} />
    </div>
  );
}
