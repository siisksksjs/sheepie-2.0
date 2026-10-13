// lib/meta/server.ts
import { isIP } from "node:net";

import type { MetaEvent } from "./events";

/** Graph API version for the Conversions API; bump when Meta deprecates it. */
export const META_GRAPH_VERSION = "v23.0";

export type MetaEnv = { pixelId: string; token: string; testEventCode?: string };

export function readMetaEnv(env: NodeJS.ProcessEnv = process.env): MetaEnv | null {
  const pixelId = env.META_PIXEL_ID?.trim();
  const token = env.META_CAPI_TOKEN?.trim();
  if (!pixelId || !token) return null;
  const testEventCode = env.META_TEST_EVENT_CODE?.trim() || undefined;
  return { pixelId, token, testEventCode };
}

function cookie(request: Request, name: string): string | undefined {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return undefined;
}

function clientIp(request: Request): string | undefined {
  const forwarded = request.headers.get("x-vercel-forwarded-for") ?? request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first && isIP(first) ? first : undefined;
}

function safeUrl(value: string | null): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

export function buildServerEvent(event: MetaEvent, request: Request, eventSourceUrl: string | null, nowMs: number) {
  const userData: Record<string, string> = {};
  const ip = clientIp(request);
  const ua = request.headers.get("user-agent");
  const fbp = cookie(request, "_fbp");
  const fbc = cookie(request, "_fbc");
  if (ip) userData.client_ip_address = ip;
  if (ua) userData.client_user_agent = ua;
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;

  const sourceUrl = safeUrl(eventSourceUrl) ?? safeUrl(request.headers.get("referer"));

  return {
    event_name: event.event_name,
    event_time: Math.floor(nowMs / 1000),
    event_id: event.event_id,
    action_source: "website" as const,
    ...(sourceUrl ? { event_source_url: sourceUrl } : {}),
    user_data: userData,
    custom_data: event.custom_data,
  };
}

/** Never throws: tracking must not stand between a shopper and the store. */
export async function forwardToMeta(
  serverEvent: ReturnType<typeof buildServerEvent>,
  env: MetaEnv,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  const url = `https://graph.facebook.com/${META_GRAPH_VERSION}/${env.pixelId}/events?access_token=${encodeURIComponent(env.token)}`;
  try {
    const response = await fetchImpl(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ data: [serverEvent], ...(env.testEventCode ? { test_event_code: env.testEventCode } : {}) }),
      signal: AbortSignal.timeout(3000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
