import type { MetaEvent } from "./events";

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[][];
  push?: Fbq;
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

export const META_ENDPOINT = "/api/meta-events";

/** Meta's standard base code, written out so it is typed and runs once. */
export function initPixel(pixelId: string): void {
  if (typeof window === "undefined" || window.fbq) return;

  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue!.push(args);
  } as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  fbq("init", pixelId);
}

/** Browser pixel + server copy with the same event id. Never throws. */
export function sendMetaEvent(event: MetaEvent): void {
  try {
    window.fbq?.("track", event.event_name, event.custom_data, { eventID: event.event_id });
  } catch {
    // Blocked or broken pixel: the server copy below still counts.
  }

  try {
    const body = JSON.stringify({ ...event, event_source_url: window.location.href });
    const beaconed =
      typeof navigator !== "undefined" &&
      typeof navigator.sendBeacon === "function" &&
      navigator.sendBeacon(META_ENDPOINT, new Blob([body], { type: "application/json" }));
    if (!beaconed) {
      void fetch(META_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
    }
  } catch {
    // Tracking never interrupts the page.
  }
}
