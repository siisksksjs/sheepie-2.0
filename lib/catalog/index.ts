import products from "@/data/products.json";
import type { Locale } from "@/i18n/config";

import { productCopy } from "./content";
import { parseIdr } from "./price";
import {
  PRODUCT_SLUGS,
  type OptionSource,
  type Product,
  type ProductOption,
  type ProductSlug,
  type Text,
} from "./types";

export { productCopy };

interface SourceVariant {
  name: string;
  price: string;
  originalPrice: string;
  shopeeUrl: string;
  tokopediaUrl: string;
}

interface SourceProduct {
  slug: string;
  price: string;
  originalPrice: string;
  shopeeUrl: string;
  tokopediaUrl: string;
  variants?: SourceVariant[];
  colors?: { name: string }[];
}

const sources = products as SourceProduct[];

function source(slug: ProductSlug): SourceProduct {
  const found = sources.find((p) => p.slug === slug);
  if (!found) throw new Error(`data/products.json has no product "${slug}"`);
  return found;
}

function priced(price: string, originalPrice: string) {
  const amount = parseIdr(price);
  const original = parseIdr(originalPrice);
  return { price: amount, originalPrice: original > amount ? original : null };
}

function resolveOption(slug: ProductSlug, option: OptionSource, locale: Locale): ProductOption {
  const base = source(slug);
  let pricing = priced(base.price, base.originalPrice);
  let urls = { shopeeUrl: base.shopeeUrl, tokopediaUrl: base.tokopediaUrl };

  if (option.source.kind === "variant") {
    const name = option.source.name;
    const variant = base.variants?.find((v) => v.name === name);
    if (!variant) throw new Error(`Missing variant "${name}" for ${slug}`);
    pricing = priced(variant.price, variant.originalPrice);
    urls = { shopeeUrl: variant.shopeeUrl, tokopediaUrl: variant.tokopediaUrl };
  } else if (option.source.kind === "color") {
    const name = option.source.name;
    if (!base.colors?.some((c) => c.name === name)) throw new Error(`Missing colour "${name}" for ${slug}`);
  }

  return {
    key: option.key,
    label: option.label[locale],
    note: option.note[locale],
    image: option.image,
    ...pricing,
    ...urls,
  };
}

export function isProductSlug(value: string): value is ProductSlug {
  return (PRODUCT_SLUGS as readonly string[]).includes(value);
}

export function getProduct(slug: ProductSlug, locale: Locale): Product {
  const copy = productCopy[slug];
  const t = (text: Text) => text[locale];

  return {
    slug,
    name: copy.name,
    role: copy.role,
    card: { image: copy.card.image, hoverImage: copy.card.hoverImage, chip: t(copy.card.chip), line: t(copy.card.line) },
    sub: t(copy.sub),
    gallery: copy.gallery.map((g) => ({ src: g.src, alt: t(g.alt) })),
    icons: copy.icons.map((i) => ({ icon: i.icon, label: t(i.label) })),
    optionLabel: t(copy.optionLabel),
    options: copy.options.map((o) => resolveOption(slug, o, locale)),
    accordions: copy.accordions.map((a) => ({ title: t(a.title), body: a.body.map(t) })),
    anatomy: {
      title: t(copy.anatomy.title),
      intro: t(copy.anatomy.intro),
      image: copy.anatomy.image,
      points: copy.anatomy.points.map((p) => ({ x: p.x, y: p.y, title: t(p.title), body: t(p.body) })),
    },
    fit: { title: t(copy.fit.title), items: copy.fit.items.map((i) => ({ title: t(i.title), body: t(i.body), fits: i.fits })) },
    compare: {
      title: t(copy.compare.title),
      theirs: t(copy.compare.theirs),
      rows: copy.compare.rows.map((r) => ({ label: t(r.label), ours: t(r.ours), theirs: t(r.theirs) })),
    },
    faq: copy.faq.map((f) => ({ q: t(f.q), a: t(f.a) })),
    pairWith: copy.pairWith,
  };
}

export function getProducts(locale: Locale): Product[] {
  return PRODUCT_SLUGS.map((slug) => getProduct(slug, locale));
}

export function findOption(product: Product, key: string | null | undefined): ProductOption {
  return product.options.find((o) => o.key === key) ?? product.options[0];
}

export function productPath(locale: Locale, slug: ProductSlug, optionKey?: string): string {
  return `/${locale}/products/${slug}${optionKey ? `?option=${encodeURIComponent(optionKey)}` : ""}`;
}
