import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProductHero } from "@/components/product/product-hero";
import { ProductSalesSections } from "@/components/product/product-sales-sections";
import products from "@/data/products.json";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

// This is required for SSG with dynamic routes
export async function generateStaticParams() {
  const locales = ['en', 'id'];
  return locales.flatMap((locale) =>
    products.map((product) => ({
      locale,
      slug: product.slug,
    }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};

  const t = await getTranslations({locale, namespace: 'Products'});

  return {
    title: `${t(`${slug}.name` as any)} | Sheepie.`,
    description: t(`${slug}.tagline` as any),
    openGraph: {
      images: [product.images[0]],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const t = await getTranslations({locale, namespace: 'Products'});
  const translatedName = t(`${slug}.name` as any);

  return (
    <main className="min-h-screen bg-white w-full max-w-[100vw]">
      <Navbar />

      <div className="container mx-auto px-4 py-12 lg:py-20">
        <section className="relative rounded-3xl border border-border/60 bg-white p-4 shadow-[0_24px_70px_-50px_rgba(33,51,104,0.3)] lg:p-8">
          <ProductHero product={product} productName={translatedName} locale={locale} />
        </section>

        <div className="mt-12 lg:mt-20">
          <ProductSalesSections product={product} locale={locale} />
        </div>
      </div>

      <Footer />
    </main>
  );
}
