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
import { isLocale, type Locale } from "@/i18n/config";
import { homeCopy } from "@/lib/site/home-copy";

const HOME_TITLE: Record<Locale, string> = {
  id: "Sheepie. | Bantal ergonomis & penutup mata tidur blackout",
  en: "Sheepie. | Ergonomic pillows & blackout eye masks",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const title = HOME_TITLE[locale];
  const description = homeCopy[locale].hero.sub;
  return {
    title,
    description,
    openGraph: {
      type: "website",
      locale: locale === "id" ? "id_ID" : "en_US",
      url: `https://sheepiesleep.com/${locale}`,
      siteName: "Sheepie",
      title,
      description,
    },
  };
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
      <SiteFooter locale={locale} />
    </div>
  );
}
