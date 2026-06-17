"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Check,
  Package2,
  ShieldCheck,
  Truck,
  WalletCards,
} from "lucide-react";
import { BuyButtons } from "@/components/product/buy-buttons";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getProductPageContent } from "@/lib/product-page-content";

interface ProductVariant {
  name: string;
  price: string;
  originalPrice?: string;
  shopeeUrl: string;
  tokopediaUrl: string;
}

interface Product {
  slug: string;
  name: string;
  tagline: string;
  price: string;
  originalPrice?: string;
  description: string;
  benefits: string[];
  shopeeUrl: string;
  tokopediaUrl: string;
  variants?: ProductVariant[];
}

interface ProductDetailsProps {
  product: Product;
  locale: string;
}

function parsePrice(value?: string) {
  if (!value) return null;
  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number(digits) : null;
}

export function ProductDetails({ product, locale }: ProductDetailsProps) {
  const tProd = useTranslations("Products");
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants ? product.variants[0] : null
  );
  const content = getProductPageContent(product.slug, locale);
  const isId = locale === "id";

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentOriginalPrice = selectedVariant ? selectedVariant.originalPrice : product.originalPrice;
  const currentShopeeUrl = selectedVariant ? selectedVariant.shopeeUrl : product.shopeeUrl;
  const currentTokopediaUrl = selectedVariant ? selectedVariant.tokopediaUrl : product.tokopediaUrl;
  const currentProductName = tProd(`${product.slug}.name` as any);
  const currentPriceValue = parsePrice(currentPrice);
  const currentOriginalPriceValue = parsePrice(currentOriginalPrice);
  const savings =
    currentPriceValue && currentOriginalPriceValue && currentOriginalPriceValue > currentPriceValue
      ? currentOriginalPriceValue - currentPriceValue
      : null;

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-[0_24px_80px_-48px_rgba(33,51,104,0.45)]">
        <div className="border-b border-border/60 bg-[linear-gradient(180deg,#f8fbfd_0%,#ffffff_100%)] p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant="secondary"
              className="border-none bg-primary/[0.07] px-3 py-1 text-xs font-medium text-primary hover:bg-primary/10"
            >
              {content.eyebrow}
            </Badge>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white px-3 py-1 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span>{isId ? "Marketplace checkout aman" : "Secure marketplace checkout"}</span>
            </div>
            {savings && (
              <div className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                <span>
                  {isId
                    ? `Hemat ${new Intl.NumberFormat("id-ID").format(savings)}`
                    : `Save ${new Intl.NumberFormat("id-ID").format(savings)}`}
                </span>
              </div>
            )}
          </div>

          <div className="mt-5 space-y-4">
            <h1 className="font-display text-4xl leading-tight text-primary md:text-5xl lg:text-[3.6rem]">
              {currentProductName}
            </h1>

            <p className="max-w-2xl text-2xl leading-tight text-foreground/88">
              {content.headline}
            </p>

            <p className="max-w-2xl text-base leading-8 text-foreground/70">
              {content.summary}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-border/50 pt-5 sm:flex-row sm:items-center sm:gap-8">
            <div className="flex items-center gap-2.5 text-sm font-medium text-foreground">
              <Truck className="h-4 w-4 flex-none text-primary" strokeWidth={1.5} />
              {content.trustBadges[0]}
            </div>
            <div className="flex items-center gap-2.5 text-sm font-medium text-foreground">
              <ShieldCheck className="h-4 w-4 flex-none text-primary" strokeWidth={1.5} />
              {content.trustBadges[1]}
            </div>
            <div className="flex items-center gap-2.5 text-sm font-medium text-foreground">
              <Package2 className="h-4 w-4 flex-none text-primary" strokeWidth={1.5} />
              {content.trustBadges[2]}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {content.fitTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border/60 bg-white px-3.5 py-1.5 text-xs font-medium text-primary/80"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-5 border-b border-border/60 p-6 md:grid-cols-[1fr_auto] md:items-end md:p-8">
          <div>
            <div className="flex flex-wrap items-end gap-3">
              <span className="text-xs font-medium text-primary/60">
                {isId ? "Harga sekarang" : "Current price"}
              </span>
              {currentOriginalPrice && (
                <span className="text-xl font-light text-foreground/40 line-through decoration-foreground/40 decoration-1">
                  {currentOriginalPrice}
                </span>
              )}
              <div className="font-display text-4xl font-medium text-primary">{currentPrice}</div>
              {savings && (
                <span className="rounded-full bg-secondary/30 px-3 py-1 text-xs font-semibold text-primary">
                  {isId ? "Harga promo" : "Offer price"}
                </span>
              )}
            </div>
            <p className="mt-3 text-sm leading-7 text-foreground/70">
              {isId
                ? "Checkout melalui marketplace favorit Anda. Cocok untuk pembelian langsung tanpa ribet."
                : "Checkout through your preferred marketplace for a straightforward purchase flow."}
            </p>
          </div>

          <div className="rounded-2xl border border-primary/10 bg-[#f8fbfd] p-4 md:min-w-[220px]">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <WalletCards className="h-4 w-4" strokeWidth={1.5} />
              <span>{isId ? "Belanja via marketplace" : "Buy via marketplace"}</span>
            </div>
            <p className="mt-2 text-sm leading-7 text-foreground/70">
              {isId
                ? "Shopee & Tokopedia untuk pembayaran, promo channel, dan tracking pesanan."
                : "Shopee and Tokopedia for payment, channel promos, and order tracking."}
            </p>
          </div>
        </div>

        <div className="space-y-5 p-6 md:p-8">
          {product.variants && (
            <div className="space-y-3">
              <span className="text-sm font-medium text-primary/60">
                {isId ? "Pilih opsi" : "Choose option"}
              </span>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.name}
                    onClick={() => setSelectedVariant(variant)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200",
                      selectedVariant?.name === variant.name
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-white text-foreground/70 hover:border-primary/50"
                    )}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-display text-lg font-medium text-primary">
              {isId ? "Kenapa orang pilih produk ini" : "Why people choose this"}
            </h3>
            <ul className="space-y-3">
              {content.keyBenefits.map((benefit) => (
                <li key={benefit} className="group flex items-start gap-3 text-sm text-foreground/85 md:text-base">
                  <div className="mt-1 rounded-full bg-secondary/30 p-1 text-primary transition-colors group-hover:bg-secondary/50">
                    <Check className="h-3 w-3" strokeWidth={2} />
                  </div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-primary/10 bg-primary p-5 text-primary-foreground">
            <p className="text-sm font-medium text-primary-foreground/70">
              {content.bundleTitle}
            </p>
            <p className="mt-3 text-sm leading-7 text-primary-foreground/82">{content.bundleBody}</p>
            <Link
              href={`/${locale}/products/${content.relatedSlug}`}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white"
            >
              {content.relatedCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="pt-2 space-y-4">
            <BuyButtons
              shopeeUrl={currentShopeeUrl}
              tokopediaUrl={currentTokopediaUrl}
              productSlug={product.slug}
              className="w-full"
            />
            <p className="text-center text-xs text-muted-foreground/70">
              {isId
                ? "Belanja aman lewat marketplace favorit Anda. Scroll ke bawah untuk lihat perbandingan, FAQ, dan guide fit."
                : "Secure checkout through your preferred marketplace. Scroll down for comparisons, FAQs, and fit guidance."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
          <p className="font-display text-lg font-medium text-primary">
            {isId ? "Quick fit guide" : "Quick fit guide"}
          </p>
          <div className="mt-4 space-y-3">
            {content.goodFit.slice(0, 3).map((item) => (
              <div key={item} className="flex gap-3 text-sm leading-7 text-foreground/85">
                <Check className="mt-1 h-4 w-4 flex-none text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
          <p className="font-display text-lg font-medium text-primary">
            {isId ? "Why buy here" : "Why buy here"}
          </p>
          <div className="mt-4 space-y-3 text-sm leading-7 text-foreground/85">
            <div className="flex gap-3">
              <ShieldCheck className="mt-1 h-4 w-4 flex-none text-primary" />
              <span>{isId ? "Checkout resmi via Shopee dan Tokopedia" : "Official checkout via Shopee and Tokopedia"}</span>
            </div>
            <div className="flex gap-3">
              <Truck className="mt-1 h-4 w-4 flex-none text-primary" />
              <span>{isId ? "Pengiriman Indonesia dan support lokal" : "Indonesia shipping with local support"}</span>
            </div>
            <div className="flex gap-3">
              <Package2 className="mt-1 h-4 w-4 flex-none text-primary" />
              <span>{isId ? "Lebih enak dibundle untuk sleep setup lengkap" : "Works best as part of a fuller sleep setup bundle"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
