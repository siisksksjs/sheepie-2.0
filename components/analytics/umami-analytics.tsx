"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, data?: Record<string, string | number | boolean | null>) => void;
    };
  }
}

const UMAMI_SCRIPT_URL = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ?? "https://cloud.umami.is/script.js";
const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

const getMarketplace = (url: URL) => {
  if (url.hostname.includes("shopee")) return "shopee";
  if (url.hostname.includes("tokopedia")) return "tokopedia";
  return null;
};

const getPageContext = () => {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const locale = parts[0] ?? "unknown";
  const section = parts[1] ?? "home";
  const slug = parts[2] ?? "home";

  return {
    locale,
    section,
    slug,
    page_path: window.location.pathname,
  };
};

export function UmamiAnalytics() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const link = target?.closest("a[href]");

      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;

      let url: URL;
      try {
        url = new URL(href, window.location.origin);
      } catch {
        return;
      }

      const marketplace = getMarketplace(url);
      if (!marketplace) return;

      const context = getPageContext();
      const eventName = context.section === "blog" ? `blog_${marketplace}_click` : "marketplace_click";

      window.umami?.track(eventName, {
        ...context,
        marketplace,
        destination: url.hostname,
        cta_text: link.textContent?.trim().slice(0, 120) || null,
        product: link.getAttribute("data-product") ?? context.slug,
        cta_position: link.getAttribute("data-cta-position") ?? "inline",
      });
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  if (!UMAMI_WEBSITE_ID) return null;

  return (
    <Script
      src={UMAMI_SCRIPT_URL}
      data-website-id={UMAMI_WEBSITE_ID}
      strategy="afterInteractive"
    />
  );
}
