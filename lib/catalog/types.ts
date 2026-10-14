import type { Locale } from "@/i18n/config";

export type { Locale };

export const PRODUCT_SLUGS = ["cervicloud", "lumicloud", "calmicloud"] as const;
export type ProductSlug = (typeof PRODUCT_SLUGS)[number];

/** A string in every supported locale. */
export type Text = Record<Locale, string>;

export type Marketplace = "shopee" | "tokopedia";

export type IconName =
  | "neck"
  | "cool"
  | "foam"
  | "wash"
  | "dark"
  | "eye"
  | "hair"
  | "travel"
  | "ear"
  | "mold"
  | "case"
  | "reuse";

/** Where an option's price and marketplace links come from in data/products.json. */
export type OptionPriceSource =
  | { kind: "base" }
  | { kind: "variant"; name: string }
  | { kind: "color"; name: string };

export interface OptionSource {
  key: string;
  label: Text;
  note: Text;
  image: string;
  source: OptionPriceSource;
}

export interface ProductCopy {
  slug: ProductSlug;
  name: string;
  role: "hero" | "companion";
  card: { image: string; hoverImage: string; chip: Text; line: Text };
  sub: Text;
  gallery: { src: string; alt: Text }[];
  icons: { icon: IconName; label: Text }[];
  optionLabel: Text;
  options: OptionSource[];
  accordions: { title: Text; body: Text[] }[];
  anatomy: {
    title: Text;
    intro: Text;
    image: string;
    /** Transparent product cut-out: sits on the dark blue stage. */
    cutout?: boolean;
    points: { x: number; y: number; title: Text; body: Text }[];
  };
  fit: { title: Text; items: { title: Text; body: Text; fits: boolean }[] };
  compare: { title: Text; theirs: Text; rows: { label: Text; ours: Text; theirs: Text }[] };
  faq: { q: Text; a: Text }[];
  pairWith: ProductSlug[];
}

export interface ProductBundle {
  key: string;
  qty: number;
  label: string;
  price: number;
  /** null when there is no saving to show. */
  originalPrice: number | null;
  /** The pack's listing photo (e.g. "Bundle of 2"), shown first in the gallery when picked. */
  image: string | null;
  /** Per-option pack photos (LumiCloud colours), keyed by option key; wins over `image`. */
  imageByOption: Record<string, string>;
}

export interface ProductOption {
  key: string;
  label: string;
  note: string;
  image: string;
  price: number;
  /** null when there is no saving to show. */
  originalPrice: number | null;
  shopeeUrl: string;
  tokopediaUrl: string;
  /** Colour options only: the swatch hex from data/products.json. */
  swatch?: string;
}

export interface Product {
  slug: ProductSlug;
  name: string;
  role: "hero" | "companion";
  card: { image: string; hoverImage: string; chip: string; line: string };
  sub: string;
  gallery: { src: string; alt: string }[];
  icons: { icon: IconName; label: string }[];
  optionLabel: string;
  options: ProductOption[];
  /** Multi-buy packs sold on the same marketplace listing; empty when there are none. */
  bundles: ProductBundle[];
  accordions: { title: string; body: string[] }[];
  anatomy: {
    title: string;
    intro: string;
    image: string;
    cutout: boolean;
    points: { x: number; y: number; title: string; body: string }[];
  };
  fit: { title: string; items: { title: string; body: string; fits: boolean }[] };
  compare: { title: string; theirs: string; rows: { label: string; ours: string; theirs: string }[] };
  faq: { q: string; a: string }[];
  pairWith: ProductSlug[];
}
