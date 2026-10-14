import Script from "next/script";

/** GA4 property for sheepiesleep.com; NEXT_PUBLIC_GA_ID overrides it. */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID?.trim() || "G-EZW7PYLJP3";

/**
 * Google Analytics 4. Loads after the page is interactive so it never delays first paint.
 * Only live production builds report: local dev and Vercel preview deploys stay out of the numbers.
 * Page views on client-side navigation come from GA4's enhanced measurement (history changes).
 */
export function GoogleAnalytics() {
  const isLive = process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_VERCEL_ENV !== "preview";
  if (!isLive || !GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
