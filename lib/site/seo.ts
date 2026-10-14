import type { Metadata } from "next";

import type { Locale } from "@/i18n/config";
import type { Product } from "@/lib/catalog/types";
import { storeLinks } from "@/lib/site/copy";
import { WHATSAPP_NUMBER } from "@/lib/site/whatsapp";

export const SITE_URL = "https://sheepiesleep.com";
const SITE_NAME = "Sheepie";
const OG_LOCALE: Record<Locale, string> = { id: "id_ID", en: "en_US" };

/** Pages that exist in both languages, keyed by path (no locale prefix, "" is home). */
export type PageKey = "home" | "products" | "about" | "contact" | "faq" | "blog" | "guide";

const PATHS: Record<PageKey, string> = {
  home: "",
  products: "/products",
  about: "/about",
  contact: "/contact",
  faq: "/faq",
  blog: "/blog",
  guide: "/calmicloud-earplug-guide",
};

/** Search titles (≤60 chars) and descriptions (≤160) for every page, in one place. */
const PAGE_SEO: Record<PageKey, Record<Locale, { title: string; description: string }>> = {
  home: {
    id: {
      title: "Sheepie | Bantal Ergonomis, Penutup Mata Tidur & Earplug",
      description: "Perlengkapan tidur Sheepie: bantal ergonomis CerviCloud, penutup mata tidur LumiCloud, dan earplug CalmiCloud. Belanja resmi di Shopee & Tokopedia.",
    },
    en: {
      title: "Sheepie | Ergonomic Pillow, Sleep Mask & Earplugs",
      description: "Sleep essentials by Sheepie: the CerviCloud ergonomic pillow, LumiCloud blackout sleep mask and CalmiCloud earplugs. Shop official on Shopee & Tokopedia.",
    },
  },
  products: {
    id: {
      title: "Koleksi Perlengkapan Tidur | Sheepie",
      description: "Bantal ergonomis CerviCloud, penutup mata tidur LumiCloud, dan earplug CalmiCloud, plus paket hemat. Belanja resmi di Shopee & Tokopedia.",
    },
    en: {
      title: "Sleep Essentials Collection | Sheepie",
      description: "The CerviCloud ergonomic pillow, LumiCloud sleep mask and CalmiCloud earplugs, plus value bundles. Shop official on Shopee & Tokopedia.",
    },
  },
  about: {
    id: {
      title: "Filosofi Kami | Sheepie",
      description: "Hari yang lebih baik dimulai dari malam sebelumnya. Cerita di balik bantal, penutup mata tidur, dan earplug Sheepie.",
    },
    en: {
      title: "Our Philosophy | Sheepie",
      description: "A better day starts the night before. The story behind Sheepie's pillow, sleep mask and earplugs.",
    },
  },
  contact: {
    id: {
      title: "Hubungi Kami | Sheepie",
      description: "Tanya soal produk, ukuran, atau pesanan Sheepie lewat WhatsApp, email, atau chat toko kami di Shopee dan Tokopedia.",
    },
    en: {
      title: "Contact Us | Sheepie",
      description: "Ask about Sheepie products, sizes or orders on WhatsApp, by email, or through our Shopee and Tokopedia stores.",
    },
  },
  faq: {
    id: {
      title: "FAQ: Produk, Perawatan & Pengiriman | Sheepie",
      description: "Jawaban seputar bantal CerviCloud, penutup mata tidur LumiCloud, earplug CalmiCloud, cara merawatnya, serta pengiriman dan pengembalian.",
    },
    en: {
      title: "FAQ: Products, Care & Delivery | Sheepie",
      description: "Answers about the CerviCloud pillow, LumiCloud sleep mask and CalmiCloud earplugs, how to care for them, delivery and returns.",
    },
  },
  blog: {
    id: {
      title: "Blog Sheepie: Panduan Tidur Lebih Nyenyak",
      description: "Panduan praktis dari tim Sheepie soal bantal, posisi tidur, cahaya, suara, dan kebiasaan tidur sehari-hari.",
    },
    en: {
      title: "Sheepie Blog: Guides to Sleeping Better",
      description: "Practical guides from the Sheepie team on pillows, sleeping positions, light, noise and everyday sleep habits. Articles are in Bahasa Indonesia.",
    },
  },
  guide: {
    id: {
      title: "Cara Pakai Earplug CalmiCloud | Sheepie",
      description: "Panduan resmi memakai, melepas, merawat, dan menyimpan earplug silikon CalmiCloud. Ditempel di luar telinga, bukan dimasukkan ke liang telinga.",
    },
    en: {
      title: "How to Use CalmiCloud Earplugs | Sheepie",
      description: "The official guide to wearing, removing, cleaning and storing CalmiCloud silicone earplugs. They sit over the outer ear, never inside the canal.",
    },
  },
};

/** Product search titles, keyword first. */
const PRODUCT_TITLE: Record<Product["slug"], Record<Locale, string>> = {
  cervicloud: { id: "Bantal Ergonomis CerviCloud untuk Leher | Sheepie", en: "CerviCloud Ergonomic Neck Pillow | Sheepie" },
  lumicloud: { id: "Penutup Mata Tidur Blackout LumiCloud | Sheepie", en: "LumiCloud Blackout Sleep Mask | Sheepie" },
  calmicloud: { id: "Earplug Tidur Silikon CalmiCloud | Sheepie", en: "CalmiCloud Silicone Sleep Earplugs | Sheepie" },
};

/** One brand card (1200×630 JPG) for every page; blog articles use their own illustration. */
const OG_IMAGE = "/og/sheepie.jpg";

export const postOgImage = (slug: string) => `/og/blog/${slug}.jpg`;

export const absolute = (path: string) => `${SITE_URL}${path}`;
const localePath = (locale: Locale, path: string) => `/${locale}${path}`;

type Seo = {
  locale: Locale;
  /** Path without the locale prefix ("" for home). */
  path: string;
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
  type?: "website" | "article";
  /** Which locales the page exists in; the first is also x-default. */
  languages?: Locale[];
  /** Point the canonical at another locale (e.g. English blog pages → Indonesian). */
  canonicalLocale?: Locale;
  noindex?: boolean;
  article?: { publishedTime: string; modifiedTime: string };
};

/** Title, description, canonical, hreflang, Open Graph and Twitter tags for one page. */
export function buildMetadata(seo: Seo): Metadata {
  const languages = seo.languages ?? ["id", "en"];
  const canonical = absolute(localePath(seo.canonicalLocale ?? seo.locale, seo.path));
  const alternates: Record<string, string> = Object.fromEntries(languages.map((l) => [l, absolute(localePath(l, seo.path))]));
  alternates["x-default"] = absolute(localePath(languages[0], seo.path));
  const image = { url: absolute(seo.image), width: 1200, height: 630, alt: seo.imageAlt ?? seo.title };

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical, languages: alternates },
    robots: seo.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: seo.type ?? "website",
      url: canonical,
      siteName: SITE_NAME,
      locale: OG_LOCALE[seo.locale],
      title: seo.title,
      description: seo.description,
      images: [image],
      ...(seo.article ?? {}),
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description, images: [image.url] },
  };
}

export function pageMetadata(key: PageKey, locale: Locale, extra: Partial<Seo> = {}): Metadata {
  return buildMetadata({ locale, path: PATHS[key], ...PAGE_SEO[key][locale], image: OG_IMAGE, ...extra });
}

export function pageSeo(key: PageKey, locale: Locale) {
  return { ...PAGE_SEO[key][locale], path: PATHS[key] };
}

export function productMetadata(product: Product, locale: Locale): Metadata {
  return buildMetadata({
    locale,
    path: `/products/${product.slug}`,
    title: PRODUCT_TITLE[product.slug][locale],
    description: product.sub,
    image: OG_IMAGE,
    imageAlt: product.name,
  });
}

/* ---------- Structured data ---------- */

const ORG_ID = `${SITE_URL}/#organization`;

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: absolute("/brand/lamb-blue.webp"),
    sameAs: [storeLinks.instagram, storeLinks.tiktok, storeLinks.shopee, storeLinks.tokopedia],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: `+${WHATSAPP_NUMBER}`,
      availableLanguage: ["Indonesian", "English"],
      areaServed: "ID",
    },
  };
}

export function websiteLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: absolute(`/${locale}`),
    inLanguage: locale === "id" ? "id-ID" : "en-US",
    publisher: { "@id": ORG_ID },
  };
}

/** Breadcrumbs from the home page down; each crumb is [name, path without locale]. */
export function breadcrumbLd(locale: Locale, crumbs: [string, string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [[locale === "id" ? "Beranda" : "Home", ""] as [string, string], ...crumbs].map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: absolute(localePath(locale, path)),
    })),
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  const plain = (s: string) => s.replace(/<[^>]+>/g, "").trim();
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: plain(i.q), acceptedAnswer: { "@type": "Answer", text: plain(i.a) } })),
  };
}

/** Product with its price range across options and bundles; it's sold through Shopee and Tokopedia. */
export function productLd(product: Product, locale: Locale) {
  const prices = [...product.options.map((o) => o.price), ...product.bundles.map((b) => b.price)];
  const url = absolute(localePath(locale, `/products/${product.slug}`));
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.sub,
    image: product.gallery.slice(0, 4).map((g) => absolute(g.src)),
    sku: product.slug,
    brand: { "@type": "Brand", name: SITE_NAME },
    url,
    offers:
      low === high
        ? { "@type": "Offer", price: low, priceCurrency: "IDR", availability: "https://schema.org/InStock", url, seller: { "@type": "Organization", "@id": ORG_ID, name: SITE_NAME } }
        : {
            "@type": "AggregateOffer",
            lowPrice: low,
            highPrice: high,
            offerCount: prices.length,
            priceCurrency: "IDR",
            availability: "https://schema.org/InStock",
            url,
            seller: { "@type": "Organization", "@id": ORG_ID, name: SITE_NAME },
          },
  };
}

export function itemListLd(locale: Locale, products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: absolute(localePath(locale, `/products/${p.slug}`)), name: p.name })),
  };
}
