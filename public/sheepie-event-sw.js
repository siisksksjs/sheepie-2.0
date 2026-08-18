// Offline support for the Sheepie x Yoga spin-wheel event.
//
// This worker is served from the origin root, so its scope is the whole site.
// It must therefore be extremely conservative about what it handles: anything it
// caches and replays would otherwise freeze that page for the visitor. Only the
// event page and immutable static assets are ever served from the cache, and
// nothing is cached opportunistically.
const CACHE_NAME = "sheepie-event-v4";

const EVENT_PATH = "/sheepie-x-yoga-spin";

/**
 * Whether a URL belongs to the offline event bundle.
 *
 * `/_next/static/` and `/images/event/` are content-addressed or event-specific,
 * so a cached copy can never be stale in a way that matters. Everything else —
 * every other page, API route, and image on the site — is left entirely alone.
 */
function isEventAsset(rawUrl, origin) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    return false;
  }
  if (url.origin !== origin) return false;

  return (
    url.pathname.includes(EVENT_PATH) ||
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/images/event/")
  );
}

function isEventPage(rawUrl, origin) {
  try {
    return new URL(rawUrl).origin === origin && new URL(rawUrl).pathname.includes(EVENT_PATH);
  } catch {
    return false;
  }
}

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("sheepie-event-") && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "CACHE_EVENT" || !Array.isArray(event.data.urls)) return;

  const urls = [...new Set(event.data.urls)].filter((url) =>
    isEventAsset(url, self.location.origin),
  );

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => Promise.allSettled(urls.map((url) => cache.add(url)))),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  // Not part of the event bundle: do not call respondWith at all, so the request
  // goes to the network exactly as if this worker were not installed.
  if (!isEventAsset(event.request.url, self.location.origin)) return;

  const request = event.request;

  // The event page itself is network-first, so a redeploy reaches the device;
  // the cache is the offline fallback rather than the default answer.
  if (isEventPage(request.url, self.location.origin)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached ?? Response.error())),
    );
    return;
  }

  // Immutable assets: serve the cached copy immediately, refresh in the background.
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(request).then((cached) => {
        const network = fetch(request).then((response) => {
          if (response.ok) cache.put(request, response.clone());
          return response;
        });

        if (!cached) return network;
        network.catch(() => undefined);
        return cached;
      }),
    ),
  );
});
