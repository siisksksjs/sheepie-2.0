"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import products from "@/data/products.json";
import { useTranslations, useLocale } from "next-intl";

// Editorial showcase imagery (kept from the original art direction)
const showcaseImages: Record<string, string> = {
  lumicloud: "/images/edited/DSC01278.JPG",
  cervicloud: "/images/photoshoot/DSC01110.JPG",
  calmicloud: "/images/edited/DSC01313.JPG",
};

// Premium ease-out curve (transitions.dev "smooth ease out" token)
const EASE = [0.22, 1, 0.36, 1] as const;

export function ProductShowcase() {
  const t = useTranslations("ProductShowcase");
  const tProducts = useTranslations("Products");
  const locale = useLocale();
  const getPath = (path: string) => `/${locale}${path}`;

  const [feature, ...rest] = products;

  return (
    <section id="products" className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header — the Playfair display carries the hierarchy, no kicker */}
        <div className="max-w-2xl mb-14 md:mb-20">
          <h2 className="text-5xl md:text-7xl font-display font-medium text-primary leading-[0.95] tracking-tight text-balance">
            {t.rich("title", { br: () => <br /> })}
          </h2>
          <p className="mt-6 text-lg md:text-xl text-foreground/70 leading-relaxed max-w-md text-pretty">
            {t("subtitle")}
          </p>
        </div>

        {/* Asymmetric feature + duo grid (scannable, not a uniform card row) */}
        <div className="grid gap-5 md:gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ProductCard
              product={feature}
              size="feature"
              name={tProducts(`${feature.slug}.name` as any)}
              tagline={tProducts(`${feature.slug}.tagline` as any)}
              href={getPath(`/products/${feature.slug}`)}
            />
          </div>

          <div className="lg:col-span-5 grid gap-5 md:gap-6">
            {rest.map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
                size="compact"
                name={tProducts(`${product.slug}.name` as any)}
                tagline={tProducts(`${product.slug}.tagline` as any)}
                href={getPath(`/products/${product.slug}`)}
              />
            ))}
          </div>
        </div>

        {/* Collection CTA */}
        <div className="mt-12 flex justify-center">
          <Button
            size="lg"
            variant="outline"
            className="rounded-full h-14 px-10 text-base border-primary/20 text-primary hover:bg-primary hover:text-white transition-colors duration-300"
            asChild
          >
            <Link href={getPath("/products")}>{t("ctaButton")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  size,
  name,
  tagline,
  href,
}: {
  product: (typeof products)[number];
  size: "feature" | "compact";
  name: string;
  tagline: string;
  href: string;
}) {
  const image = showcaseImages[product.slug] || product.images[0];
  const isFeature = size === "feature";
  const hasDiscount = product.originalPrice !== product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, ease: EASE }}
      className="h-full"
    >
      <Link
        href={href}
        className={`group relative block w-full overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-neutral-100 ${
          isFeature ? "h-[60vh] lg:h-[78vh]" : "h-[37vh] lg:h-[37vh]"
        }`}
      >
        <Image
          src={image}
          alt={`${name} — ${tagline}`}
          fill
          className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
          sizes={isFeature ? "(max-width: 1024px) 100vw, 58vw" : "(max-width: 1024px) 100vw, 42vw"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-7 md:p-9 text-white">
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-2">
              <h3
                className={`font-display font-medium leading-none ${
                  isFeature ? "text-4xl md:text-6xl" : "text-2xl md:text-3xl"
                }`}
              >
                {name}
              </h3>
              <p
                className={`text-white/80 max-w-md text-pretty ${
                  isFeature ? "text-base md:text-lg pt-1" : "text-sm"
                }`}
              >
                {tagline}
              </p>
              <div className="flex items-baseline gap-2.5 pt-2">
                <span className={`font-display ${isFeature ? "text-xl md:text-2xl" : "text-lg"}`}>
                  {product.price}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-white/50 line-through">{product.originalPrice}</span>
                )}
              </div>
            </div>

            <span
              className={`hidden md:flex flex-shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition-colors duration-300 group-hover:bg-white group-hover:text-primary ${
                isFeature ? "h-16 w-16" : "h-12 w-12"
              }`}
              aria-hidden="true"
            >
              <ArrowUpRight className={isFeature ? "h-7 w-7" : "h-5 w-5"} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
