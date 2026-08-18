import { BIO_EVENT_TEXT_LIMITS, MAX_BIO_EVENT_INTEGER, normalizeText } from "./contracts";

export const SESSION_TIMEOUT_MS = 30 * 60_000;

export type Campaign = Readonly<{
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
}>;

export type BioEventSessionContext = Readonly<{
  visitorId: string;
  sessionId: string;
  sequenceNo: number;
  isReturning: boolean;
  campaign: Campaign;
}>;

export type BioSession = {
  readonly visitorId: string;
  readonly sessionId: string;
  readonly sequenceNo: number;
  readonly isReturning: boolean;
  readonly campaign: Campaign;
  allocateEventContext: (now?: number) => BioEventSessionContext;
  nextSequence: (now?: number) => number;
  touch: (now?: number) => void;
};

export type BioSessionCrypto = {
  randomUUID?: Crypto["randomUUID"];
  getRandomValues?: Crypto["getRandomValues"];
};

type StorageLike = Pick<Storage, "getItem" | "setItem">;

type StoredSession = {
  sessionId: string;
  lastActivityAt: number;
  sequenceNo: number;
  isReturning: boolean;
  campaign: Campaign;
};

type StoredSessionRead =
  | { available: false }
  | { available: true; session: StoredSession | null };

const STORAGE_KEYS = {
  visitorId: "sheepie.bio.visitor_id",
  firstSeen: "sheepie.bio.first_seen",
  sessionId: "sheepie.bio.session_id",
  lastActivityAt: "sheepie.bio.last_activity_at",
  sequenceNo: "sheepie.bio.sequence_no",
  isReturning: "sheepie.bio.is_returning",
  campaign: "sheepie.bio.campaign",
} as const;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const EMPTY_CAMPAIGN: Campaign = Object.freeze({
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  utm_content: null,
  utm_term: null,
});

function safeGet(storage: StorageLike, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(storage: StorageLike, key: string, value: string): void {
  try {
    storage.setItem(key, value);
  } catch {
    // Storage denial must not interfere with the public page or outbound navigation.
  }
}

function parseStoredInteger(value: string | null): number | null {
  if (value === null || !/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

function parseStoredBoolean(value: string | null): boolean | null {
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

function freezeCampaign(campaign: Campaign): Campaign {
  return Object.freeze({ ...campaign });
}

function parseStoredCampaign(value: string | null): Campaign | null {
  if (value === null) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return null;
    const record = parsed as Record<string, unknown>;
    const keys: ReadonlyArray<keyof Campaign> = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ];
    const campaign = { ...EMPTY_CAMPAIGN };
    for (const key of keys) {
      const field = record[key];
      if (field !== null && typeof field !== "string") return null;
      if (typeof field === "string" && field.trim().length > BIO_EVENT_TEXT_LIMITS[key]) return null;
      campaign[key] = normalizeText(field, BIO_EVENT_TEXT_LIMITS[key]);
    }
    return freezeCampaign(campaign);
  } catch {
    return null;
  }
}

function currentUrl(): URL {
  if (typeof globalThis.location !== "undefined") return new URL(globalThis.location.href);
  return new URL("https://sheepiesleep.com/bio");
}

function defaultCrypto(): BioSessionCrypto | null {
  return typeof globalThis.crypto === "undefined" ? null : globalThis.crypto;
}

function generateUuid(cryptoProvider: BioSessionCrypto | null): string {
  if (cryptoProvider?.randomUUID) {
    try {
      const value = cryptoProvider.randomUUID();
      if (UUID_PATTERN.test(value)) return value;
    } catch {
      // Fall through to getRandomValues.
    }
  }

  if (!cryptoProvider?.getRandomValues) {
    throw new Error("Secure UUID generation requires Web Crypto");
  }

  const bytes = new Uint8Array(16);
  try {
    cryptoProvider.getRandomValues(bytes);
  } catch {
    throw new Error("Secure UUID generation requires Web Crypto");
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
}

export function shouldRotateSession(state: { lastActivityAt: number }, now: number): boolean {
  return (
    !Number.isFinite(state.lastActivityAt) ||
    !Number.isFinite(now) ||
    state.lastActivityAt > now ||
    now - state.lastActivityAt >= SESSION_TIMEOUT_MS
  );
}

export function captureCampaign(url: URL): Campaign {
  return freezeCampaign({
    utm_source: normalizeText(url.searchParams.get("utm_source"), BIO_EVENT_TEXT_LIMITS.utm_source),
    utm_medium: normalizeText(url.searchParams.get("utm_medium"), BIO_EVENT_TEXT_LIMITS.utm_medium),
    utm_campaign: normalizeText(url.searchParams.get("utm_campaign"), BIO_EVENT_TEXT_LIMITS.utm_campaign),
    utm_content: normalizeText(url.searchParams.get("utm_content"), BIO_EVENT_TEXT_LIMITS.utm_content),
    utm_term: normalizeText(url.searchParams.get("utm_term"), BIO_EVENT_TEXT_LIMITS.utm_term),
  });
}

/**
 * Creates a tab-scoped analytics session. Browsers isolate sessionStorage per tab;
 * synchronous handles in the same tab coordinate by re-reading it before every reservation.
 * A browser may initially clone an opener tab's sessionStorage, but the two copies cannot
 * coordinate afterward; links opening independent tabs should therefore use `noopener`.
 */
export function createBioSession(
  localStorage: StorageLike,
  sessionStorage: StorageLike,
  now = Date.now(),
  url: URL = currentUrl(),
  cryptoProvider: BioSessionCrypto | null = defaultCrypto(),
): BioSession {
  const storedVisitorId = safeGet(localStorage, STORAGE_KEYS.visitorId);
  const visitorExisted = storedVisitorId !== null && UUID_PATTERN.test(storedVisitorId);
  const visitorId = visitorExisted ? storedVisitorId : generateUuid(cryptoProvider);

  if (!visitorExisted) {
    safeSet(localStorage, STORAGE_KEYS.visitorId, visitorId);
    safeSet(localStorage, STORAGE_KEYS.firstSeen, String(now));
  } else if (parseStoredInteger(safeGet(localStorage, STORAGE_KEYS.firstSeen)) === null) {
    safeSet(localStorage, STORAGE_KEYS.firstSeen, String(now));
  }

  let sessionId = "";
  let sequenceNo = 0;
  let isReturning = false;
  let campaign = EMPTY_CAMPAIGN;
  let lastActivityAt = now;
  let hasAllocatedEvent = false;
  let sessionStorageUnavailable = false;

  function readStoredSession(): StoredSessionRead {
    if (sessionStorageUnavailable) return { available: false };

    let storedSessionId: string | null;
    let storedActivityAt: number | null;
    let storedSequenceNo: number | null;
    let storedReturning: boolean | null;
    let storedCampaign: Campaign | null;
    try {
      storedSessionId = sessionStorage.getItem(STORAGE_KEYS.sessionId);
      storedActivityAt = parseStoredInteger(sessionStorage.getItem(STORAGE_KEYS.lastActivityAt));
      storedSequenceNo = parseStoredInteger(sessionStorage.getItem(STORAGE_KEYS.sequenceNo));
      storedReturning = parseStoredBoolean(sessionStorage.getItem(STORAGE_KEYS.isReturning));
      storedCampaign = parseStoredCampaign(sessionStorage.getItem(STORAGE_KEYS.campaign));
    } catch {
      sessionStorageUnavailable = true;
      return { available: false };
    }

    if (
      storedSessionId === null ||
      !UUID_PATTERN.test(storedSessionId) ||
      storedActivityAt === null ||
      storedSequenceNo === null ||
      storedSequenceNo > MAX_BIO_EVENT_INTEGER ||
      storedReturning === null ||
      storedCampaign === null
    ) {
      return { available: true, session: null };
    }

    return {
      available: true,
      session: {
        sessionId: storedSessionId,
        lastActivityAt: storedActivityAt,
        sequenceNo: storedSequenceNo,
        isReturning: storedReturning,
        campaign: storedCampaign,
      },
    };
  }

  function persistSession(activityAt: number): void {
    lastActivityAt = activityAt;
    if (sessionStorageUnavailable) return;
    try {
      sessionStorage.setItem(STORAGE_KEYS.sessionId, sessionId);
      sessionStorage.setItem(STORAGE_KEYS.lastActivityAt, String(activityAt));
      sessionStorage.setItem(STORAGE_KEYS.sequenceNo, String(sequenceNo));
      sessionStorage.setItem(STORAGE_KEYS.isReturning, String(isReturning));
      sessionStorage.setItem(STORAGE_KEYS.campaign, JSON.stringify(campaign));
    } catch {
      sessionStorageUnavailable = true;
    }
  }

  function rotateSession(
    activityAt: number,
    returning = visitorExisted || hasAllocatedEvent,
  ): void {
    sessionId = generateUuid(cryptoProvider);
    sequenceNo = 0;
    isReturning = returning;
    campaign = captureCampaign(url);
    persistSession(activityAt);
  }

  function reconcileOrRotate(activityAt: number): void {
    const read = readStoredSession();
    if (!read.available) {
      if (
        sequenceNo >= MAX_BIO_EVENT_INTEGER ||
        shouldRotateSession({ lastActivityAt }, activityAt)
      ) {
        rotateSession(activityAt, visitorExisted || hasAllocatedEvent);
      }
      return;
    }

    const stored = read.session;
    if (stored === null) {
      rotateSession(activityAt);
      return;
    }
    if (
      stored.sequenceNo >= MAX_BIO_EVENT_INTEGER ||
      shouldRotateSession(stored, activityAt)
    ) {
      rotateSession(activityAt, true);
      return;
    }

    sessionId = stored.sessionId;
    sequenceNo = stored.sequenceNo;
    isReturning = stored.isReturning;
    campaign = stored.campaign;
    lastActivityAt = stored.lastActivityAt;
  }

  const initialRead = readStoredSession();
  const initialStored = initialRead.available ? initialRead.session : null;
  if (
    initialRead.available &&
    visitorExisted &&
    initialStored !== null &&
    initialStored.sequenceNo < MAX_BIO_EVENT_INTEGER &&
    !shouldRotateSession(initialStored, now)
  ) {
    sessionId = initialStored.sessionId;
    sequenceNo = initialStored.sequenceNo;
    isReturning = initialStored.isReturning;
    campaign = initialStored.campaign;
  } else {
    rotateSession(now);
  }
  persistSession(now);

  function allocateEventContext(at = Date.now()): BioEventSessionContext {
    reconcileOrRotate(at);
    sequenceNo += 1;
    hasAllocatedEvent = true;
    persistSession(at);
    return Object.freeze({
      visitorId,
      sessionId,
      sequenceNo,
      isReturning,
      campaign: freezeCampaign(campaign),
    });
  }

  return {
    visitorId,
    get sessionId() {
      return sessionId;
    },
    get sequenceNo() {
      return sequenceNo;
    },
    get isReturning() {
      return isReturning;
    },
    get campaign() {
      return freezeCampaign(campaign);
    },
    allocateEventContext,
    nextSequence(at = Date.now()) {
      return allocateEventContext(at).sequenceNo;
    },
    touch(at = Date.now()) {
      reconcileOrRotate(at);
      persistSession(at);
    },
  };
}
