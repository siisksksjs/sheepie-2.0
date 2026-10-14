// lib/go/app-link.ts
/**
 * Opening the Shopee app from a link tapped inside Instagram/Facebook.
 *
 * Their in-app browsers load shopee.co.id as a signed-out web page. Android can
 * hand an https URL straight to the Shopee app with an intent: link. iOS in-app
 * browsers block that hand-off, so we bounce the visitor into Safari first
 * (x-safari-https://), where a cross-site redirect to shopee.co.id lets iOS
 * open the app through its universal link.
 */

export const SHOPEE_ANDROID_PACKAGE = "com.shopee.id";

export type Platform = "android" | "ios" | "other";

export function platformOf(userAgent: string | null): Platform {
  const ua = userAgent ?? "";
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  return "other";
}

/** Instagram, Facebook, Messenger, Threads, TikTok and LINE embedded browsers. */
export function isInAppBrowser(userAgent: string | null): boolean {
  return /instagram|FBAN|FBAV|FB_IAB|FBIOS|Messenger|Barcelona|musical_ly|BytedanceWebview|Line\//i.test(userAgent ?? "");
}

export function isShopeeUrl(href: string): boolean {
  try {
    const url = new URL(href);
    return url.protocol === "https:" && /(^|\.)shopee\.co\.id$/i.test(url.hostname);
  } catch {
    return false;
  }
}

/** Android intent that opens the URL in the Shopee app, or the web page if it isn't installed. */
export function androidIntent(href: string): string {
  const url = new URL(href);
  return (
    `intent://${url.host}${url.pathname}${url.search}` +
    `#Intent;scheme=https;package=${SHOPEE_ANDROID_PACKAGE};` +
    `S.browser_fallback_url=${encodeURIComponent(href)};end`
  );
}

/** Reopen an https URL in Safari from an iOS in-app browser (iOS 17+). */
export function safariUrl(href: string): string {
  const url = new URL(href);
  return `x-safari-${url.protocol === "http:" ? "http" : "https"}://${url.host}${url.pathname}${url.search}`;
}
