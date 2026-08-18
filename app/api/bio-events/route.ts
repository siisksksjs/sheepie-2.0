import { isIP } from "node:net";

import {
  MAX_BIO_EVENT_BODY_BYTES,
  parseBioEvent,
  type BioEventInput,
} from "@/lib/bio-analytics/contracts";
import {
  BioEventRateLimitError,
  createDailyRateKey,
  ingestBioEvent,
  type BioEventIngestResult,
} from "@/lib/bio-analytics/server";

export const runtime = "nodejs";

const BOT_USER_AGENT_PATTERN =
  /bot|crawler|spider|headless|preview|facebookexternalhit|slackbot/i;
const NO_STORE_HEADERS = { "cache-control": "no-store" };

type PostDependencies = {
  ingest: (
    event: BioEventInput,
    rateKey: string,
    signal?: AbortSignal,
  ) => Promise<BioEventIngestResult>;
  rateKey?: (ip: string, day: string) => string;
  now?: () => Date;
  allowedOrigins?: () => string | undefined;
  isVercel?: () => boolean;
  trustProxyHeaders?: () => boolean;
};

type BodyReadResult =
  | { status: "ok"; bytes: Uint8Array }
  | { status: "too_large" }
  | { status: "aborted" }
  | { status: "invalid" };

function json(body: unknown, status: number, headers?: HeadersInit): Response {
  return Response.json(body, {
    status,
    headers: { ...NO_STORE_HEADERS, ...headers },
  });
}

function normalizeOrigin(value: string): string | null {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (url.username || url.password || url.pathname !== "/" || url.search || url.hash) return null;
    return url.origin;
  } catch {
    return null;
  }
}

function configuredOrigins(value: string | undefined): Set<string> {
  const origins = new Set<string>();
  for (const entry of value?.split(",") ?? []) {
    const origin = normalizeOrigin(entry);
    if (origin) origins.add(origin);
  }
  return origins;
}

function isAllowedOrigin(request: Request, configured: string | undefined): boolean {
  const header = request.headers.get("origin");
  if (header === null) return true;
  const origin = normalizeOrigin(header);
  if (!origin) return false;
  if (origin === new URL(request.url).origin) return true;
  return configuredOrigins(configured).has(origin);
}

function normalizeIp(value: string | null): string | null {
  const normalized = value
    ?.split(",", 1)[0]
    ?.replace(/[\u0000-\u001f\u007f]/g, "")
    .trim();
  if (!normalized || normalized.length > 128) return null;

  const version = isIP(normalized);
  if (version === 4) return normalized;
  if (version === 6) {
    try {
      return new URL(`http://[${normalized}]/`).hostname.slice(1, -1);
    } catch {
      return null;
    }
  }
  return null;
}

function clientAddress(
  headers: Headers,
  deployment: { vercel: boolean; trustProxyHeaders: boolean },
): string {
  if (deployment.vercel) {
    const vercelAddress = normalizeIp(headers.get("x-vercel-forwarded-for"));
    if (vercelAddress) return vercelAddress;
  }
  if (deployment.trustProxyHeaders) {
    for (const name of ["x-forwarded-for", "x-real-ip"] as const) {
      const address = normalizeIp(headers.get(name));
      if (address) return address;
    }
  }
  return "unknown";
}

function declaredBodyIsTooLarge(value: string | null): boolean {
  if (value === null || !/^\d+$/.test(value.trim())) return false;
  return Number(value) > MAX_BIO_EVENT_BODY_BYTES;
}

async function readBoundedBody(request: Request): Promise<BodyReadResult> {
  if (request.signal.aborted) return { status: "aborted" };
  if (request.body === null) return { status: "ok", bytes: new Uint8Array() };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  const cancelForAbort = () => {
    void reader.cancel(request.signal.reason).catch(() => undefined);
  };
  request.signal.addEventListener("abort", cancelForAbort, { once: true });
  if (request.signal.aborted) cancelForAbort();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (request.signal.aborted) return { status: "aborted" };
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BIO_EVENT_BODY_BYTES) {
        await reader.cancel("Bio event body is too large").catch(() => undefined);
        return { status: "too_large" };
      }
      chunks.push(value);
    }
  } catch {
    return request.signal.aborted ? { status: "aborted" } : { status: "invalid" };
  } finally {
    request.signal.removeEventListener("abort", cancelForAbort);
    reader.releaseLock();
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { status: "ok", bytes };
}

export function createPostHandler(deps: PostDependencies) {
  const deriveRateKey = deps.rateKey ?? createDailyRateKey;
  const now = deps.now ?? (() => new Date());
  const allowedOrigins = deps.allowedOrigins ?? (() => process.env.BIO_ANALYTICS_ALLOWED_ORIGINS);
  const isVercel = deps.isVercel ?? (() => Boolean(process.env.VERCEL));
  const trustProxyHeaders =
    deps.trustProxyHeaders ?? (() => process.env.BIO_ANALYTICS_TRUST_PROXY_HEADERS === "true");

  return async function POST(request: Request): Promise<Response> {
    const contentType = request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
    if (contentType !== "application/json") {
      return json({ accepted: false, code: "unsupported_media_type" }, 415);
    }
    if (declaredBodyIsTooLarge(request.headers.get("content-length"))) {
      return json({ accepted: false, code: "payload_too_large" }, 413);
    }
    if (!isAllowedOrigin(request, allowedOrigins())) {
      return json({ accepted: false, code: "forbidden_origin" }, 403);
    }
    if (BOT_USER_AGENT_PATTERN.test(request.headers.get("user-agent") ?? "")) {
      return json({ accepted: false, reason: "ignored_bot" }, 202);
    }

    const body = await readBoundedBody(request);
    if (body.status === "too_large") {
      return json({ accepted: false, code: "payload_too_large" }, 413);
    }
    if (body.status === "aborted") {
      return json({ accepted: false, code: "service_unavailable" }, 503);
    }
    if (body.status === "invalid") {
      return json({ accepted: false, code: "invalid_request" }, 400);
    }

    let text: string;
    try {
      text = new TextDecoder("utf-8", { fatal: true }).decode(body.bytes);
    } catch {
      return json({ accepted: false, code: "invalid_request" }, 400);
    }

    let untrusted: unknown;
    try {
      untrusted = JSON.parse(text);
    } catch {
      return json({ accepted: false, code: "malformed_json" }, 400);
    }

    const parsed = parseBioEvent(untrusted);
    if (!parsed.success) {
      return json(
        { accepted: false, code: "invalid_event", reason: "Event validation failed" },
        400,
      );
    }

    try {
      if (request.signal.aborted) {
        return json({ accepted: false, code: "service_unavailable" }, 503);
      }
      const day = now().toISOString().slice(0, 10);
      const rateKey = deriveRateKey(
        clientAddress(request.headers, {
          vercel: isVercel(),
          trustProxyHeaders: trustProxyHeaders(),
        }),
        day,
      );
      await deps.ingest(parsed.data, rateKey, request.signal);
      return json({ accepted: true }, 202);
    } catch (error) {
      if (!request.signal.aborted && error instanceof BioEventRateLimitError) {
        return json(
          { accepted: false, code: "rate_limited" },
          429,
          { "retry-after": "60" },
        );
      }
      return json({ accepted: false, code: "service_unavailable" }, 503);
    }
  };
}

export const POST = createPostHandler({ ingest: ingestBioEvent });
