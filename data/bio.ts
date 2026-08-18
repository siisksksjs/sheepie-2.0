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
  actions: [BioAction, BioAction];
};

export type BioTestimonial = {
  id: string;
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
 * Real five-star reviews from Shopee and Tokopedia, transcribed so they are
 * legible on a phone. The original screenshot is linked from each card as proof;
 * rendering those screenshots inline puts their text at roughly 5px on mobile.
 * Ordered so all three products appear early.
 */
const testimonials: BioTestimonial[] = [
  {
    id: "cervicloud-tokopedia-1",
    author: "s***i",
    marketplace: "tokopedia",
    quote:
      "Udah beli 2 kali disini. Sama-sama tidur miring, suka banget sama desain ergonomiknya, cerdas! Ada bagian khusus buat tangan pas tidur miring, gak kerasa kesemutan lagi.",
    screenshot: { src: "/images/bio/testimonials/cervicloud-tokopedia-1.png", width: 609, height: 225 },
  },
  {
    id: "lumicloud-shopee-1",
    author: "indoshop_lokal",
    marketplace: "shopee",
    quote:
      "Ringan dan enak. Strap nya kenceng dan ga nyangkut di rambut. Seller respon cepet, kirim juga sat set. Mantep poll",
    screenshot: { src: "/images/bio/testimonials/lumicloud-shopee-1.png", width: 957, height: 313 },
  },
  {
    id: "calmicloud-shopee-1",
    author: "saalsabilaadinda",
    marketplace: "shopee",
    quote:
      "Aku tipe orang light sleeper, ada suara dikit kebangun dan susah buat balik tidur lagi. Tapi pertama kali pake ini aku malemnya tidur 12 jam. Ini 100% ngeblock suara, cukup banget bahkan buat aku yang sensitif.",
    screenshot: { src: "/images/bio/testimonials/calmicloud-shopee-1.png", width: 952, height: 423 },
  },
  {
    id: "cervicloud-tokopedia-2",
    author: "Jiwon",
    marketplace: "tokopedia",
    quote:
      "Pertama kali pakai rasanya beda banget, tapi adminnya sempat bilang memang perlu waktu untuk adaptasi. Memory foam nya mantap banget, real ngesupport. Sekarang malah gak bisa tidur pake bantal lain.",
    screenshot: { src: "/images/bio/testimonials/cervicloud-tokopedia-2.png", width: 608, height: 197 },
  },
  {
    id: "lumicloud-tokopedia-1",
    author: "Q***d",
    marketplace: "tokopedia",
    quote:
      "Bahannya alus banget, katun halus gitu enak dipake, gak panas, dan full blackout. Tidur siang jadi pulesss. Strap nya juga high quality, gak nyangkut di rambut.",
    screenshot: { src: "/images/bio/testimonials/lumicloud-tokopedia-1.png", width: 611, height: 229 },
  },
  {
    id: "calmicloud-shopee-2",
    author: "bluenavy89",
    marketplace: "shopee",
    quote:
      "Sesuai judulnya, Moldable jadi bisa ditempel langsung di sekitar lubang telinga sesuai bentuk yang kamu inginkan. Sangat bantu untuk redam suara dari luar.",
    screenshot: { src: "/images/bio/testimonials/calmicloud-shopee-2.png", width: 959, height: 310 },
  },
  {
    id: "cervicloud-tokopedia-3",
    author: "H***y",
    marketplace: "tokopedia",
    quote:
      "Awalnya agak aneh karena bentuknya beda dari bantal biasa, tapi setelah 2 minggu mulai kerasa bedanya. Leher jadi gak gampang pegal, dan bangun tidur gak kaku lagi.",
    screenshot: { src: "/images/bio/testimonials/cervicloud-tokopedia-3.png", width: 596, height: 205 },
  },
  {
    id: "lumicloud-shopee-2",
    author: "c*****9",
    marketplace: "shopee",
    quote:
      "Aku udah coba pake dan beneran halus dan gak ngerusak bulu mata palsuku! Tidur juga jadi makin pules soalnya aku gampang kebangun tengah malem.",
    screenshot: { src: "/images/bio/testimonials/lumicloud-shopee-2.png", width: 955, height: 227 },
  },
  {
    id: "calmicloud-shopee-3",
    author: "bennettonlin",
    marketplace: "shopee",
    quote:
      "Barang sesuai, pengiriman cepat. Kosan berisik, pake ini jadi lebih kebantu buat tidur. Rekomended",
    screenshot: { src: "/images/bio/testimonials/calmicloud-shopee-3.png", width: 967, height: 238 },
  },
  {
    id: "cervicloud-tokopedia-4",
    author: "Lie",
    marketplace: "tokopedia",
    quote:
      "Unik banget bentuknya, ada cekungan buat kepala dan space buat tidur miring. Ergonomisnya berasa, posisi badan jadi jauh lebih stabil waktu tidur.",
    screenshot: { src: "/images/bio/testimonials/cervicloud-tokopedia-4.png", width: 609, height: 195 },
  },
  {
    id: "lumicloud-tokopedia-2",
    author: "U***q",
    marketplace: "tokopedia",
    quote:
      "Soft puffy gitu eye mask nya, lucu ada logo sheep nya. Enak buat jalan-jalan travel, dapet pouch nya pula. Tempelannya halus, gak nyangkut di rambut.",
    screenshot: { src: "/images/bio/testimonials/lumicloud-tokopedia-2.png", width: 615, height: 258 },
  },
  {
    id: "lumicloud-shopee-3",
    author: "steve969",
    marketplace: "shopee",
    quote:
      "Bahan berkualitas, lembut, cahaya tidak tembus. Bahan lembut tidak buat sakit atau pegal bagian belakang kepala. Sangat recomended",
    screenshot: { src: "/images/bio/testimonials/lumicloud-shopee-3.png", width: 951, height: 310 },
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

function productActions(slug: ProductSlug): [BioAction, BioAction] {
  const product = getSourceProduct(slug);
  const name = product.name.replace(/ (Pillow|Eye Mask|Earplugs)$/, "");

  return [
    {
      id: `bio-${slug}-shopee`,
      label: "Beli di Shopee",
      href: product.shopeeUrl,
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

const productStories: Array<Omit<BioProduct, "price" | "actions">> = [
  {
    id: "bio-product-alignment",
    slug: "cervicloud",
    name: "CerviCloud",
    eyebrow: "Penyelarasan",
    headline: "Leher lebih ditopang, pagi terasa lebih ringan.",
    description:
      "Kontur ergonomis 4D memeluk leher dan membantu menjaga posisi tidur alami, dengan permukaan Ice-Silk yang terasa sejuk.",
    image: {
      src: "/images/edited/DSC01139.JPG",
      alt: "Bantal ergonomis CerviCloud berwarna putih dengan kontur penyangga leher",
    },
  },
  {
    id: "bio-product-darkness",
    slug: "lumicloud",
    name: "LumiCloud",
    eyebrow: "Kegelapan",
    headline: "Redupkan dunia tanpa menekan mata.",
    description:
      "Ruang mata 3D dan kain katun lembut menciptakan gelap menyeluruh dengan rasa ringan, sejuk, dan nyaman.",
    image: {
      src: "/images/edited/DSC01058.JPG",
      alt: "Masker tidur LumiCloud biru muda dengan ruang mata tiga dimensi",
    },
  },
  {
    id: "bio-product-silence",
    slug: "calmicloud",
    name: "CalmiCloud",
    eyebrow: "Keheningan",
    headline: "Bentuk ruang tenangmu sendiri.",
    description:
      "Silikon kelas medis yang dapat dibentuk menutup bagian luar telinga dengan nyaman untuk membantu meredam suara sekitar.",
    image: {
      src: "/images/edited/DSC01313.JPG",
      alt: "Earplug silikon CalmiCloud dalam wadah penyimpanan transparan",
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
      label: "TikTok",
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

  hubActions.push({
    id: "bio-hub-email",
    label: "Email",
    href: `mailto:${SHEEPIE_EMAIL}`,
    destination: "email",
    accessibleLabel: `Kirim email ke Sheepie di ${SHEEPIE_EMAIL}`,
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
      src: "/images/bio/sheepie-banner.png",
      alt: "Tiga produk Sheepie berjajar: LumiCloud Sleep Mask, CerviCloud Ergonomic Pillow, dan CalmiCloud Moldable Earplug, dengan tulisan Better Sleep Starts Here",
    },
    products: productStories.map((story) => ({
      ...story,
      price: getSourceProduct(story.slug).price,
      actions: productActions(story.slug),
    })),
    hubActions,
    testimonials,
  };
}

export const bioConfig = createBioConfig(process.env.NEXT_PUBLIC_SHEEPIE_WHATSAPP_URL);
