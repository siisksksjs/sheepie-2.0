import type { Metadata } from "next";

import { BioPage } from "@/components/bio/bio-page";
import { bioConfig } from "@/data/bio";

const title = "Sheepie — Temukan Sistem Tidurmu";
const description =
  "Kenali tiga lapisan istirahat Sheepie: penyangga leher, kegelapan lembut, dan ruang yang lebih tenang.";
const canonical = "https://sheepiesleep.com/bio";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: canonical,
    title,
    description,
    siteName: "Sheepie",
    images: [
      {
        url: bioConfig.heroImage.src,
        alt: bioConfig.heroImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [bioConfig.heroImage.src],
  },
};

export default function Page() {
  return <BioPage config={bioConfig} />;
}
