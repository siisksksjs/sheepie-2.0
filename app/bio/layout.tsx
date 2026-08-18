import type { Metadata } from "next";
import { Playfair_Display, Quicksand } from "next/font/google";

import "../globals.css";

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
};

export default function BioLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body
        className={`${playfair.variable} ${quicksand.variable} bg-background font-body text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
