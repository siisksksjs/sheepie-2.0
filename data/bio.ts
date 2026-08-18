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

export type BioConfig = {
  heroImage: {
    src: string;
    alt: string;
  };
  products: BioProduct[];
  hubActions: BioAction[];
};

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
      id: "bio-hub-website",
      label: "Kunjungi website",
      href: "https://sheepiesleep.com/id",
      destination: "website",
      accessibleLabel: "Kunjungi website Sheepie (buka tab baru)",
    },
    {
      id: "bio-hub-shopee",
      label: "Toko Resmi Shopee",
      href: "https://shopee.co.id/sheepie.sleep",
      destination: "shopee",
      accessibleLabel: "Kunjungi toko resmi Sheepie di Shopee (buka tab baru)",
    },
    {
      id: "bio-hub-tokopedia",
      label: "Tokopedia Sheepie",
      href: "https://www.tokopedia.com/sheepie",
      destination: "tokopedia",
      accessibleLabel: "Kunjungi toko Sheepie di Tokopedia (buka tab baru)",
    },
    {
      id: "bio-hub-instagram",
      label: "Instagram",
      href: siteSource.socials.instagram,
      destination: "instagram",
      accessibleLabel: "Ikuti Sheepie di Instagram (buka tab baru)",
    },
    {
      id: "bio-hub-tiktok",
      label: "TikTok",
      href: siteSource.socials.tiktok,
      destination: "tiktok",
      accessibleLabel: "Ikuti Sheepie di TikTok (buka tab baru)",
    },
  ];

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
    products: productStories.map((story) => ({
      ...story,
      price: getSourceProduct(story.slug).price,
      actions: productActions(story.slug),
    })),
    hubActions,
  };
}

export const bioConfig = createBioConfig(process.env.NEXT_PUBLIC_SHEEPIE_WHATSAPP_URL);
