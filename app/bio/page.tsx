import type { Metadata } from "next";

import { BioPage } from "@/components/bio/bio-page";
import { bioConfig } from "@/data/bio";

const title = "Sheepie — Temukan Sistem Tidurmu";
const description =
  "Kenali tiga lapis istirahat Sheepie: topangan leher, gelap yang lembut, dan suasana yang lebih tenang.";
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
        // 1200×630 JPG preview; link-preview crawlers read JPG most reliably.
        url: "/og/bio.jpg",
        width: 1200,
        height: 630,
        alt: bioConfig.heroImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og/bio.jpg"],
  },
};

export default function Page() {
  return <BioPage config={bioConfig} />;
}
