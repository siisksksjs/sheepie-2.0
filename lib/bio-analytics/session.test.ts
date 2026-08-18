import { describe, expect, it } from "vitest";

import {
  type BioSessionCrypto,
  SESSION_TIMEOUT_MS,
  captureCampaign,
  createBioSession,
  shouldRotateSession,
} from "./session";

import { MAX_BIO_EVENT_INTEGER } from "./contracts";

class MemoryStorage implements Pick<Storage, "getItem" | "setItem"> {
  private readonly values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

describe("shouldRotateSession", () => {
  it("rotates at the exact inactivity boundary", () => {
    expect(shouldRotateSession({ lastActivityAt: 0 }, SESSION_TIMEOUT_MS - 1)).toBe(false);
    expect(shouldRotateSession({ lastActivityAt: 0 }, SESSION_TIMEOUT_MS)).toBe(true);
    expect(shouldRotateSession({ lastActivityAt: 0 }, SESSION_TIMEOUT_MS + 1)).toBe(true);
  });

  it("rotates corrupt or future activity timestamps", () => {
    expect(shouldRotateSession({ lastActivityAt: Number.NaN }, 1_000)).toBe(true);
    expect(shouldRotateSession({ lastActivityAt: 2_000 }, 1_000)).toBe(true);
  });
});

describe("captureCampaign", () => {
  it("captures and normalizes the five approved UTM fields", () => {
    const campaign = captureCampaign(
      new URL(
        "https://sheepiesleep.com/bio?utm_source=%20ig%20&utm_medium=social&utm_campaign=launch&utm_content=hero&utm_term=sleep",
      ),
    );

    expect(campaign).toEqual({
      utm_source: "ig",
      utm_medium: "social",
      utm_campaign: "launch",
      utm_content: "hero",
      utm_term: "sleep",
    });
  });

  it("returns nulls for absent values and caps long values", () => {
    const campaign = captureCampaign(
      new URL(`https://sheepiesleep.com/bio?utm_source=${"x".repeat(200)}`),
    );

    expect(campaign.utm_source).toHaveLength(200);
    expect(campaign.utm_campaign).toBeNull();
  });
});

describe("createBioSession", () => {
  it("marks the first session new and a later rotated session returning", () => {
    const local = new MemoryStorage();
    const session = new MemoryStorage();

    const first = createBioSession(local, session, 1_000);
    const same = createBioSession(local, session, 2_000);
    const returning = createBioSession(local, session, 2_000 + SESSION_TIMEOUT_MS + 1);

    expect(first.isReturning).toBe(false);
    expect(same.isReturning).toBe(false);
    expect(same.visitorId).toBe(first.visitorId);
    expect(same.sessionId).toBe(first.sessionId);
    expect(returning.isReturning).toBe(true);
    expect(returning.visitorId).toBe(first.visitorId);
    expect(returning.sessionId).not.toBe(first.sessionId);
  });

  it("recovers safely from corrupt stored identifiers, numbers, and campaign JSON", () => {
    const local = new MemoryStorage();
    const session = new MemoryStorage();
    local.setItem("sheepie.bio.visitor_id", "broken");
    local.setItem("sheepie.bio.first_seen", "broken");
    session.setItem("sheepie.bio.session_id", "broken");
    session.setItem("sheepie.bio.last_activity_at", "not-a-number");
    session.setItem("sheepie.bio.sequence_no", "oops");
    session.setItem("sheepie.bio.campaign", "{bad-json");

    const result = createBioSession(local, session, 5_000);

    expect(result.visitorId).toMatch(/^[0-9a-f-]{36}$/i);
    expect(result.sessionId).toMatch(/^[0-9a-f-]{36}$/i);
    expect(result.sequenceNo).toBe(0);
    expect(result.isReturning).toBe(false);
    expect(result.campaign).toEqual({
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
      utm_term: null,
    });
  });

  it("does not reuse a stored session when the visitor identifier is corrupt", () => {
    const local = new MemoryStorage();
    const session = new MemoryStorage();
    const first = createBioSession(local, session, 1_000);
    local.setItem("sheepie.bio.visitor_id", "broken");

    const recovered = createBioSession(local, session, 2_000);

    expect(recovered.visitorId).not.toBe(first.visitorId);
    expect(recovered.sessionId).not.toBe(first.sessionId);
    expect(recovered.sequenceNo).toBe(0);
    expect(recovered.isReturning).toBe(false);
  });

  it("keeps the landing campaign for the session and captures a new one after rotation", () => {
    const local = new MemoryStorage();
    const session = new MemoryStorage();
    const first = createBioSession(
      local,
      session,
      1_000,
      new URL("https://sheepiesleep.com/bio?utm_source=instagram&utm_campaign=launch"),
    );
    const same = createBioSession(
      local,
      session,
      2_000,
      new URL("https://sheepiesleep.com/bio?utm_source=tiktok&utm_campaign=changed"),
    );
    const rotated = createBioSession(
      local,
      session,
      2_000 + SESSION_TIMEOUT_MS + 1,
      new URL("https://sheepiesleep.com/bio?utm_source=tiktok&utm_campaign=summer"),
    );

    expect(first.campaign.utm_source).toBe("instagram");
    expect(same.campaign).toEqual(first.campaign);
    expect(rotated.campaign).toEqual({
      utm_source: "tiktok",
      utm_medium: null,
      utm_campaign: "summer",
      utm_content: null,
      utm_term: null,
    });
  });

  it("allocates persistent sequence numbers and resets them on rotation", () => {
    const local = new MemoryStorage();
    const session = new MemoryStorage();
    const first = createBioSession(local, session, 1_000);

    expect(first.sequenceNo).toBe(0);
    expect(first.allocateEventContext(1_001).sequenceNo).toBe(1);
    expect(first.nextSequence(1_002)).toBe(2);

    const resumed = createBioSession(local, session, 2_000);
    expect(resumed.sequenceNo).toBe(2);
    expect(resumed.allocateEventContext(2_001).sequenceNo).toBe(3);

    const rotated = createBioSession(local, session, 2_001 + SESSION_TIMEOUT_MS);
    expect(rotated.sequenceNo).toBe(0);
    expect(rotated.allocateEventContext(2_001 + SESSION_TIMEOUT_MS + 1).sequenceNo).toBe(1);
  });

  it.each([MAX_BIO_EVENT_INTEGER, Number.MAX_SAFE_INTEGER])(
    "rotates before allocating from an exhausted stored sequence of %d",
    (storedSequence) => {
      const local = new MemoryStorage();
      const session = new MemoryStorage();
      const first = createBioSession(local, session, 1_000);
      session.setItem("sheepie.bio.sequence_no", String(storedSequence));

      const rotated = createBioSession(local, session, 2_000);

      expect(rotated.sessionId).not.toBe(first.sessionId);
      expect(rotated.sequenceNo).toBe(0);
      expect(rotated.isReturning).toBe(true);
    },
  );

  it("rotates with live session state when nextSequence exhausts the integer range", () => {
    const local = new MemoryStorage();
    const session = new MemoryStorage();
    createBioSession(local, session, 1_000);
    session.setItem("sheepie.bio.sequence_no", String(MAX_BIO_EVENT_INTEGER - 1));

    const atBoundary = createBioSession(local, session, 2_000);
    const exhaustedSessionId = atBoundary.sessionId;
    expect(atBoundary.sequenceNo).toBe(MAX_BIO_EVENT_INTEGER - 1);
    expect(atBoundary.allocateEventContext(2_001).sequenceNo).toBe(MAX_BIO_EVENT_INTEGER);

    expect(atBoundary.nextSequence(2_002)).toBe(1);
    expect(atBoundary.sequenceNo).toBe(1);
    expect(atBoundary.sessionId).not.toBe(exhaustedSessionId);
    expect(atBoundary.isReturning).toBe(true);

    const resumed = createBioSession(local, session, 2_003);
    expect(resumed.sessionId).toBe(atBoundary.sessionId);
    expect(resumed.sequenceNo).toBe(1);
  });

  it("touch reconciles storage and rotates rather than hiding inactivity", () => {
    const local = new MemoryStorage();
    const session = new MemoryStorage();
    const first = createBioSession(local, session, 1_000);
    first.touch(1_000 + SESSION_TIMEOUT_MS);

    expect(first.sequenceNo).toBe(0);
    const resumed = createBioSession(local, session, 1_000 + SESSION_TIMEOUT_MS + 1);
    expect(resumed.sessionId).toBe(first.sessionId);
    expect(resumed.sequenceNo).toBe(0);
    expect(resumed.isReturning).toBe(true);
  });

  it("rotates a long-lived handle when allocation occurs after inactivity", () => {
    const local = new MemoryStorage();
    const session = new MemoryStorage();
    const handle = createBioSession(local, session, 1_000);
    const originalSessionId = handle.sessionId;

    const context = handle.allocateEventContext(1_000 + SESSION_TIMEOUT_MS);

    expect(context.sessionId).not.toBe(originalSessionId);
    expect(context.sequenceNo).toBe(1);
    expect(context.isReturning).toBe(true);
    expect(handle.sessionId).toBe(context.sessionId);
  });

  it("coordinates sequence reservations across two live handles in one tab", () => {
    const local = new MemoryStorage();
    const session = new MemoryStorage();
    const first = createBioSession(local, session, 1_000);
    const second = createBioSession(local, session, 1_000);

    const firstEvent = first.allocateEventContext(1_001);
    const secondEvent = second.allocateEventContext(1_002);

    expect(secondEvent.sessionId).toBe(firstEvent.sessionId);
    expect(firstEvent.sequenceNo).toBe(1);
    expect(secondEvent.sequenceNo).toBe(2);
    expect(first.sequenceNo).toBe(1);
    expect(second.sequenceNo).toBe(2);
  });

  it("returns frozen campaign snapshots that cannot mutate session state", () => {
    const local = new MemoryStorage();
    const session = new MemoryStorage();
    const handle = createBioSession(
      local,
      session,
      1_000,
      new URL("https://sheepiesleep.com/bio?utm_source=instagram"),
    );
    const exposed = handle.campaign as { utm_source: string | null };

    expect(Object.isFrozen(exposed)).toBe(true);
    expect(() => {
      exposed.utm_source = "tampered";
    }).toThrow();
    expect(handle.campaign.utm_source).toBe("instagram");
    expect(handle.allocateEventContext(1_001).campaign.utm_source).toBe("instagram");
  });

  it("keeps one in-memory session when browser storage throws", () => {
    const throwingStorage: Pick<Storage, "getItem" | "setItem"> = {
      getItem() {
        throw new Error("denied");
      },
      setItem() {
        throw new Error("denied");
      },
    };

    const handle = createBioSession(throwingStorage, throwingStorage, 1_000);
    const first = handle.allocateEventContext(1_001);
    const second = handle.allocateEventContext(1_002);
    expect(first.sequenceNo).toBe(1);
    expect(second.sequenceNo).toBe(2);
    expect(second.sessionId).toBe(first.sessionId);

    const afterTimeout = handle.allocateEventContext(1_002 + SESSION_TIMEOUT_MS);
    expect(afterTimeout.sequenceNo).toBe(1);
    expect(afterTimeout.sessionId).not.toBe(first.sessionId);
  });

  it("falls back to getRandomValues when randomUUID fails", () => {
    let fill = 0;
    const fallbackCrypto = {
      randomUUID() {
        throw new Error("unavailable");
      },
      getRandomValues<T extends ArrayBufferView | null>(array: T): T {
        const bytes = array as Uint8Array;
        bytes.fill(fill++);
        return array;
      },
    } satisfies BioSessionCrypto;

    const handle = createBioSession(
      new MemoryStorage(),
      new MemoryStorage(),
      1_000,
      undefined,
      fallbackCrypto,
    );

    expect(handle.visitorId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(handle.sessionId).not.toBe(handle.visitorId);
  });

  it("fails closed with a clear error when Web Crypto is unavailable", () => {
    expect(() =>
      createBioSession(new MemoryStorage(), new MemoryStorage(), 1_000, undefined, null),
    ).toThrow("Secure UUID generation requires Web Crypto");
  });
});
