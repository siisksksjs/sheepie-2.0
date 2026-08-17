# Sheepie Bio Page and Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the branded `sheepiesleep.com/bio` conversion catalog, record privacy-safe behavior through outbound clicks, and expose detailed combined Umami/Supabase reporting at `dashboard.sheepiesleep.com/bio-analytics`.

**Architecture:** The main `sheepie` app owns the exact `/bio` route, code-configured content, browser session tracker, and a same-origin validated ingestion endpoint. The shared Supabase project stores append-only custom events and serves indexed aggregate RPCs; the separate authenticated `dashboard-sheepie` app joins those aggregates with server-side Umami Cloud API data and renders filters, charts, journeys, event details, and CSV export. Tracking is non-blocking and fails open so analytics can never interrupt an outbound link.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, next/image, Framer Motion, Supabase Postgres/RPC, `@supabase/supabase-js`, Umami Cloud API, Recharts 3, Vitest.

---

## Repository and File Map

The workspace contains two independent Git repositories. Run commands from the repository named by each task.

### `dashboard-sheepie` repository

- `supabase/migrations/20260817_add_bio_analytics.sql` — append-only event schema, rate buckets, RLS, retention, ingestion, aggregates, journey, and filter RPCs.
- `lib/types/database.types.ts` — TypeScript row shape for `bio_events`.
- `lib/bio-analytics/types.ts` — shared dashboard contracts and filter definitions.
- `lib/bio-analytics/range.ts` — Jakarta date parsing and Umami time-unit selection.
- `lib/bio-analytics/range.test.ts` — range boundary tests.
- `lib/bio-analytics/umami.ts` — server-only Umami Cloud client using `x-umami-api-key`.
- `lib/bio-analytics/umami.test.ts` — request construction and degraded-response tests.
- `lib/actions/bio-analytics.ts` — authenticated Supabase RPC loading and Umami/Supabase bundle assembly.
- `lib/bio-analytics/metrics.ts` — pure CTR, funnel, and time-series merge helpers.
- `lib/bio-analytics/metrics.test.ts` — metric-definition tests.
- `app/(dashboard)/bio-analytics/page.tsx` — protected server page and URL-filter parsing.
- `app/(dashboard)/bio-analytics/bio-analytics-client.tsx` — interactive dashboard composition.
- `components/bio-analytics/filters.tsx` — URL-backed filters.
- `components/bio-analytics/charts.tsx` — Recharts traffic, product, marketplace, funnel, engagement, and heatmap visuals.
- `components/bio-analytics/tables.tsx` — product, journey, audience, and event tables.
- `app/api/bio-analytics/export/route.ts` — authenticated, filtered CSV stream.
- `components/layout/sidebar.tsx` — adds Bio Analytics navigation.
- `.env.example` and `README.md` — Umami reporting and shared Supabase configuration.

### `sheepie` repository

- `package.json`, `package-lock.json`, `vitest.config.ts` — add Supabase and focused unit-test support.
- `.env.example` — ingestion-only server environment variables.
- `middleware.ts` — reserves exact `/bio` outside locale middleware.
- `data/bio.ts` — typed, code-configured bio content and stable tracking IDs.
- `lib/bio-analytics/contracts.ts` — public event schema, allowlists, and normalization.
- `lib/bio-analytics/contracts.test.ts` — validation and normalization tests.
- `lib/bio-analytics/session.ts` — anonymous visitor/session lifecycle and UTM capture.
- `lib/bio-analytics/session.test.ts` — session-boundary and campaign tests.
- `lib/bio-analytics/client.ts` — non-blocking event delivery.
- `lib/bio-analytics/server.ts` — server-only Supabase RPC client and daily IP-derived rate key.
- `app/api/bio-events/route.ts` — same-origin event ingestion route.
- `app/api/bio-events/route.test.ts` — request validation and response tests.
- `app/bio/layout.tsx` — standalone branded root layout for the exact unlocalized route.
- `app/bio/page.tsx` — metadata and public page composition.
- `components/bio/bio-page.tsx` — branded server-rendered catalog.
- `components/bio/bio-tracker.tsx` — view, scroll, section, and click tracking.
- `components/bio/marketplace-button.tsx` — accessible tracked outbound action.
- `app/sitemap.ts` — adds the canonical bio URL.

## Task 1: Create the Supabase analytics schema and ingestion boundary

**Repository:** `/Users/tsth/Coding/sheepie/dashboard-sheepie`

**Files:**
- Create: `supabase/migrations/20260817_add_bio_analytics.sql`
- Create: `lib/bio-analytics/schema-contract.test.ts`
- Modify: `lib/types/database.types.ts`

- [ ] **Step 1: Write the schema contract test**

Create `lib/bio-analytics/schema-contract.test.ts`:

```ts
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const migration = readFileSync(
  fileURLToPath(new URL("../../supabase/migrations/20260817_add_bio_analytics.sql", import.meta.url)),
  "utf8",
)

describe("bio analytics schema", () => {
  it("keeps events append-only and inaccessible to anon", () => {
    expect(migration).toContain("ALTER TABLE bio_events ENABLE ROW LEVEL SECURITY")
    expect(migration).toContain("TO authenticated USING (true)")
    expect(migration).toContain("REVOKE ALL ON bio_events FROM anon")
    expect(migration).toContain("prevent_bio_event_mutation")
  })

  it("provides service-only ingestion, reporting, and retention functions", () => {
    for (const name of [
      "ingest_bio_event",
      "get_bio_analytics_summary",
      "get_bio_filter_options",
      "get_bio_journeys",
      "delete_expired_bio_events",
    ]) expect(migration).toContain(name)
    expect(migration).toContain("GRANT EXECUTE ON FUNCTION ingest_bio_event")
    expect(migration).toContain("TO service_role")
  })
})
```

- [ ] **Step 2: Run the focused test and verify the missing migration failure**

Run: `npm test -- lib/bio-analytics/schema-contract.test.ts`

Expected: FAIL because `20260817_add_bio_analytics.sql` does not exist.

- [ ] **Step 3: Create the migration**

Create `supabase/migrations/20260817_add_bio_analytics.sql` beginning with these objects:

```sql
CREATE TABLE bio_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL UNIQUE,
  occurred_at TIMESTAMPTZ NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  schema_version SMALLINT NOT NULL DEFAULT 1 CHECK (schema_version = 1),
  event_name TEXT NOT NULL CHECK (event_name IN (
    'bio_page_view', 'bio_section_view', 'bio_scroll_depth',
    'bio_product_view', 'bio_outbound_click', 'bio_share_click'
  )),
  visitor_id UUID NOT NULL,
  session_id UUID NOT NULL,
  sequence_no INTEGER NOT NULL CHECK (sequence_no > 0),
  section_id TEXT,
  product_slug TEXT CHECK (product_slug IS NULL OR product_slug IN ('cervicloud','lumicloud','calmicloud')),
  cta_id TEXT,
  cta_position TEXT,
  destination TEXT CHECK (destination IS NULL OR destination IN ('shopee','tokopedia','website','whatsapp','instagram','tiktok','share')),
  landing_path TEXT NOT NULL DEFAULT '/bio' CHECK (landing_path = '/bio'),
  referrer_category TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  elapsed_ms INTEGER NOT NULL DEFAULT 0 CHECK (elapsed_ms >= 0),
  is_returning BOOLEAN NOT NULL DEFAULT false,
  screen_category TEXT CHECK (screen_category IN ('mobile','tablet','desktop')),
  language TEXT,
  timezone TEXT,
  scroll_depth SMALLINT CHECK (scroll_depth IS NULL OR scroll_depth IN (25,50,75,100)),
  UNIQUE (session_id, sequence_no)
);

CREATE TABLE bio_event_rate_buckets (
  rate_key TEXT NOT NULL,
  minute_bucket TIMESTAMPTZ NOT NULL,
  event_count INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (rate_key, minute_bucket)
);

CREATE INDEX bio_events_occurred_at_idx ON bio_events (occurred_at DESC);
CREATE INDEX bio_events_session_idx ON bio_events (session_id, sequence_no);
CREATE INDEX bio_events_visitor_idx ON bio_events (visitor_id, occurred_at DESC);
CREATE INDEX bio_events_product_idx ON bio_events (product_slug, occurred_at DESC) WHERE product_slug IS NOT NULL;
CREATE INDEX bio_events_destination_idx ON bio_events (destination, occurred_at DESC) WHERE destination IS NOT NULL;
CREATE INDEX bio_events_campaign_idx ON bio_events (utm_source, utm_campaign, occurred_at DESC);

ALTER TABLE bio_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE bio_event_rate_buckets ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON bio_events, bio_event_rate_buckets FROM anon;
GRANT SELECT ON bio_events TO authenticated;
CREATE POLICY "Authenticated users read bio events"
ON bio_events FOR SELECT TO authenticated USING (true);

CREATE OR REPLACE FUNCTION prevent_bio_event_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'bio_events is append-only'; END $$;
CREATE TRIGGER bio_events_no_update BEFORE UPDATE OR DELETE ON bio_events
FOR EACH ROW EXECUTE FUNCTION prevent_bio_event_mutation();
```

In the same migration, add:

- `ingest_bio_event(payload jsonb, request_rate_key text)` as `SECURITY DEFINER`; increment the current minute bucket, reject counts above 120/minute, and insert the validated mapped fields with `ON CONFLICT (event_id) DO NOTHING`.
- `get_bio_analytics_summary(start_at timestamptz, end_at timestamptz, filters jsonb)` returning JSON with `kpis`, `time_series`, `products`, `marketplaces`, `funnel`, `sections`, `scroll_depth`, and `heatmap`. Every query must apply the same date and JSON filters.
- `get_bio_filter_options(start_at timestamptz, end_at timestamptz)` returning distinct products, destinations, UTM sources, and campaigns.
- `get_bio_journeys(start_at timestamptz, end_at timestamptz, filters jsonb, row_limit integer default 20)` using `string_agg(event_name || coalesce(':' || product_slug, '') || coalesce(':' || destination, ''), ' → ' ORDER BY sequence_no)` grouped by session.
- `delete_expired_bio_events(retain_months integer default 13)` deleting raw events and expired rate buckets.
- Execute `REVOKE ALL ON FUNCTION ... FROM PUBLIC` for every function. Grant `ingest_bio_event` only to `service_role`; grant the three reporting functions to `authenticated, service_role`; grant `delete_expired_bio_events` only to `service_role`.

- [ ] **Step 4: Add the database row type**

Append to `lib/types/database.types.ts`:

```ts
export type BioEventName =
  | "bio_page_view" | "bio_section_view" | "bio_scroll_depth"
  | "bio_product_view" | "bio_outbound_click" | "bio_share_click"

export type BioEvent = {
  id: string; event_id: string; occurred_at: string; received_at: string
  schema_version: 1; event_name: BioEventName; visitor_id: string; session_id: string
  sequence_no: number; section_id: string | null; product_slug: string | null
  cta_id: string | null; cta_position: string | null; destination: string | null
  landing_path: "/bio"; referrer_category: string | null; utm_source: string | null
  utm_medium: string | null; utm_campaign: string | null; utm_content: string | null
  utm_term: string | null; elapsed_ms: number; is_returning: boolean
  screen_category: "mobile" | "tablet" | "desktop" | null
  language: string | null; timezone: string | null; scroll_depth: 25 | 50 | 75 | 100 | null
}
```

- [ ] **Step 5: Run verification and commit the schema**

Run: `npm test -- lib/bio-analytics/schema-contract.test.ts && npm run typecheck`

Expected: PASS with no TypeScript errors.

```bash
git add supabase/migrations/20260817_add_bio_analytics.sql lib/bio-analytics/schema-contract.test.ts lib/types/database.types.ts
git commit -m "feat: add bio analytics event schema"
```

## Task 2: Add validated public analytics contracts and session lifecycle

**Repository:** `/Users/tsth/Coding/sheepie/sheepie`

**Files:**
- Modify: `package.json`, `package-lock.json`
- Create: `vitest.config.ts`
- Create: `lib/bio-analytics/contracts.ts`
- Create: `lib/bio-analytics/contracts.test.ts`
- Create: `lib/bio-analytics/session.ts`
- Create: `lib/bio-analytics/session.test.ts`

- [ ] **Step 1: Install focused dependencies and configure tests**

Run: `npm install @supabase/supabase-js && npm install -D vitest`

Add scripts to `package.json`:

```json
"test": "vitest run",
"typecheck": "tsc --noEmit"
```

Create `vitest.config.ts`:

```ts
import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  test: { environment: "node", include: ["lib/**/*.test.ts", "app/**/*.test.ts"] },
})
```

- [ ] **Step 2: Write failing contract and session tests**

Test these exact behaviors:

```ts
expect(parseBioEvent(validEvent).success).toBe(true)
expect(parseBioEvent({ ...validEvent, event_name: "purchase" }).success).toBe(false)
expect(normalizeText(" x ".repeat(200), 64)?.length).toBeLessThanOrEqual(64)
expect(classifyReferrer("https://www.instagram.com/")).toBe("instagram")
expect(getScreenCategory(390)).toBe("mobile")
expect(shouldRotateSession({ lastActivityAt: 0 }, 30 * 60_000 + 1)).toBe(true)
expect(captureCampaign(new URL("https://sheepiesleep.com/bio?utm_source=ig&utm_campaign=launch"))).toEqual(
  expect.objectContaining({ utm_source: "ig", utm_campaign: "launch" }),
)
```

Run: `npm test -- lib/bio-analytics/contracts.test.ts lib/bio-analytics/session.test.ts`

Expected: FAIL because the modules do not exist.

- [ ] **Step 3: Implement the event contract**

In `contracts.ts`, export the literal allowlists, `BioEventInput`, and:

```ts
export function parseBioEvent(value: unknown):
  | { success: true; data: BioEventInput }
  | { success: false; error: string }

export function normalizeText(value: unknown, max = 120): string | null
export function classifyReferrer(value: string): "instagram" | "tiktok" | "google" | "direct" | "other"
export function getScreenCategory(width: number): "mobile" | "tablet" | "desktop"
```

The parser must reject unknown keys, invalid UUIDs, timestamps over five minutes in the future, unsupported products/destinations, invalid scroll depths, and JSON bodies above the route's 8 KB limit. It must normalize text before returning data.

- [ ] **Step 4: Implement session and campaign state**

In `session.ts`, export pure helpers plus a browser adapter:

```ts
export const SESSION_TIMEOUT_MS = 30 * 60_000
export type Campaign = { utm_source: string | null; utm_medium: string | null; utm_campaign: string | null; utm_content: string | null; utm_term: string | null }
export function shouldRotateSession(state: { lastActivityAt: number }, now: number): boolean
export function captureCampaign(url: URL): Campaign
export function createBioSession(storage: Pick<Storage, "getItem" | "setItem">, sessionStorage: Pick<Storage, "getItem" | "setItem">, now?: number): {
  visitorId: string; sessionId: string; sequenceNo: number; isReturning: boolean; campaign: Campaign
}
```

Use `crypto.randomUUID()`, `localStorage` for the visitor and first-seen marker, and `sessionStorage` for session ID, activity time, sequence, and landing campaign. Rotate after 30 minutes of inactivity.

- [ ] **Step 5: Verify and commit contracts**

Run: `npm test -- lib/bio-analytics/contracts.test.ts lib/bio-analytics/session.test.ts && npm run typecheck`

Expected: PASS.

```bash
git add package.json package-lock.json vitest.config.ts lib/bio-analytics
git commit -m "feat: define bio analytics client contracts"
```

## Task 3: Implement the protected event ingestion route

**Repository:** `/Users/tsth/Coding/sheepie/sheepie`

**Files:**
- Create: `lib/bio-analytics/server.ts`
- Create: `app/api/bio-events/route.ts`
- Create: `app/api/bio-events/route.test.ts`
- Modify: `.env.example`

- [ ] **Step 1: Write route tests against an injected ingestion function**

Cover:

```ts
expect((await POST(makeRequest(validEvent), { ingest: vi.fn().mockResolvedValue("inserted") })).status).toBe(202)
expect((await POST(makeRequest({ event_name: "purchase" }), deps)).status).toBe(400)
expect((await POST(makeRequest(validEvent, { origin: "https://evil.example" }), deps)).status).toBe(403)
expect((await POST(makeOversizedRequest(), deps)).status).toBe(413)
```

Run: `npm test -- app/api/bio-events/route.test.ts`

Expected: FAIL because the route does not exist.

- [ ] **Step 2: Implement the server-only Supabase caller**

Create `server.ts`:

```ts
import "server-only"
import { createClient } from "@supabase/supabase-js"
import { createHmac } from "node:crypto"
import type { BioEventInput } from "./contracts"

export function createDailyRateKey(ip: string, day: string) {
  const secret = process.env.BIO_ANALYTICS_RATE_SECRET!
  return createHmac("sha256", secret).update(`${day}:${ip}`).digest("hex")
}

export async function ingestBioEvent(event: BioEventInput, rateKey: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  )
  const { error } = await supabase.rpc("ingest_bio_event", { payload: event, request_rate_key: rateKey })
  if (error) throw error
}
```

- [ ] **Step 3: Implement the route**

The route must:

- require `content-type: application/json`;
- reject `content-length > 8192` before reading;
- accept only same-origin requests whose `Origin` is absent or equals `https://sheepiesleep.com`/the current request origin;
- reject obvious bots from a short, explicit user-agent regex;
- parse with `parseBioEvent`;
- derive the client address from the first trusted forwarded address, hash it with the current UTC date and `BIO_ANALYTICS_RATE_SECRET`, and never persist the raw value;
- call `ingestBioEvent` and return `202` with `{ accepted: true }`;
- return `429` for the database rate-limit error and `503` for other storage errors without echoing internals.

Export a small `createPostHandler(deps)` factory and `POST = createPostHandler({ ingest: ingestBioEvent })` so tests do not access the network.

- [ ] **Step 4: Document environment variables**

Add to `.env.example`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
BIO_ANALYTICS_RATE_SECRET=
```

- [ ] **Step 5: Verify and commit ingestion**

Run: `npm test -- app/api/bio-events/route.test.ts && npm run typecheck && npm run lint`

Expected: PASS.

```bash
git add app/api/bio-events lib/bio-analytics/server.ts .env.example
git commit -m "feat: ingest privacy-safe bio events"
```

## Task 4: Build the code-configured Sheepie bio page

**Repository:** `/Users/tsth/Coding/sheepie/sheepie`

**Files:**
- Create: `data/bio.ts`
- Create: `app/bio/layout.tsx`
- Create: `app/bio/page.tsx`
- Create: `components/bio/bio-page.tsx`
- Create: `components/bio/marketplace-button.tsx`
- Modify: `middleware.ts`
- Modify: `app/sitemap.ts`

- [ ] **Step 1: Reserve the exact unlocalized route**

Change the middleware matcher to exclude `bio` while continuing to localize all existing pages:

```ts
export const config = {
  matcher: ["/((?!api|bio(?:/|$)|_next|.*\\..*).*)"],
}
```

Verify with `npm run dev` and `curl -I http://localhost:3000/bio`: expected `200`, not a redirect to `/en/bio`.

- [ ] **Step 2: Create the typed page configuration**

`data/bio.ts` must map the three existing `data/products.json` products into this contract:

```ts
export type BioProduct = {
  slug: "cervicloud" | "lumicloud" | "calmicloud"
  eyebrow: string; headline: string; description: string
  image: string; price: string
  actions: Array<{ id: string; label: string; destination: "shopee" | "tokopedia"; href: string }>
}

export const bioConfig = {
  title: "Tidur lebih dalam. Bangun lebih jernih.",
  subtitle: "Tiga essential untuk malam yang lebih tenang.",
  products: products.map((product) => ({
    slug: product.slug,
    eyebrow: product.slug === "cervicloud" ? "Penyelarasan" : product.slug === "lumicloud" ? "Kegelapan" : "Keheningan",
    headline: product.name,
    description: product.tagline,
    image: product.images[0],
    price: product.price,
    actions: [
      { id: `${product.slug}_shopee_primary`, label: "Beli di Shopee", destination: "shopee", href: product.shopeeUrl },
      { id: `${product.slug}_tokopedia_primary`, label: "Beli di Tokopedia", destination: "tokopedia", href: product.tokopediaUrl },
    ],
  })),
  hubs: [
    { id: "website_hub", label: "Website Resmi", destination: "website", href: "https://sheepiesleep.com/id" },
    { id: "shopee_store_hub", label: "Shopee Official Store", destination: "shopee", href: "https://shopee.co.id/sheepie.sleep" },
    { id: "tokopedia_store_hub", label: "Tokopedia Official Store", destination: "tokopedia", href: "https://www.tokopedia.com/sheepie" },
  ],
} satisfies BioConfig
```

Read the WhatsApp customer-service URL from the required `NEXT_PUBLIC_SHEEPIE_WHATSAPP_URL` deployment variable and append its hub entry when configured; add this variable to `.env.example`. This avoids inventing or committing a customer-service phone number.

Use stable IDs such as `cervicloud_shopee_primary`, not translated button labels.

- [ ] **Step 3: Create the standalone root layout and metadata page**

`app/bio/layout.tsx` imports `../globals.css`, configures the same Playfair Display and Quicksand CSS variables as the localized root layout, renders `UmamiAnalytics`, and does not render the main navbar, language modal, or Lenis scrolling.

`app/bio/page.tsx` exports canonical metadata for `https://sheepiesleep.com/bio` and renders `<BioPage config={bioConfig} />`.

- [ ] **Step 4: Implement the branded catalog**

Build `BioPage` as server-rendered sections:

- compact Sheepie wordmark/social/share header;
- cream/blue hero using an existing photoshoot image;
- three alternating product stories using `next/image` and the configured primary listing image;
- marketplace hub;
- compact trust/review strip based on existing Sheepie proof content;
- final repeated marketplace actions;
- footer disclosure: “Halaman ini menggunakan analitik anonim untuk memahami interaksi, tanpa menyimpan nama, email, atau alamat IP.”

Use the existing CSS variables, Playfair/Quicksand, `rounded-[2rem]` product framing, blue/cream blocks, cloud-like pseudo-elements, accessible focus rings, semantic headings, and `prefers-reduced-motion` support. Avoid a generic button stack.

- [ ] **Step 5: Implement outbound buttons and sitemap entry**

`MarketplaceButton` must render a normal `<a target="_blank" rel="noopener noreferrer">` with `data-bio-*` attributes for stable IDs, product, destination, section, and position. It must work without JavaScript.

Add `https://sheepiesleep.com/bio` to `app/sitemap.ts` with `changeFrequency: "weekly"` and `priority: 0.9`.

- [ ] **Step 6: Verify and commit the public experience**

Run: `npm run lint && npm run typecheck && npm run build`

Expected: all commands pass and `/bio` is generated as its own route.

```bash
git add middleware.ts app/bio app/sitemap.ts components/bio data/bio.ts
git commit -m "feat: add Sheepie social bio catalog"
```

## Task 5: Add non-blocking behavioral tracking to the bio page

**Repository:** `/Users/tsth/Coding/sheepie/sheepie`

**Files:**
- Create: `lib/bio-analytics/client.ts`
- Create: `lib/bio-analytics/client.test.ts`
- Create: `components/bio/bio-tracker.tsx`
- Modify: `components/bio/bio-page.tsx`

- [ ] **Step 1: Write delivery and deduplication tests**

Test that `sendBioEvent` prefers `navigator.sendBeacon`, falls back to `fetch(..., { keepalive: true })`, and never throws. Test a `Set<string>`-backed `once(key, fn)` helper so section and scroll events are emitted only once per session.

Run: `npm test -- lib/bio-analytics/client.test.ts`

Expected: FAIL because the client module does not exist.

- [ ] **Step 2: Implement non-blocking delivery**

```ts
export function sendBioEvent(event: BioEventInput, transport = defaultTransport): void {
  try {
    const body = JSON.stringify(event)
    if (transport.sendBeacon?.("/api/bio-events", new Blob([body], { type: "application/json" }))) return
    void transport.fetch("/api/bio-events", {
      method: "POST", headers: { "content-type": "application/json" }, body, keepalive: true,
    }).catch(() => undefined)
  } catch {
    return
  }
}
```

The client event factory must combine session state, elapsed time, campaign, language, timezone, screen category, stable element fields, and a new event UUID.

- [ ] **Step 3: Implement the tracker component**

`BioTracker` must:

- send `bio_page_view` once after hydration;
- observe `[data-bio-section]` at 35% visibility and emit one `bio_section_view` per section;
- emit `bio_product_view` when a product section first becomes visible;
- emit scroll milestones 25/50/75/100 once;
- listen for clicks on `[data-bio-cta]`, emit `bio_outbound_click` or `bio_share_click`, and never call `preventDefault()`;
- use `navigator.share` only when the dedicated share button is clicked, with clipboard fallback;
- mirror outbound clicks to `window.umami?.track("bio_outbound_click", safeProperties)` for aggregate correlation.

Render `<BioTracker />` once inside `BioPage` and mark every section with a stable `data-bio-section`.

- [ ] **Step 4: Verify navigation remains independent**

Run tests, then manually block `/api/bio-events` in browser developer tools and click every marketplace button. Expected: each destination opens immediately and no visitor-facing error appears.

- [ ] **Step 5: Verify and commit tracking**

Run: `npm test && npm run lint && npm run typecheck && npm run build`

Expected: PASS.

```bash
git add lib/bio-analytics/client.ts lib/bio-analytics/client.test.ts components/bio
git commit -m "feat: track bio engagement and outbound clicks"
```

## Task 6: Define dashboard range, metric, and Umami service contracts

**Repository:** `/Users/tsth/Coding/sheepie/dashboard-sheepie`

**Files:**
- Create: `lib/bio-analytics/types.ts`
- Create: `lib/bio-analytics/range.ts`
- Create: `lib/bio-analytics/range.test.ts`
- Create: `lib/bio-analytics/metrics.ts`
- Create: `lib/bio-analytics/metrics.test.ts`
- Create: `lib/bio-analytics/umami.ts`
- Create: `lib/bio-analytics/umami.test.ts`

- [ ] **Step 1: Write range and metric tests**

Cover Jakarta-local inclusive dates converted to exclusive UTC bounds, presets, invalid dates, hour/day/month Umami unit selection, zero-denominator CTR, and timestamp-based merging:

```ts
expect(percent(1, 4)).toBe(25)
expect(percent(0, 0)).toBe(0)
expect(selectUmamiUnit({ days: 7 })).toBe("hour")
expect(selectUmamiUnit({ days: 90 })).toBe("day")
expect(parseRange({ preset: "7d" }, new Date("2026-08-17T12:00:00+07:00"))).toMatchObject({ timezone: "Asia/Jakarta" })
```

- [ ] **Step 2: Implement shared dashboard contracts**

Define `BioAnalyticsFilters`, `BioAnalyticsSummary`, `UmamiBundle`, `BioAnalyticsBundle`, `SourceStatus`, product/marketplace/funnel/heatmap rows, journeys, and paginated events. Make source status one of `healthy | unavailable | unconfigured`.

- [ ] **Step 3: Implement pure range and metric helpers**

Use Asia/Jakarta as the explicit reporting timezone. `mergeTrafficSeries` must align ISO timestamps and return `{ timestamp, visitors, sessions, clicks }`. `percent` rounds to one decimal and never returns `NaN`/`Infinity`.

- [ ] **Step 4: Write Umami client request tests**

Inject `fetch` and assert:

- base URL is `https://api.umami.is/v1` unless configured;
- requests use `x-umami-api-key`, never a bearer header;
- every request filters `path=/bio` and passes `timezone=Asia/Jakarta` where supported;
- stats, pageviews, metrics for `referrer/country/region/device/browser/os`, and weekly session heatmap are requested;
- one failed endpoint produces an `unavailable` source result instead of throwing the whole dashboard.

- [ ] **Step 5: Implement the server-only Umami service**

Use the current official Umami Cloud API shape:

```ts
const headers = { Accept: "application/json", "x-umami-api-key": process.env.UMAMI_API_KEY! }
const root = process.env.UMAMI_API_BASE_URL ?? "https://api.umami.is/v1"
```

Call `/websites/{id}/stats`, `/pageviews`, `/metrics?type=...`, and `/sessions/weekly` with `startAt`, `endAt`, `/bio` path filter, supported UTM filters, and correct time unit. Return `unconfigured` when either secret is absent. Limit concurrent requests with one `Promise.allSettled` bundle and cache for five minutes with `next.revalidate`.

- [ ] **Step 6: Verify and commit dashboard foundations**

Run: `npm test -- lib/bio-analytics && npm run typecheck`

Expected: PASS.

```bash
git add lib/bio-analytics
git commit -m "feat: add bio analytics reporting contracts"
```

## Task 7: Load and merge authenticated dashboard data

**Repository:** `/Users/tsth/Coding/sheepie/dashboard-sheepie`

**Files:**
- Create: `lib/actions/bio-analytics.ts`
- Create: `lib/actions/bio-analytics.test.ts`

- [ ] **Step 1: Write action tests with injected Supabase and Umami dependencies**

Test that the action calls `get_bio_analytics_summary`, `get_bio_filter_options`, and `get_bio_journeys` with the same UTC range and filter JSON; fetches a paginated event stream; merges Umami traffic; preserves Supabase results when Umami is unavailable; and throws a safe dashboard error when the authenticated Supabase query fails.

- [ ] **Step 2: Implement the data bundle action**

Export:

```ts
export async function getBioAnalyticsBundle(
  filters: BioAnalyticsFilters,
  deps: BioAnalyticsDependencies = productionDependencies,
): Promise<BioAnalyticsBundle>
```

Use the existing authenticated `createClient()` for RPCs and event-table reads. Select only approved event fields, order by `occurred_at desc`, and paginate 50 rows at a time. Merge click counts into the Umami time series but keep source-specific metrics labeled; never infer purchases.

- [ ] **Step 3: Verify and commit**

Run: `npm test -- lib/actions/bio-analytics.test.ts && npm run typecheck`

Expected: PASS.

```bash
git add lib/actions/bio-analytics.ts lib/actions/bio-analytics.test.ts
git commit -m "feat: assemble hybrid bio analytics data"
```

## Task 8: Build the protected ultra-detailed Bio Analytics dashboard

**Repository:** `/Users/tsth/Coding/sheepie/dashboard-sheepie`

**Files:**
- Create: `app/(dashboard)/bio-analytics/page.tsx`
- Create: `app/(dashboard)/bio-analytics/bio-analytics-client.tsx`
- Create: `components/bio-analytics/filters.tsx`
- Create: `components/bio-analytics/charts.tsx`
- Create: `components/bio-analytics/tables.tsx`
- Modify: `components/layout/sidebar.tsx`

- [ ] **Step 1: Add URL-backed filter parsing and the protected server page**

Accept `preset`, `from`, `to`, `product`, `destination`, `source`, `campaign`, `device`, `country`, `returning`, and `page`. Normalize with `parseRange`, discard invalid enumerations, call `getBioAnalyticsBundle`, and pass the result to the client component. The existing dashboard route group/middleware supplies authentication.

- [ ] **Step 2: Add sidebar navigation**

Import `MousePointerClick` from Lucide and add:

```ts
{ name: "Bio Analytics", href: "/bio-analytics", icon: MousePointerClick }
```

Use `pathname === item.href || pathname.startsWith(item.href + "/")` so nested/filter routes remain highlighted.

- [ ] **Step 3: Build filters and KPI row**

Use current dashboard UI primitives. Filter changes update URL search parameters through `router.replace`; provide Today/7d/30d/90d/custom controls and a clear-all action. KPI cards show Visitors, Sessions, Engaged Sessions, Outbound Clicks, Outbound CTR, Average Engagement Time, and Returning Share, each with an `InfoTooltip` definition and a visible Umami/Supabase source label.

- [ ] **Step 4: Build charts**

Use Recharts and Sheepie tokens for:

- combined visitor/session/click time series;
- source/campaign bars;
- product views/clicks/CTR table-chart;
- Shopee versus Tokopedia comparison;
- four-stage visit → engaged → product view → outbound funnel;
- section reach and scroll depth;
- 7×24 Jakarta heatmap;
- device/browser/OS/country/region breakdowns.

Every chart needs a text title, legend, accessible table fallback or adjacent value list, responsive container, explicit empty state, and no misleading purchase/revenue terminology.

- [ ] **Step 5: Build journey and event detail tables**

Journey rows show event sequence, session count, and share. The event table shows time, anonymous shortened session ID, event, product, destination, section/CTA, source/campaign, elapsed time, device/language, and new/returning status. Add previous/next links that preserve all active filters.

- [ ] **Step 6: Add degraded source states**

Render a compact banner for `unavailable` or `unconfigured` Umami while leaving Supabase sections usable. Distinguish “no matching events” from “data source unavailable.”

- [ ] **Step 7: Verify and commit dashboard UI**

Run: `npm run lint && npm run typecheck && npm test && npm run build`

Expected: PASS and `/bio-analytics` appears in the build output.

```bash
git add app/'(dashboard)'/bio-analytics components/bio-analytics components/layout/sidebar.tsx
git commit -m "feat: add detailed bio analytics dashboard"
```

## Task 9: Add authenticated filtered CSV export

**Repository:** `/Users/tsth/Coding/sheepie/dashboard-sheepie`

**Files:**
- Create: `app/api/bio-analytics/export/route.ts`
- Create: `lib/bio-analytics/csv.ts`
- Create: `lib/bio-analytics/csv.test.ts`
- Modify: `app/(dashboard)/bio-analytics/bio-analytics-client.tsx`

- [ ] **Step 1: Write CSV escaping tests**

Verify commas, quotes, line breaks, nulls, formula-leading values (`=`, `+`, `-`, `@`), stable header order, and Jakarta timestamp formatting.

- [ ] **Step 2: Implement safe CSV serialization**

Export only approved fields. Prefix spreadsheet-formula-leading strings with a single quote, double embedded quotes, and quote every cell.

- [ ] **Step 3: Implement authenticated export**

The route must call the existing server Supabase client and `auth.getUser()`, return `401` without a user, parse the same filter contract as the page, cap export at 100,000 ordered rows, and stream a UTF-8 BOM CSV response named `sheepie-bio-events-YYYY-MM-DD.csv`. Never include IP/rate keys or service credentials.

- [ ] **Step 4: Add the export action and verify**

Add an Export CSV link that preserves active filters. Run:

`npm test -- lib/bio-analytics/csv.test.ts && npm run typecheck && npm run lint`

Expected: PASS.

```bash
git add app/api/bio-analytics app/'(dashboard)'/bio-analytics/bio-analytics-client.tsx lib/bio-analytics/csv.ts lib/bio-analytics/csv.test.ts
git commit -m "feat: export filtered bio analytics events"
```

## Task 10: Document configuration, apply migration, and perform cross-app acceptance

**Repositories:** both repositories

**Files:**
- Create/Modify: `dashboard-sheepie/.env.example`
- Modify: `dashboard-sheepie/README.md`
- Modify: `sheepie/.env.example`
- Modify: `sheepie/app/bio/page.tsx` privacy disclosure footer copy

- [ ] **Step 1: Document dashboard configuration**

Add:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
UMAMI_API_KEY=
UMAMI_WEBSITE_ID=
UMAMI_API_BASE_URL=https://api.umami.is/v1
```

Document that Umami Cloud uses `x-umami-api-key`, is queried server-side only, and the API key is limited to 50 calls per 15 seconds. Document the five-minute dashboard cache and source-degraded behavior.

- [ ] **Step 2: Apply the migration through the existing Supabase deployment workflow**

Apply `supabase/migrations/20260817_add_bio_analytics.sql` through the Supabase SQL editor used by this repository. Verify as an authenticated dashboard user that reporting RPCs execute, and verify the anon role cannot select `bio_events` or execute `ingest_bio_event`.

- [ ] **Step 3: Configure production secrets in the correct deployments**

Main website deployment: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and a generated `BIO_ANALYTICS_RATE_SECRET`.

Dashboard deployment: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `UMAMI_API_KEY`, `UMAMI_WEBSITE_ID`, and optional `UMAMI_API_BASE_URL`.

Do not copy server secrets into `NEXT_PUBLIC_*` variables.

- [ ] **Step 4: Run both complete verification suites**

From `sheepie`:

`npm test && npm run lint && npm run typecheck && npm run build`

From `dashboard-sheepie`:

`npm test && npm run lint && npm run typecheck && npm run build`

Expected: both suites and production builds pass.

- [ ] **Step 5: Run the acceptance journey**

1. Open `/bio?utm_source=instagram&utm_medium=social&utm_campaign=bio_launch&utm_content=profile_link` at a 390×844 viewport.
2. Confirm the exact URL remains `/bio`, the page is visually Sheepie-branded, all three products render, and layout has no horizontal overflow.
3. View CerviCloud, cross 25% and 50% scroll, then click its Shopee primary CTA.
4. Confirm the Shopee destination opens immediately.
5. Confirm exactly one event per milestone, ordered sequence numbers, normalized campaign fields, and no raw IP in Supabase.
6. Open `dashboard.sheepiesleep.com/bio-analytics`, select Today, Instagram, CerviCloud, and Shopee.
7. Confirm the KPI, funnel, product table, journey, heatmap, and event stream include the session under Asia/Jakarta time.
8. Disable Umami credentials locally and confirm a source warning appears while Supabase analytics remains usable.
9. Block event ingestion and confirm all public outbound links remain functional.
10. Export CSV and verify only filtered, approved fields appear.

- [ ] **Step 6: Commit documentation in each repository**

In `dashboard-sheepie`:

```bash
git add .env.example README.md
git commit -m "docs: configure bio analytics reporting"
```

The main-site environment and privacy disclosure are committed in Tasks 3 and 4; verify `git status --short` is clean rather than creating an empty documentation commit.

## Final Verification Checklist

- [ ] `/bio` is canonical, exact, mobile-first, Indonesian-first, and visually consistent with Sheepie rather than Cartiera.
- [ ] CerviCloud, LumiCloud, and CalmiCloud use current code-configured prices, images, and marketplace destinations.
- [ ] Standard links work with JavaScript disabled and during analytics failures.
- [ ] Public event input is allowlisted, size-limited, rate-limited, deduplicated, and contains no direct personal identifiers or raw IP.
- [ ] Umami traffic and Supabase behavior are labeled and combined without calling outbound clicks purchases.
- [ ] Dashboard filters, funnels, journeys, heatmap, event stream, degraded states, pagination, and CSV export work.
- [ ] Raw-event retention defaults to 13 months and can be invoked safely.
- [ ] Both repositories pass tests, lint, type checking, and production builds.
