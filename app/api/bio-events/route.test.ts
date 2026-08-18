import { createHmac } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { createPostHandler } from "./route";
import {
  BioEventRateLimitError,
  BioEventStorageError,
  createDailyRateKey,
} from "@/lib/bio-analytics/server";

const NOW = new Date("2026-08-17T12:34:56.000Z");
const SECRET = "a-test-secret-that-is-at-least-32-characters-long";

const validEvent = {
  event_id: "11111111-1111-4111-8111-111111111111",
  occurred_at: "2026-01-17T12:30:00.000Z",
  schema_version: 1,
  event_name: "bio_page_view",
  visitor_id: "22222222-2222-4222-8222-222222222222",
  session_id: "33333333-3333-4333-8333-333333333333",
  sequence_no: 1,
  section_id: null,
  product_slug: null,
  cta_id: null,
  cta_position: null,
  destination: null,
  landing_path: "/bio",
  referrer_category: "instagram",
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  utm_content: null,
  utm_term: null,
  elapsed_ms: 100,
  is_returning: false,
  screen_category: "mobile",
  language: "id-ID",
  timezone: "Asia/Jakarta",
  scroll_depth: null,
} as const;

function request(
  body: unknown = validEvent,
  options: { headers?: HeadersInit; url?: string; rawBody?: BodyInit; signal?: AbortSignal } = {},
) {
  return new Request(options.url ?? "https://sheepiesleep.com/api/bio-events", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8", ...options.headers },
    body: options.rawBody ?? JSON.stringify(body),
    signal: options.signal,
  });
}

function streamRequest(body: ReadableStream<Uint8Array>, signal?: AbortSignal): Request {
  return new Request("https://sheepiesleep.com/api/bio-events", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    signal,
    duplex: "half",
  } as RequestInit & { duplex: "half" });
}

function sizedJsonBody(size: number, withBom = false): ArrayBuffer {
  const json = new TextEncoder().encode(JSON.stringify(validEvent));
  const bom = withBom ? Uint8Array.from([0xef, 0xbb, 0xbf]) : new Uint8Array();
  if (bom.byteLength + json.byteLength > size) throw new Error("Requested body is too small");
  const body = new Uint8Array(size);
  body.set(bom);
  body.set(json, bom.byteLength);
  body.fill(0x20, bom.byteLength + json.byteLength);
  return body.buffer;
}

function setup(overrides: Partial<Parameters<typeof createPostHandler>[0]> = {}) {
  const defaultIngest = vi.fn().mockResolvedValue("inserted" as const);
  const rateKey = vi.fn((ip: string, day: string) =>
    createHmac("sha256", SECRET).update(`${day}:${ip}`).digest("hex"),
  );
  const dependencies = {
    ingest: defaultIngest,
    rateKey,
    now: () => NOW,
    allowedOrigins: () =>
      "https://sheepiesleep.com, https://www.sheepiesleep.com, javascript:ignored, not-a-url",
    isVercel: () => true,
    trustProxyHeaders: () => true,
    ...overrides,
  };
  const handler = createPostHandler(dependencies);
  return { handler, ingest: dependencies.ingest, rateKey };
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/bio-events", () => {
  it.each(["inserted", "duplicate"] as const)("accepts a valid %s event", async (result) => {
    const { handler, ingest } = setup({ ingest: vi.fn().mockResolvedValue(result) });
    const response = await handler(
      request(validEvent, { headers: { "x-vercel-forwarded-for": " 203.0.113.5 , 10.0.0.1" } }),
    );

    expect(response.status).toBe(202);
    expect(response.headers.get("cache-control")).toBe("no-store");
    await expect(response.json()).resolves.toEqual({ accepted: true });
    expect(ingest).toHaveBeenCalledOnce();
    expect(ingest).toHaveBeenCalledWith(
      validEvent,
      createHmac("sha256", SECRET).update("2026-08-17:203.0.113.5").digest("hex"),
      expect.any(AbortSignal),
    );
  });

  it("passes canonical lowercase UUIDs to storage for uppercase valid input", async () => {
    const { handler, ingest } = setup();
    const lowercaseIds = {
      event_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      visitor_id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      session_id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    };
    const uppercaseEvent = {
      ...validEvent,
      event_id: lowercaseIds.event_id.toUpperCase(),
      visitor_id: lowercaseIds.visitor_id.toUpperCase(),
      session_id: lowercaseIds.session_id.toUpperCase(),
      utm_source: "KeepCASE",
    };

    const response = await handler(request(uppercaseEvent));

    expect(response.status).toBe(202);
    expect(ingest).toHaveBeenCalledWith(
      { ...validEvent, ...lowercaseIds, utm_source: "KeepCASE" },
      expect.any(String),
      expect.any(AbortSignal),
    );
  });

  it("rejects unsupported and cross-field-invalid events", async () => {
    const { handler, ingest } = setup();
    const unsupported = await handler(request({ ...validEvent, event_name: "purchase" }));
    const crossField = await handler(
      request({ ...validEvent, event_name: "bio_page_view", section_id: "products" }),
    );

    expect(unsupported.status).toBe(400);
    expect(crossField.status).toBe(400);
    expect(await unsupported.json()).toMatchObject({ accepted: false, code: "invalid_event" });
    expect(ingest).not.toHaveBeenCalled();
  });

  it("accepts database text boundaries and rejects overflow before storage", async () => {
    const { handler, ingest } = setup();
    expect((await handler(request({ ...validEvent, utm_source: "x".repeat(200) }))).status).toBe(
      202,
    );
    expect((await handler(request({ ...validEvent, utm_source: "x".repeat(201) }))).status).toBe(
      400,
    );
    expect(ingest).toHaveBeenCalledOnce();
  });

  it("enforces exact same and configured origins", async () => {
    const { handler, ingest } = setup();

    expect((await handler(request(validEvent))).status).toBe(202);
    expect(
      (await handler(request(validEvent, { headers: { origin: "https://sheepiesleep.com" } }))).status,
    ).toBe(202);
    expect(
      (
        await handler(
          request(validEvent, {
            url: "https://preview.example/api/bio-events",
            headers: { origin: "https://www.sheepiesleep.com" },
          }),
        )
      ).status,
    ).toBe(202);
    expect(
      (await handler(request(validEvent, { headers: { origin: "https://evil.example" } }))).status,
    ).toBe(403);
    expect(
      (
        await handler(
          request(validEvent, { headers: { origin: "https://sheepiesleep.com.evil.example" } }),
        )
      ).status,
    ).toBe(403);

    const invalidConfigured = setup({ allowedOrigins: () => "https://evil.example/path" });
    expect(
      (
        await invalidConfigured.handler(
          request(validEvent, { headers: { origin: "https://evil.example" } }),
        )
      ).status,
    ).toBe(403);
    expect(ingest).toHaveBeenCalledTimes(3);
  });

  it("enforces declared and actual raw UTF-8 byte limits before decoding", async () => {
    const { handler, ingest } = setup();
    expect(
      (await handler(request(validEvent, { headers: { "content-type": "text/plain" } }))).status,
    ).toBe(415);
    expect((await handler(request(validEvent, { rawBody: "{" }))).status).toBe(400);
    expect(
      (await handler(request(validEvent, { headers: { "content-length": "8193" } }))).status,
    ).toBe(413);
    expect((await handler(request(validEvent, { rawBody: sizedJsonBody(8192) }))).status).toBe(202);
    expect((await handler(request(validEvent, { rawBody: sizedJsonBody(8193, true) }))).status).toBe(
      413,
    );
    expect(
      (
        await handler(
          request(validEvent, { rawBody: Uint8Array.from([0xc3, 0x28]).buffer }),
        )
      ).status,
    ).toBe(400);
    const empty = new Request("https://sheepiesleep.com/api/bio-events", {
      method: "POST",
      headers: { "content-type": "application/json" },
    });
    expect((await handler(empty)).status).toBe(400);
    expect(ingest).toHaveBeenCalledOnce();
  });

  it("cancels a streamed body immediately after the byte limit is crossed", async () => {
    let pulls = 0;
    let cancelled = false;
    const body = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulls += 1;
        if (pulls <= 2) {
          controller.enqueue(new Uint8Array(5_000));
          return;
        }
        controller.error(new Error("body reader pulled after crossing the limit"));
      },
      cancel() {
        cancelled = true;
      },
    });
    const { handler, ingest } = setup();

    const response = await handler(streamRequest(body));

    expect(response.status).toBe(413);
    expect(cancelled).toBe(true);
    expect(pulls).toBe(2);
    expect(ingest).not.toHaveBeenCalled();
  });

  it("quietly ignores obvious bots but accepts Instagram and TikTok in-app user agents", async () => {
    const { handler, ingest } = setup();
    const bot = await handler(
      request(validEvent, { headers: { "user-agent": "Mozilla/5.0 Slackbot-LinkExpanding" } }),
    );
    expect(bot.status).toBe(202);
    await expect(bot.json()).resolves.toEqual({ accepted: false, reason: "ignored_bot" });
    expect(ingest).not.toHaveBeenCalled();

    const instagram = await handler(
      request(validEvent, { headers: { "user-agent": "Instagram 370.0.0.0 Android" } }),
    );
    expect(instagram.status).toBe(202);
    const tiktok = await handler(
      request(validEvent, { headers: { "user-agent": "TikTok 36.5.4 rv:365004 Android" } }),
    );
    expect(tiktok.status).toBe(202);
    expect(ingest).toHaveBeenCalledTimes(2);
  });

  it("trusts Vercel's address header only on Vercel", async () => {
    const headers = {
      "x-vercel-forwarded-for": " 198.51.100.7 , 10.0.0.1",
      "x-forwarded-for": "203.0.113.9",
    };
    const trusted = setup({ isVercel: () => true, trustProxyHeaders: () => false });
    await trusted.handler(request(validEvent, { headers }));
    expect(trusted.rateKey).toHaveBeenCalledWith("198.51.100.7", "2026-08-17");

    const spoofed = setup({ isVercel: () => false, trustProxyHeaders: () => false });
    await spoofed.handler(request(validEvent, { headers }));
    expect(spoofed.rateKey).toHaveBeenCalledWith("unknown", "2026-08-17");
  });

  it.each([
    [{ "x-forwarded-for": " 203.0.113.9 , 10.0.0.1" }, "203.0.113.9"],
    [{ "x-real-ip": " 2001:DB8:0:0:0:0:0:A\t" }, "2001:db8::a"],
    [{ "x-forwarded-for": "not-an-ip", "x-real-ip": "also-invalid" }, "unknown"],
    [{ "x-real-ip": "1".repeat(129) }, "unknown"],
    [{}, "unknown"],
  ] as const)("uses explicitly trusted proxy addresses safely: %#", async (headers, expected) => {
    const { handler, ingest, rateKey } = setup({
      isVercel: () => false,
      trustProxyHeaders: () => true,
    });
    const response = await handler(request(validEvent, { headers }));
    const responseText = await response.text();

    expect(rateKey).toHaveBeenCalledWith(expected, "2026-08-17");
    expect(ingest).toHaveBeenCalledWith(
      expect.anything(),
      expect.not.stringContaining(expected),
      expect.any(AbortSignal),
    );
    expect(responseText).not.toContain(expected);
  });

  it("never accepts or exposes an address from the request body", async () => {
    const { handler, ingest, rateKey } = setup();
    const bodyAddress = await handler(request({ ...validEvent, ip: "198.51.100.99" }));
    expect(bodyAddress.status).toBe(400);
    expect(await bodyAddress.text()).not.toContain("198.51.100.99");
    expect(rateKey).not.toHaveBeenCalled();
    expect(ingest).not.toHaveBeenCalled();
  });

  it("maps rate limiting and storage failures to safe responses", async () => {
    const limited = setup({ ingest: vi.fn().mockRejectedValue(new BioEventRateLimitError()) });
    const limitedResponse = await limited.handler(request());
    expect(limitedResponse.status).toBe(429);
    expect(limitedResponse.headers.get("retry-after")).toBe("60");
    await expect(limitedResponse.json()).resolves.toEqual({
      accepted: false,
      code: "rate_limited",
    });

    const failed = setup({ ingest: vi.fn().mockRejectedValue(new BioEventStorageError()) });
    const failedResponse = await failed.handler(request());
    expect(failedResponse.status).toBe(503);
    await expect(failedResponse.json()).resolves.toEqual({
      accepted: false,
      code: "service_unavailable",
    });
  });

  it("passes the request signal to storage and skips ingestion when already aborted", async () => {
    const active = setup();
    const activeRequest = request();
    expect((await active.handler(activeRequest)).status).toBe(202);
    expect(active.ingest).toHaveBeenCalledWith(
      expect.anything(),
      expect.any(String),
      activeRequest.signal,
    );

    const controller = new AbortController();
    const abortedRequest = request(validEvent, { signal: controller.signal });
    controller.abort();
    const aborted = setup();
    expect((await aborted.handler(abortedRequest)).status).toBe(503);
    expect(aborted.ingest).not.toHaveBeenCalled();
  });

  it("aborts an in-flight storage call and returns a generic 503 without hanging", async () => {
    const controller = new AbortController();
    let observedSignal: AbortSignal | undefined;
    let markStarted: (() => void) | undefined;
    const started = new Promise<void>((resolve) => {
      markStarted = resolve;
    });
    const ingest = vi.fn(
      (_event: unknown, _rateKey: string, signal?: AbortSignal) =>
        new Promise<"inserted">((_resolve, reject) => {
          observedSignal = signal;
          markStarted?.();
          signal?.addEventListener(
            "abort",
            () => reject(new DOMException("Aborted", "AbortError")),
            { once: true },
          );
        }),
    );
    const { handler } = setup({ ingest });

    const pendingResponse = handler(request(validEvent, { signal: controller.signal }));
    await started;
    expect(observedSignal).toBeInstanceOf(AbortSignal);
    expect(observedSignal?.aborted).toBe(false);
    controller.abort();
    const response = await pendingResponse;

    expect(observedSignal?.aborted).toBe(true);
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      accepted: false,
      code: "service_unavailable",
    });
  });

  it("sets no-store on every response class", async () => {
    const responses = [
      await setup().handler(request()),
      await setup().handler(request(validEvent, { headers: { "user-agent": "HeadlessChrome" } })),
      await setup().handler(request(validEvent, { rawBody: "{" })),
      await setup().handler(request(validEvent, { headers: { origin: "https://evil.example" } })),
      await setup().handler(request(validEvent, { headers: { "content-length": "8193" } })),
      await setup().handler(request(validEvent, { headers: { "content-type": "text/plain" } })),
      await setup({ ingest: vi.fn().mockRejectedValue(new BioEventRateLimitError()) }).handler(
        request(),
      ),
      await setup({ ingest: vi.fn().mockRejectedValue(new BioEventStorageError()) }).handler(
        request(),
      ),
    ];

    expect(responses.map((response) => response.status)).toEqual([
      202, 202, 400, 403, 413, 415, 429, 503,
    ]);
    for (const response of responses) {
      expect(response.headers.get("cache-control")).toBe("no-store");
    }
  });
});

describe("createDailyRateKey", () => {
  it("is deterministic and rotates daily without returning the address", () => {
    vi.stubEnv("BIO_ANALYTICS_RATE_SECRET", SECRET);
    const first = createDailyRateKey("203.0.113.5", "2026-08-17");
    const expected = createHmac("sha256", SECRET)
      .update("2026-08-17:203.0.113.5")
      .digest("hex");
    expect(first).toBe(expected);
    expect(createDailyRateKey("203.0.113.5", "2026-08-17")).toBe(first);
    expect(createDailyRateKey("203.0.113.5", "2026-08-18")).not.toBe(first);
    expect(first).not.toContain("203.0.113.5");
  });

  it("validates the secret and UTC day when invoked", () => {
    vi.stubEnv("BIO_ANALYTICS_RATE_SECRET", "short");
    expect(() => createDailyRateKey("unknown", "2026-08-17")).toThrowError(
      "Bio analytics is not configured",
    );

    vi.stubEnv("BIO_ANALYTICS_RATE_SECRET", SECRET);
    expect(() => createDailyRateKey("unknown", "17-08-2026")).toThrowError(
      "Invalid bio analytics rate-key day",
    );
    expect(() => createDailyRateKey("unknown", "2026-02-30")).toThrowError(
      "Invalid bio analytics rate-key day",
    );
  });
});
