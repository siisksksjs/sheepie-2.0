import "server-only";

import { createHmac } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

import type { BioEventInput } from "./contracts";

export type BioEventIngestResult = "inserted" | "duplicate";

export class BioEventRateLimitError extends Error {
  constructor() {
    super("Bio event rate limit exceeded");
    this.name = "BioEventRateLimitError";
  }
}

export class BioEventStorageError extends Error {
  constructor(message = "Bio event storage is unavailable") {
    super(message);
    this.name = "BioEventStorageError";
  }
}

type RpcError = { code?: string; message?: string };
type RpcResult = { data: unknown; error: RpcError | null };
type RpcQuery = {
  abortSignal: (signal: AbortSignal) => PromiseLike<RpcResult>;
};
type RpcClient = {
  rpc: (
    name: "ingest_bio_event",
    args: { payload: BioEventInput; request_rate_key: string },
  ) => RpcQuery;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const BIO_EVENT_INGEST_TIMEOUT_MS = 5_000;

let client: RpcClient | undefined;

function configuredClient(): RpcClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceRoleKey) {
    throw new BioEventStorageError("Bio analytics is not configured");
  }

  try {
    client = createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    return client;
  } catch {
    throw new BioEventStorageError("Bio analytics is not configured");
  }
}

function isValidUtcDay(day: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day);
  if (!match) return false;
  const date = new Date(`${day}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === day;
}

export function createDailyRateKey(ip: string, day: string): string {
  const secret = process.env.BIO_ANALYTICS_RATE_SECRET;
  if (!secret || secret.trim().length < 32) {
    throw new BioEventStorageError("Bio analytics is not configured");
  }
  if (!isValidUtcDay(day)) {
    throw new BioEventStorageError("Invalid bio analytics rate-key day");
  }

  return createHmac("sha256", secret).update(`${day}:${ip}`).digest("hex");
}

function isRateLimitError(error: RpcError): boolean {
  return (
    error.code === "P0001" &&
    error.message === "bio analytics rate limit exceeded"
  );
}

function normalizeRpcResult(data: unknown, expectedEventId: string): BioEventIngestResult {
  if (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    typeof (data as { id?: unknown }).id === "string" &&
    UUID_PATTERN.test((data as { id: string }).id) &&
    "event_id" in data &&
    typeof (data as { event_id?: unknown }).event_id === "string" &&
    UUID_PATTERN.test((data as { event_id: string }).event_id) &&
    (data as { event_id: string }).event_id === expectedEventId &&
    "status" in data &&
    ((data as { status?: unknown }).status === "inserted" ||
      (data as { status?: unknown }).status === "duplicate")
  ) {
    return (data as { status: BioEventIngestResult }).status;
  }
  throw new BioEventStorageError();
}

export async function ingestBioEventWithClient(
  rpcClient: RpcClient,
  event: BioEventInput,
  rateKey: string,
  requestSignal?: AbortSignal,
  timeoutMs = BIO_EVENT_INGEST_TIMEOUT_MS,
): Promise<BioEventIngestResult> {
  let result: RpcResult;
  try {
    const timeoutSignal = AbortSignal.timeout(timeoutMs);
    const signal = requestSignal
      ? AbortSignal.any([requestSignal, timeoutSignal])
      : timeoutSignal;
    result = await rpcClient
      .rpc("ingest_bio_event", {
        payload: event,
        request_rate_key: rateKey,
      })
      .abortSignal(signal);
  } catch {
    throw new BioEventStorageError();
  }

  if (result.error) {
    if (isRateLimitError(result.error)) throw new BioEventRateLimitError();
    throw new BioEventStorageError();
  }
  return normalizeRpcResult(result.data, event.event_id);
}

export async function ingestBioEvent(
  event: BioEventInput,
  rateKey: string,
  signal?: AbortSignal,
): Promise<BioEventIngestResult> {
  return ingestBioEventWithClient(configuredClient(), event, rateKey, signal);
}
