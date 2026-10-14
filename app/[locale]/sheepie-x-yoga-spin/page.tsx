import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { SpinWheel } from "./spin-wheel";

export const metadata: Metadata = {
  title: "Sheepie x Yoga Place | Putar & Menang",
  description: "Acara spesial Sheepie x Yoga Place.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function SheepieYogaSpinPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SpinWheel />;
}
