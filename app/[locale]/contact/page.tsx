import { ContactClient } from "./contact-client";
import { getTranslations, setRequestLocale } from "next-intl/server";

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
  setRequestLocale(locale);
  return <ContactClient />;
}