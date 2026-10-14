// lib/go/opener-page.ts
import type { MetaEvent } from "@/lib/meta/events";

export type OpenerProduct = {
  name: string;
  headline: string;
  price: string;
  imageSrc: string;
  rating?: number;
};

/**
 * A tiny standalone page (no React) that records the Meta event and sends the
 * visitor to Shopee.
 *
 * - "auto" (Android): moves on to `openHref` straight away; the buttons are only
 *   a fallback when the browser refuses to leave on its own.
 * - "tap" (iPhone): no redirect. iOS opens the Shopee app only from a real tap
 *   on the Shopee link, so the page shows the product, styled like /bio, with
 *   one big button.
 */
export function openerPageHtml(input: {
  mode: "auto" | "tap";
  openHref: string;
  webHref: string;
  event: MetaEvent | null;
  product?: OpenerProduct | null;
}): string {
  return input.mode === "tap" ? tapPage(input) : autoPage(input);
}

const attr = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const json = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");
const optimized = (src: string, width: number) => `/_next/image?url=${encodeURIComponent(src)}&amp;w=${width}&amp;q=75`;

function autoPage(input: { openHref: string; webHref: string; event: MetaEvent | null }): string {
  const showWebLink = input.openHref !== input.webHref;
  return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Membuka Shopee… | Sheepie.</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { margin: 0; min-height: 100svh; display: grid; place-items: center; padding: 24px 16px; background: #fffdf5; color: #213368; font: 16px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; text-align: center; }
  main { width: 100%; max-width: 360px; }
  .logo { font: 700 26px/1 Georgia, "Times New Roman", serif; letter-spacing: -0.01em; margin: 0 0 24px; }
  p { margin: 0 0 20px; color: #4b5878; }
  a { display: flex; align-items: center; justify-content: center; min-height: 52px; border-radius: 999px; text-decoration: none; font-weight: 600; }
  .primary { background: #213368; color: #fff; margin-bottom: 12px; }
  .secondary { color: #213368; border: 1px solid #d9d2c3; }
</style>
</head>
<body>
<main>
  <div class="logo">Sheepie.</div>
  <p>Membuka aplikasi Shopee…</p>
  <a class="primary" href="${attr(input.openHref)}">Buka di aplikasi Shopee</a>
  ${showWebLink ? `<a class="secondary" href="${attr(input.webHref)}">Lanjut di browser</a>` : ""}
</main>
${trackingScript(input.event, input.openHref)}
</body>
</html>`;
}

function tapPage(input: { openHref: string; event: MetaEvent | null; product?: OpenerProduct | null }): string {
  const product = input.product ?? null;
  const rating = product?.rating
    ? `<p class="rating"><span class="stars" aria-hidden="true">★★★★★</span>${product.rating.toFixed(1).replace(".0", "")}/5</p>`
    : "";

  const card = product
    ? `<article class="card">
    <div class="photo"><img src="${optimized(product.imageSrc, 640)}" alt="${attr(product.name)}" width="640" height="640" fetchpriority="high"></div>
    <div class="info">
      <h1 class="name">${attr(product.name)}</h1>
      ${rating}
      <p class="line">${attr(product.headline)}</p>
      <p class="price">${attr(product.price)}</p>
    </div>
  </article>`
    : `<h1 class="title">Toko resmi Sheepie di Shopee</h1>`;

  return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#fffdf5">
<title>${attr(product?.name ?? "Sheepie")} | Buka di Shopee</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Quicksand:wght@500;600;700&display=swap" rel="stylesheet">
<style>
  :root { color-scheme: light; --navy: #213368; --ice: #eaf2f8; --cream: #fffdf5; --muted: #4b5878; --rule: #a8bdd8; --border: rgba(33, 51, 104, 0.12); }
  * { box-sizing: border-box; margin: 0; }
  body { min-height: 100svh; background: var(--cream); color: var(--navy); font: 500 16px/1.5 Quicksand, system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
  main { width: 100%; max-width: 420px; margin: 0 auto; padding: 20px 16px calc(120px + env(safe-area-inset-bottom)); display: flex; flex-direction: column; gap: 18px; }
  .brand { display: flex; justify-content: center; }
  .brand img { width: 74px; height: auto; }
  .card { border: 1px solid var(--border); border-radius: 18px; overflow: hidden; background: #fff; }
  .photo { aspect-ratio: 1; background: var(--ice); }
  .photo img { display: block; width: 100%; height: 100%; object-fit: cover; }
  .info { padding: 16px 18px 18px; }
  .name, .title { font: 600 1.45rem/1.2 "Playfair Display", Georgia, serif; letter-spacing: -0.02em; }
  .title { text-align: center; padding: 24px 0 4px; }
  .rating { display: flex; align-items: center; gap: 6px; margin-top: 6px; font-size: 0.82rem; font-weight: 600; color: var(--muted); font-variant-numeric: tabular-nums; }
  .stars { color: #f5a524; letter-spacing: 0.04em; }
  .line { margin-top: 8px; font-size: 0.95rem; color: var(--muted); }
  .price { margin-top: 10px; font-size: 1.15rem; font-weight: 700; font-variant-numeric: tabular-nums; }
  .dock { position: fixed; inset: auto 0 0; padding: 14px 16px calc(14px + env(safe-area-inset-bottom)); background: linear-gradient(to top, var(--cream) 72%, rgba(255, 253, 245, 0)); }
  .dock > * { max-width: 388px; margin-inline: auto; }
  .dock .note { margin-top: 8px; }
  .cta { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 56px; border-radius: 999px; background: var(--navy); color: #fff; font-size: 1.02rem; font-weight: 700; letter-spacing: 0.01em; text-decoration: none; -webkit-tap-highlight-color: transparent; transition: transform 0.12s ease; }
  .cta:active { transform: scale(0.98); }
  .cta img { width: 28px; height: 28px; padding: 3px; border-radius: 8px; background: #fff; object-fit: contain; }
  .note { text-align: center; font-size: 0.8rem; color: var(--muted); }
  .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 14px 0 0; border-top: 1px solid var(--border); list-style: none; text-align: center; }
  .stats b { display: block; font-size: 0.9rem; }
  .stats span { font-size: 0.66rem; color: var(--muted); }
</style>
</head>
<body>
<main>
  <div class="brand"><img src="${optimized("/images/bio/sheepie-logo.webp", 256)}" alt="Sheepie" width="148" height="110"></div>
  ${card}
  <ul class="stats">
    <li><b>4.9/5</b><span>dari 1000+ ulasan</span></li>
    <li><b>1000+</b><span>happy sleepers</span></li>
    <li><b>Proudly</b><span>Indonesian Brand</span></li>
  </ul>
</main>
<div class="dock">
  <a class="cta" href="${attr(input.openHref)}"><img src="/images/bio/shopee-logo.webp" alt="" width="28" height="28">Buka di aplikasi Shopee</a>
  <p class="note">Checkout di aplikasi Shopee: sudah login, voucher &amp; koin siap dipakai.</p>
</div>
${trackingScript(input.event, null)}
</body>
</html>`;
}

/** Sends the Meta event through /api/meta-events, then optionally moves on. Never throws. */
function trackingScript(event: MetaEvent | null, openHref: string | null): string {
  return `<script>
(function () {
  var event = ${json(event)};
  var openHref = ${json(openHref)};
  try {
    if (event) {
      var now = Date.now();
      var jar = document.cookie;
      var maxAge = "; Max-Age=7776000; Path=/; SameSite=Lax";
      if (!/(^|; )_fbp=/.test(jar)) {
        document.cookie = "_fbp=fb.1." + now + "." + Math.floor(Math.random() * 1e10) + maxAge;
      }
      var fbclid = new URLSearchParams(location.search).get("fbclid");
      if (fbclid && /^[\\w-]+$/.test(fbclid)) {
        document.cookie = "_fbc=fb.1." + now + "." + fbclid + maxAge;
      }
      event.event_source_url = location.href;
      var body = JSON.stringify(event);
      var sent = navigator.sendBeacon && navigator.sendBeacon("/api/meta-events", new Blob([body], { type: "application/json" }));
      if (!sent) fetch("/api/meta-events", { method: "POST", headers: { "Content-Type": "application/json" }, body: body, keepalive: true }).catch(function () {});
    }
  } catch (e) {}
  if (openHref) location.replace(openHref);
})();
</script>`;
}
