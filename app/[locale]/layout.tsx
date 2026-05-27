import type { Metadata } from "next";
import { Playfair_Display, Quicksand } from "next/font/google";
import "../globals.css";
import { ReactLenis } from "@/lib/lenis"; 
import { BackgroundClouds } from "@/components/ui/background-clouds";
import { Analytics } from "@vercel/analytics/react";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { LanguageModal } from "@/components/layout/language-modal";
import { UmamiAnalytics } from "@/components/analytics/umami-analytics";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sheepiesleep.com"),
  title: "Sheepie. | Premium Sleep Essentials for Deep Rest",
  description: "Transform your night with Sheepie. Discover ergonomic pillows, 100% blackout masks, and moldable earplugs engineered for deep, restorative sleep.",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://sheepie.co.id",
    title: "Sheepie | Premium Sleep Essentials",
    description: "Experience the cloud-like comfort of Sheepie.",
    siteName: "Sheepie",
  },
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Ensure valid locale
  if (!['en', 'id'].includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${playfair.variable} ${quicksand.variable} antialiased bg-background text-foreground font-body`}
      >
        <NextIntlClientProvider messages={messages}>
          <ReactLenis root>
            <BackgroundClouds />
            <LanguageModal />
            {children}
            <UmamiAnalytics />
            <Analytics />
          </ReactLenis>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
