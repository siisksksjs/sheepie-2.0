import productsSource from "./products.json";
import siteSource from "./site.json";

import type { BioDestination } from "@/lib/bio-analytics/contracts";

export type { BioDestination } from "@/lib/bio-analytics/contracts";

export type BioAction = {
  id: string;
  label: string;
  href: string;
  destination: Exclude<BioDestination, "share">;
  accessibleLabel: string;
};

export type BioProduct = {
  id: string;
  slug: "cervicloud" | "lumicloud" | "calmicloud";
  name: string;
  eyebrow: string;
  headline: string;
  description: string;
  price: string;
  image: {
    src: string;
    alt: string;
  };
  /** Every listing image, browsable one frame at a time. */
  gallery: string[];
  /**
   * Marketplace rating, supplied by the store owner. A rating is a factual
   * claim to shoppers, so it is only ever set from real figures — never
   * estimated. `count` is optional until review totals are confirmed.
   */
  rating?: { score: number; count?: string };
  actions: [BioAction, BioAction];
};

export type BioTestimonial = {
  id: string;
  product: ProductSlug;
  author: string;
  marketplace: "shopee" | "tokopedia";
  quote: string;
  /** The original review screenshot, linked as proof behind the quote. */
  screenshot: { src: string; width: number; height: number };
};

export type BioConfig = {
  heroImage: {
    src: string;
    alt: string;
  };
  bannerImage: {
    src: string;
    alt: string;
  };
  products: BioProduct[];
  hubActions: BioAction[];
  /** Shopee review screenshots. The section is hidden while this is empty. */
  testimonials: BioTestimonial[];
};

export const SHEEPIE_EMAIL = "hello@sheepiesleep.com";

/**
 * Masks a marketplace handle to the shape the stores themselves use, so no
 * reviewer is identifiable from this page regardless of how the original
 * marketplace displayed them.
 */
export function maskAuthor(handle: string): string {
  const trimmed = handle.trim();
  if (trimmed.length < 2) return "*****";

  const stars = Math.min(5, Math.max(3, trimmed.length - 2));
  return `${trimmed[0]}${"*".repeat(stars)}${trimmed[trimmed.length - 1]}`;
}

/**
 * The strongest three five-star reviews per product, chosen for distinct angles
 * rather than repetition: an objection answered, the core benefit, and a signal
 * of repeat trust.
 *
 * Screenshots are the untouched marketplace captures. `quote` carries their
 * visible text for assistive technology and search engines.
 */
const rawTestimonials: BioTestimonial[] = [
  // CerviCloud Pillow — the shape looks odd at first, so lead with that objection.
  {
    id: "cervicloud-1",
    product: "cervicloud",
    author: "H***u",
    marketplace: "tokopedia",
    quote:
      "Awalnya agak aneh karena bentuknya beda dari bantal biasa, tapi setelah 2 minggu mulai kerasa bedanya. Leher jadi gak gampang pegal, dan bangun tidur gak kaku lagi. Postur badan lebih terjaga pas tidur.",
    screenshot: { src: "/images/bio/testimonials/cervicloud-1-review.jpg", width: 1170, height: 975 },
  },
  {
    id: "cervicloud-2",
    product: "cervicloud",
    author: "Jiwon",
    marketplace: "tokopedia",
    quote:
      "Pertama kali pakai rasanya beda banget, tapi adminnya sempat bilang memang perlu waktu untuk adaptasi. Memory foam nya mantap banget, real ngesupport. Sekarang malah gak bisa tidur pake bantal lain.",
    screenshot: { src: "/images/bio/testimonials/cervicloud-2-review.jpg", width: 1170, height: 982 },
  },
  {
    id: "cervicloud-3",
    product: "cervicloud",
    author: "s***i",
    marketplace: "tokopedia",
    quote:
      "Udah beli 2 kali disini. Sama-sama tidur miring, suka banget sama desain ergonomiknya, cerdas! Ada bagian khusus buat tangan pas tidur miring, gak kerasa kesemutan lagi.",
    screenshot: { src: "/images/bio/testimonials/cervicloud-3-review.jpg", width: 1170, height: 1013 },
  },

  // LumiCloud EyeMask — blackout is the promise; strap and comfort are the doubts.
  {
    id: "lumicloud-1",
    product: "lumicloud",
    author: "steve969",
    marketplace: "shopee",
    quote:
      "Bahan berkualitas, lembut, cahaya tidak tembus. Bahan lembut tidak buat sakit atau pegal bagian belakang kepala, sangat recomended.",
    screenshot: { src: "/images/bio/testimonials/lumicloud-1-review.jpg", width: 1170, height: 1278 },
  },
  {
    id: "lumicloud-2",
    product: "lumicloud",
    author: "indarwati22",
    marketplace: "shopee",
    quote:
      "Bagus halus banget bahannya, tebel empuk dan nyaman dipakai lama. Yang paling oke adalah fitur silent velcro nya.",
    screenshot: { src: "/images/bio/testimonials/lumicloud-2-review.jpg", width: 1170, height: 1467 },
  },
  {
    id: "lumicloud-3",
    product: "lumicloud",
    author: "c*****9",
    marketplace: "shopee",
    quote:
      "Aku udah coba pake dan beneran halus dan gak ngerusak bulu mata palsuku! Tidur juga jadi makin pules soalnya aku gampang kebangun tengah malem.",
    screenshot: { src: "/images/bio/testimonials/lumicloud-3-review.jpg", width: 1169, height: 1199 },
  },

  // CalmiCloud Earplug — noise is the problem; lead with the most concrete outcome.
  {
    id: "calmicloud-1",
    product: "calmicloud",
    author: "saalsabilaadinda",
    marketplace: "shopee",
    quote:
      "Aku tipe orang light sleeper, ada suara dikit kebangun dan susah buat balik tidur lagi. Tapi pertama kali pake ini aku malemnya tidur 12 jam. Cukup banget bahkan buat aku yang sensitif.",
    screenshot: { src: "/images/bio/testimonials/calmicloud-1-review.jpg", width: 1170, height: 1829 },
  },
  {
    id: "calmicloud-2",
    product: "calmicloud",
    author: "bluenavy89",
    marketplace: "shopee",
    quote:
      "Sesuai judulnya, Moldable jadi bisa ditempel langsung di sekitar lubang telinga sesuai dengan bentuk yang kamu inginkan. Sangat bantu untuk redam suara dari luar.",
    screenshot: { src: "/images/bio/testimonials/calmicloud-2-review.jpg", width: 1170, height: 1598 },
  },
  {
    id: "calmicloud-3",
    product: "calmicloud",
    author: "bennettonlin",
    marketplace: "shopee",
    quote:
      "Barang sesuai, pengiriman cepat. Kosan berisik, pake ini jadi lebih kebantu buat tidur. Rekomended.",
    screenshot: { src: "/images/bio/testimonials/calmicloud-3-review.jpg", width: 1170, height: 1273 },
  },
];

type ProductSlug = BioProduct["slug"];

const sourceBySlug = new Map(productsSource.map((product) => [product.slug, product]));

function getSourceProduct(slug: ProductSlug) {
  const product = sourceBySlug.get(slug);

  if (!product) {
    throw new Error(`Missing required bio product source: ${slug}`);
  }

  return product;
}

/**
 * Short canonical Shopee links used by the bio page. The main site keeps the
 * long listing URLs, which preselect a variant via `extraParams`.
 */
const BIO_SHOPEE_URLS: Record<ProductSlug, string> = {
  cervicloud: "https://shopee.co.id/product/669518207/25697801158/",
  lumicloud: "https://shopee.co.id/product/669518207/55952823103/",
  calmicloud: "https://shopee.co.id/product/669518207/40426532493/",
};

function productActions(slug: ProductSlug): [BioAction, BioAction] {
  const product = getSourceProduct(slug);
  const name = product.name.replace(/ (Pillow|Eye Mask|Earplugs)$/, "");

  return [
    {
      id: `bio-${slug}-shopee`,
      label: "Beli di Shopee",
      href: BIO_SHOPEE_URLS[slug],
      destination: "shopee",
      accessibleLabel: `Beli ${name} di Shopee (buka tab baru)`,
    },
    {
      id: `bio-${slug}-tokopedia`,
      label: "Beli di Tokopedia",
      href: product.tokopediaUrl,
      destination: "tokopedia",
      accessibleLabel: `Beli ${name} di Tokopedia (buka tab baru)`,
    },
  ];
}

const productStories: Array<Omit<BioProduct, "price" | "gallery" | "actions">> = [
  {
    id: "bio-product-alignment",
    slug: "cervicloud",
    rating: { score: 4.9 },
    name: "CerviCloud Pillow",
    eyebrow: "Penyelarasan",
    headline: "Leher lebih ditopang, pagi terasa lebih ringan.",
    description:
      "Kontur ergonomis 4D memeluk leher dan membantu menjaga posisi tidur alami, dengan permukaan Ice-Silk yang terasa sejuk.",
    image: {
      src: "/images/products/cervicloud/listing-01.png",
      alt: "Bantal ergonomis CerviCloud dengan kontur penyangga leher di latar biru muda",
    },
  },
  {
    id: "bio-product-darkness",
    slug: "lumicloud",
    rating: { score: 5 },
    name: "LumiCloud EyeMask",
    eyebrow: "Kegelapan",
    headline: "Redupkan dunia tanpa menekan mata.",
    description:
      "Ruang mata 3D dan kain katun lembut menciptakan gelap menyeluruh dengan rasa ringan, sejuk, dan nyaman.",
    image: {
      src: "/images/products/lumicloud/listing-01.png",
      alt: "Masker tidur LumiCloud biru muda dengan ruang mata tiga dimensi di latar biru muda",
    },
  },
  {
    id: "bio-product-silence",
    slug: "calmicloud",
    rating: { score: 4.9 },
    name: "CalmiCloud Earplug",
    eyebrow: "Keheningan",
    headline: "Bentuk ruang tenangmu sendiri.",
    description:
      "Silikon kelas medis yang dapat dibentuk menutup bagian luar telinga dengan nyaman untuk membantu meredam suara sekitar.",
    image: {
      src: "/images/products/calmicloud/listing-01.png",
      alt: "Earplug silikon CalmiCloud dalam wadah transparan di latar biru muda",
    },
  },
];

export function isValidWhatsAppUrl(value: string | undefined): value is string {
  if (!value) return false;

  try {
    const url = new URL(value);
    const authority = value.slice("https://".length).split(/[/?#]/, 1)[0];
    const isPhone = (phone: string) => /^[1-9]\d{7,14}$/.test(phone);
    const hasOnlyParams = (allowed: string[]) =>
      [...url.searchParams.keys()].every((key) => allowed.includes(key));

    if (
      url.protocol !== "https:" ||
      authority !== url.hostname ||
      url.username ||
      url.password ||
      url.port ||
      url.hash
    ) {
      return false;
    }

    if (url.hostname === "wa.me") {
      return isPhone(url.pathname.slice(1)) && hasOnlyParams(["text"]);
    }

    if (url.hostname === "api.whatsapp.com") {
      return (
        url.pathname === "/send" &&
        isPhone(url.searchParams.get("phone") ?? "") &&
        url.searchParams.getAll("phone").length === 1 &&
        hasOnlyParams(["phone", "text"])
      );
    }

    return false;
  } catch {
    return false;
  }
}

export function createBioConfig(whatsAppUrl?: string): BioConfig {
  const hubActions: BioAction[] = [
    {
      id: "bio-hub-tokopedia",
      label: "Tokopedia",
      href: "https://www.tokopedia.com/sheepie",
      destination: "tokopedia",
      accessibleLabel: "Kunjungi toko Sheepie di Tokopedia (buka tab baru)",
    },
    {
      id: "bio-hub-shopee",
      label: "Shopee",
      href: "https://shopee.co.id/sheepie.sleep",
      destination: "shopee",
      accessibleLabel: "Kunjungi toko resmi Sheepie di Shopee (buka tab baru)",
    },
    {
      id: "bio-hub-tiktok",
      label: "TikTok Shop",
      href: siteSource.socials.tiktok,
      destination: "tiktok",
      accessibleLabel: "Ikuti Sheepie di TikTok (buka tab baru)",
    },
    {
      id: "bio-hub-instagram",
      label: "Instagram",
      href: siteSource.socials.instagram,
      destination: "instagram",
      accessibleLabel: "Ikuti Sheepie di Instagram (buka tab baru)",
    },
  ];

  // Masked at config-build time so raw handles never reach the client bundle.
  const testimonials: BioTestimonial[] = rawTestimonials.map((testimonial) => ({
    ...testimonial,
    author: maskAuthor(testimonial.author),
  }));

  hubActions.push({
    id: "bio-hub-email",
    label: "Email",
    href: `mailto:${SHEEPIE_EMAIL}`,
    destination: "email",
    accessibleLabel: `Kirim email ke Sheepie di ${SHEEPIE_EMAIL}`,
  });

  hubActions.push({
    id: "bio-connect-tiktok",
    label: "TikTok",
    href: siteSource.socials.tiktok,
    destination: "tiktok",
    accessibleLabel: "Ikuti Sheepie di TikTok (buka tab baru)",
  });

  hubActions.push({
    id: "bio-hub-website",
    label: "Website",
    href: "https://sheepiesleep.com/id",
    destination: "website",
    accessibleLabel: "Kunjungi website Sheepie (buka tab baru)",
  });

  if (isValidWhatsAppUrl(whatsAppUrl)) {
    hubActions.push({
      id: "bio-hub-whatsapp",
      label: "Tanya via WhatsApp",
      href: whatsAppUrl,
      destination: "whatsapp",
      accessibleLabel: "Hubungi Sheepie melalui WhatsApp (buka tab baru)",
    });
  }

  return {
    heroImage: {
      src: "/images/bio/sheepie-sleep-system.jpg",
      alt: "Seseorang beristirahat menggunakan CerviCloud dan LumiCloud dari Sheepie",
    },
    bannerImage: {
      src: "/images/bio/sheepie-banner-hero.jpg",
      alt: "Seseorang tidur nyenyak mengenakan LumiCloud Sleep Mask di atas bantal CerviCloud, dengan tulisan Better Sleep Starts Here",
    },
    products: productStories.map((story) => ({
      ...story,
      price: getSourceProduct(story.slug).price,
      gallery: getSourceProduct(story.slug).images,
      actions: productActions(story.slug),
    })),
    hubActions,
    testimonials,
  };
}

export const bioConfig = createBioConfig(process.env.NEXT_PUBLIC_SHEEPIE_WHATSAPP_URL);
