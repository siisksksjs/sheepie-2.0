import type { Metadata } from "next";
import { SpinWheel } from "./spin-wheel";

export const metadata: Metadata = {
  title: "Sheepie x Yoga Place | Putar & Menang",
  description: "Aktivasi khusus Sheepie x Yoga Place.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function SheepieYogaSpinPage() {
  return <SpinWheel />;
}
