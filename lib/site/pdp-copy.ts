// lib/site/pdp-copy.ts
import type { Locale } from "@/i18n/config";

export interface PdpCopy {
  home: string;
  products: string;
  save: string;
  bundle: string;
  voucher: string;
  copy: string;
  copied: string;
  assurances: [string, string];
  fits: string;
  notFit: string;
  reviews: string;
  viewOriginal: string;
  faq: string;
  faqNote: string;
  pair: string;
  gallery: string;
}

export const pdpCopy: Record<Locale, PdpCopy> = {
  id: {
    home: "Beranda",
    products: "Produk",
    save: "Hemat {n}%",
    bundle: "Paket",
    voucher: "Kode khusus website:",
    copy: "Salin",
    copied: "Tersalin",
    assurances: ["Dikirim dari Indonesia lewat Shopee & Tokopedia", "Pembayaran & retur dilindungi marketplace"],
    fits: "Cocok",
    notFit: "Kurang cocok",
    reviews: "Kata mereka tentang {name}",
    viewOriginal: "Lihat ulasan asli",
    faq: "Frequently Asked Questions",
    faqNote: "Masih ragu? Tanya kami lewat chat Shopee atau Tokopedia.",
    pair: "Lengkapi tidurmu",
    gallery: "Foto produk",
  },
  en: {
    home: "Home",
    products: "Products",
    save: "Save {n}%",
    bundle: "Bundle",
    voucher: "Website-only code:",
    copy: "Copy",
    copied: "Copied",
    assurances: ["Ships from Indonesia via Shopee & Tokopedia", "Payment & returns covered by marketplace protection"],
    fits: "Good fit",
    notFit: "Not ideal",
    reviews: "What people say about {name}",
    viewOriginal: "See original review",
    faq: "Frequently Asked Questions",
    faqNote: "Still unsure? Ask us in Shopee or Tokopedia chat.",
    pair: "Complete your sleep",
    gallery: "Product photos",
  },
};
