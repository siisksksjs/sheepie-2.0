import type { Metadata } from "next";
import { Playfair_Display, Quicksand } from "next/font/google";
import "../globals.css";
import { Analytics } from "@vercel/analytics/react";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isLocale, locales } from "@/i18n/config";
import { UmamiAnalytics } from "@/components/analytics/umami-analytics";
import { MotionProvider } from "@/components/providers/motion-provider";
import { CookieNotice } from "@/components/site/cookie-notice";
import { MetaPixel } from "@/components/site/meta-pixel";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"],
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sheepiesleep.com"),
  title: "Sheepie. | Premium Sleep Essentials for Deep Rest",
  description: "Sheepie: ergonomic CerviCloud pillows, LumiCloud blackout eye masks and CalmiCloud earplugs for calmer nights in Indonesia.",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://sheepiesleep.com",
    title: "Sheepie | Premium Sleep Essentials",
    description: "Experience the cloud-like comfort of Sheepie.",
    siteName: "Sheepie",
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Ensure valid locale
  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.js='1'" }} />
      </head>
      <body className={`${playfair.variable} ${quicksand.variable} antialiased bg-background text-foreground font-body`}>
        <NextIntlClientProvider messages={messages}>
          <MotionProvider>
            {children}
            <MetaPixel pixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID} />
            <CookieNotice locale={locale} />
            <UmamiAnalytics />
            <Analytics />
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
