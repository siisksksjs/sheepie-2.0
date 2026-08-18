export const BIO_EVENT_NAMES = [
  "bio_page_view",
  "bio_section_view",
  "bio_scroll_depth",
  "bio_product_view",
  "bio_outbound_click",
  "bio_share_click",
] as const;

export const PRODUCT_SLUGS = ["cervicloud", "lumicloud", "calmicloud"] as const;

export const DESTINATIONS = [
  "shopee",
  "tokopedia",
  "website",
  "whatsapp",
  "instagram",
  "tiktok",
  "email",
  "share",
] as const;

export const REFERRER_CATEGORIES = ["instagram", "tiktok", "google", "direct", "other"] as const;
export const SCREEN_CATEGORIES = ["mobile", "tablet", "desktop"] as const;
export const SCROLL_DEPTHS = [25, 50, 75, 100] as const;

export const MAX_BIO_EVENT_BODY_BYTES = 8192;
export const BIO_EVENT_TEXT_LIMITS = {
  section_id: 100,
  cta_id: 100,
  cta_position: 100,
  referrer_category: 100,
  timezone: 100,
  language: 35,
  utm_source: 200,
  utm_medium: 200,
  utm_campaign: 200,
  utm_content: 200,
  utm_term: 200,
} as const;
export const MAX_BIO_EVENT_TEXT_LENGTH = 200;
export const MAX_BIO_EVENT_INTEGER = 2_147_483_647;

export type BioEventName = (typeof BIO_EVENT_NAMES)[number];
export type BioProductSlug = (typeof PRODUCT_SLUGS)[number];
export type BioDestination = (typeof DESTINATIONS)[number];
export type ReferrerCategory = (typeof REFERRER_CATEGORIES)[number];
export type ScreenCategory = (typeof SCREEN_CATEGORIES)[number];
export type ScrollDepth = (typeof SCROLL_DEPTHS)[number];

type BioEventCommon = {
  event_id: string;
  occurred_at: string;
  schema_version: 1;
  visitor_id: string;
  session_id: string;
  sequence_no: number;
  landing_path: "/bio";
  referrer_category: ReferrerCategory | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  elapsed_ms: number;
  is_returning: boolean;
  screen_category: ScreenCategory | null;
  language: string | null;
  timezone: string | null;
};

export type BioEventInput = BioEventCommon &
  (
    | {
        event_name: "bio_page_view";
        section_id: null;
        product_slug: null;
        cta_id: null;
        cta_position: null;
        destination: null;
        scroll_depth: null;
      }
    | {
        event_name: "bio_section_view";
        section_id: string;
        product_slug: null;
        cta_id: null;
        cta_position: null;
        destination: null;
        scroll_depth: null;
      }
    | {
        event_name: "bio_scroll_depth";
        section_id: null;
        product_slug: null;
        cta_id: null;
        cta_position: null;
        destination: null;
        scroll_depth: ScrollDepth;
      }
    | {
        event_name: "bio_product_view";
        section_id: string;
        product_slug: BioProductSlug;
        cta_id: null;
        cta_position: null;
        destination: null;
        scroll_depth: null;
      }
    | {
        event_name: "bio_outbound_click";
        section_id: string;
        product_slug: BioProductSlug | null;
        cta_id: string;
        cta_position: string;
        destination: Exclude<BioDestination, "share">;
        scroll_depth: null;
      }
    | {
        event_name: "bio_share_click";
        section_id: string;
        product_slug: null;
        cta_id: string;
        cta_position: string;
        destination: "share";
        scroll_depth: null;
      }
  );

export type BioEventParseResult =
  | { success: true; data: BioEventInput }
  | { success: false; error: string };

const ALLOWED_KEYS = new Set<keyof BioEventInput>([
  "event_id",
  "occurred_at",
  "schema_version",
  "event_name",
  "visitor_id",
  "session_id",
  "sequence_no",
  "section_id",
  "product_slug",
  "cta_id",
  "cta_position",
  "destination",
  "landing_path",
  "referrer_category",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "elapsed_ms",
  "is_returning",
  "screen_category",
  "language",
  "timezone",
  "scroll_depth",
]);

const REQUIRED_KEYS: ReadonlyArray<keyof BioEventInput> = [
  "event_id",
  "occurred_at",
  "schema_version",
  "event_name",
  "visitor_id",
  "session_id",
  "sequence_no",
  "landing_path",
  "elapsed_ms",
  "is_returning",
];

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ISO_TIMESTAMP_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|[+-](\d{2}):(\d{2}))$/;
const MAX_FUTURE_SKEW_MS = 5 * 60_000;

function isAllowed<T>(values: readonly T[], value: unknown): value is T {
  return values.includes(value as T);
}

function failure(error: string): BioEventParseResult {
  return { success: false, error };
}

function parseNullableText(
  record: Record<string, unknown>,
  key: keyof typeof BIO_EVENT_TEXT_LIMITS,
): { valid: true; value: string | null } | { valid: false } {
  const value = record[key];
  if (value === undefined || value === null) return { valid: true, value: null };
  const max = BIO_EVENT_TEXT_LIMITS[key];
  if (typeof value !== "string" || value.trim().length > max) {
    return { valid: false };
  }
  return { valid: true, value: normalizeText(value, max) };
}

export function normalizeText(value: unknown, max = MAX_BIO_EVENT_TEXT_LENGTH): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  if (!normalized) return null;
  return normalized.slice(0, Math.max(0, max)).trim() || null;
}

export function classifyReferrer(value: string): ReferrerCategory {
  if (!value.trim()) return "direct";

  try {
    const referrer = new URL(value.trim());
    if (referrer.protocol !== "http:" && referrer.protocol !== "https:") return "other";

    const hostname = referrer.hostname.toLowerCase().replace(/\.$/, "");
    if (hostname === "instagram.com" || hostname.endsWith(".instagram.com")) return "instagram";
    if (hostname === "tiktok.com" || hostname.endsWith(".tiktok.com")) return "tiktok";
    if (/(?:^|\.)google\.(?:com|[a-z]{2}|(?:co|com)\.[a-z]{2})$/.test(hostname)) return "google";
    return "other";
  } catch {
    return "other";
  }
}

function isValidIsoTimestamp(value: string): boolean {
  const match = ISO_TIMESTAMP_PATTERN.exec(value);
  if (!match) return false;

  const [, yearText, monthText, dayText, hourText, minuteText, secondText, zone, offsetHourText, offsetMinuteText] =
    match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const second = Number(secondText);

  if (month < 1 || month > 12 || hour > 23 || minute > 59 || second > 59) return false;

  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day < 1 || day > daysInMonth[month - 1]) return false;

  if (zone !== "Z") {
    const offsetHour = Number(offsetHourText);
    const offsetMinute = Number(offsetMinuteText);
    if (offsetHour > 14 || offsetMinute > 59 || (offsetHour === 14 && offsetMinute !== 0)) {
      return false;
    }
  }

  return Number.isFinite(Date.parse(value));
}

export function getScreenCategory(width: number): ScreenCategory {
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

export function parseBioEvent(value: unknown): BioEventParseResult {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return failure("Event must be an object");
  }

  const record = value as Record<string, unknown>;
  const unknownKey = Object.keys(record).find((key) => !ALLOWED_KEYS.has(key as keyof BioEventInput));
  if (unknownKey) return failure(`Unknown field: ${unknownKey}`);

  const missingKey = REQUIRED_KEYS.find((key) => !(key in record));
  if (missingKey) return failure(`Missing required field: ${missingKey}`);

  if (typeof record.event_id !== "string" || !UUID_PATTERN.test(record.event_id)) {
    return failure("Invalid event_id");
  }
  if (typeof record.visitor_id !== "string" || !UUID_PATTERN.test(record.visitor_id)) {
    return failure("Invalid visitor_id");
  }
  if (typeof record.session_id !== "string" || !UUID_PATTERN.test(record.session_id)) {
    return failure("Invalid session_id");
  }

  if (
    typeof record.occurred_at !== "string" ||
    !isValidIsoTimestamp(record.occurred_at)
  ) {
    return failure("Invalid occurred_at");
  }
  if (Date.parse(record.occurred_at) > Date.now() + MAX_FUTURE_SKEW_MS) {
    return failure("occurred_at is too far in the future");
  }

  if (record.schema_version !== 1) return failure("Unsupported schema_version");
  if (!isAllowed(BIO_EVENT_NAMES, record.event_name)) return failure("Unsupported event_name");
  if (record.landing_path !== "/bio") return failure("Invalid landing_path");
  if (typeof record.is_returning !== "boolean") return failure("Invalid is_returning");

  if (
    !Number.isInteger(record.sequence_no) ||
    (record.sequence_no as number) <= 0 ||
    (record.sequence_no as number) > MAX_BIO_EVENT_INTEGER
  ) {
    return failure("Invalid sequence_no");
  }
  if (
    !Number.isInteger(record.elapsed_ms) ||
    (record.elapsed_ms as number) < 0 ||
    (record.elapsed_ms as number) > MAX_BIO_EVENT_INTEGER
  ) {
    return failure("Invalid elapsed_ms");
  }

  const textFields = [
    "section_id",
    "cta_id",
    "cta_position",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "language",
    "timezone",
  ] as const;
  const normalizedText = {} as Record<(typeof textFields)[number], string | null>;
  for (const key of textFields) {
    const parsed = parseNullableText(record, key);
    if (!parsed.valid) return failure(`Invalid ${key}`);
    normalizedText[key] = parsed.value;
  }

  const productSlug = record.product_slug ?? null;
  if (productSlug !== null && !isAllowed(PRODUCT_SLUGS, productSlug)) {
    return failure("Unsupported product_slug");
  }
  const destination = record.destination ?? null;
  if (destination !== null && !isAllowed(DESTINATIONS, destination)) {
    return failure("Unsupported destination");
  }
  const screenCategory = record.screen_category ?? null;
  if (screenCategory !== null && !isAllowed(SCREEN_CATEGORIES, screenCategory)) {
    return failure("Unsupported screen_category");
  }
  const scrollDepth = record.scroll_depth ?? null;
  if (scrollDepth !== null && !isAllowed(SCROLL_DEPTHS, scrollDepth)) {
    return failure("Unsupported scroll_depth");
  }

  const parsedReferrer = parseNullableText(record, "referrer_category");
  if (!parsedReferrer.valid) return failure("Invalid referrer_category");
  if (
    parsedReferrer.value !== null &&
    !isAllowed(REFERRER_CATEGORIES, parsedReferrer.value)
  ) {
    return failure("Unsupported referrer_category");
  }

  const sectionId = normalizedText.section_id;
  const ctaId = normalizedText.cta_id;
  const ctaPosition = normalizedText.cta_position;
  const hasForbidden = (...fields: unknown[]) => fields.some((field) => field !== null);

  switch (record.event_name) {
    case "bio_page_view":
      if (hasForbidden(sectionId, productSlug, ctaId, ctaPosition, destination, scrollDepth)) {
        return failure("bio_page_view contains incompatible fields");
      }
      break;
    case "bio_section_view":
      if (sectionId === null || hasForbidden(productSlug, ctaId, ctaPosition, destination, scrollDepth)) {
        return failure("bio_section_view requires only section_id");
      }
      break;
    case "bio_scroll_depth":
      if (scrollDepth === null || hasForbidden(sectionId, productSlug, ctaId, ctaPosition, destination)) {
        return failure("bio_scroll_depth requires only scroll_depth");
      }
      break;
    case "bio_product_view":
      if (
        sectionId === null ||
        productSlug === null ||
        hasForbidden(ctaId, ctaPosition, destination, scrollDepth)
      ) {
        return failure("bio_product_view requires section_id and product_slug");
      }
      break;
    case "bio_outbound_click":
      if (
        sectionId === null ||
        ctaId === null ||
        ctaPosition === null ||
        destination === null ||
        destination === "share" ||
        scrollDepth !== null
      ) {
        return failure("bio_outbound_click requires section, CTA, position, and destination");
      }
      break;
    case "bio_share_click":
      if (
        sectionId === null ||
        ctaId === null ||
        ctaPosition === null ||
        destination !== "share" ||
        hasForbidden(productSlug, scrollDepth)
      ) {
        return failure("bio_share_click requires a share CTA without product or scroll fields");
      }
      break;
  }

  return {
    success: true,
    data: {
      event_id: record.event_id.toLowerCase(),
      occurred_at: record.occurred_at,
      schema_version: 1,
      event_name: record.event_name,
      visitor_id: record.visitor_id.toLowerCase(),
      session_id: record.session_id.toLowerCase(),
      sequence_no: record.sequence_no as number,
      section_id: sectionId,
      product_slug: productSlug,
      cta_id: ctaId,
      cta_position: ctaPosition,
      destination,
      landing_path: "/bio",
      referrer_category: parsedReferrer.value,
      utm_source: normalizedText.utm_source,
      utm_medium: normalizedText.utm_medium,
      utm_campaign: normalizedText.utm_campaign,
      utm_content: normalizedText.utm_content,
      utm_term: normalizedText.utm_term,
      elapsed_ms: record.elapsed_ms as number,
      is_returning: record.is_returning,
      screen_category: screenCategory,
      language: normalizedText.language,
      timezone: normalizedText.timezone,
      scroll_depth: scrollDepth,
    } as BioEventInput,
  };
}
