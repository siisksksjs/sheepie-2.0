import { ContactClient } from "./contact-client";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { isLocale } from "@/i18n/config";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'ContactPage'});
 
  return {
    title: t('metaTitle'),
    description: t('metaDescription')
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  return <ContactClient header={<SiteHeader locale={locale} />} footer={<SiteFooter locale={locale} />} />;
}