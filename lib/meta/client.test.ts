import { afterEach, describe, expect, it, vi } from "vitest";

import { pageView } from "./events";
import { META_ENDPOINT, sendMetaEvent } from "./client";

afterEach(() => vi.unstubAllGlobals());

function stubBrowser({ beacon = true, fbq }: { beacon?: boolean; fbq?: (...args: unknown[]) => void }) {
  const sendBeacon = vi.fn(() => beacon);
  const fetchMock = vi.fn(async () => new Response(null, { status: 202 }));
  vi.stubGlobal("window", { fbq, location: { href: "https://sheepiesleep.com/id" } });
  vi.stubGlobal("navigator", { sendBeacon });
  vi.stubGlobal("fetch", fetchMock);
  return { sendBeacon, fetchMock };
}

describe("sendMetaEvent", () => {
  it("tracks in the pixel and beacons the same event id to the server", async () => {
    const fbq = vi.fn();
    const { sendBeacon } = stubBrowser({ fbq });
    const event = pageView();

    sendMetaEvent(event);

    expect(fbq).toHaveBeenCalledWith("track", "PageView", {}, { eventID: event.event_id });
    expect(sendBeacon).toHaveBeenCalledOnce();
    const [endpoint, blob] = sendBeacon.mock.calls[0] as unknown as [string, Blob];
    expect(endpoint).toBe(META_ENDPOINT);
    const sent = JSON.parse(await blob.text());
    expect(sent.event_id).toBe(event.event_id);
    expect(sent.event_source_url).toBe("https://sheepiesleep.com/id");
  });

  it("falls back to a keepalive fetch when the beacon is refused", () => {
    const { fetchMock } = stubBrowser({ beacon: false, fbq: vi.fn() });

    sendMetaEvent(pageView());

    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(init.keepalive).toBe(true);
  });

  it("still reaches the server when the pixel is missing or throws", () => {
    const missing = stubBrowser({});
    sendMetaEvent(pageView());
    expect(missing.sendBeacon).toHaveBeenCalledOnce();

    const throwing = stubBrowser({ fbq: () => { throw new Error("blocked"); } });
    expect(() => sendMetaEvent(pageView())).not.toThrow();
    expect(throwing.sendBeacon).toHaveBeenCalledOnce();
  });
});
