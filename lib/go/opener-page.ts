// lib/go/opener-page.ts
import type { MetaEvent } from "@/lib/meta/events";

/**
 * A tiny standalone page (no React, no fonts) that records the Meta event and
 * immediately moves the visitor on to `openHref`. The buttons are the fallback
 * when the browser refuses to leave on its own.
 */
export function openerPageHtml(input: {
  openHref: string;
  webHref: string;
  event: MetaEvent | null;
}): string {
  const sameTarget = input.openHref === input.webHref;
  const attr = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const json = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

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
  body { margin: 0; min-height: 100svh; display: grid; place-items: center; padding: 24px 16px; background: #fffdf5; color: #1d2b44; font: 16px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; text-align: center; }
  main { width: 100%; max-width: 360px; }
  .logo { font: 700 28px/1 Georgia, "Times New Roman", serif; letter-spacing: -0.01em; margin: 0 0 28px; }
  p { margin: 0 0 24px; color: #4a5568; }
  a { display: flex; align-items: center; justify-content: center; min-height: 52px; border-radius: 999px; text-decoration: none; font-weight: 600; }
  .primary { background: #1d2b44; color: #fffdf5; margin-bottom: 12px; }
  .secondary { color: #1d2b44; border: 1px solid #d9d2c3; }
</style>
</head>
<body>
<main>
  <div class="logo">Sheepie.</div>
  <p>Membuka Shopee…</p>
  <a class="primary" href="${attr(input.openHref)}">Buka di aplikasi Shopee</a>
  ${sameTarget ? "" : `<a class="secondary" href="${attr(input.webHref)}">Lanjut di browser</a>`}
</main>
<script>
(function () {
  var event = ${json(input.event)};
  var openHref = ${json(input.openHref)};
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
  location.replace(openHref);
})();
</script>
</body>
</html>`;
}
