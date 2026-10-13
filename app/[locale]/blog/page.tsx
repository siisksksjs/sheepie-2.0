import { BlogList } from "./blog-list";
import { getTranslations, setRequestLocale } from "next-intl/server";

const baseUrl = "https://sheepiesleep.com";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'Blog'});
 
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `${baseUrl}/id/blog`,
    },
    robots: locale === 'id'
      ? undefined
      : {
          index: false,
          follow: true,
        },
  };
}

export default async function BlogListingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <BlogList />;
}
