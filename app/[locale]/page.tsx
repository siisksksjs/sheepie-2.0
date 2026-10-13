import { notFound } from "next/navigation";

import { FeatureBand } from "@/components/home/feature-band";
import { HomeHero } from "@/components/home/home-hero";
import { LightsOutBand } from "@/components/home/lights-out-band";
import { ProductDuo } from "@/components/home/product-duo";
import { ReviewSection } from "@/components/home/review-section";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import site from "@/components/site/site.module.css";
import { isLocale } from "@/i18n/config";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div className={site.page}>
      <SiteHeader locale={locale} overlay />
      <main>
        <HomeHero locale={locale} />
        <ProductDuo locale={locale} />
        <FeatureBand locale={locale} />
        <ReviewSection locale={locale} slug="cervicloud" featuredId="cervicloud-3" tone="day" />
        <LightsOutBand locale={locale} />
        <ReviewSection locale={locale} slug="lumicloud" featuredId="lumicloud-1" tone="night" />
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
