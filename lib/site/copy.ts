import type { Locale } from "@/i18n/config";

export interface SiteCopy {
  notice: string;
  nav: { pillow: string; mask: string; earplug: string; story: string; journal: string; faq: string; contact: string; shop: string; menu: string; close: string; allProducts: string };
  shopPanel: { title: string; note: string };
  buy: { shopee: string; tokopedia: string };
  footer: { goodnight: string; shop: string; brand: string; find: string; rights: string; cover: string; soldOut: string };
  language: { label: string; switchTo: string };
}

export const siteCopy: Record<Locale, SiteCopy> = {
  id: {
    notice: "Belanja resmi Sheepie di Shopee & Tokopedia",
    nav: { pillow: "Bantal", mask: "Masker Mata", earplug: "Earplug", story: "Cerita Kami", journal: "Blog", faq: "FAQ", contact: "Kontak", shop: "Belanja", menu: "Menu", close: "Tutup", allProducts: "Semua produk" },
    shopPanel: { title: "Belanja Sheepie", note: "Pilih produk, lalu toko favoritmu." },
    buy: { shopee: "Beli di Shopee", tokopedia: "Beli di Tokopedia" },
    footer: { goodnight: "Selamat tidur, sampai besok pagi.", shop: "Belanja", brand: "Sheepie", find: "Temukan kami", rights: "© 2026 Sheepie", cover: "Sarung CerviCloud", soldOut: "Habis" },
    language: { label: "Bahasa", switchTo: "English" },
  },
  en: {
    notice: "Shop official Sheepie on Shopee & Tokopedia",
    nav: { pillow: "Pillow", mask: "Eye Mask", earplug: "Earplugs", story: "Our Story", journal: "Blog", faq: "FAQ", contact: "Contact", shop: "Shop", menu: "Menu", close: "Close", allProducts: "All products" },
    shopPanel: { title: "Shop Sheepie", note: "Pick a product, then your favourite store." },
    buy: { shopee: "Buy on Shopee", tokopedia: "Buy on Tokopedia" },
    footer: { goodnight: "Sleep well, see you in the morning.", shop: "Shop", brand: "Sheepie", find: "Find us", rights: "© 2026 Sheepie", cover: "CerviCloud cover", soldOut: "Sold out" },
    language: { label: "Language", switchTo: "Bahasa Indonesia" },
  },
};

export const storeLinks = {
  shopee: "https://shopee.co.id/sheepie.sleep",
  tokopedia: "https://www.tokopedia.com/sheepie",
  instagram: "https://www.instagram.com/sheepiesleep.id",
  tiktok: "https://www.tiktok.com/@sheepiesleep",
} as const;

export function localeHref(locale: Locale, path: string): string {
  return `/${locale}${path === "/" ? "" : path}`;
}
