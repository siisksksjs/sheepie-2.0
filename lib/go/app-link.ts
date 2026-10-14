// lib/go/app-link.ts
/**
 * Opening the Shopee app from a link tapped inside Instagram/Facebook.
 *
 * Their in-app browsers load shopee.co.id as a signed-out web page when the
 * page navigates there by itself. Android can hand the URL straight to the
 * Shopee app with an intent: link. iOS has no equivalent from an in-app
 * browser, so it is sent straight to the Shopee link.
 */

export const SHOPEE_ANDROID_PACKAGE = "com.shopee.id";

export type Platform = "android" | "ios" | "other";

export function platformOf(userAgent: string | null): Platform {
  const ua = userAgent ?? "";
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  return "other";
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
