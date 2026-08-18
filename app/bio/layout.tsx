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
        className={`${playfair.variable} ${quicksand.variable} font-body text-foreground antialiased`}
        // Set here as well as on the page so overscroll and short viewports
        // never reveal a white band behind the cream.
        style={{ backgroundColor: "#fffdf5" }}
      >
        {children}
      </body>
    </html>
  );
}
