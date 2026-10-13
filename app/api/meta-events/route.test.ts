// app/api/meta-events/route.test.ts
import { afterEach, describe, expect, it, vi } from "vitest";

import { viewContent } from "@/lib/meta/events";
import { POST } from "./route";

function post(body: string, headers: Record<string, string> = {}) {
  return new Request("https://sheepiesleep.com/api/meta-events", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body,
  });
}

const event = () => ({ ...viewContent({ slug: "cervicloud", optionKey: "pillow", value: 838000 }), event_source_url: "https://sheepiesleep.com/id/products/cervicloud" });

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("POST /api/meta-events", () => {
  it("forwards a valid event to the Conversions API with the same event_id", async () => {
    vi.stubEnv("META_PIXEL_ID", "123456");
    vi.stubEnv("META_CAPI_TOKEN", "secret-token");
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const body = event();
    const response = await POST(
      post(JSON.stringify(body), {
        "user-agent": "Mozilla/5.0 test",
        "x-forwarded-for": "203.0.113.9, 10.0.0.1",
        cookie: "_fbp=fb.1.1700000000.111; _fbc=fb.1.1700000000.abc",
      }),
    );

    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ ok: true, forwarded: true });
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://graph.facebook.com/v23.0/123456/events?access_token=secret-token");
    const sent = JSON.parse(String(init.body));
    expect(sent.data[0]).toMatchObject({
      event_name: "ViewContent",
      event_id: body.event_id,
      action_source: "website",
      event_source_url: body.event_source_url,
      user_data: {
        client_user_agent: "Mozilla/5.0 test",
        client_ip_address: "203.0.113.9",
        fbp: "fb.1.1700000000.111",
        fbc: "fb.1.1700000000.abc",
      },
      custom_data: body.custom_data,
    });
  });

  it("adds the test event code when one is configured", async () => {
    vi.stubEnv("META_PIXEL_ID", "123456");
    vi.stubEnv("META_CAPI_TOKEN", "secret-token");
    vi.stubEnv("META_TEST_EVENT_CODE", "TEST123");
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await POST(post(JSON.stringify(event())));

    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(JSON.parse(String(init.body)).test_event_code).toBe("TEST123");
  });

  it("accepts but does not forward when Meta is not configured", async () => {
    vi.stubEnv("META_PIXEL_ID", "");
    vi.stubEnv("META_CAPI_TOKEN", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(post(JSON.stringify(event())));

    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ ok: true, forwarded: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("still answers 202 when Meta is down", async () => {
    vi.stubEnv("META_PIXEL_ID", "123456");
    vi.stubEnv("META_CAPI_TOKEN", "secret-token");
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("network down"); }));

    const response = await POST(post(JSON.stringify(event())));

    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ ok: true, forwarded: false });
  });

  it.each([
    ["not JSON", "{oops"],
    ["unknown event", JSON.stringify({ event_name: "Purchase", event_id: "abcdefgh12", custom_data: {} })],
    ["oversized body", JSON.stringify({ ...event(), event_source_url: `https://sheepiesleep.com/${"a".repeat(5000)}` })],
  ])("rejects %s without forwarding", async (_label, body) => {
    vi.stubEnv("META_PIXEL_ID", "123456");
    vi.stubEnv("META_CAPI_TOKEN", "secret-token");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(post(body));

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
