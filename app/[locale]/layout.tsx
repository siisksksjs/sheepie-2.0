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
import { WhatsAppButton } from "@/components/site/whatsapp-button";

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

// Fallback for pages without their own metadata (e.g. the 404); every page sets its own title, canonical and preview.
export const metadata: Metadata = {
  metadataBase: new URL("https://sheepiesleep.com"),
  title: "Sheepie | Ergonomic Pillow, Sleep Mask & Earplugs",
  description: "Sheepie: ergonomic CerviCloud pillows, LumiCloud blackout sleep masks and CalmiCloud earplugs for calmer nights in Indonesia.",
  openGraph: { type: "website", siteName: "Sheepie", images: [{ url: "/og/sheepie.jpg", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", images: ["/og/sheepie.jpg"] },
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
            <WhatsAppButton locale={locale} />
            <UmamiAnalytics />
            <Analytics />
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
