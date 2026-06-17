import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductDetails } from "@/components/product/product-details";
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
          <div className="relative grid w-full gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
            <div className="w-full min-w-0 lg:col-span-7 lg:sticky lg:top-24 lg:self-start">
              <ProductGallery images={product.images} productName={translatedName} />
            </div>

            <div className="relative w-full min-w-0 lg:col-span-5">
              <ProductDetails product={product} locale={locale} />
            </div>
          </div>
        </section>

        <div className="mt-12 lg:mt-20">
          <ProductSalesSections product={product} locale={locale} />
        </div>
      </div>

      <Footer />
    </main>
  );
}
