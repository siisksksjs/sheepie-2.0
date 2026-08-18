import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import type { BioEventInput } from "./contracts";
import {
  BIO_EVENT_INGEST_TIMEOUT_MS,
  BioEventRateLimitError,
  BioEventStorageError,
  ingestBioEventWithClient,
} from "./server";

const event = { event_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" } as BioEventInput;
const rowId = "44444444-4444-4444-8444-444444444444";

type RpcResult = { data: unknown; error: { code?: string; message?: string } | null };

function fakeClient(result: RpcResult | Promise<RpcResult>) {
  const abortSignal = vi.fn().mockReturnValue(Promise.resolve(result));
  const rpc = vi.fn().mockReturnValue({ abortSignal });
  return { client: { rpc }, rpc, abortSignal };
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("ingestBioEventWithClient", () => {
  it("uses a five-second production timeout", () => {
    expect(BIO_EVENT_INGEST_TIMEOUT_MS).toBe(5_000);
  });

  it.each(["inserted", "duplicate"] as const)("returns the validated RPC %s status", async (status) => {
    const { client, rpc, abortSignal } = fakeClient({
      data: { id: rowId, event_id: event.event_id, status },
      error: null,
    });

    await expect(ingestBioEventWithClient(client, event, "hashed-key")).resolves.toBe(status);
    expect(rpc).toHaveBeenCalledWith("ingest_bio_event", {
      payload: event,
      request_rate_key: "hashed-key",
    });
    expect(abortSignal).toHaveBeenCalledWith(expect.any(AbortSignal));
  });

  it("maps only the database's exact rate-limit exception", async () => {
    const limited = fakeClient({
      data: null,
      error: { code: "P0001", message: "bio analytics rate limit exceeded" },
    });
    await expect(
      ingestBioEventWithClient(limited.client, event, "hashed-key"),
    ).rejects.toBeInstanceOf(BioEventRateLimitError);

    for (const error of [
      { code: "P0002", message: "bio analytics rate limit exceeded" },
      { code: "P0001", message: "Bio analytics rate limit exceeded" },
      { code: "P0001", message: "bio analytics rate limit exceeded!" },
      { code: "P0001", message: "prefix bio analytics rate limit exceeded" },
      { code: "P0001", message: "some other database exception" },
    ]) {
      const unrelated = fakeClient({ data: null, error });
      await expect(
        ingestBioEventWithClient(unrelated.client, event, "hashed-key"),
      ).rejects.toBeInstanceOf(BioEventStorageError);
    }
  });

  it("maps transport failures to a safe storage error", async () => {
    const abortSignal = vi.fn().mockReturnValue(Promise.reject(new Error("secret transport detail")));
    const rpc = vi.fn().mockReturnValue({ abortSignal });
    await expect(ingestBioEventWithClient({ rpc }, event, "hashed-key")).rejects.toEqual(
      new BioEventStorageError(),
    );
  });

  it.each([
    { id: "not-a-uuid", event_id: event.event_id, status: "inserted" },
    { id: rowId, event_id: "55555555-5555-4555-8555-555555555555", status: "inserted" },
    { id: rowId, event_id: event.event_id, status: "unexpected" },
    { event_id: event.event_id, status: "inserted" },
  ])("rejects drifted RPC data: %#", async (data) => {
    const { client } = fakeClient({ data, error: null });
    await expect(ingestBioEventWithClient(client, event, "hashed-key")).rejects.toBeInstanceOf(
      BioEventStorageError,
    );
  });

  it("combines the request signal with a bounded storage timeout", async () => {
    let querySignal: AbortSignal | undefined;
    const abortSignal = vi.fn((signal: AbortSignal) => {
      querySignal = signal;
      return new Promise<RpcResult>((_resolve, reject) => {
        signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), {
          once: true,
        });
      });
    });
    const rpc = vi.fn().mockReturnValue({ abortSignal });

    await expect(ingestBioEventWithClient({ rpc }, event, "hashed-key", undefined, 5)).rejects.toBeInstanceOf(
      BioEventStorageError,
    );
    expect(querySignal?.aborted).toBe(true);
  });

  it("propagates request cancellation to the RPC query", async () => {
    const controller = new AbortController();
    const { client, abortSignal } = fakeClient({
      data: { id: rowId, event_id: event.event_id, status: "inserted" },
      error: null,
    });

    await ingestBioEventWithClient(client, event, "hashed-key", controller.signal);
    const querySignal = abortSignal.mock.calls[0]?.[0] as AbortSignal;
    expect(querySignal.aborted).toBe(false);
    controller.abort();
    expect(querySignal.aborted).toBe(true);
  });
});

describe("lazy server configuration", () => {
  it("does not validate missing environment variables until ingestion is invoked", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
    vi.resetModules();

    const server = await import("./server");
    await expect(server.ingestBioEvent(event, "hashed-key")).rejects.toThrowError(
      "Bio analytics is not configured",
    );
  });
});
