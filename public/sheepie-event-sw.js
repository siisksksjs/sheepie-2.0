// The Sheepie x Yoga spin-wheel event has ended. Browsers that installed the old
// offline worker fetch this file on their next visit: it clears the event cache
// and unregisters itself so the site loads normally from then on.
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("sheepie-event-")).map((key) => caches.delete(key))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: "window" }))
      .then((clients) => clients.forEach((client) => client.navigate(client.url))),
  );
});
