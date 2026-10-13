# Sheepie Brand Site Redesign (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Sheepie home page, product pages and products index with the approved brand-grade design, and add Meta Pixel + Conversions API tracking for marketplace clicks.

**Architecture:**
- Pages stay in the existing Next.js 16 App Router under `app/[locale]`. They become server components that read a typed product catalog (`lib/catalog`). That catalog merges prices and links from `data/products.json` with page copy kept in Indonesian and English.
- Styling uses CSS Modules (the pattern `/bio` already uses) on top of a small set of `--sp-*` tokens in `app/globals.css`. Interactivity lives in small client islands.
- Tracking:
  - a pure event builder (`lib/meta/events.ts`)
  - a browser sender (`lib/meta/client.ts`)
  - a Conversions API forwarding route (`app/api/meta-events/route.ts`)
  - browser and server share one `event_id`, so Meta deduplicates the pair.

**Tech Stack:** Next.js 16.0.10 (App Router), React 19.2.1, TypeScript, CSS Modules, next-intl 4 (routing only), next/image, sharp (asset script), Vitest 4 (node environment, `renderToStaticMarkup` for component contracts).

**Spec:** `docs/superpowers/specs/2026-10-13-sheepie-brand-site-redesign-design.md`.

**Approved mockups (local, gitignored):** `.superpowers/brainstorm/26086-1791874327/content/home-v3.html` (home) and `pdp-v1.html` (product page). Open them in a browser when a visual detail is unclear; the CSS in this plan is ported from them.

## Global Constraints

- **Brand fonts:** Playfair Display for headings and quotes, Quicksand for body and UI. Load only Playfair 600/700 and Quicksand 500/600/700.
- **Color tokens (exact values):**
  - `--sp-cream #fffdf5`
  - `--sp-linen #f3eee4`
  - `--sp-sky #a3c1e0`
  - `--sp-sky-soft #e4edf5`
  - `--sp-peach #f6cdb8`
  - `--sp-ink #1d2b44`
  - `--sp-night #111b2c`
  - `--sp-line rgba(29,43,68,.12)`
  - logo blue `#7f9fc6`
- **Anti-template rules:** no uppercase wide-tracked eyebrow labels, no italic or mixed-font emphasis inside headlines, no centered-everything sections, no inset rounded color panels.
- **Width rule:**
  - full bleed for the home hero, CerviCloud band, LumiCloud lights-out band, night reviews and footer;
  - contained grid for everything else (max 1320px; 28px gutter on desktop, 20px under 760px);
  - rounded corners only on photos, cards and tiles.
- **Motion:** exactly three effects (breathing lamb, fade-in once, LumiCloud lights-out).
  - Animate only `opacity` and `transform`.
  - No per-frame loop when idle.
  - Honor `prefers-reduced-motion: reduce`.
  - Remove Lenis.
- **Languages:** Indonesian is primary and the default locale (`id`). English mirrors it. Every user-facing string exists in both.
- **Claims:** follow `POSITIONING_FINDINGS.md`:
  - no decibel numbers;
  - no "medical-grade";
  - no "100% blackout" or "total blackout" (say "menutup cahaya untuk kebanyakan orang" / "blocks light for most sleepers");
  - no "3D eye cavities";
  - CerviCloud cover is ice-silk (never bamboo);
  - no treatment or cure language;
  - the adaptation period is "7–14 malam" / "7–14 nights".
- **Reviews:** come from `createBioConfig().testimonials` in `data/bio.ts`. Show them in full text on product pages; any shortened excerpt ends with "…".
- **Tracking:** a tracking failure must never block or delay the shopper reaching Shopee or Tokopedia.
- **Viewports:** mobile is first-class. At 390px there is no horizontal scroll (`document.documentElement.scrollWidth === clientWidth`) and every tap target is at least 44px.
- **Performance targets:** Lighthouse mobile performance ≥ 90 on `/id` and `/id/products/cervicloud`, CLS < 0.05, LCP < 2.5s on simulated 4G.
- **UI strings:** they live in typed TypeScript dictionaries (`lib/site/*-copy.ts`, `lib/catalog/content.ts`), not in `messages/*.json`, so components render in tests without an intl provider. next-intl keeps doing locale routing for the Phase 2 pages.
- **Scope boundary:** About, FAQ, Blog, Contact, `/bio`, `/go` and the campaign pages are not restyled. They only receive the new header and footer through the `Navbar`/`Footer` shims.

## Review Focus

1. **A product URL that is not in the catalog** (`/id/products/bantal`) must show the 404 page, not crash. This is pinned in Task 4 (`isProductSlug`) and Task 13 (`dynamicParams = false` and `generateStaticParams` test).
2. **A shared link with a bad option** (`?option=xyz`) must fall back to the first option, not render an empty buy box. This is pinned in Task 4 (`findOption` fallback) and Task 12 (provider uses `findOption`).
3. **Meta not configured (preview deploys) or Meta's API failing or slow:** the click still navigates and `/api/meta-events` answers 202 without throwing. This is pinned in Task 6 route tests and Task 7 client tests.
4. **Garbage or hostile POSTs to `/api/meta-events`** (not JSON, unknown event, oversized body, extra fields) must get 400 and forward nothing to Meta. This is pinned in Task 6.
5. **An option with no discount** (CerviCloud "Sarung saja", price equals original) must show no strikethrough and no "Hemat 0%". This is pinned in Task 3 (`discountPercent` → `null`) and Task 12 (`PriceLine` render test).

---

## File Structure

```
scripts/extract-brand-assets.mjs           # rebuilds public/brand/* from the brand-book PDF
public/brand/                              # mendung-{white,sky,ink}.png, lamb-{blue,white}.png, icesilk.jpg
i18n/config.ts                             # locales, defaultLocale (id), isLocale
lib/catalog/types.ts                       # Locale-aware catalog types
lib/catalog/price.ts                       # parseIdr, formatIdr, discountPercent
lib/catalog/content.ts                     # per-product copy (id + en), options, anatomy, fit, compare, faq
lib/catalog/index.ts                       # getProduct, getProducts, findOption, isProductSlug, productPath
lib/catalog/reviews.ts                     # getReviews, excerpt
lib/meta/events.ts                         # event builders + isMetaEvent validator
lib/meta/server.ts                         # Conversions API payload + forwarding
lib/meta/client.ts                         # initPixel, sendMetaEvent
app/api/meta-events/route.ts               # POST → Conversions API
lib/site/copy.ts                           # header/footer/shared UI strings + store links
lib/site/home-copy.ts                      # home page strings
lib/site/pdp-copy.ts                       # product page chrome strings
lib/site/config.ts                         # website voucher code
lib/utm.ts                                 # + marketplaceHref
components/site/site.module.css            # tokens-based shared styles (buttons, chips, mendung, card, fade)
components/site/button.tsx                 # ButtonLink, buttonClass
components/site/lamb-mark.tsx
components/site/mendung.tsx
components/site/fade-in.tsx                # client
components/site/marketplace-link.tsx       # client
components/site/product-card.tsx
components/site/meta-pixel.tsx             # client
components/site/cookie-notice.tsx          # client (+ cookie-notice.module.css)
components/site/header.module.css
components/site/site-header.tsx
components/site/header-bar.tsx             # client: nav, menu sheet, shop panel
components/site/header-over-hero.tsx       # client
components/site/language-switch.tsx        # client
components/site/footer.module.css
components/site/site-footer.tsx
components/layout/navbar.tsx               # becomes a shim → SiteHeader
components/layout/footer.tsx               # becomes a shim → SiteFooter
components/home/home.module.css
components/home/home-hero.tsx
components/home/product-duo.tsx
components/home/companion-row.tsx
components/home/feature-band.tsx
components/home/review-section.tsx
components/home/lights-out-band.tsx
components/home/lights-out-controller.tsx  # client
components/pdp/pdp.module.css
components/pdp/icons.tsx
components/pdp/option-context.tsx          # client
components/pdp/product-gallery.tsx         # client
components/pdp/price-line.tsx
components/pdp/buy-box.tsx                 # client
components/pdp/voucher-line.tsx            # client
components/pdp/sticky-buy-bar.tsx          # client
components/pdp/details.tsx                 # AnatomyPanel, FitGrid, CompareTable
components/pdp/social.tsx                  # ReviewGrid, FaqList, PairWith
app/[locale]/page.tsx                      # home (rewritten)
app/[locale]/products/[slug]/page.tsx      # product page (rewritten)
app/[locale]/products/page.tsx             # products index (rewritten)
```

Tests (Vitest, node env) live next to the code as `*.test.ts`. Task 2 extends the include list to `components/**`.

---

### Task 1: Brand assets from the brand book

**Files:**
- Create: `scripts/extract-brand-assets.mjs`
- Create (generated, committed): `public/brand/mendung-white.png`, `public/brand/mendung-sky.png`, `public/brand/mendung-ink.png`, `public/brand/lamb-blue.png`, `public/brand/lamb-white.png`, `public/brand/icesilk.jpg`
- Test: `lib/site/brand-assets.test.ts`

**Interfaces:**
- Produces: static files under `/brand/*` used by every later task. URLs: `/brand/mendung-white.png`, `/brand/mendung-sky.png`, `/brand/mendung-ink.png`, `/brand/lamb-blue.png`, `/brand/lamb-white.png`, `/brand/icesilk.jpg`.

- [ ] **Step 1: Write the failing test**

```ts
// lib/site/brand-assets.test.ts
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const brand = (name: string) => join(process.cwd(), "public", "brand", name);

describe("brand assets", () => {
  it.each(["mendung-white.png", "mendung-sky.png", "mendung-ink.png"])(
    "ships the %s pattern tile small enough to repeat cheaply",
    (name) => {
      expect(existsSync(brand(name))).toBe(true);
      expect(statSync(brand(name)).size).toBeLessThan(120_000);
    },
  );

  it.each(["lamb-blue.png", "lamb-white.png", "icesilk.jpg"])("ships %s", (name) => {
    expect(existsSync(brand(name))).toBe(true);
    expect(statSync(brand(name)).size).toBeGreaterThan(5_000);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/site/brand-assets.test.ts`
Expected: FAIL, `expected false to be true` for every file.

- [ ] **Step 3: Write the extraction script**

```js
// scripts/extract-brand-assets.mjs
// Rebuilds public/brand/* from the Sheepie brand book PDF.
// Needs poppler's `pdfimages` on PATH (macOS: `brew install poppler`).
// Usage: node scripts/extract-brand-assets.mjs ~/Downloads/Sheepie_MTS.pdf
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import sharp from "sharp";

const pdf = process.argv[2];
if (!pdf) {
  console.error("Usage: node scripts/extract-brand-assets.mjs <brand-book.pdf>");
  process.exit(1);
}

const out = resolve("public/brand");
mkdirSync(out, { recursive: true });
const work = mkdtempSync(join(tmpdir(), "sheepie-brand-"));

function extractPage(page) {
  execFileSync("pdfimages", ["-png", "-f", String(page), "-l", String(page), pdf, join(work, `p${page}`)]);
}

// Page 5 holds the Mega Mendung tile (p5-002) and the lamb marks:
// p5-003 + mask p5-004 is the blue lamb, p5-000 + mask p5-001 is the white lamb.
// Page 14 holds the ice-silk fabric close-up (p14-000).
extractPage(5);
extractPage(14);

// The tile is light linework on a flat blue field. Lift the lines into alpha,
// then pre-tint so pages can use a plain background-image (no CSS masks).
async function patternTiles() {
  const { data, info } = await sharp(join(work, "p5-002.png"))
    .resize({ width: 460 })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const sorted = Uint8Array.from(data).sort();
  const base = sorted[Math.floor(sorted.length * 0.5)];
  const top = sorted[Math.floor(sorted.length * 0.995)];
  const alpha = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    const t = Math.max(0, Math.min(1, (data[i] - base - 4) / Math.max(1, top - base - 4)));
    alpha[i] = Math.round(Math.pow(t, 0.8) * 255);
  }

  const tones = {
    "mendung-white": [255, 255, 255, 0.75],
    "mendung-sky": [163, 193, 224, 0.22],
    "mendung-ink": [29, 43, 68, 0.06],
  };
  for (const [name, [r, g, b, a]] of Object.entries(tones)) {
    const px = Buffer.alloc(info.width * info.height * 4);
    for (let i = 0; i < alpha.length; i++) {
      px[i * 4] = r;
      px[i * 4 + 1] = g;
      px[i * 4 + 2] = b;
      px[i * 4 + 3] = Math.round(alpha[i] * a);
    }
    await sharp(px, { raw: { width: info.width, height: info.height, channels: 4 } })
      .png({ palette: true, quality: 70, compressionLevel: 9 })
      .toFile(join(out, `${name}.png`));
  }
}

async function lamb(source, mask, name) {
  const rgb = await sharp(join(work, source)).removeAlpha().toColourspace("srgb").raw().toBuffer({ resolveWithObject: true });
  const a = await sharp(join(work, mask)).greyscale().raw().toBuffer();
  const { width, height, channels } = rgb.info;
  const px = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    px[i * 4] = rgb.data[i * channels];
    px[i * 4 + 1] = rgb.data[i * channels + 1];
    px[i * 4 + 2] = rgb.data[i * channels + 2];
    px[i * 4 + 3] = a[i];
  }
  await sharp(px, { raw: { width, height, channels: 4 } }).png().toFile(join(out, `${name}.png`));
}

async function icesilk() {
  await sharp(join(work, "p14-000.png")).resize({ width: 1200 }).jpeg({ quality: 80 }).toFile(join(out, "icesilk.jpg"));
}

try {
  await patternTiles();
  await lamb("p5-003.png", "p5-004.png", "lamb-blue");
  await lamb("p5-000.png", "p5-001.png", "lamb-white");
  await icesilk();
  console.log(`Brand assets written to ${out}`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
```

- [ ] **Step 4: Run the script**

Run: `node scripts/extract-brand-assets.mjs ~/Downloads/Sheepie_MTS.pdf && ls -la public/brand`
Expected: six files listed. The `mendung-*.png` files are 20–110KB each.

- [ ] **Step 5: Look at the output**

Open `public/brand/lamb-blue.png` and `public/brand/mendung-white.png` in an image viewer on a cream background.
- The lamb is the sleeping lamb with a transparent face area.
- The tile is cloud linework that repeats seamlessly.

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run lib/site/brand-assets.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 7: Commit**

```bash
git add scripts/extract-brand-assets.mjs public/brand lib/site/brand-assets.test.ts
git commit -m "feat: extract Mega Mendung tiles and lamb marks from the brand book"
```

---

### Task 2: Foundation (locale config, tokens, fonts, layout cleanup)

**Files:**
- Create: `i18n/config.ts`
- Modify: `i18n/request.ts`
- Modify: `middleware.ts`
- Modify: `app/[locale]/layout.tsx`
- Modify: `app/globals.css`
- Modify: `vitest.config.mts`
- Test: `lib/site/i18n-config.test.ts`

**Interfaces:**
- Produces:
  - `i18n/config.ts`, which exports `locales: readonly ["id","en"]`, `type Locale = "id" | "en"`, `defaultLocale: Locale` (= `"id"`) and `isLocale(value: string | null | undefined): value is Locale`.
  - CSS custom properties: `--sp-cream`, `--sp-linen`, `--sp-sky`, `--sp-sky-soft`, `--sp-peach`, `--sp-ink`, `--sp-night`, `--sp-line`, `--sp-logo`, `--sp-ease-out`, `--sp-gutter`, `--sp-max`.
  - `html[data-js="1"]`, set before paint, which `FadeIn` uses to hide content only when JS runs.

- [ ] **Step 1: Write the failing test**

```ts
// lib/site/i18n-config.test.ts
import { describe, expect, it } from "vitest";

import { defaultLocale, isLocale, locales } from "@/i18n/config";

describe("locale config", () => {
  it("serves Indonesian first", () => {
    expect(defaultLocale).toBe("id");
    expect(locales).toEqual(["id", "en"]);
  });

  it("recognises only supported locales", () => {
    expect(isLocale("id")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/site/i18n-config.test.ts`
Expected: FAIL, `Cannot find module '@/i18n/config'`.

- [ ] **Step 3: Create the locale config and use it everywhere**

```ts
// i18n/config.ts
export const locales = ["id", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "id";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "id" || value === "en";
}
```

Replace `i18n/request.ts` with:

```ts
import { getRequestConfig } from "next-intl/server";

import { defaultLocale, isLocale } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = isLocale(requested) ? requested : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

Replace `middleware.ts` with:

```ts
import createMiddleware from "next-intl/middleware";

import { defaultLocale, locales } from "./i18n/config";

export default createMiddleware({
  locales: [...locales],
  defaultLocale,
});

export const config = {
  // Match all pathnames except API routes, Next.js internals, the standalone
  // /bio and /go routes, and static files.
  matcher: ["/((?!api|_next|bio(?:/|$)|go(?:/|$)|.*\\..*).*)"],
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/site/i18n-config.test.ts`
Expected: PASS.

- [ ] **Step 5: Add design tokens to `app/globals.css`**

Append to the end of `app/globals.css`:

```css
/* ---------- Sheepie brand site tokens (Phase 1 redesign) ---------- */
:root {
  --sp-cream: #fffdf5;
  --sp-linen: #f3eee4;
  --sp-sky: #a3c1e0;
  --sp-sky-soft: #e4edf5;
  --sp-peach: #f6cdb8;
  --sp-ink: #1d2b44;
  --sp-night: #111b2c;
  --sp-line: rgba(29, 43, 68, 0.12);
  --sp-logo: #7f9fc6;
  --sp-ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --sp-gutter: 28px;
  --sp-max: 1320px;
}

@media (max-width: 760px) {
  :root {
    --sp-gutter: 20px;
  }
}

html,
body {
  overflow-x: clip;
}
```

- [ ] **Step 6: Clean up the root layout**

In `app/[locale]/layout.tsx`:

1. Delete these imports and their JSX usages:
   - `ReactLenis` (`@/lib/lenis`)
   - `BackgroundClouds`
   - `LanguageModal`

   The modal blocked every first visit, including ad traffic; the language switch moves into the header menu and footer.
2. Change the font weights:

```ts
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"],
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["500", "600", "700"],
});
```

3. Replace the locale guard with `isLocale`:

```ts
import { isLocale } from "@/i18n/config";
// ...
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
```

4. Change the metadata description (it carries a banned claim):

```ts
  description: "Sheepie: ergonomic CerviCloud pillows, LumiCloud blackout eye masks and CalmiCloud earplugs for calmer nights in Indonesia.",
```

5. Make the returned JSX the following. It keeps `NextIntlClientProvider`, `MotionProvider`, `UmamiAnalytics` and `Analytics`; the `<head>` script marks JS as available before paint so `FadeIn` content stays visible without JS.

```tsx
  return (
    <html lang={locale}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.js='1'" }} />
      </head>
      <body className={`${playfair.variable} ${quicksand.variable} antialiased bg-background text-foreground font-body`}>
        <NextIntlClientProvider messages={messages}>
          <MotionProvider>
            {children}
            <UmamiAnalytics />
            <Analytics />
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
```

- [ ] **Step 7: Let Vitest find component tests**

In `vitest.config.mts`, change the include line to:

```ts
    include: ["lib/**/*.test.ts", "app/**/*.test.ts", "components/**/*.test.ts"],
```

- [ ] **Step 8: Verify nothing else broke**

Run: `npm test && npm run typecheck`
Expected: all existing tests PASS; typecheck exits 0.

- [ ] **Step 9: Commit**

```bash
git add i18n middleware.ts app/[locale]/layout.tsx app/globals.css vitest.config.mts lib/site/i18n-config.test.ts
git commit -m "feat: default to Indonesian, add brand tokens, drop Lenis and the language modal"
```

---

### Task 3: Catalog types and IDR price helpers

**Files:**
- Create: `lib/catalog/types.ts`
- Create: `lib/catalog/price.ts`
- Test: `lib/catalog/price.test.ts`

**Interfaces:**
- Consumes: `Locale` from `i18n/config.ts`.
- Produces:
  - `lib/catalog/types.ts` exports:
    - `ProductSlug`, `PRODUCT_SLUGS`, `Text`, `IconName`, `Marketplace`
    - `OptionSource`, `ProductCopy`, `ProductOption`, `Product`
  - `lib/catalog/price.ts` exports:
    - `parseIdr(value: string): number`
    - `formatIdr(amount: number): string` (e.g. `"Rp838.000"`)
    - `discountPercent(price: number, originalPrice: number | null): number | null`

- [ ] **Step 1: Write the failing test**

```ts
// lib/catalog/price.test.ts
import { describe, expect, it } from "vitest";

import { discountPercent, formatIdr, parseIdr } from "./price";

describe("IDR prices", () => {
  it("parses the strings used in data/products.json", () => {
    expect(parseIdr("IDR 838.000")).toBe(838000);
    expect(parseIdr("IDR 1.399.000")).toBe(1399000);
  });

  it("refuses strings without digits", () => {
    expect(() => parseIdr("IDR")).toThrow(/Not an IDR amount/);
  });

  it("formats with dot thousands and no space", () => {
    expect(formatIdr(838000)).toBe("Rp838.000");
    expect(formatIdr(1399000)).toBe("Rp1.399.000");
    expect(formatIdr(88000)).toBe("Rp88.000");
  });

  it("rounds the discount to a whole percent", () => {
    expect(discountPercent(838000, 1399000)).toBe(40);
    expect(discountPercent(218000, 299000)).toBe(27);
    expect(discountPercent(88000, 108000)).toBe(19);
  });

  it("reports no discount when there is nothing to save", () => {
    expect(discountPercent(198000, 198000)).toBeNull();
    expect(discountPercent(198000, null)).toBeNull();
    expect(discountPercent(200000, 150000)).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/catalog/price.test.ts`
Expected: FAIL, `Cannot find module './price'`.

- [ ] **Step 3: Write the types and helpers**

```ts
// lib/catalog/types.ts
import type { Locale } from "@/i18n/config";

export type { Locale };

export const PRODUCT_SLUGS = ["cervicloud", "lumicloud", "calmicloud"] as const;
export type ProductSlug = (typeof PRODUCT_SLUGS)[number];

/** A string in every supported locale. */
export type Text = Record<Locale, string>;

export type Marketplace = "shopee" | "tokopedia";

export type IconName =
  | "neck"
  | "cool"
  | "foam"
  | "wash"
  | "dark"
  | "eye"
  | "hair"
  | "travel"
  | "ear"
  | "mold"
  | "case"
  | "reuse";

/** Where an option's price and marketplace links come from in data/products.json. */
export type OptionPriceSource =
  | { kind: "base" }
  | { kind: "variant"; name: string }
  | { kind: "color"; name: string };

export interface OptionSource {
  key: string;
  label: Text;
  note: Text;
  image: string;
  source: OptionPriceSource;
}

export interface ProductCopy {
  slug: ProductSlug;
  name: string;
  role: "hero" | "companion";
  card: { image: string; hoverImage: string; chip: Text; line: Text };
  sub: Text;
  gallery: { src: string; alt: Text }[];
  icons: { icon: IconName; label: Text }[];
  optionLabel: Text;
  options: OptionSource[];
  accordions: { title: Text; body: Text[] }[];
  anatomy: {
    title: Text;
    intro: Text;
    image: string;
    points: { x: number; y: number; title: Text; body: Text }[];
  };
  fit: { title: Text; items: { title: Text; body: Text; fits: boolean }[] };
  compare: { title: Text; theirs: Text; rows: { label: Text; ours: Text; theirs: Text }[] };
  faq: { q: Text; a: Text }[];
  pairWith: ProductSlug[];
}

export interface ProductOption {
  key: string;
  label: string;
  note: string;
  image: string;
  price: number;
  /** null when there is no saving to show. */
  originalPrice: number | null;
  shopeeUrl: string;
  tokopediaUrl: string;
}

export interface Product {
  slug: ProductSlug;
  name: string;
  role: "hero" | "companion";
  card: { image: string; hoverImage: string; chip: string; line: string };
  sub: string;
  gallery: { src: string; alt: string }[];
  icons: { icon: IconName; label: string }[];
  optionLabel: string;
  options: ProductOption[];
  accordions: { title: string; body: string[] }[];
  anatomy: {
    title: string;
    intro: string;
    image: string;
    points: { x: number; y: number; title: string; body: string }[];
  };
  fit: { title: string; items: { title: string; body: string; fits: boolean }[] };
  compare: { title: string; theirs: string; rows: { label: string; ours: string; theirs: string }[] };
  faq: { q: string; a: string }[];
  pairWith: ProductSlug[];
}
```

```ts
// lib/catalog/price.ts
export function parseIdr(value: string): number {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) {
    throw new Error(`Not an IDR amount: "${value}"`);
  }
  return Number(digits);
}

export function formatIdr(amount: number): string {
  return `Rp${Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

/** Whole-percent saving, or null when the original price is missing or not higher. */
export function discountPercent(price: number, originalPrice: number | null): number | null {
  if (originalPrice === null || originalPrice <= price) {
    return null;
  }
  return Math.round((1 - price / originalPrice) * 100);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/catalog/price.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/catalog/types.ts lib/catalog/price.ts lib/catalog/price.test.ts
git commit -m "feat: add catalog types and IDR price helpers"
```

---

### Task 4: Product catalog content and accessor

**Files:**
- Create: `lib/catalog/content.ts`
- Create: `lib/catalog/index.ts`
- Test: `lib/catalog/index.test.ts`

**Interfaces:**
- Consumes: the types from Task 3, `parseIdr`, `data/products.json`.
- Produces (from `lib/catalog/index.ts`):
  - `isProductSlug(value: string): value is ProductSlug`
  - `getProduct(slug: ProductSlug, locale: Locale): Product`
  - `getProducts(locale: Locale): Product[]`, in `PRODUCT_SLUGS` order
  - `findOption(product: Product, key: string | null | undefined): ProductOption`, which falls back to the first option
  - `productPath(locale: Locale, slug: ProductSlug, optionKey?: string): string`
  - `productCopy: Record<ProductSlug, ProductCopy>`, re-exported from `content.ts`

- [ ] **Step 1: Write the failing test**

```ts
// lib/catalog/index.test.ts
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { locales } from "@/i18n/config";
import { findOption, getProduct, getProducts, isProductSlug, productCopy, productPath } from "./index";
import { PRODUCT_SLUGS } from "./types";

function collectTexts(value: unknown, path: string, out: Array<[string, unknown]>) {
  if (Array.isArray(value)) {
    value.forEach((item, i) => collectTexts(item, `${path}[${i}]`, out));
  } else if (value && typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.length === 2 && keys.includes("id") && keys.includes("en")) {
      out.push([path, value]);
      return;
    }
    for (const [key, child] of Object.entries(value)) collectTexts(child, `${path}.${key}`, out);
  }
}

describe("product catalog", () => {
  it("has non-empty Indonesian and English for every piece of copy", () => {
    const texts: Array<[string, unknown]> = [];
    collectTexts(productCopy, "productCopy", texts);
    expect(texts.length).toBeGreaterThan(150);
    for (const [path, text] of texts) {
      const { id, en } = text as { id: string; en: string };
      expect(id.trim(), `${path}.id`).not.toBe("");
      expect(en.trim(), `${path}.en`).not.toBe("");
    }
  });

  it("resolves every product in every locale with priced, linked options", () => {
    for (const locale of locales) {
      for (const slug of PRODUCT_SLUGS) {
        const product = getProduct(slug, locale);
        expect(product.options.length).toBeGreaterThan(0);
        for (const option of product.options) {
          expect(option.price).toBeGreaterThan(0);
          expect(option.shopeeUrl).toMatch(/^https:\/\/shopee\.co\.id\//);
          expect(option.tokopediaUrl).toMatch(/^https:\/\/www\.tokopedia\.com\//);
        }
      }
    }
  });

  it("uses the variant price for the CerviCloud cover and shows no saving on it", () => {
    const cervi = getProduct("cervicloud", "id");
    const pillow = findOption(cervi, "pillow");
    const cover = findOption(cervi, "case");
    expect(pillow.price).toBe(838000);
    expect(pillow.originalPrice).toBe(1399000);
    expect(cover.price).toBe(198000);
    expect(cover.originalPrice).toBeNull();
  });

  it("offers LumiCloud in Blue and Apricot at the same price", () => {
    const lumi = getProduct("lumicloud", "en");
    expect(lumi.options.map((o) => o.key)).toEqual(["blue", "apricot"]);
    expect(new Set(lumi.options.map((o) => o.price)).size).toBe(1);
  });

  it("falls back to the first option for a missing or unknown key", () => {
    const cervi = getProduct("cervicloud", "id");
    expect(findOption(cervi, "nope").key).toBe("pillow");
    expect(findOption(cervi, null).key).toBe("pillow");
  });

  it("recognises only catalog slugs", () => {
    expect(isProductSlug("cervicloud")).toBe(true);
    expect(isProductSlug("bantal")).toBe(false);
    expect(isProductSlug("")).toBe(false);
  });

  it("builds locale-prefixed product paths", () => {
    expect(productPath("id", "cervicloud")).toBe("/id/products/cervicloud");
    expect(productPath("en", "cervicloud", "case")).toBe("/en/products/cervicloud?option=case");
  });

  it("returns products in catalog order", () => {
    expect(getProducts("id").map((p) => p.slug)).toEqual(["cervicloud", "lumicloud", "calmicloud"]);
  });

  it("pairs each product with other real products", () => {
    for (const slug of PRODUCT_SLUGS) {
      const { pairWith } = productCopy[slug];
      expect(pairWith).not.toContain(slug);
      for (const other of pairWith) expect(isProductSlug(other)).toBe(true);
    }
  });

  it("places four anatomy pins inside the image", () => {
    for (const slug of PRODUCT_SLUGS) {
      const { points } = productCopy[slug].anatomy;
      expect(points).toHaveLength(4);
      for (const p of points) {
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.x).toBeLessThanOrEqual(100);
        expect(p.y).toBeGreaterThanOrEqual(0);
        expect(p.y).toBeLessThanOrEqual(100);
      }
    }
  });

  it("points every image at a file that exists in public/", () => {
    for (const slug of PRODUCT_SLUGS) {
      const copy = productCopy[slug];
      const images = [
        copy.card.image,
        copy.card.hoverImage,
        copy.anatomy.image,
        ...copy.gallery.map((g) => g.src),
        ...copy.options.map((o) => o.image),
      ];
      for (const src of images) {
        expect(existsSync(join(process.cwd(), "public", src)), src).toBe(true);
      }
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/catalog/index.test.ts`
Expected: FAIL, `Cannot find module './index'`.

- [ ] **Step 3: Write the catalog content**

```ts
// lib/catalog/content.ts
import type { ProductCopy, ProductSlug } from "./types";

const cervicloud: ProductCopy = {
  slug: "cervicloud",
  name: "CerviCloud",
  role: "hero",
  card: {
    image: "/images/edited/DSC01187.JPG",
    hoverImage: "/images/etalase/22.png",
    chip: { id: "Sarung ice-silk", en: "Ice-silk cover" },
    line: {
      id: "Bantal ergonomis bentuk butterfly yang menopang leher, untuk side & back sleeper.",
      en: "A butterfly-shaped ergonomic pillow that supports the neck, for side and back sleepers.",
    },
  },
  sub: {
    id: "Bantal ergonomis bentuk butterfly yang menopang leher saat telentang dan miring, dengan sarung ice-silk yang terasa sejuk.",
    en: "A butterfly-shaped ergonomic pillow that supports your neck on your back and side, with an ice-silk cover that feels cool.",
  },
  gallery: [
    { src: "/images/edited/DSC01139.JPG", alt: { id: "Tidur telentang di CerviCloud", en: "Sleeping on the back on CerviCloud" } },
    { src: "/images/edited/DSC01187.JPG", alt: { id: "Tidur miring memeluk CerviCloud", en: "Side sleeping with CerviCloud" } },
    { src: "/images/etalase/22.png", alt: { id: "Bentuk butterfly CerviCloud", en: "CerviCloud's butterfly shape" } },
    { src: "/brand/icesilk.jpg", alt: { id: "Tekstur kain ice-silk heksagonal", en: "Hexagonal ice-silk fabric" } },
    { src: "/images/edited/DSC01148.JPG", alt: { id: "CerviCloud di kamar tidur", en: "CerviCloud in a bedroom" } },
  ],
  icons: [
    { icon: "neck", label: { id: "Menopang leher", en: "Supports the neck" } },
    { icon: "cool", label: { id: "Sarung ice-silk sejuk", en: "Cool ice-silk cover" } },
    { icon: "foam", label: { id: "Memory foam slow-rebound", en: "Slow-rebound memory foam" } },
    { icon: "wash", label: { id: "Sarung bisa dicuci", en: "Washable cover" } },
  ],
  optionLabel: { id: "Pilihan", en: "Option" },
  options: [
    {
      key: "pillow",
      label: { id: "Bantal + sarung", en: "Pillow + cover" },
      note: { id: "Paket lengkap", en: "Complete set" },
      image: "/images/etalase/22.png",
      source: { kind: "variant", name: "Pillow" },
    },
    {
      key: "case",
      label: { id: "Sarung saja", en: "Cover only" },
      note: { id: "Sarung ice-silk cadangan", en: "Spare ice-silk cover" },
      image: "/brand/icesilk.jpg",
      source: { kind: "variant", name: "Case Only" },
    },
  ],
  accordions: [
    {
      title: { id: "Ukuran & bahan", en: "Size & materials" },
      body: [
        { id: "64 × 35 × 12 cm", en: "64 × 35 × 12 cm" },
        { id: "Isi: memory foam slow-rebound", en: "Core: slow-rebound memory foam" },
        { id: "Sarung: kain ice-silk heksagonal, bisa dilepas", en: "Cover: hexagonal ice-silk fabric, removable" },
      ],
    },
    {
      title: { id: "Perawatan", en: "Care" },
      body: [
        {
          id: "Lepas sarung dan cuci dengan air dingin. Jangan mencuci inti memory foam; cukup diangin-anginkan.",
          en: "Remove the cover and wash it in cold water. Don't wash the memory foam core; just air it out.",
        },
      ],
    },
    {
      title: { id: "Masa adaptasi", en: "Adjustment period" },
      body: [
        {
          id: "Kalau sebelumnya pakai bantal biasa, umumnya butuh sekitar 7–14 malam sampai leher terbiasa dengan bentuknya.",
          en: "Coming from a regular pillow, it usually takes about 7–14 nights for your neck to get used to the shape.",
        },
      ],
    },
  ],
  anatomy: {
    title: { id: "Setiap lekuk punya tugasnya.", en: "Every curve has a job." },
    intro: {
      id: "Bentuk butterfly dibuat untuk dua posisi tidur sekaligus, ditambah ruang untuk tangan.",
      en: "The butterfly shape is made for two sleeping positions at once, plus room for your arm.",
    },
    image: "/images/etalase/22.png",
    points: [
      {
        x: 50,
        y: 40,
        title: { id: "Cekungan kepala", en: "Head cradle" },
        body: { id: "Kepala duduk di tengah saat telentang, leher tetap tertopang.", en: "Your head rests in the middle on your back while the neck stays supported." },
      },
      {
        x: 27,
        y: 43,
        title: { id: "Sayap samping", en: "Side wings" },
        body: { id: "Lebih tinggi untuk tidur miring, mengisi jarak bahu ke telinga.", en: "Higher for side sleeping, filling the gap between shoulder and ear." },
      },
      {
        x: 72,
        y: 31,
        title: { id: "Ruang tangan", en: "Arm space" },
        body: { id: "Lekukan untuk menaruh tangan saat tidur miring.", en: "A curve to rest your arm when you sleep on your side." },
      },
      {
        x: 44,
        y: 60,
        title: { id: "Sarung ice-silk", en: "Ice-silk cover" },
        body: { id: "Kain heksagonal yang terasa sejuk, bisa dilepas dan dicuci.", en: "Hexagonal fabric that feels cool, removable and washable." },
      },
    ],
  },
  fit: {
    title: { id: "Cocok untuk siapa?", en: "Who is it for?" },
    items: [
      { title: { id: "Tidur miring", en: "Side sleepers" }, body: { id: "Sayap samping mengisi jarak bahu ke kepala.", en: "The side wings fill the gap from shoulder to head." }, fits: true },
      { title: { id: "Tidur telentang", en: "Back sleepers" }, body: { id: "Cekungan tengah menjaga leher tetap tertopang.", en: "The center cradle keeps the neck supported." }, fits: true },
      { title: { id: "Sering ganti posisi", en: "Combination sleepers" }, body: { id: "Lebar 64 cm, cukup ruang untuk berguling.", en: "64 cm wide, room to roll over." }, fits: true },
      { title: { id: "Tidur tengkurap", en: "Stomach sleepers" }, body: { id: "Bentuknya terlalu tinggi untuk posisi ini.", en: "The shape is too high for this position." }, fits: false },
    ],
  },
  compare: {
    title: { id: "Bedanya dengan bantal biasa", en: "How it differs from a regular pillow" },
    theirs: { id: "Bantal biasa", en: "Regular pillow" },
    rows: [
      { label: { id: "Topangan leher", en: "Neck support" }, ours: { id: "Kontur mengikuti leher", en: "Contour follows the neck" }, theirs: { id: "Rata, sering terlalu tinggi", en: "Flat, often too high" } },
      { label: { id: "Setelah dipakai lama", en: "After months of use" }, ours: { id: "Memory foam kembali ke bentuk", en: "Memory foam returns to shape" }, theirs: { id: "Mudah kempes", en: "Goes flat" } },
      { label: { id: "Rasa di kulit", en: "On the skin" }, ours: { id: "Sarung ice-silk sejuk", en: "Cool ice-silk cover" }, theirs: { id: "Kain biasa, cepat hangat", en: "Regular fabric, warms up fast" } },
      { label: { id: "Tidur miring", en: "Side sleeping" }, ours: { id: "Ada ruang tangan", en: "Has arm space" }, theirs: { id: "Tangan sering kesemutan", en: "Arm often goes numb" } },
    ],
  },
  faq: [
    { q: { id: "Bantalnya keras atau empuk?", en: "Is it firm or soft?" }, a: { id: "Medium-firm. Cukup menopang leher, tapi tetap nyaman dan tidak kaku.", en: "Medium-firm. Supportive enough for the neck, yet comfortable and never stiff." } },
    { q: { id: "Perlu waktu adaptasi?", en: "Is there an adjustment period?" }, a: { id: "Ya, umumnya sekitar 7–14 malam kalau sebelumnya pakai bantal biasa.", en: "Yes, usually about 7–14 nights if you're used to a regular pillow." } },
    { q: { id: "Sarungnya bisa dicuci?", en: "Is the cover washable?" }, a: { id: "Bisa. Sarung ice-silk bisa dilepas dan dicuci. Inti memory foam jangan dicuci.", en: "Yes. The ice-silk cover comes off and can be washed. Don't wash the memory foam core." } },
    { q: { id: "Bisa beli sarung cadangan?", en: "Can I buy a spare cover?" }, a: { id: "Bisa, sarung CerviCloud dijual terpisah.", en: "Yes, the CerviCloud cover is sold separately." } },
  ],
  pairWith: ["lumicloud", "calmicloud"],
};

const lumicloud: ProductCopy = {
  slug: "lumicloud",
  name: "LumiCloud",
  role: "hero",
  card: {
    image: "/images/edited/DSC01225.JPG",
    hoverImage: "/images/products/lumicloud/variant-blue.webp",
    chip: { id: "Blue · Apricot", en: "Blue · Apricot" },
    line: {
      id: "Masker mata blackout yang ringan dan tidak menekan mata, untuk tidur malam, siang, dan perjalanan.",
      en: "A light blackout eye mask that doesn't press on your eyes, for nights, naps and travel.",
    },
  },
  sub: {
    id: "Masker mata blackout yang ringan dan lembut, tidak menekan kelopak mata, untuk tidur malam, tidur siang, dan perjalanan.",
    en: "A light, soft blackout eye mask that doesn't press on your eyelids, for nights, naps and travel.",
  },
  gallery: [
    { src: "/images/edited/DSC01225.JPG", alt: { id: "Tidur miring memakai LumiCloud", en: "Side sleeping in LumiCloud" } },
    { src: "/images/edited/DSC01334.JPG", alt: { id: "LumiCloud dipakai saat tidur", en: "LumiCloud worn while sleeping" } },
    { src: "/images/products/lumicloud/variant-blue.webp", alt: { id: "LumiCloud warna Blue", en: "LumiCloud in Blue" } },
    { src: "/images/edited/DSC01058.JPG", alt: { id: "LumiCloud di kamar yang gelap", en: "LumiCloud in a dark room" } },
    { src: "/images/edited/DSC01278.JPG", alt: { id: "LumiCloud di atas bantal", en: "LumiCloud resting on a pillow" } },
  ],
  icons: [
    { icon: "dark", label: { id: "Blackout", en: "Blackout" } },
    { icon: "eye", label: { id: "Tidak menekan mata", en: "No pressure on the eyes" } },
    { icon: "hair", label: { id: "Velcro halus, aman untuk rambut", en: "Soft velcro, hair-friendly" } },
    { icon: "travel", label: { id: "Ringan untuk dibawa", en: "Light to carry" } },
  ],
  optionLabel: { id: "Warna", en: "Colour" },
  options: [
    {
      key: "blue",
      label: { id: "Blue", en: "Blue" },
      note: { id: "Biru langit", en: "Sky blue" },
      image: "/images/products/lumicloud/variant-blue.webp",
      source: { kind: "color", name: "Blue" },
    },
    {
      key: "apricot",
      label: { id: "Apricot", en: "Apricot" },
      note: { id: "Peach lembut", en: "Soft peach" },
      image: "/images/products/lumicloud/variant-apricot.webp",
      source: { kind: "color", name: "Apricot" },
    },
  ],
  accordions: [
    {
      title: { id: "Bahan", en: "Materials" },
      body: [
        { id: "Kain lembut yang ringan di wajah", en: "Soft fabric that feels light on the face" },
        { id: "Tali dengan velcro halus yang tidak menyangkut rambut", en: "Strap with soft velcro that doesn't catch hair" },
      ],
    },
    {
      title: { id: "Perawatan", en: "Care" },
      body: [
        {
          id: "Sebaiknya dicuci dengan tangan. Kalau pakai mesin, masukkan ke kantong laundry dan pilih siklus lembut dengan air dingin.",
          en: "Hand washing is best. If you use a machine, put it in a laundry bag on a gentle, cold cycle.",
        },
      ],
    },
    {
      title: { id: "Kapan dipakai", en: "When to use it" },
      body: [
        { id: "Tidur malam di kamar yang kurang gelap, tidur siang, di pesawat, atau di hotel.", en: "Nights in a room that isn't dark enough, afternoon naps, on a plane or in a hotel." },
      ],
    },
  ],
  anatomy: {
    title: { id: "Gelap, tanpa terasa berat.", en: "Dark, without feeling heavy." },
    intro: {
      id: "Dibuat supaya cahaya tertutup, tapi wajah tetap nyaman dipakai semalaman.",
      en: "Made to block light while staying comfortable on your face all night.",
    },
    image: "/images/edited/DSC01334.JPG",
    points: [
      {
        x: 44,
        y: 26,
        title: { id: "Menutup cahaya", en: "Blocks light" },
        body: { id: "Menutup area mata dengan rapat untuk kebanyakan orang.", en: "Covers the eye area closely for most sleepers." },
      },
      {
        x: 34,
        y: 34,
        title: { id: "Tidak menekan", en: "No pressure" },
        body: { id: "Kelopak mata tetap bebas, tidak terasa tertekan.", en: "Your eyelids stay free, with no pressing." },
      },
      {
        x: 64,
        y: 20,
        title: { id: "Velcro halus", en: "Soft velcro" },
        body: { id: "Mudah diatur dan tidak menyangkut rambut.", en: "Easy to adjust and doesn't catch hair." },
      },
      {
        x: 53,
        y: 15,
        title: { id: "Ringan", en: "Light" },
        body: { id: "Gampang dilipat dan dibawa saat bepergian.", en: "Easy to fold and take when you travel." },
      },
    ],
  },
  fit: {
    title: { id: "Kapan LumiCloud paling terasa?", en: "When does LumiCloud help most?" },
    items: [
      { title: { id: "Kamar kurang gelap", en: "A room that isn't dark" }, body: { id: "Lampu jalan atau cahaya dari ventilasi.", en: "Street lights or light through the vents." }, fits: true },
      { title: { id: "Tidur siang", en: "Afternoon naps" }, body: { id: "Siang terang, tetap bisa terlelap.", en: "Bright afternoons, still easy to drift off." }, fits: true },
      { title: { id: "Perjalanan", en: "Travel" }, body: { id: "Pesawat, kereta, hotel.", en: "Planes, trains, hotels." }, fits: true },
      { title: { id: "Pasangan beda jam tidur", en: "Partners on different hours" }, body: { id: "Lampu kamar masih menyala.", en: "The bedroom light is still on." }, fits: true },
    ],
  },
  compare: {
    title: { id: "Bedanya dengan masker mata biasa", en: "How it differs from a regular eye mask" },
    theirs: { id: "Masker biasa", en: "Regular mask" },
    rows: [
      { label: { id: "Cahaya", en: "Light" }, ours: { id: "Menutup rapat", en: "Closes off light" }, theirs: { id: "Sering bocor di tepi", en: "Often leaks at the edges" } },
      { label: { id: "Di mata", en: "On the eyes" }, ours: { id: "Tidak menekan kelopak", en: "No pressure on the eyelids" }, theirs: { id: "Menempel di mata", en: "Sits on the eyes" } },
      { label: { id: "Tali", en: "Strap" }, ours: { id: "Velcro halus", en: "Soft velcro" }, theirs: { id: "Karet yang menarik rambut", en: "Elastic that pulls hair" } },
      { label: { id: "Dipakai lama", en: "Worn all night" }, ours: { id: "Ringan & lembut", en: "Light and soft" }, theirs: { id: "Bikin pegal belakang kepala", en: "Aches at the back of the head" } },
    ],
  },
  faq: [
    { q: { id: "Apakah menekan mata atau bulu mata?", en: "Does it press on my eyes or lashes?" }, a: { id: "Tidak. LumiCloud dibuat supaya kelopak mata tetap bebas.", en: "No. LumiCloud is made so your eyelids stay free." } },
    { q: { id: "Talinya aman untuk rambut?", en: "Is the strap hair-friendly?" }, a: { id: "Ya, velcro-nya halus dan tidak menyangkut rambut.", en: "Yes, the velcro is soft and doesn't catch hair." } },
    { q: { id: "Bisa dicuci?", en: "Can I wash it?" }, a: { id: "Sebaiknya cuci tangan. Kalau pakai mesin, gunakan kantong laundry dan siklus lembut.", en: "Hand washing is best. In a machine, use a laundry bag and a gentle cycle." } },
    { q: { id: "Ada pilihan warna?", en: "Which colours are there?" }, a: { id: "Ada dua: Blue dan Apricot.", en: "Two: Blue and Apricot." } },
  ],
  pairWith: ["cervicloud", "calmicloud"],
};

const calmicloud: ProductCopy = {
  slug: "calmicloud",
  name: "CalmiCloud",
  role: "companion",
  card: {
    image: "/images/edited/DSC01249.JPG",
    hoverImage: "/images/edited/DSC01313.JPG",
    chip: { id: "Isi 3 pasang", en: "3 pairs" },
    line: {
      id: "Earplug silikon lembut untuk dengkuran, AC, dan suara jalan.",
      en: "Soft silicone earplugs for snoring, AC hum and street noise.",
    },
  },
  sub: {
    id: "Earplug silikon lembut yang bisa dibentuk menutup bagian luar telinga, membantu mengurangi suara dengkuran, AC, dan jalan.",
    en: "Soft, moldable silicone earplugs that cover the outer ear and help quiet snoring, AC hum and traffic.",
  },
  gallery: [
    { src: "/images/edited/DSC01249.JPG", alt: { id: "Memakai CalmiCloud", en: "Wearing CalmiCloud" } },
    { src: "/images/edited/DSC01313.JPG", alt: { id: "CalmiCloud dalam case", en: "CalmiCloud in its case" } },
    { src: "/images/edited/DSC01241.JPG", alt: { id: "Tidur dengan CalmiCloud", en: "Sleeping with CalmiCloud" } },
    { src: "/images/edited/DSC01263.JPG", alt: { id: "CalmiCloud di telinga", en: "CalmiCloud in the ear" } },
  ],
  icons: [
    { icon: "ear", label: { id: "Mengurangi suara sekitar", en: "Quiets the room" } },
    { icon: "mold", label: { id: "Silikon bisa dibentuk", en: "Moldable silicone" } },
    { icon: "reuse", label: { id: "Bisa dipakai ulang", en: "Reusable" } },
    { icon: "case", label: { id: "Dengan case", en: "Comes with a case" } },
  ],
  optionLabel: { id: "Isi", en: "Contents" },
  options: [
    {
      key: "set",
      label: { id: "3 pasang + case", en: "3 pairs + case" },
      note: { id: "Satu set", en: "One set" },
      image: "/images/edited/DSC01313.JPG",
      source: { kind: "base" },
    },
  ],
  accordions: [
    {
      title: { id: "Isi & bahan", en: "Contents & material" },
      body: [
        { id: "3 pasang earplug silikon lembut", en: "3 pairs of soft silicone earplugs" },
        { id: "Case untuk menyimpan", en: "A storage case" },
      ],
    },
    {
      title: { id: "Cara pakai", en: "How to use" },
      body: [
        {
          id: "Bentuk silikon dengan jari, lalu tempelkan menutup lubang telinga dari luar. Jangan didorong masuk ke dalam.",
          en: "Shape the silicone with your fingers, then press it over the ear opening from the outside. Don't push it into the ear canal.",
        },
      ],
    },
    {
      title: { id: "Perawatan", en: "Care" },
      body: [
        {
          id: "Cuci perlahan dengan sabun lembut dan air hangat, keringkan, lalu simpan di case.",
          en: "Wash gently with mild soap and warm water, let dry, then store in the case.",
        },
      ],
    },
  ],
  anatomy: {
    title: { id: "Lembut, dan mengikuti telingamu.", en: "Soft, and shaped to your ear." },
    intro: {
      id: "Bukan dimasukkan ke dalam, tapi menutup dari luar.",
      en: "It doesn't go inside your ear; it seals from the outside.",
    },
    image: "/images/edited/DSC01313.JPG",
    points: [
      {
        x: 44,
        y: 58,
        title: { id: "Silikon lembut", en: "Soft silicone" },
        body: { id: "Nyaman dipakai semalaman, juga untuk tidur miring.", en: "Comfortable all night, including for side sleepers." },
      },
      {
        x: 56,
        y: 62,
        title: { id: "Bisa dibentuk", en: "Moldable" },
        body: { id: "Dibentuk dengan jari sesuai telingamu.", en: "Shaped with your fingers to fit your ear." },
      },
      {
        x: 52,
        y: 40,
        title: { id: "Case", en: "Case" },
        body: { id: "Tempat menyimpan supaya tetap bersih.", en: "Keeps them clean between nights." },
      },
      {
        x: 62,
        y: 50,
        title: { id: "Pakai ulang", en: "Reusable" },
        body: { id: "Dicuci, dikeringkan, lalu dipakai lagi.", en: "Wash, dry and use again." },
      },
    ],
  },
  fit: {
    title: { id: "Kapan CalmiCloud membantu?", en: "When does CalmiCloud help?" },
    items: [
      { title: { id: "Pasangan mendengkur", en: "A snoring partner" }, body: { id: "Dengkuran terasa lebih jauh.", en: "Snoring feels further away." }, fits: true },
      { title: { id: "AC atau kipas", en: "AC or fan hum" }, body: { id: "Dengung terasa lebih pelan.", en: "The hum feels softer." }, fits: true },
      { title: { id: "Kos & apartemen", en: "Rooms near the street" }, body: { id: "Suara jalan dan tetangga berkurang.", en: "Less street and neighbour noise." }, fits: true },
      { title: { id: "Butuh sunyi total", en: "Needing total silence" }, body: { id: "Earplug mengurangi suara, tidak menghapus semuanya.", en: "Earplugs reduce noise; they don't remove all of it." }, fits: false },
    ],
  },
  compare: {
    title: { id: "Bedanya dengan earplug busa", en: "How it differs from foam earplugs" },
    theirs: { id: "Earplug busa", en: "Foam earplugs" },
    rows: [
      { label: { id: "Cara pakai", en: "How it sits" }, ours: { id: "Menutup dari luar", en: "Seals from outside" }, theirs: { id: "Didorong ke dalam telinga", en: "Pushed into the ear" } },
      { label: { id: "Tidur miring", en: "Side sleeping" }, ours: { id: "Tetap nyaman", en: "Stays comfortable" }, theirs: { id: "Sering terasa menekan", en: "Often presses" } },
      { label: { id: "Dipakai ulang", en: "Reuse" }, ours: { id: "Bisa dicuci", en: "Washable" }, theirs: { id: "Sekali pakai", en: "Single use" } },
      { label: { id: "Penyimpanan", en: "Storage" }, ours: { id: "Ada case", en: "Comes with a case" }, theirs: { id: "Biasanya tanpa case", en: "Usually no case" } },
    ],
  },
  faq: [
    { q: { id: "Bisa dipakai ulang?", en: "Are they reusable?" }, a: { id: "Bisa. Cuci perlahan dengan sabun lembut, keringkan, lalu simpan di case.", en: "Yes. Wash gently with mild soap, let dry and store in the case." } },
    { q: { id: "Ada ukurannya?", en: "Do they come in sizes?" }, a: { id: "Tidak perlu. Silikonnya dibentuk mengikuti telingamu.", en: "No need. You shape the silicone to your ear." } },
    { q: { id: "Apakah semua suara hilang?", en: "Will I hear nothing at all?" }, a: { id: "Tidak. Earplug mengurangi suara sekitar, jadi pasang alarm dengan volume yang cukup.", en: "No. Earplugs reduce surrounding noise, so keep your alarm loud enough." } },
    { q: { id: "Nyaman untuk tidur miring?", en: "Comfortable for side sleeping?" }, a: { id: "Ya, karena menutup dari luar dan tidak didorong ke dalam.", en: "Yes, because it seals from the outside instead of being pushed in." } },
  ],
  pairWith: ["cervicloud", "lumicloud"],
};

export const productCopy: Record<ProductSlug, ProductCopy> = { cervicloud, lumicloud, calmicloud };
```

- [ ] **Step 4: Write the accessor**

```ts
// lib/catalog/index.ts
import products from "@/data/products.json";
import type { Locale } from "@/i18n/config";

import { productCopy } from "./content";
import { parseIdr } from "./price";
import {
  PRODUCT_SLUGS,
  type OptionSource,
  type Product,
  type ProductOption,
  type ProductSlug,
  type Text,
} from "./types";

export { productCopy };

interface SourceVariant {
  name: string;
  price: string;
  originalPrice: string;
  shopeeUrl: string;
  tokopediaUrl: string;
}

interface SourceProduct {
  slug: string;
  price: string;
  originalPrice: string;
  shopeeUrl: string;
  tokopediaUrl: string;
  variants?: SourceVariant[];
  colors?: { name: string }[];
}

const sources = products as SourceProduct[];

function source(slug: ProductSlug): SourceProduct {
  const found = sources.find((p) => p.slug === slug);
  if (!found) throw new Error(`data/products.json has no product "${slug}"`);
  return found;
}

function priced(price: string, originalPrice: string) {
  const amount = parseIdr(price);
  const original = parseIdr(originalPrice);
  return { price: amount, originalPrice: original > amount ? original : null };
}

function resolveOption(slug: ProductSlug, option: OptionSource, locale: Locale): ProductOption {
  const base = source(slug);
  let pricing = priced(base.price, base.originalPrice);
  let urls = { shopeeUrl: base.shopeeUrl, tokopediaUrl: base.tokopediaUrl };

  if (option.source.kind === "variant") {
    const name = option.source.name;
    const variant = base.variants?.find((v) => v.name === name);
    if (!variant) throw new Error(`Missing variant "${name}" for ${slug}`);
    pricing = priced(variant.price, variant.originalPrice);
    urls = { shopeeUrl: variant.shopeeUrl, tokopediaUrl: variant.tokopediaUrl };
  } else if (option.source.kind === "color") {
    const name = option.source.name;
    if (!base.colors?.some((c) => c.name === name)) throw new Error(`Missing colour "${name}" for ${slug}`);
  }

  return {
    key: option.key,
    label: option.label[locale],
    note: option.note[locale],
    image: option.image,
    ...pricing,
    ...urls,
  };
}

export function isProductSlug(value: string): value is ProductSlug {
  return (PRODUCT_SLUGS as readonly string[]).includes(value);
}

export function getProduct(slug: ProductSlug, locale: Locale): Product {
  const copy = productCopy[slug];
  const t = (text: Text) => text[locale];

  return {
    slug,
    name: copy.name,
    role: copy.role,
    card: { image: copy.card.image, hoverImage: copy.card.hoverImage, chip: t(copy.card.chip), line: t(copy.card.line) },
    sub: t(copy.sub),
    gallery: copy.gallery.map((g) => ({ src: g.src, alt: t(g.alt) })),
    icons: copy.icons.map((i) => ({ icon: i.icon, label: t(i.label) })),
    optionLabel: t(copy.optionLabel),
    options: copy.options.map((o) => resolveOption(slug, o, locale)),
    accordions: copy.accordions.map((a) => ({ title: t(a.title), body: a.body.map(t) })),
    anatomy: {
      title: t(copy.anatomy.title),
      intro: t(copy.anatomy.intro),
      image: copy.anatomy.image,
      points: copy.anatomy.points.map((p) => ({ x: p.x, y: p.y, title: t(p.title), body: t(p.body) })),
    },
    fit: { title: t(copy.fit.title), items: copy.fit.items.map((i) => ({ title: t(i.title), body: t(i.body), fits: i.fits })) },
    compare: {
      title: t(copy.compare.title),
      theirs: t(copy.compare.theirs),
      rows: copy.compare.rows.map((r) => ({ label: t(r.label), ours: t(r.ours), theirs: t(r.theirs) })),
    },
    faq: copy.faq.map((f) => ({ q: t(f.q), a: t(f.a) })),
    pairWith: copy.pairWith,
  };
}

export function getProducts(locale: Locale): Product[] {
  return PRODUCT_SLUGS.map((slug) => getProduct(slug, locale));
}

export function findOption(product: Product, key: string | null | undefined): ProductOption {
  return product.options.find((o) => o.key === key) ?? product.options[0];
}

export function productPath(locale: Locale, slug: ProductSlug, optionKey?: string): string {
  return `/${locale}/products/${slug}${optionKey ? `?option=${encodeURIComponent(optionKey)}` : ""}`;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run lib/catalog`
Expected: PASS. If the "points every image at a file" test fails, the failing path is printed; check the file name's case under `public/images/edited/` (the files are uppercase `.JPG`) and fix the path in `content.ts`.

- [ ] **Step 6: Commit**

```bash
git add lib/catalog/content.ts lib/catalog/index.ts lib/catalog/index.test.ts
git commit -m "feat: add the bilingual product catalog"
```

---

### Task 5: Reviews from the bio testimonials

**Files:**
- Create: `lib/catalog/reviews.ts`
- Test: `lib/catalog/reviews.test.ts`

**Interfaces:**
- Consumes: `createBioConfig()` from `data/bio.ts`, and `ProductSlug`/`Marketplace` from Task 3.
- Produces:
  - `interface Review { id: string; slug: ProductSlug; author: string; marketplace: Marketplace; quote: string; screenshot: string }`
  - `getReviews(slug: ProductSlug): Review[]`, in `data/bio.ts` order
  - `excerpt(text: string, maxWords: number): string`

- [ ] **Step 1: Write the failing test**

```ts
// lib/catalog/reviews.test.ts
import { describe, expect, it } from "vitest";

import { excerpt, getReviews } from "./reviews";

describe("reviews", () => {
  it("returns the three bio testimonials per product", () => {
    for (const slug of ["cervicloud", "lumicloud", "calmicloud"] as const) {
      const reviews = getReviews(slug);
      expect(reviews).toHaveLength(3);
      for (const review of reviews) {
        expect(review.slug).toBe(slug);
        expect(review.screenshot).toMatch(/^\/images\/bio\/testimonials\/.+\.jpg$/);
      }
    }
  });

  it("never exposes a raw marketplace handle", () => {
    const authors = getReviews("lumicloud").map((r) => r.author);
    expect(authors).not.toContain("steve969");
    for (const author of authors) expect(author).toMatch(/\*{3,}/);
  });

  it("keeps short quotes whole", () => {
    expect(excerpt("bantal nya adem", 10)).toBe("bantal nya adem");
  });

  it("cuts long quotes on a word boundary and marks the cut", () => {
    expect(excerpt("satu dua tiga, empat lima", 3)).toBe("satu dua tiga…");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/catalog/reviews.test.ts`
Expected: FAIL, `Cannot find module './reviews'`.

- [ ] **Step 3: Write the implementation**

```ts
// lib/catalog/reviews.ts
import { createBioConfig } from "@/data/bio";

import type { Marketplace, ProductSlug } from "./types";

export interface Review {
  id: string;
  slug: ProductSlug;
  author: string;
  marketplace: Marketplace;
  quote: string;
  screenshot: string;
}

/** Bio testimonials, already masked at config-build time. */
export function getReviews(slug: ProductSlug): Review[] {
  return createBioConfig()
    .testimonials.filter((t) => t.product === slug)
    .map((t) => ({
      id: t.id,
      slug,
      author: t.author,
      marketplace: t.marketplace,
      quote: t.quote,
      screenshot: t.screenshot.src,
    }));
}

/** Shortens on a word boundary; a cut is always marked with an ellipsis. */
export function excerpt(text: string, maxWords: number): string {
  const trimmed = text.trim();
  const words = trimmed.split(/\s+/);
  if (words.length <= maxWords) return trimmed;
  return `${words.slice(0, maxWords).join(" ").replace(/[,.;:!?]+$/, "")}…`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/catalog/reviews.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/catalog/reviews.ts lib/catalog/reviews.test.ts
git commit -m "feat: share bio testimonials with the product catalog"
```

---

### Task 6: Meta events and the Conversions API route

**Files:**
- Create: `lib/meta/events.ts`
- Create: `lib/meta/server.ts`
- Create: `app/api/meta-events/route.ts`
- Test: `lib/meta/events.test.ts`
- Test: `app/api/meta-events/route.test.ts`

**Interfaces:**
- Consumes: `ProductSlug` and `Marketplace` from Task 3.
- Produces (from `lib/meta/events.ts`):
  - `META_EVENT_NAMES`, `type MetaEventName`, `type MetaCustomData`
  - `type MetaEvent = { event_name; event_id; custom_data }`
  - `newEventId(): string`
  - `contentId(slug, optionKey): string`, which returns `"<slug>:<optionKey>"`
  - `pageView(): MetaEvent`
  - `viewContent({ slug, optionKey, value }): MetaEvent`
  - `initiateCheckout({ slug, optionKey, value, marketplace, placement }): MetaEvent`
  - `isMetaEvent(value: unknown): value is MetaEvent & { event_source_url?: string }`
- Produces (from `lib/meta/server.ts`):
  - `META_GRAPH_VERSION`
  - `readMetaEnv(env?): MetaEnv | null`
  - `buildServerEvent(event, request, eventSourceUrl, nowMs)`
  - `forwardToMeta(serverEvent, env, fetchImpl?): Promise<boolean>`
- The route: `POST /api/meta-events`, which answers 202 `{ ok: true, forwarded: boolean }` or 400 `{ ok: false }`.

- [ ] **Step 1: Write the failing event tests**

```ts
// lib/meta/events.test.ts
import { describe, expect, it } from "vitest";

import { contentId, initiateCheckout, isMetaEvent, pageView, viewContent } from "./events";

describe("meta events", () => {
  it("gives every event a fresh id", () => {
    const a = pageView();
    const b = pageView();
    expect(a.event_id).not.toBe(b.event_id);
    expect(a.event_id).toMatch(/^[\w-]{8,64}$/);
  });

  it("describes a product view in IDR", () => {
    const event = viewContent({ slug: "cervicloud", optionKey: "pillow", value: 838000 });
    expect(event.event_name).toBe("ViewContent");
    expect(event.custom_data).toEqual({
      content_ids: ["cervicloud:pillow"],
      content_type: "product",
      value: 838000,
      currency: "IDR",
    });
  });

  it("records the marketplace and placement of a buy click", () => {
    const event = initiateCheckout({ slug: "lumicloud", optionKey: "blue", value: 218000, marketplace: "shopee", placement: "buy-box" });
    expect(event.event_name).toBe("InitiateCheckout");
    expect(event.custom_data.marketplace).toBe("shopee");
    expect(event.custom_data.placement).toBe("buy-box");
    expect(contentId("lumicloud", "blue")).toBe("lumicloud:blue");
  });

  it("accepts what the builders produce, plus a source URL", () => {
    expect(isMetaEvent(pageView())).toBe(true);
    expect(isMetaEvent({ ...viewContent({ slug: "cervicloud", optionKey: "pillow", value: 1 }), event_source_url: "https://sheepiesleep.com/id" })).toBe(true);
  });

  it.each([
    ["null", null],
    ["unknown event", { event_name: "Purchase", event_id: "abcdefgh12", custom_data: {} }],
    ["bad id", { event_name: "PageView", event_id: "x", custom_data: {} }],
    ["extra top-level key", { event_name: "PageView", event_id: "abcdefgh12", custom_data: {}, user_data: { em: "x" } }],
    ["extra custom key", { event_name: "PageView", event_id: "abcdefgh12", custom_data: { email: "a@b.c" } }],
    ["negative value", { event_name: "ViewContent", event_id: "abcdefgh12", custom_data: { value: -1 } }],
    ["wrong currency", { event_name: "ViewContent", event_id: "abcdefgh12", custom_data: { currency: "USD" } }],
    ["too many ids", { event_name: "ViewContent", event_id: "abcdefgh12", custom_data: { content_ids: ["a", "b", "c", "d", "e", "f"] } }],
    ["long placement", { event_name: "InitiateCheckout", event_id: "abcdefgh12", custom_data: { placement: "x".repeat(41) } }],
    ["non-string source url", { event_name: "PageView", event_id: "abcdefgh12", custom_data: {}, event_source_url: 5 }],
  ])("rejects %s", (_label, value) => {
    expect(isMetaEvent(value)).toBe(false);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run lib/meta/events.test.ts`
Expected: FAIL, `Cannot find module './events'`.

- [ ] **Step 3: Write the event module**

```ts
// lib/meta/events.ts
import type { Marketplace, ProductSlug } from "@/lib/catalog/types";

export const META_EVENT_NAMES = ["PageView", "ViewContent", "InitiateCheckout"] as const;
export type MetaEventName = (typeof META_EVENT_NAMES)[number];

export type MetaCustomData = {
  content_ids?: string[];
  content_type?: "product";
  value?: number;
  currency?: "IDR";
  marketplace?: Marketplace;
  placement?: string;
};

export type MetaEvent = {
  event_name: MetaEventName;
  event_id: string;
  custom_data: MetaCustomData;
};

export function newEventId(): string {
  return globalThis.crypto.randomUUID();
}

export function contentId(slug: ProductSlug, optionKey: string): string {
  return `${slug}:${optionKey}`;
}

export function pageView(): MetaEvent {
  return { event_name: "PageView", event_id: newEventId(), custom_data: {} };
}

export function viewContent(input: { slug: ProductSlug; optionKey: string; value: number }): MetaEvent {
  return {
    event_name: "ViewContent",
    event_id: newEventId(),
    custom_data: {
      content_ids: [contentId(input.slug, input.optionKey)],
      content_type: "product",
      value: input.value,
      currency: "IDR",
    },
  };
}

export function initiateCheckout(input: {
  slug: ProductSlug;
  optionKey: string;
  value: number;
  marketplace: Marketplace;
  placement: string;
}): MetaEvent {
  const event = viewContent(input);
  return {
    event_name: "InitiateCheckout",
    event_id: event.event_id,
    custom_data: { ...event.custom_data, marketplace: input.marketplace, placement: input.placement },
  };
}

const TOP_KEYS = new Set(["event_name", "event_id", "custom_data", "event_source_url"]);
const CUSTOM_KEYS = new Set(["content_ids", "content_type", "value", "currency", "marketplace", "placement"]);
const SAFE = /^[\w:-]+$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Strict allow-list check for anything arriving at /api/meta-events. */
export function isMetaEvent(value: unknown): value is MetaEvent & { event_source_url?: string } {
  if (!isRecord(value)) return false;
  if (!Object.keys(value).every((k) => TOP_KEYS.has(k))) return false;
  if (!(META_EVENT_NAMES as readonly unknown[]).includes(value.event_name)) return false;
  if (typeof value.event_id !== "string" || !/^[\w-]{8,64}$/.test(value.event_id)) return false;
  if ("event_source_url" in value && (typeof value.event_source_url !== "string" || value.event_source_url.length > 500)) return false;

  const data = value.custom_data;
  if (!isRecord(data)) return false;
  if (!Object.keys(data).every((k) => CUSTOM_KEYS.has(k))) return false;
  if ("content_ids" in data) {
    const ids = data.content_ids;
    if (!Array.isArray(ids) || ids.length > 5) return false;
    if (!ids.every((id) => typeof id === "string" && id.length <= 60 && SAFE.test(id))) return false;
  }
  if ("content_type" in data && data.content_type !== "product") return false;
  if ("value" in data && (typeof data.value !== "number" || !Number.isFinite(data.value) || data.value < 0 || data.value > 1e9)) return false;
  if ("currency" in data && data.currency !== "IDR") return false;
  if ("marketplace" in data && data.marketplace !== "shopee" && data.marketplace !== "tokopedia") return false;
  if ("placement" in data && (typeof data.placement !== "string" || data.placement.length > 40 || !SAFE.test(data.placement))) return false;
  return true;
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `npx vitest run lib/meta/events.test.ts`
Expected: PASS.

- [ ] **Step 5: Write the failing route tests**

```ts
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
```

- [ ] **Step 6: Run them to verify they fail**

Run: `npx vitest run app/api/meta-events/route.test.ts`
Expected: FAIL, `Cannot find module './route'`.

- [ ] **Step 7: Write the server helpers and the route**

```ts
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
```

```ts
// app/api/meta-events/route.ts
import { isMetaEvent } from "@/lib/meta/events";
import { buildServerEvent, forwardToMeta, readMetaEnv } from "@/lib/meta/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = 4096;

export async function POST(request: Request) {
  const text = await request.text();
  if (text.length > MAX_BODY) return Response.json({ ok: false }, { status: 400 });

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  if (!isMetaEvent(body)) return Response.json({ ok: false }, { status: 400 });

  const env = readMetaEnv();
  if (!env) return Response.json({ ok: true, forwarded: false }, { status: 202 });

  const serverEvent = buildServerEvent(body, request, body.event_source_url ?? null, Date.now());
  const forwarded = await forwardToMeta(serverEvent, env);
  return Response.json({ ok: true, forwarded }, { status: 202 });
}
```

- [ ] **Step 8: Run all Meta tests to verify they pass**

Run: `npx vitest run lib/meta app/api/meta-events`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add lib/meta/events.ts lib/meta/events.test.ts lib/meta/server.ts app/api/meta-events
git commit -m "feat: forward site events to the Meta Conversions API"
```

---

### Task 7: Browser tracking (pixel, sender, cookie notice)

**Files:**
- Create: `lib/meta/client.ts`
- Create: `components/site/meta-pixel.tsx`
- Create: `components/site/cookie-notice.tsx`
- Create: `components/site/cookie-notice.module.css`
- Modify: `app/[locale]/layout.tsx`
- Modify: `.env.example`
- Test: `lib/meta/client.test.ts`

**Interfaces:**
- Consumes: `MetaEvent` and `pageView` from Task 6, and `Locale` from Task 2.
- Produces:
  - `META_ENDPOINT = "/api/meta-events"`
  - `initPixel(pixelId: string): void`
  - `sendMetaEvent(event: MetaEvent): void`
  - `<MetaPixel pixelId?: string />`
  - `<CookieNotice locale: Locale />`

- [ ] **Step 1: Write the failing test**

```ts
// lib/meta/client.test.ts
import { afterEach, describe, expect, it, vi } from "vitest";

import { pageView } from "./events";
import { META_ENDPOINT, sendMetaEvent } from "./client";

afterEach(() => vi.unstubAllGlobals());

function stubBrowser({ beacon = true, fbq }: { beacon?: boolean; fbq?: (...args: unknown[]) => void }) {
  const sendBeacon = vi.fn(() => beacon);
  const fetchMock = vi.fn(async () => new Response(null, { status: 202 }));
  vi.stubGlobal("window", { fbq, location: { href: "https://sheepiesleep.com/id" } });
  vi.stubGlobal("navigator", { sendBeacon });
  vi.stubGlobal("fetch", fetchMock);
  return { sendBeacon, fetchMock };
}

describe("sendMetaEvent", () => {
  it("tracks in the pixel and beacons the same event id to the server", async () => {
    const fbq = vi.fn();
    const { sendBeacon } = stubBrowser({ fbq });
    const event = pageView();

    sendMetaEvent(event);

    expect(fbq).toHaveBeenCalledWith("track", "PageView", {}, { eventID: event.event_id });
    expect(sendBeacon).toHaveBeenCalledOnce();
    const [endpoint, blob] = sendBeacon.mock.calls[0] as unknown as [string, Blob];
    expect(endpoint).toBe(META_ENDPOINT);
    const sent = JSON.parse(await blob.text());
    expect(sent.event_id).toBe(event.event_id);
    expect(sent.event_source_url).toBe("https://sheepiesleep.com/id");
  });

  it("falls back to a keepalive fetch when the beacon is refused", () => {
    const { fetchMock } = stubBrowser({ beacon: false, fbq: vi.fn() });

    sendMetaEvent(pageView());

    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(init.keepalive).toBe(true);
  });

  it("still reaches the server when the pixel is missing or throws", () => {
    const missing = stubBrowser({});
    sendMetaEvent(pageView());
    expect(missing.sendBeacon).toHaveBeenCalledOnce();

    const throwing = stubBrowser({ fbq: () => { throw new Error("blocked"); } });
    expect(() => sendMetaEvent(pageView())).not.toThrow();
    expect(throwing.sendBeacon).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run lib/meta/client.test.ts`
Expected: FAIL, `Cannot find module './client'`.

- [ ] **Step 3: Write the browser sender**

```ts
// lib/meta/client.ts
import type { MetaEvent } from "./events";

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[][];
  push?: Fbq;
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

export const META_ENDPOINT = "/api/meta-events";

/** Meta's standard base code, written out so it is typed and runs once. */
export function initPixel(pixelId: string): void {
  if (typeof window === "undefined" || window.fbq) return;

  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue!.push(args);
  } as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  fbq("init", pixelId);
}

/** Browser pixel + server copy with the same event id. Never throws. */
export function sendMetaEvent(event: MetaEvent): void {
  try {
    window.fbq?.("track", event.event_name, event.custom_data, { eventID: event.event_id });
  } catch {
    // Blocked or broken pixel: the server copy below still counts.
  }

  try {
    const body = JSON.stringify({ ...event, event_source_url: window.location.href });
    const beaconed =
      typeof navigator !== "undefined" &&
      typeof navigator.sendBeacon === "function" &&
      navigator.sendBeacon(META_ENDPOINT, new Blob([body], { type: "application/json" }));
    if (!beaconed) {
      void fetch(META_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
    }
  } catch {
    // Tracking never interrupts the page.
  }
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `npx vitest run lib/meta/client.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Add the pixel and cookie notice components**

```tsx
// components/site/meta-pixel.tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { initPixel, sendMetaEvent } from "@/lib/meta/client";
import { pageView } from "@/lib/meta/events";

/** Loads the pixel once and records a PageView on every route change. */
export function MetaPixel({ pixelId }: { pixelId?: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (pixelId) initPixel(pixelId);
  }, [pixelId]);

  useEffect(() => {
    sendMetaEvent(pageView());
  }, [pathname]);

  return null;
}
```

```tsx
// components/site/cookie-notice.tsx
"use client";

import { useEffect, useState } from "react";

import type { Locale } from "@/i18n/config";

import styles from "./cookie-notice.module.css";

const KEY = "sheepie-cookie-notice";
const copy: Record<Locale, { text: string; ok: string }> = {
  id: { text: "Kami memakai cookie untuk analitik dan iklan agar situs ini lebih baik.", ok: "Oke" },
  en: { text: "We use cookies for analytics and ads to improve this site.", ok: "Okay" },
};

export function CookieNotice({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      // Storage blocked: stay quiet rather than nag on every page.
    }
  }, []);

  if (!open) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      // Ignore; closing for this view is enough.
    }
    setOpen(false);
  };

  return (
    <div className={styles.notice} role="region" aria-label="Cookie">
      <p>{copy[locale].text}</p>
      <button type="button" onClick={dismiss}>{copy[locale].ok}</button>
    </div>
  );
}
```

```css
/* components/site/cookie-notice.module.css */
.notice {
  position: fixed;
  left: 16px;
  bottom: 16px;
  z-index: 70;
  max-width: 380px;
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 14px 16px;
  border-radius: 18px;
  background: var(--sp-ink);
  color: var(--sp-cream);
  font-family: var(--font-body), sans-serif;
  font-size: 13.5px;
  line-height: 1.45;
  box-shadow: 0 16px 40px -18px rgba(17, 27, 44, 0.6);
}

.notice button {
  flex: none;
  min-height: 44px;
  padding: 0 18px;
  border: 0;
  border-radius: 999px;
  background: var(--sp-cream);
  color: var(--sp-ink);
  font: 700 14px var(--font-body), sans-serif;
  cursor: pointer;
}

@media (max-width: 760px) {
  .notice {
    left: 12px;
    right: 12px;
    bottom: 12px;
    max-width: none;
  }
}
```

- [ ] **Step 6: Wire them into the root layout**

In `app/[locale]/layout.tsx`, add the imports and place both components inside `MotionProvider`, after `{children}`:

```tsx
import { CookieNotice } from "@/components/site/cookie-notice";
import { MetaPixel } from "@/components/site/meta-pixel";
// ...
          <MotionProvider>
            {children}
            <MetaPixel pixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID} />
            <CookieNotice locale={locale} />
            <UmamiAnalytics />
            <Analytics />
          </MotionProvider>
```

- [ ] **Step 7: Document the environment**

Append to `.env.example`:

```
# Meta Pixel + Conversions API (marketplace click tracking).
# NEXT_PUBLIC_META_PIXEL_ID and META_PIXEL_ID hold the same pixel/dataset ID.
NEXT_PUBLIC_META_PIXEL_ID=
META_PIXEL_ID=
META_CAPI_TOKEN=
# Optional: Events Manager "Test events" code while verifying.
META_TEST_EVENT_CODE=
# Website-only marketplace voucher shown on product pages.
NEXT_PUBLIC_WEBSITE_VOUCHER_CODE=SHEEPIEWEB
```

- [ ] **Step 8: Verify**

Run: `npm test && npm run typecheck`
Expected: PASS, exit 0.

- [ ] **Step 9: Commit**

```bash
git add lib/meta/client.ts lib/meta/client.test.ts components/site/meta-pixel.tsx components/site/cookie-notice.tsx components/site/cookie-notice.module.css app/[locale]/layout.tsx .env.example
git commit -m "feat: load the Meta pixel and send deduplicated page views"
```

---

### Task 8: Site copy and shared UI pieces

**Files:**
- Create: `lib/site/copy.ts`
- Create: `lib/site/config.ts`
- Modify: `lib/utm.ts`
- Create: `components/site/site.module.css`
- Create: `components/site/button.tsx`
- Create: `components/site/lamb-mark.tsx`
- Create: `components/site/mendung.tsx`
- Create: `components/site/fade-in.tsx`
- Create: `components/site/marketplace-link.tsx`
- Create: `components/site/product-card.tsx`
- Test: `components/site/site-ui.test.ts`

**Interfaces:**
- Consumes:
  - `Locale`
  - `Product`, `ProductSlug`, `Marketplace`
  - `formatIdr`, `discountPercent`
  - `productPath`
  - `initiateCheckout`, `sendMetaEvent`
  - `trackMarketplaceClick` from `lib/analytics.ts`
- Produces:
  - `siteCopy: Record<Locale, SiteCopy>`
  - `storeLinks: { shopee: string; tokopedia: string; instagram: string; tiktok: string }`
  - `WEBSITE_VOUCHER_CODE: string`
  - `marketplaceHref(href: string, slug: ProductSlug, placement: string): string`
  - `ButtonLink` props: `{ href: string; variant: "ink" | "cream" | "line" | "lineLight"; wide?: boolean; className?: string; children }`
  - `buttonClass(variant, wide?): string`
  - `LambMark` props: `{ tone?: "blue" | "white"; size: number; breathe?: boolean; className?: string }`
  - `Mendung` props: `{ tone: "white" | "sky" | "ink" }`
  - `FadeIn` props: `{ index?: number; className?: string; id?: string; section?: string; children }`. It renders `data-fade` and `data-section` when given.
  - `MarketplaceLink` props: `{ slug: ProductSlug; optionKey: string; value: number; marketplace: Marketplace; href: string; placement: string; className?: string; children }`. It renders `<a target="_blank" rel="noopener noreferrer" data-marketplace data-placement>`.
  - `ProductCard` props: `{ product: Product; locale: Locale; index?: number }`. It renders `data-product-card={slug}`.

- [ ] **Step 1: Write the failing test**

```ts
// components/site/site-ui.test.ts
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { getProduct } from "@/lib/catalog";
import { siteCopy } from "@/lib/site/copy";
import { marketplaceHref } from "@/lib/utm";

import { ButtonLink } from "./button";
import { FadeIn } from "./fade-in";
import { MarketplaceLink } from "./marketplace-link";
import { Mendung } from "./mendung";
import { ProductCard } from "./product-card";

describe("shared site UI", () => {
  it("has the same copy keys in both languages", () => {
    const keys = (value: unknown, prefix = ""): string[] =>
      value && typeof value === "object"
        ? Object.entries(value).flatMap(([k, v]) => keys(v, `${prefix}${k}.`))
        : [prefix];
    expect(keys(siteCopy.en)).toEqual(keys(siteCopy.id));
  });

  it("tags marketplace links with site UTM parameters", () => {
    const url = new URL(marketplaceHref("https://shopee.co.id/product/1/2/", "cervicloud", "buy-box"));
    expect(url.searchParams.get("utm_source")).toBe("site");
    expect(url.searchParams.get("utm_medium")).toBe("button");
    expect(url.searchParams.get("utm_campaign")).toBe("buy-box");
    expect(url.searchParams.get("utm_content")).toBe("cervicloud");
  });

  it("opens marketplaces in a new tab and labels the placement", () => {
    const html = renderToStaticMarkup(
      createElement(MarketplaceLink, {
        slug: "cervicloud",
        optionKey: "pillow",
        value: 838000,
        marketplace: "shopee",
        href: "https://shopee.co.id/product/1/2/",
        placement: "buy-box",
        children: "Beli di Shopee",
      }),
    );
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('data-marketplace="shopee"');
    expect(html).toContain('data-placement="buy-box"');
    expect(html).toContain("utm_campaign=buy-box");
  });

  it("renders button links and decorative patterns", () => {
    expect(renderToStaticMarkup(createElement(ButtonLink, { href: "/id", variant: "ink", children: "Go" }))).toContain('href="/id"');
    expect(renderToStaticMarkup(createElement(Mendung, { tone: "sky" }))).toContain('aria-hidden="true"');
  });

  it("marks fade-in content so it can be revealed once", () => {
    const html = renderToStaticMarkup(createElement(FadeIn, { section: "products", children: "x" }));
    expect(html).toContain("data-fade");
    expect(html).toContain('data-section="products"');
  });

  it("renders a product card with price, saving and a product link", () => {
    const html = renderToStaticMarkup(createElement(ProductCard, { product: getProduct("cervicloud", "id"), locale: "id" }));
    expect(html).toContain('data-product-card="cervicloud"');
    expect(html).toContain('href="/id/products/cervicloud"');
    expect(html).toContain("Rp838.000");
    expect(html).toContain("Rp1.399.000");
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run components/site/site-ui.test.ts`
Expected: FAIL, `Cannot find module '@/lib/site/copy'`.

- [ ] **Step 3: Write the copy, config and UTM helper**

```ts
// lib/site/copy.ts
import type { Locale } from "@/i18n/config";

export interface SiteCopy {
  notice: string;
  nav: { pillow: string; mask: string; earplug: string; story: string; journal: string; faq: string; contact: string; shop: string; menu: string; close: string; allProducts: string };
  shopPanel: { title: string; note: string };
  buy: { shopee: string; tokopedia: string };
  footer: { goodnight: string; shop: string; brand: string; find: string; rights: string; cover: string };
  language: { label: string; switchTo: string };
}

export const siteCopy: Record<Locale, SiteCopy> = {
  id: {
    notice: "Belanja resmi Sheepie di Shopee & Tokopedia",
    nav: { pillow: "Bantal", mask: "Masker Mata", earplug: "Earplug", story: "Cerita Kami", journal: "Jurnal", faq: "FAQ", contact: "Kontak", shop: "Belanja", menu: "Menu", close: "Tutup", allProducts: "Semua produk" },
    shopPanel: { title: "Belanja Sheepie", note: "Pilih produk, lalu toko favoritmu." },
    buy: { shopee: "Beli di Shopee", tokopedia: "Beli di Tokopedia" },
    footer: { goodnight: "Selamat tidur, sampai besok pagi.", shop: "Belanja", brand: "Sheepie", find: "Temukan kami", rights: "© 2026 Sheepie", cover: "Sarung CerviCloud" },
    language: { label: "Bahasa", switchTo: "English" },
  },
  en: {
    notice: "Shop official Sheepie on Shopee & Tokopedia",
    nav: { pillow: "Pillow", mask: "Eye Mask", earplug: "Earplugs", story: "Our Story", journal: "Journal", faq: "FAQ", contact: "Contact", shop: "Shop", menu: "Menu", close: "Close", allProducts: "All products" },
    shopPanel: { title: "Shop Sheepie", note: "Pick a product, then your favourite store." },
    buy: { shopee: "Buy on Shopee", tokopedia: "Buy on Tokopedia" },
    footer: { goodnight: "Sleep well, see you in the morning.", shop: "Shop", brand: "Sheepie", find: "Find us", rights: "© 2026 Sheepie", cover: "CerviCloud cover" },
    language: { label: "Language", switchTo: "Bahasa Indonesia" },
  },
};

export const storeLinks = {
  shopee: "https://shopee.co.id/sheepie.sleep",
  tokopedia: "https://www.tokopedia.com/sheepie",
  instagram: "https://www.instagram.com/sheepiesleep.id",
  tiktok: "https://www.tiktok.com/@sheepiesleep",
} as const;

export function localeHref(locale: Locale, path: string): string {
  return `/${locale}${path === "/" ? "" : path}`;
}
```

```ts
// lib/site/config.ts
/** Private marketplace voucher shown only on this website (tracks site-driven orders). */
export const WEBSITE_VOUCHER_CODE = process.env.NEXT_PUBLIC_WEBSITE_VOUCHER_CODE?.trim() || "SHEEPIEWEB";
```

Append to `lib/utm.ts`:

```ts
/** UTM-tagged marketplace URL for a click from the brand site. */
export const marketplaceHref = (href: string, slug: string, placement: string) => {
  const url = new URL(href);
  url.searchParams.set("utm_source", "site");
  url.searchParams.set("utm_medium", "button");
  url.searchParams.set("utm_campaign", placement);
  url.searchParams.set("utm_content", slug);
  return url.toString();
};
```

- [ ] **Step 4: Write the shared styles**

```css
/* components/site/site.module.css */
.page {
  background: var(--sp-cream);
  color: var(--sp-ink);
  font-family: var(--font-body), sans-serif;
  font-weight: 500;
  -webkit-font-smoothing: antialiased;
}

.shell {
  max-width: var(--sp-max);
  margin: 0 auto;
  padding: 0 var(--sp-gutter);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 26px;
  border-radius: 999px;
  font: 700 15.5px var(--font-body), sans-serif;
  text-decoration: none;
  transition: transform 0.16s var(--sp-ease-out), background-color 0.2s;
}

.btn:active {
  transform: scale(0.97);
}

.ink { background: var(--sp-ink); color: var(--sp-cream); }
.cream { background: var(--sp-cream); color: var(--sp-ink); }
.line { border: 1.5px solid var(--sp-ink); color: var(--sp-ink); }
.lineLight { border: 1.5px solid rgba(255, 253, 245, 0.7); color: var(--sp-cream); }

.wide {
  width: 100%;
  min-height: 56px;
  font-size: 16px;
}

.chip {
  position: absolute;
  z-index: 1;
  left: 16px;
  top: 16px;
  padding: 7px 12px;
  border-radius: 999px;
  background: var(--sp-cream);
  color: var(--sp-ink);
  font: 700 12px var(--font-body), sans-serif;
}

.mendung {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-repeat: repeat;
}

.mendungWhite { background-image: url(/brand/mendung-white.png); }
.mendungSky { background-image: url(/brand/mendung-sky.png); }
.mendungInk { background-image: url(/brand/mendung-ink.png); }

.breathe {
  transform-origin: 50% 85%;
  animation: breathe 5.2s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { transform: scale(1); }
  45% { transform: scale(1.04, 1.06); }
}

/* Hidden only when JS is running (html[data-js]) and the element has not entered yet. */
:global(html[data-js="1"]) .fade:not([data-visible="true"]) {
  opacity: 0;
  transform: translateY(16px);
}

.fade {
  transition: opacity 0.7s var(--sp-ease-out), transform 0.7s var(--sp-ease-out);
  transition-delay: var(--fade-delay, 0ms);
}

/* Product card */
.card {
  display: block;
  color: inherit;
  text-decoration: none;
}

.cardPh {
  position: relative;
  aspect-ratio: 5 / 5.4;
  border-radius: 24px;
  overflow: hidden;
  background: var(--sp-linen);
}

.cardImg {
  object-fit: cover;
  transition: opacity 0.5s var(--sp-ease-out);
}

.cardAlt {
  opacity: 0;
}

@media (hover: hover) {
  .card:hover .cardAlt { opacity: 1; }
}

.cardRow {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-top: 20px;
}

.cardName {
  font: 700 30px var(--font-display), serif;
  letter-spacing: -0.015em;
}

.cardLine {
  margin-top: 6px;
  max-width: 440px;
  font-size: 16px;
  line-height: 1.5;
  opacity: 0.8;
}

.price {
  font: 700 17px var(--font-body), sans-serif;
  white-space: nowrap;
}

.price s {
  margin-left: 8px;
  font-weight: 500;
  opacity: 0.45;
}

@media (max-width: 760px) {
  .cardRow { flex-direction: column; gap: 4px; align-items: flex-start; }
  .cardName { font-size: 24px; }
  .cardLine { font-size: 14.5px; }
}

@media (prefers-reduced-motion: reduce) {
  .breathe { animation: none; }
  .fade { transition: none; }
  :global(html[data-js="1"]) .fade:not([data-visible="true"]) { opacity: 1; transform: none; }
}
```

- [ ] **Step 5: Write the components**

```tsx
// components/site/button.tsx
import Link from "next/link";
import type { ReactNode } from "react";

import styles from "./site.module.css";

export type ButtonVariant = "ink" | "cream" | "line" | "lineLight";

export function buttonClass(variant: ButtonVariant, wide = false): string {
  return [styles.btn, styles[variant], wide ? styles.wide : ""].filter(Boolean).join(" ");
}

export function ButtonLink({
  href,
  variant,
  wide,
  className,
  children,
}: {
  href: string;
  variant: ButtonVariant;
  wide?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={[buttonClass(variant, wide), className].filter(Boolean).join(" ")}>
      {children}
    </Link>
  );
}
```

```tsx
// components/site/lamb-mark.tsx
import Image from "next/image";

import styles from "./site.module.css";

export function LambMark({
  tone = "blue",
  size,
  breathe = false,
  className,
}: {
  tone?: "blue" | "white";
  size: number;
  breathe?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={tone === "blue" ? "/brand/lamb-blue.png" : "/brand/lamb-white.png"}
      alt=""
      width={size}
      height={size}
      className={[breathe ? styles.breathe : "", className].filter(Boolean).join(" ")}
    />
  );
}
```

```tsx
// components/site/mendung.tsx
import styles from "./site.module.css";

const toneClass = { white: styles.mendungWhite, sky: styles.mendungSky, ink: styles.mendungInk } as const;

/** The traced Mega Mendung tile as a decorative layer. Parent must be position: relative. */
export function Mendung({ tone }: { tone: keyof typeof toneClass }) {
  return <div aria-hidden="true" className={`${styles.mendung} ${toneClass[tone]}`} />;
}
```

```tsx
// components/site/fade-in.tsx
"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

import styles from "./site.module.css";

let observer: IntersectionObserver | null = null;

function sharedObserver(): IntersectionObserver {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.visible = "true";
            observer!.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );
  }
  return observer;
}

/** Fades content in once when it enters the viewport. */
export function FadeIn({
  index = 0,
  className,
  id,
  section,
  children,
}: {
  index?: number;
  className?: string;
  id?: string;
  section?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = sharedObserver();
    io.observe(node);
    return () => io.unobserve(node);
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      data-fade=""
      data-section={section}
      className={[styles.fade, className].filter(Boolean).join(" ")}
      style={{ "--fade-delay": `${index * 70}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
```

```tsx
// components/site/marketplace-link.tsx
"use client";

import type { ReactNode } from "react";

import { trackMarketplaceClick } from "@/lib/analytics";
import type { Marketplace, ProductSlug } from "@/lib/catalog/types";
import { sendMetaEvent } from "@/lib/meta/client";
import { initiateCheckout } from "@/lib/meta/events";
import { marketplaceHref } from "@/lib/utm";

/** Every link out to a marketplace goes through here so each click is tracked once. */
export function MarketplaceLink({
  slug,
  optionKey,
  value,
  marketplace,
  href,
  placement,
  className,
  children,
}: {
  slug: ProductSlug;
  optionKey: string;
  value: number;
  marketplace: Marketplace;
  href: string;
  placement: string;
  className?: string;
  children: ReactNode;
}) {
  const onClick = () => {
    // Fire-and-forget; the browser follows the link regardless.
    sendMetaEvent(initiateCheckout({ slug, optionKey, value, marketplace, placement }));
    trackMarketplaceClick({ product_slug: slug, marketplace, page_path: window.location.pathname });
  };

  return (
    <a
      href={marketplaceHref(href, slug, placement)}
      target="_blank"
      rel="noopener noreferrer"
      data-marketplace={marketplace}
      data-placement={placement}
      className={className}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
```

```tsx
// components/site/product-card.tsx
import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/i18n/config";
import { productPath } from "@/lib/catalog";
import { formatIdr } from "@/lib/catalog/price";
import type { Product } from "@/lib/catalog/types";

import { FadeIn } from "./fade-in";
import styles from "./site.module.css";

export function ProductCard({ product, locale, index = 0 }: { product: Product; locale: Locale; index?: number }) {
  const option = product.options[0];

  return (
    <FadeIn index={index}>
      <Link href={productPath(locale, product.slug)} className={styles.card} data-product-card={product.slug}>
        <div className={styles.cardPh}>
          <Image src={product.card.image} alt={product.name} fill sizes="(max-width: 760px) 82vw, 640px" className={styles.cardImg} />
          <Image src={product.card.hoverImage} alt="" fill sizes="(max-width: 760px) 82vw, 640px" className={`${styles.cardImg} ${styles.cardAlt}`} />
          <span className={styles.chip}>{product.card.chip}</span>
        </div>
        <div className={styles.cardRow}>
          <h3 className={styles.cardName}>{product.name}</h3>
          <div className={styles.price}>
            {formatIdr(option.price)}
            {option.originalPrice !== null && <s>{formatIdr(option.originalPrice)}</s>}
          </div>
        </div>
        <p className={styles.cardLine}>{product.card.line}</p>
      </Link>
    </FadeIn>
  );
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx vitest run components/site/site-ui.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 7: Commit**

```bash
git add lib/site/copy.ts lib/site/config.ts lib/utm.ts components/site
git commit -m "feat: add shared brand UI pieces and tracked marketplace links"
```

---

### Task 9: Site header with menu and shop panel

**Files:**
- Create: `components/site/header.module.css`
- Create: `components/site/site-header.tsx`
- Create: `components/site/header-bar.tsx`
- Create: `components/site/header-over-hero.tsx`
- Create: `components/site/language-switch.tsx`
- Modify: `components/layout/navbar.tsx` (replace the whole file)
- Test: `components/site/site-header.test.ts`

**Interfaces:**
- Consumes:
  - `siteCopy`, `localeHref`
  - `getProducts`, `productPath`, `formatIdr`
  - `MarketplaceLink`, `buttonClass`, `LambMark`
- Produces:
  - `SiteHeader` props: `{ locale: Locale; overlay?: boolean }`. It renders `<header id="site-header" data-overlay data-over>`. When `overlay` is set, the page must render an element with `id="hero"`.
  - `ShopItem` type: `{ slug; name; image; price: string; optionKey: string; value: number; shopeeUrl: string; tokopediaUrl: string }`
  - `LanguageSwitch` props: `{ locale: Locale }`
  - `Navbar()` shim, with no props.

- [ ] **Step 1: Write the failing test**

```ts
// components/site/site-header.test.ts
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SiteHeader } from "./site-header";

describe("site header", () => {
  it("links each product and section in Indonesian", () => {
    const html = renderToStaticMarkup(createElement(SiteHeader, { locale: "id" }));
    expect(html).toContain('id="site-header"');
    expect(html).toContain('data-overlay="false"');
    expect(html).toContain("Belanja resmi Sheepie di Shopee &amp; Tokopedia");
    for (const href of ["/id/products/cervicloud", "/id/products/lumicloud", "/id/products/calmicloud", "/id/about", "/id/blog"]) {
      expect(html).toContain(`href="${href}"`);
    }
    expect(html).toContain('data-panel-trigger="shop"');
    expect(html).toContain('data-panel-trigger="menu"');
  });

  it("starts transparent over the hero on the home page", () => {
    const html = renderToStaticMarkup(createElement(SiteHeader, { locale: "en", overlay: true }));
    expect(html).toContain('data-overlay="true"');
    expect(html).toContain('data-over="true"');
    expect(html).toContain(">Shop<");
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run components/site/site-header.test.ts`
Expected: FAIL, `Cannot find module './site-header'`.

- [ ] **Step 3: Write the header styles**

```css
/* components/site/header.module.css */
.header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: var(--sp-cream);
  color: var(--sp-ink);
  border-bottom: 1px solid var(--sp-line);
  font-family: var(--font-body), sans-serif;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}

.header[data-overlay="true"] {
  position: fixed;
  left: 0;
  right: 0;
}

.header[data-over="true"] {
  background: transparent;
  color: var(--sp-cream);
  border-color: transparent;
}

.notice {
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  background: var(--sp-sky-soft);
  color: var(--sp-ink);
  font-size: 13px;
  font-weight: 600;
  text-align: center;
}

.header[data-over="true"] .notice {
  background: rgba(17, 27, 44, 0.25);
  color: var(--sp-cream);
}

.bar {
  height: 72px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
}

.nav {
  display: flex;
  gap: 28px;
  font-size: 15px;
  font-weight: 600;
}

.nav a {
  color: inherit;
  text-decoration: none;
}

.navRight {
  justify-content: flex-end;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--sp-logo);
  text-decoration: none;
}

.brand span {
  font: 700 26px var(--font-display), serif;
  letter-spacing: -0.01em;
}

.header[data-over="true"] .brand {
  color: var(--sp-cream);
}

.header[data-over="true"] .brand img {
  filter: brightness(0) invert(1);
}

.shopBtn {
  min-height: 44px;
  padding: 0 18px;
  border: 0;
  border-radius: 999px;
  background: var(--sp-ink);
  color: var(--sp-cream);
  font: 700 14px var(--font-body), sans-serif;
  cursor: pointer;
}

.header[data-over="true"] .shopBtn {
  background: var(--sp-cream);
  color: var(--sp-ink);
}

.menuBtn {
  display: none;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;
}

.menuBtn span {
  display: block;
  width: 22px;
  height: 12px;
  border-top: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
}

.scrim {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(17, 27, 44, 0.35);
}

.sheet {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 61;
  width: min(440px, 100%);
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  overflow-y: auto;
  background: var(--sp-cream);
  color: var(--sp-ink);
}

.sheetHead {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sheetHead h2 {
  font: 700 28px var(--font-display), serif;
}

.sheetNote {
  font-size: 15px;
  opacity: 0.75;
}

.close {
  min-width: 44px;
  min-height: 44px;
  border: 0;
  background: none;
  color: inherit;
  font: 700 15px var(--font-body), sans-serif;
  cursor: pointer;
}

.shopRow {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 14px;
  align-items: center;
  padding: 12px;
  border-radius: 18px;
  background: var(--sp-linen);
}

.shopThumb {
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 12px;
  overflow: hidden;
}

.shopRow h3 {
  font: 700 20px var(--font-display), serif;
}

.shopActions {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.shopActions a {
  min-height: 46px;
  padding: 0 12px;
  font-size: 14px;
}

.menuLinks {
  display: grid;
  gap: 4px;
}

.menuLinks a {
  padding: 8px 0;
  color: inherit;
  font: 700 26px var(--font-display), serif;
  text-decoration: none;
}

.lang {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  color: inherit;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 760px) {
  .notice { height: 32px; font-size: 12px; }
  .bar { height: 60px; grid-template-columns: 44px 1fr auto; }
  .navLeft { display: none; }
  .navRight a { display: none; }
  .menuBtn { display: block; }
  .brand span { font-size: 22px; }
  .shopBtn { padding: 0 14px; font-size: 13px; }
}
```

- [ ] **Step 4: Write the header components**

```tsx
// components/site/language-switch.tsx
"use client";

import { useEffect, useState } from "react";

import type { Locale } from "@/i18n/config";
import { siteCopy } from "@/lib/site/copy";

const LOCALE_PREFIX = /^\/(id|en)(?=\/|$)/;

/**
 * Links to the same page in the other language. Reads the path after mount
 * (no next/navigation hook) so it also renders outside the App Router, e.g. in tests.
 */
export function LanguageSwitch({ locale, className }: { locale: Locale; className?: string }) {
  const target: Locale = locale === "id" ? "en" : "id";
  const [href, setHref] = useState(`/${target}`);

  useEffect(() => {
    const path = window.location.pathname;
    setHref(LOCALE_PREFIX.test(path) ? path.replace(LOCALE_PREFIX, `/${target}`) + window.location.search : `/${target}`);
  }, [target]);

  return (
    <a href={href} hrefLang={target} className={className} data-language-switch>
      {siteCopy[locale].language.switchTo}
    </a>
  );
}
```

```tsx
// components/site/header-over-hero.tsx
"use client";

import { useEffect } from "react";

/** Keeps the fixed header transparent while #hero sits under it. */
export function HeaderOverHero() {
  useEffect(() => {
    const header = document.getElementById("site-header");
    const hero = document.getElementById("hero");
    if (!header || !hero) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        header.dataset.over = entry.isIntersecting ? "true" : "false";
      },
      { rootMargin: "-110px 0px 0px 0px" },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return null;
}
```

```tsx
// components/site/header-bar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { Locale } from "@/i18n/config";
import type { ProductSlug } from "@/lib/catalog/types";
import { localeHref, siteCopy } from "@/lib/site/copy";

import { buttonClass } from "./button";
import styles from "./header.module.css";
import { LambMark } from "./lamb-mark";
import { LanguageSwitch } from "./language-switch";
import { MarketplaceLink } from "./marketplace-link";

export type ShopItem = {
  slug: ProductSlug;
  name: string;
  image: string;
  price: string;
  optionKey: string;
  value: number;
  shopeeUrl: string;
  tokopediaUrl: string;
};

type Panel = "menu" | "shop" | null;

export function HeaderBar({ locale, shopItems }: { locale: Locale; shopItems: ShopItem[] }) {
  const t = siteCopy[locale];
  const [panel, setPanel] = useState<Panel>(null);

  useEffect(() => {
    if (!panel) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPanel(null);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [panel]);

  const links = [
    { href: localeHref(locale, "/products/cervicloud"), label: t.nav.pillow },
    { href: localeHref(locale, "/products/lumicloud"), label: t.nav.mask },
    { href: localeHref(locale, "/products/calmicloud"), label: t.nav.earplug },
  ];
  const secondary = [
    { href: localeHref(locale, "/about"), label: t.nav.story },
    { href: localeHref(locale, "/blog"), label: t.nav.journal },
  ];

  return (
    <>
      <div className={styles.bar}>
        <button type="button" className={styles.menuBtn} aria-label={t.nav.menu} data-panel-trigger="menu" onClick={() => setPanel("menu")}>
          <span />
        </button>
        <nav className={`${styles.nav} ${styles.navLeft}`}>
          {links.map((link) => (
            <Link key={link.href} href={link.href}>{link.label}</Link>
          ))}
        </nav>
        <Link href={localeHref(locale, "/")} className={styles.brand} aria-label="Sheepie">
          <LambMark size={46} breathe />
          <span>Sheepie.</span>
        </Link>
        <nav className={`${styles.nav} ${styles.navRight}`}>
          {secondary.map((link) => (
            <Link key={link.href} href={link.href}>{link.label}</Link>
          ))}
          <button type="button" className={styles.shopBtn} data-panel-trigger="shop" onClick={() => setPanel("shop")}>
            {t.nav.shop}
          </button>
        </nav>
      </div>

      {panel && (
        <>
          <div className={styles.scrim} onClick={() => setPanel(null)} />
          <div className={styles.sheet} role="dialog" aria-modal="true" aria-label={panel === "shop" ? t.shopPanel.title : t.nav.menu}>
            <div className={styles.sheetHead}>
              <h2>{panel === "shop" ? t.shopPanel.title : t.nav.menu}</h2>
              <button type="button" className={styles.close} onClick={() => setPanel(null)}>{t.nav.close}</button>
            </div>

            {panel === "shop" ? (
              <>
                <p className={styles.sheetNote}>{t.shopPanel.note}</p>
                {shopItems.map((item) => (
                  <div key={item.slug} className={styles.shopRow}>
                    <div className={styles.shopThumb}>
                      <Image src={item.image} alt="" fill sizes="72px" style={{ objectFit: "cover" }} />
                    </div>
                    <div>
                      <h3>{item.name}</h3>
                      <div>{item.price}</div>
                    </div>
                    <div className={styles.shopActions}>
                      <MarketplaceLink slug={item.slug} optionKey={item.optionKey} value={item.value} marketplace="shopee" href={item.shopeeUrl} placement="shop-panel" className={buttonClass("ink")}>
                        Shopee
                      </MarketplaceLink>
                      <MarketplaceLink slug={item.slug} optionKey={item.optionKey} value={item.value} marketplace="tokopedia" href={item.tokopediaUrl} placement="shop-panel" className={buttonClass("line")}>
                        Tokopedia
                      </MarketplaceLink>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <nav className={styles.menuLinks}>
                  {[...links, ...secondary, { href: localeHref(locale, "/faq"), label: t.nav.faq }, { href: localeHref(locale, "/contact"), label: t.nav.contact }].map((link) => (
                    <Link key={link.href} href={link.href} onClick={() => setPanel(null)}>{link.label}</Link>
                  ))}
                </nav>
                <LanguageSwitch locale={locale} className={styles.lang} />
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
```

```tsx
// components/site/site-header.tsx
import type { Locale } from "@/i18n/config";
import { getProducts } from "@/lib/catalog";
import { formatIdr } from "@/lib/catalog/price";
import { siteCopy } from "@/lib/site/copy";

import { HeaderBar, type ShopItem } from "./header-bar";
import { HeaderOverHero } from "./header-over-hero";
import styles from "./header.module.css";

export function SiteHeader({ locale, overlay = false }: { locale: Locale; overlay?: boolean }) {
  const shopItems: ShopItem[] = getProducts(locale).map((product) => {
    const option = product.options[0];
    return {
      slug: product.slug,
      name: product.name,
      image: product.card.image,
      price: formatIdr(option.price),
      optionKey: option.key,
      value: option.price,
      shopeeUrl: option.shopeeUrl,
      tokopediaUrl: option.tokopediaUrl,
    };
  });

  return (
    <header id="site-header" className={styles.header} data-overlay={String(overlay)} data-over={String(overlay)}>
      <div className={styles.notice}>{siteCopy[locale].notice}</div>
      <div style={{ maxWidth: "var(--sp-max)", margin: "0 auto", padding: "0 var(--sp-gutter)" }}>
        <HeaderBar locale={locale} shopItems={shopItems} />
      </div>
      {overlay && <HeaderOverHero />}
    </header>
  );
}
```

- [ ] **Step 5: Turn the old Navbar into a shim**

Replace the entire contents of `components/layout/navbar.tsx` with:

```tsx
import { useLocale } from "next-intl";

import { SiteHeader } from "@/components/site/site-header";
import { defaultLocale, isLocale } from "@/i18n/config";

/** Phase 2 pages still import Navbar; they now get the new header. */
export function Navbar() {
  const locale = useLocale();
  return <SiteHeader locale={isLocale(locale) ? locale : defaultLocale} />;
}
```

- [ ] **Step 6: Run the test and typecheck**

Run: `npx vitest run components/site/site-header.test.ts && npm run typecheck`
Expected: PASS, exit 0.

- [ ] **Step 7: Commit**

```bash
git add components/site components/layout/navbar.tsx
git commit -m "feat: add the brand header with shop panel and menu sheet"
```

---

### Task 10: Site footer

**Files:**
- Create: `components/site/footer.module.css`
- Create: `components/site/site-footer.tsx`
- Modify: `components/layout/footer.tsx` (replace the whole file)
- Test: `components/site/site-footer.test.ts`

**Interfaces:**
- Consumes: `siteCopy`, `storeLinks`, `localeHref`, `productPath`, `Mendung`, `LambMark`, `LanguageSwitch`.
- Produces: `SiteFooter` props `{ locale: Locale }`, which renders `<footer data-section="footer">`; and the `Footer()` shim.

- [ ] **Step 1: Write the failing test**

```ts
// components/site/site-footer.test.ts
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SiteFooter } from "./site-footer";

describe("site footer", () => {
  it("says goodnight and links shop, brand and store pages", () => {
    const html = renderToStaticMarkup(createElement(SiteFooter, { locale: "id" }));
    expect(html).toContain('data-section="footer"');
    expect(html).toContain("Selamat tidur, sampai besok pagi.");
    expect(html).toContain('href="/id/products/cervicloud?option=case"');
    expect(html).toContain('href="https://shopee.co.id/sheepie.sleep"');
    expect(html).toContain('href="https://www.tokopedia.com/sheepie"');
    expect(html).toContain('href="/id/faq"');
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run components/site/site-footer.test.ts`
Expected: FAIL, `Cannot find module './site-footer'`.

- [ ] **Step 3: Write the styles and component**

```css
/* components/site/footer.module.css */
.footer {
  position: relative;
  overflow: hidden;
  background: var(--sp-night);
  color: var(--sp-cream);
  font-family: var(--font-body), sans-serif;
}

.footer > [aria-hidden] {
  opacity: 0.55;
}

.grid {
  position: relative;
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1fr;
  gap: 40px;
  padding: 90px 0 60px;
}

.say {
  margin-top: 22px;
  max-width: 360px;
  font: 700 40px/1.08 var(--font-display), serif;
  letter-spacing: -0.015em;
}

.grid h4 {
  margin-bottom: 16px;
  font-size: 15px;
  font-weight: 700;
  opacity: 0.55;
}

.grid ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.grid li a {
  display: inline-flex;
  min-height: 34px;
  align-items: center;
  color: inherit;
  font-size: 16px;
  text-decoration: none;
}

.legal {
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 22px 0 30px;
  border-top: 1px solid rgba(255, 253, 245, 0.12);
  font-size: 13px;
}

.legal a {
  color: inherit;
}

.white {
  filter: brightness(0) invert(1);
  opacity: 0.9;
}

@media (max-width: 760px) {
  .grid { grid-template-columns: 1fr 1fr; gap: 30px 20px; padding: 64px 0 40px; }
  .grid > div:first-child { grid-column: 1 / -1; }
  .say { font-size: 32px; }
  .legal { flex-direction: column; }
}
```

```tsx
// components/site/site-footer.tsx
import Link from "next/link";

import type { Locale } from "@/i18n/config";
import { productPath } from "@/lib/catalog";
import { localeHref, siteCopy, storeLinks } from "@/lib/site/copy";

import styles from "./footer.module.css";
import { LambMark } from "./lamb-mark";
import { LanguageSwitch } from "./language-switch";
import { Mendung } from "./mendung";
import site from "./site.module.css";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = siteCopy[locale];

  return (
    <footer className={styles.footer} data-section="footer">
      <Mendung tone="sky" />
      <div className={`${site.shell} ${styles.grid}`}>
        <div>
          <LambMark size={84} className={styles.white} />
          <div className={styles.say}>{t.footer.goodnight}</div>
        </div>
        <div>
          <h4>{t.footer.shop}</h4>
          <ul>
            <li><Link href={productPath(locale, "cervicloud")}>CerviCloud</Link></li>
            <li><Link href={productPath(locale, "lumicloud")}>LumiCloud</Link></li>
            <li><Link href={productPath(locale, "calmicloud")}>CalmiCloud</Link></li>
            <li><Link href={productPath(locale, "cervicloud", "case")}>{t.footer.cover}</Link></li>
          </ul>
        </div>
        <div>
          <h4>{t.footer.brand}</h4>
          <ul>
            <li><Link href={localeHref(locale, "/about")}>{t.nav.story}</Link></li>
            <li><Link href={localeHref(locale, "/blog")}>{t.nav.journal}</Link></li>
            <li><Link href={localeHref(locale, "/faq")}>{t.nav.faq}</Link></li>
            <li><Link href={localeHref(locale, "/contact")}>{t.nav.contact}</Link></li>
          </ul>
        </div>
        <div>
          <h4>{t.footer.find}</h4>
          <ul>
            <li><a href={storeLinks.shopee} target="_blank" rel="noopener noreferrer">Shopee</a></li>
            <li><a href={storeLinks.tokopedia} target="_blank" rel="noopener noreferrer">Tokopedia</a></li>
            <li><a href={storeLinks.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href={storeLinks.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a></li>
          </ul>
        </div>
      </div>
      <div className={`${site.shell} ${styles.legal}`}>
        <span>{t.footer.rights}</span>
        <LanguageSwitch locale={locale} />
      </div>
    </footer>
  );
}
```

Replace the entire contents of `components/layout/footer.tsx` with:

```tsx
import { useLocale } from "next-intl";

import { SiteFooter } from "@/components/site/site-footer";
import { defaultLocale, isLocale } from "@/i18n/config";

/** Phase 2 pages still import Footer; they now get the new footer. */
export function Footer() {
  const locale = useLocale();
  return <SiteFooter locale={isLocale(locale) ? locale : defaultLocale} />;
}
```

- [ ] **Step 4: Run the test and typecheck**

Run: `npx vitest run components/site && npm run typecheck`
Expected: PASS, exit 0.

- [ ] **Step 5: Commit**

```bash
git add components/site/footer.module.css components/site/site-footer.tsx components/site/site-footer.test.ts components/layout/footer.tsx
git commit -m "feat: add the night footer"
```

---

### Task 11: Home page

**Files:**
- Create: `lib/site/home-copy.ts`
- Create: `components/home/home.module.css`
- Create: `components/home/home-hero.tsx`
- Create: `components/home/product-duo.tsx`
- Create: `components/home/companion-row.tsx`
- Create: `components/home/feature-band.tsx`
- Create: `components/home/review-section.tsx`
- Create: `components/home/lights-out-band.tsx`
- Create: `components/home/lights-out-controller.tsx`
- Modify: `app/[locale]/page.tsx` (replace the whole file)
- Test: `components/home/home.test.ts`

**Interfaces:**
- Consumes:
  - `getProduct`, `getProducts`, `productPath`, `formatIdr`
  - `getReviews`, `excerpt`
  - `SiteHeader`, `SiteFooter`
  - `ProductCard`, `ButtonLink`, `FadeIn`, `Mendung`
- Produces: the home route.
  - Each section carries `data-section` with one of: `hero`, `products`, `cervicloud`, `cervicloud-reviews`, `lumicloud`, `lumicloud-reviews`.
  - The hero carries `id="hero"`.
  - The lights-out band carries `id="lights"`, with children marked `data-lights="sky|far|near|content"`.

- [ ] **Step 1: Write the failing test**

```ts
// components/home/home.test.ts
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import Home from "@/app/[locale]/page";

async function render(locale: "id" | "en") {
  const element = await Home({ params: Promise.resolve({ locale }) });
  return renderToStaticMarkup(element);
}

describe("home page", () => {
  it("runs the night arc in the owner's order", async () => {
    const html = await render("id");
    const order = [...html.matchAll(/data-section="([^"]+)"/g)].map((m) => m[1]).filter((s) => s !== "footer");
    expect(order).toEqual(["hero", "products", "cervicloud", "cervicloud-reviews", "lumicloud", "lumicloud-reviews"]);
    expect(html.indexOf('data-section="lumicloud-reviews"')).toBeLessThan(html.indexOf('data-section="footer"'));
  });

  it("leads with both hero products", async () => {
    const html = await render("id");
    expect(html).toContain('id="hero"');
    expect(html).toContain("Leher tertopang, mata tetap gelap.");
    expect(html).toContain('href="/id/products/cervicloud"');
    expect(html).toContain('href="/id/products/lumicloud"');
    expect(html).toContain('data-overlay="true"');
  });

  it("shows CerviCloud and LumiCloud as equal cards and CalmiCloud as a companion", async () => {
    const html = await render("id");
    expect(html).toContain('data-product-card="cervicloud"');
    expect(html).toContain('data-product-card="lumicloud"');
    expect(html).not.toContain('data-product-card="calmicloud"');
    expect(html).toContain('data-companion="calmicloud"');
    expect(html).toContain('href="/id/products/cervicloud?option=case"');
  });

  it("quotes masked reviewers with a link to the original screenshot", async () => {
    const html = await render("id");
    expect(html).toContain("/images/bio/testimonials/cervicloud-3-review.jpg");
    expect(html).toContain("/images/bio/testimonials/lumicloud-1-review.jpg");
    expect(html).not.toContain("steve969");
  });

  it("renders the lights-out band with its animated layers", async () => {
    const html = await render("id");
    expect(html).toContain('id="lights"');
    for (const layer of ["sky", "far", "near", "content"]) expect(html).toContain(`data-lights="${layer}"`);
  });

  it("renders English copy on /en", async () => {
    const html = await render("en");
    expect(html).toContain("Neck supported, eyes kept dark.");
    expect(html).toContain('href="/en/products/lumicloud"');
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run components/home/home.test.ts`
Expected: FAIL. The current `app/[locale]/page.tsx` takes no params and renders no `data-section` markers.

- [ ] **Step 3: Write the home copy**

```ts
// lib/site/home-copy.ts
import type { Locale } from "@/i18n/config";

export interface HomeCopy {
  hero: { title: string; sub: string; cervi: string; lumi: string; alt: string };
  products: { title: string; all: string; companion: string; coverName: string; coverLine: string };
  cervi: { title: string; lead: string; features: [string, string][]; cta: string };
  lumi: { title: string; lead: string; features: [string, string][]; swatches: string; cta: string };
  reviews: { cervi: string; lumi: string; viewOriginal: string };
}

export const homeCopy: Record<Locale, HomeCopy> = {
  id: {
    hero: {
      title: "Leher tertopang, mata tetap gelap.",
      sub: "CerviCloud dan LumiCloud: bantal ergonomis dan masker mata blackout untuk malam Indonesia yang gerah.",
      cervi: "Lihat CerviCloud",
      lumi: "Lihat LumiCloud",
      alt: "Tidur dengan CerviCloud, LumiCloud, dan CalmiCloud",
    },
    products: {
      title: "Koleksi utama",
      all: "Semua produk",
      companion: "Pelengkap",
      coverName: "Sarung CerviCloud",
      coverLine: "Sarung ice-silk cadangan, mudah dilepas dan dicuci.",
    },
    cervi: {
      title: "CerviCloud, bantal yang ikut bentuk tidurmu.",
      lead: "Bentuk butterfly menopang leher saat telentang dan miring. Ada lekukan untuk menaruh tangan, jadi main HP sebelum tidur pun tetap nyaman.",
      features: [
        ["Side & back sleeper", "Kontur berbeda untuk tiap posisi tidur."],
        ["Sarung ice-silk", "Terasa sejuk di kulit, bisa dilepas."],
        ["Memory foam", "Slow-rebound, tidak cepat kempes."],
        ["64 × 35 × 12 cm", "Cukup lebar untuk ganti posisi."],
      ],
      cta: "Lihat CerviCloud",
    },
    lumi: {
      title: "LumiCloud. Matikan lampu, tanpa menekan mata.",
      lead: "Masker mata blackout yang ringan dan lembut. Tidak menekan kelopak mata, jadi nyaman dipakai semalaman, siang, atau di perjalanan.",
      features: [
        ["Blackout", "Menutup cahaya untuk kebanyakan orang."],
        ["Tidak menekan mata", "Kelopak tetap bebas."],
        ["Aman untuk rambut", "Velcro halus, tidak menyangkut."],
        ["Ringan & praktis", "Untuk tidur siang dan perjalanan."],
      ],
      swatches: "Blue · Apricot",
      cta: "Lihat LumiCloud",
    },
    reviews: { cervi: "Kata mereka tentang CerviCloud", lumi: "Kata mereka tentang LumiCloud", viewOriginal: "Lihat ulasan asli" },
  },
  en: {
    hero: {
      title: "Neck supported, eyes kept dark.",
      sub: "CerviCloud and LumiCloud: an ergonomic pillow and a blackout eye mask for warm Indonesian nights.",
      cervi: "See CerviCloud",
      lumi: "See LumiCloud",
      alt: "Sleeping with CerviCloud, LumiCloud and CalmiCloud",
    },
    products: {
      title: "The core collection",
      all: "All products",
      companion: "Companions",
      coverName: "CerviCloud cover",
      coverLine: "A spare ice-silk cover, easy to remove and wash.",
    },
    cervi: {
      title: "CerviCloud, the pillow that follows how you sleep.",
      lead: "The butterfly shape supports your neck on your back and side. A curve for your arm keeps scrolling before bed comfortable too.",
      features: [
        ["Side & back sleepers", "A different contour for each position."],
        ["Ice-silk cover", "Feels cool on the skin, removable."],
        ["Memory foam", "Slow-rebound, doesn't go flat."],
        ["64 × 35 × 12 cm", "Wide enough to change position."],
      ],
      cta: "See CerviCloud",
    },
    lumi: {
      title: "LumiCloud. Lights out, no pressure on your eyes.",
      lead: "A light, soft blackout eye mask. It doesn't press on your eyelids, so it stays comfortable all night, for naps or on the road.",
      features: [
        ["Blackout", "Blocks light for most sleepers."],
        ["No eye pressure", "Your eyelids stay free."],
        ["Hair-friendly", "Soft velcro that doesn't snag."],
        ["Light & easy", "For naps and travel."],
      ],
      swatches: "Blue · Apricot",
      cta: "See LumiCloud",
    },
    reviews: { cervi: "What people say about CerviCloud", lumi: "What people say about LumiCloud", viewOriginal: "See original review" },
  },
};
```

- [ ] **Step 4: Write the home styles**

```css
/* components/home/home.module.css */
.hero {
  position: relative;
  height: 100vh;
  height: 100svh;
  min-height: 620px;
  max-height: 960px;
  overflow: hidden;
  color: var(--sp-cream);
}

.heroImg {
  object-fit: cover;
  object-position: 50% 32%;
}

.hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(0deg, rgba(17, 27, 44, 0.62) 0%, rgba(17, 27, 44, 0.22) 42%, rgba(17, 27, 44, 0) 62%),
    linear-gradient(180deg, rgba(17, 27, 44, 0.28) 0%, rgba(17, 27, 44, 0) 18%);
}

.heroCopy {
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  bottom: 64px;
}

.heroCopy h1 {
  max-width: 720px;
  font: 700 76px/1 var(--font-display), serif;
  letter-spacing: -0.02em;
}

.heroCopy p {
  max-width: 470px;
  margin: 20px 0 30px;
  font-size: 19px;
  line-height: 1.55;
  opacity: 0.92;
}

.ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.collection {
  padding: 110px 0 40px;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 24px;
  margin-bottom: 36px;
}

.head h2,
.reviews h2 {
  font: 700 46px/1.05 var(--font-display), serif;
  letter-spacing: -0.015em;
}

.link {
  color: inherit;
  font-weight: 700;
  font-size: 15px;
  text-decoration: none;
  border-bottom: 1.5px solid currentColor;
  padding-bottom: 2px;
}

.duo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.companions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 28px;
}

.mini {
  display: grid;
  grid-template-columns: 132px 1fr auto;
  gap: 20px;
  align-items: center;
  padding: 14px 24px 14px 14px;
  border-radius: 22px;
  background: var(--sp-linen);
  color: inherit;
  text-decoration: none;
}

.miniImg {
  position: relative;
  width: 132px;
  height: 132px;
  border-radius: 16px;
  overflow: hidden;
}

.miniTag {
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: 700;
  opacity: 0.55;
}

.mini h3 {
  font: 700 21px var(--font-display), serif;
}

.mini p {
  margin-top: 4px;
  font-size: 14.5px;
  line-height: 1.45;
  opacity: 0.75;
}

.miniPrice {
  font-weight: 700;
  font-size: 17px;
  white-space: nowrap;
}

.cervi {
  position: relative;
  margin-top: 100px;
  overflow: hidden;
  background: var(--sp-sky-soft);
}

.bandIn {
  position: relative;
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 64px;
  align-items: center;
  padding-top: 110px;
  padding-bottom: 110px;
}

.stack {
  position: relative;
  aspect-ratio: 1 / 1.08;
}

.stackBig {
  position: absolute;
  inset: 0 14% 12% 0;
  border-radius: 26px;
  overflow: hidden;
}

.stackSmall {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 46%;
  aspect-ratio: 1;
  border-radius: 22px;
  overflow: hidden;
  border: 6px solid var(--sp-sky-soft);
}

.cover {
  object-fit: cover;
}

.feature h2 {
  font: 700 56px/1.03 var(--font-display), serif;
  letter-spacing: -0.02em;
}

.lead {
  max-width: 470px;
  margin: 20px 0 32px;
  font-size: 18.5px;
  line-height: 1.6;
  opacity: 0.85;
}

.feat {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px 30px;
  max-width: 480px;
  margin-bottom: 38px;
}

.feat div {
  padding-top: 14px;
  border-top: 1px solid var(--sp-line);
  font-size: 15px;
  line-height: 1.5;
}

.feat b {
  display: block;
  margin-bottom: 4px;
  font-size: 16px;
  font-weight: 700;
}

.reviews {
  padding: 110px 0 120px;
}

.reviews h2 {
  margin-bottom: 40px;
}

.rvGrid {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: 24px;
}

.rvCol {
  display: grid;
  gap: 24px;
}

.rv {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 22px;
  height: 100%;
  margin: 0;
  padding: 30px 32px;
  border-radius: 24px;
  background: var(--sp-linen);
}

.rv blockquote {
  margin: 0;
  font: 600 21px/1.4 var(--font-display), serif;
}

.rvBig {
  padding: 44px 46px;
}

.rvBig blockquote {
  font: 700 36px/1.2 var(--font-display), serif;
  letter-spacing: -0.01em;
}

.rv figcaption {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  font-size: 14px;
}

.rv figcaption a {
  margin-left: auto;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  color: inherit;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.night {
  background: var(--sp-night);
  color: var(--sp-cream);
  padding-top: 40px;
}

.night .rv {
  background: rgba(255, 253, 245, 0.06);
  border: 1px solid rgba(255, 253, 245, 0.1);
}

/* Lights out */
.lights {
  position: relative;
  height: 180vh;
}

.stick {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.sky {
  position: absolute;
  inset: 0;
  background: var(--sp-night);
  opacity: 0;
  will-change: opacity;
}

.layer {
  position: absolute;
  inset: -20% 0;
  background: url(/brand/mendung-sky.png) repeat;
  opacity: 0;
  will-change: opacity, transform;
}

.layerFar {
  background-size: 760px auto;
}

.lightsIn {
  position: relative;
  z-index: 1;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  gap: 64px;
  align-items: center;
  color: var(--sp-cream);
  opacity: 0;
  will-change: opacity, transform;
}

.lightsIn .feat div {
  border-color: rgba(255, 253, 245, 0.18);
}

.lightsPh {
  position: relative;
  aspect-ratio: 1 / 1.05;
  border-radius: 26px;
  overflow: hidden;
}

.swatches {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 30px;
  font-size: 14px;
  font-weight: 600;
}

.swatches i {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid rgba(255, 253, 245, 0.8);
}

@media (max-width: 760px) {
  .heroImg { object-position: 58% 30%; }
  .hero::after {
    background:
      linear-gradient(0deg, rgba(17, 27, 44, 0.72) 0%, rgba(17, 27, 44, 0.3) 45%, rgba(17, 27, 44, 0) 65%),
      linear-gradient(180deg, rgba(17, 27, 44, 0.3) 0%, rgba(17, 27, 44, 0) 20%);
  }
  .heroCopy { bottom: 28px; }
  .heroCopy h1 { font-size: 42px; }
  .heroCopy p { margin: 14px 0 22px; font-size: 16px; }
  .ctas { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .ctas a { padding: 0 10px; font-size: 14px; }

  .collection { padding: 64px 0 20px; }
  .head { margin-bottom: 22px; }
  .head h2, .reviews h2 { font-size: 30px; }
  .duo { display: flex; gap: 14px; overflow-x: auto; scroll-snap-type: x mandatory; margin: 0 calc(var(--sp-gutter) * -1); padding: 0 var(--sp-gutter) 4px; scrollbar-width: none; }
  .duo::-webkit-scrollbar { display: none; }
  .duo > * { flex: 0 0 82%; scroll-snap-align: start; }
  .companions { grid-template-columns: 1fr; gap: 12px; margin-top: 20px; }
  .mini { grid-template-columns: 76px 1fr; gap: 14px; padding: 10px 14px 10px 10px; }
  .miniImg { width: 76px; height: 76px; border-radius: 12px; }
  .miniPrice { grid-column: 2; font-size: 14px; }
  .mini h3 { font-size: 18px; }
  .mini p { font-size: 13px; }

  .cervi { margin-top: 64px; }
  .bandIn { grid-template-columns: 1fr; gap: 34px; padding-top: 64px; padding-bottom: 64px; }
  .feature h2 { font-size: 34px; }
  .lead { margin: 14px 0 24px; font-size: 16px; }
  .feat { gap: 16px 18px; margin-bottom: 28px; }
  .feat div { font-size: 13.5px; }
  .feat b { font-size: 14.5px; }
  .feature a { width: 100%; }

  .reviews { padding: 64px 0 70px; }
  .rvGrid { grid-template-columns: 1fr; gap: 12px; }
  .rvCol { gap: 12px; }
  .rv, .rvBig { padding: 22px; border-radius: 20px; }
  .rvBig blockquote { font-size: 24px; }
  .rv blockquote { font-size: 17px; }
  .night { padding-top: 20px; }

  /* Phones: no pinning; the panel dims in as it arrives. */
  .lights { height: auto; }
  .stick { position: relative; height: auto; display: block; padding: 70px 0 30px; }
  .lightsIn { grid-template-columns: 1fr; gap: 30px; }
  .lightsPh { order: -1; aspect-ratio: 4 / 4.2; }
}

@media (prefers-reduced-motion: reduce) {
  .lights { height: auto; }
  .stick { position: relative; height: auto; padding: 100px 0; }
  .sky, .layer, .lightsIn { opacity: 1 !important; transform: none !important; }
}
```

- [ ] **Step 5: Write the home components**

```tsx
// components/home/home-hero.tsx
import Image from "next/image";

import { ButtonLink } from "@/components/site/button";
import site from "@/components/site/site.module.css";
import type { Locale } from "@/i18n/config";
import { productPath } from "@/lib/catalog";
import { homeCopy } from "@/lib/site/home-copy";

import styles from "./home.module.css";

export function HomeHero({ locale }: { locale: Locale }) {
  const t = homeCopy[locale].hero;

  return (
    <section id="hero" className={styles.hero} data-section="hero">
      <Image src="/images/edited/DSC01316.JPG" alt={t.alt} fill priority sizes="100vw" className={styles.heroImg} />
      <div className={styles.heroCopy}>
        <div className={site.shell}>
          <h1>{t.title}</h1>
          <p>{t.sub}</p>
          <div className={styles.ctas}>
            <ButtonLink href={productPath(locale, "cervicloud")} variant="cream">{t.cervi}</ButtonLink>
            <ButtonLink href={productPath(locale, "lumicloud")} variant="lineLight">{t.lumi}</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
```

```tsx
// components/home/product-duo.tsx
import Link from "next/link";

import { FadeIn } from "@/components/site/fade-in";
import { ProductCard } from "@/components/site/product-card";
import site from "@/components/site/site.module.css";
import type { Locale } from "@/i18n/config";
import { getProducts } from "@/lib/catalog";
import { localeHref } from "@/lib/site/copy";
import { homeCopy } from "@/lib/site/home-copy";

import { CompanionRow } from "./companion-row";
import styles from "./home.module.css";

export function ProductDuo({ locale }: { locale: Locale }) {
  const t = homeCopy[locale].products;
  const heroes = getProducts(locale).filter((p) => p.role === "hero");

  return (
    <section className={`${site.shell} ${styles.collection}`} data-section="products">
      <FadeIn className={styles.head}>
        <h2>{t.title}</h2>
        <Link className={styles.link} href={localeHref(locale, "/products")}>{t.all}</Link>
      </FadeIn>
      <div className={styles.duo}>
        {heroes.map((product, i) => (
          <ProductCard key={product.slug} product={product} locale={locale} index={i} />
        ))}
      </div>
      <CompanionRow locale={locale} />
    </section>
  );
}
```

```tsx
// components/home/companion-row.tsx
import Image from "next/image";
import Link from "next/link";

import { FadeIn } from "@/components/site/fade-in";
import type { Locale } from "@/i18n/config";
import { findOption, getProduct, productPath } from "@/lib/catalog";
import { formatIdr } from "@/lib/catalog/price";
import { homeCopy } from "@/lib/site/home-copy";

import styles from "./home.module.css";

export function CompanionRow({ locale }: { locale: Locale }) {
  const t = homeCopy[locale].products;
  const calmi = getProduct("calmicloud", locale);
  const cover = findOption(getProduct("cervicloud", locale), "case");

  const tiles = [
    { key: "calmicloud", href: productPath(locale, "calmicloud"), image: calmi.card.image, name: calmi.name, line: calmi.card.line, price: formatIdr(calmi.options[0].price) },
    { key: "cervicloud-case", href: productPath(locale, "cervicloud", "case"), image: cover.image, name: t.coverName, line: t.coverLine, price: formatIdr(cover.price) },
  ];

  return (
    <div className={styles.companions}>
      {tiles.map((tile, i) => (
        <FadeIn key={tile.key} index={i + 2}>
          <Link href={tile.href} className={styles.mini} data-companion={tile.key}>
            <div className={styles.miniImg}>
              <Image src={tile.image} alt="" fill sizes="132px" className={styles.cover} />
            </div>
            <div>
              <div className={styles.miniTag}>{t.companion}</div>
              <h3>{tile.name}</h3>
              <p>{tile.line}</p>
            </div>
            <div className={styles.miniPrice}>{tile.price}</div>
          </Link>
        </FadeIn>
      ))}
    </div>
  );
}
```

```tsx
// components/home/feature-band.tsx
import Image from "next/image";

import { ButtonLink } from "@/components/site/button";
import { FadeIn } from "@/components/site/fade-in";
import { Mendung } from "@/components/site/mendung";
import site from "@/components/site/site.module.css";
import type { Locale } from "@/i18n/config";
import { productPath } from "@/lib/catalog";
import { homeCopy } from "@/lib/site/home-copy";

import styles from "./home.module.css";

/** CerviCloud's daylight band. */
export function FeatureBand({ locale }: { locale: Locale }) {
  const t = homeCopy[locale].cervi;

  return (
    <section className={styles.cervi} data-section="cervicloud">
      <Mendung tone="white" />
      <div className={`${site.shell} ${styles.bandIn}`}>
        <FadeIn className={styles.stack}>
          <div className={styles.stackBig}>
            <Image src="/images/edited/DSC01139.JPG" alt="" fill sizes="(max-width: 760px) 90vw, 560px" className={styles.cover} />
          </div>
          <div className={styles.stackSmall}>
            <Image src="/brand/icesilk.jpg" alt="" fill sizes="(max-width: 760px) 42vw, 280px" className={styles.cover} />
          </div>
        </FadeIn>
        <FadeIn index={1} className={styles.feature}>
          <h2>{t.title}</h2>
          <p className={styles.lead}>{t.lead}</p>
          <div className={styles.feat}>
            {t.features.map(([title, body]) => (
              <div key={title}><b>{title}</b>{body}</div>
            ))}
          </div>
          <ButtonLink href={productPath(locale, "cervicloud")} variant="ink">{t.cta}</ButtonLink>
        </FadeIn>
      </div>
    </section>
  );
}
```

```tsx
// components/home/review-section.tsx
import { FadeIn } from "@/components/site/fade-in";
import site from "@/components/site/site.module.css";
import type { Locale } from "@/i18n/config";
import { excerpt, getReviews, type Review } from "@/lib/catalog/reviews";
import type { ProductSlug } from "@/lib/catalog/types";
import { homeCopy } from "@/lib/site/home-copy";

import styles from "./home.module.css";

function Card({ review, big, viewOriginal, index }: { review: Review; big?: boolean; viewOriginal: string; index: number }) {
  return (
    <FadeIn index={index}>
      <figure className={`${styles.rv} ${big ? styles.rvBig : ""}`}>
        <blockquote>“{big ? review.quote : excerpt(review.quote, 24)}”</blockquote>
        <figcaption>
          <b>{review.author}</b> · {review.marketplace === "shopee" ? "Shopee" : "Tokopedia"}
          <a href={review.screenshot} target="_blank" rel="noopener noreferrer">{viewOriginal}</a>
        </figcaption>
      </figure>
    </FadeIn>
  );
}

export function ReviewSection({
  locale,
  slug,
  featuredId,
  tone,
}: {
  locale: Locale;
  slug: ProductSlug;
  featuredId: string;
  tone: "day" | "night";
}) {
  const t = homeCopy[locale].reviews;
  const reviews = getReviews(slug);
  const featured = reviews.find((r) => r.id === featuredId) ?? reviews[0];
  const rest = reviews.filter((r) => r !== featured).slice(0, 2);

  return (
    <section className={`${styles.reviews} ${tone === "night" ? styles.night : ""}`} data-section={`${slug}-reviews`}>
      <div className={site.shell}>
        <FadeIn><h2>{slug === "cervicloud" ? t.cervi : t.lumi}</h2></FadeIn>
        <div className={styles.rvGrid}>
          <Card review={featured} big viewOriginal={t.viewOriginal} index={0} />
          <div className={styles.rvCol}>
            {rest.map((review, i) => (
              <Card key={review.id} review={review} viewOriginal={t.viewOriginal} index={i + 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

```tsx
// components/home/lights-out-controller.tsx
"use client";

import { useEffect } from "react";

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/**
 * Dims #lights as it scrolls in. The scroll listener exists only while the band
 * is near the viewport, writes once per animation frame, and touches only
 * opacity and transform.
 */
export function LightsOutController() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const band = document.getElementById("lights");
    if (!band) return;
    const layer = (name: string) => band.querySelector<HTMLElement>(`[data-lights="${name}"]`)!;
    const sky = layer("sky");
    const far = layer("far");
    const near = layer("near");
    const content = layer("content");
    let ticking = false;

    const update = () => {
      ticking = false;
      const r = band.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = window.innerWidth <= 760 ? clamp((vh * 0.9 - r.top) / (vh * 0.7)) : clamp((vh * 0.6 - r.top) / (r.height - vh * 0.4));
      const dark = ease(0, 0.3, p);
      const rise = ease(0.15, 0.4, p);
      sky.style.opacity = String(dark);
      far.style.opacity = String(dark * 0.8);
      near.style.opacity = String(dark);
      far.style.transform = `translate3d(0, ${(-p * 80).toFixed(1)}px, 0)`;
      near.style.transform = `translate3d(0, ${(-p * 180).toFixed(1)}px, 0)`;
      content.style.opacity = String(rise);
      content.style.transform = `translate3d(0, ${((1 - rise) * 24).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.addEventListener("scroll", onScroll, { passive: true });
          update();
        } else {
          window.removeEventListener("scroll", onScroll);
        }
      },
      { rootMargin: "20% 0px" },
    );
    io.observe(band);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
```

```tsx
// components/home/lights-out-band.tsx
import Image from "next/image";

import { buttonClass } from "@/components/site/button";
import site from "@/components/site/site.module.css";
import type { Locale } from "@/i18n/config";
import { productPath } from "@/lib/catalog";
import { homeCopy } from "@/lib/site/home-copy";
import Link from "next/link";

import styles from "./home.module.css";
import { LightsOutController } from "./lights-out-controller";

/** LumiCloud's night band: the page dims around it as it scrolls in. */
export function LightsOutBand({ locale }: { locale: Locale }) {
  const t = homeCopy[locale].lumi;

  return (
    <section id="lights" className={styles.lights} data-section="lumicloud">
      <div className={styles.stick}>
        <div className={styles.sky} data-lights="sky" />
        <div className={`${styles.layer} ${styles.layerFar}`} data-lights="far" aria-hidden="true" />
        <div className={styles.layer} data-lights="near" aria-hidden="true" />
        <div className={`${site.shell} ${styles.lightsIn}`} data-lights="content">
          <div className={styles.feature}>
            <h2>{t.title}</h2>
            <p className={styles.lead}>{t.lead}</p>
            <div className={styles.feat}>
              {t.features.map(([title, body]) => (
                <div key={title}><b>{title}</b>{body}</div>
              ))}
            </div>
            <div className={styles.swatches}>
              <i style={{ background: "#a3c1e0" }} />
              <i style={{ background: "#f3c8a8" }} />
              {t.swatches}
            </div>
            <Link className={buttonClass("cream")} href={productPath(locale, "lumicloud")}>{t.cta}</Link>
          </div>
          <div className={styles.lightsPh}>
            <Image src="/images/edited/DSC01058.JPG" alt="" fill sizes="(max-width: 760px) 90vw, 600px" className={styles.cover} />
          </div>
        </div>
      </div>
      <LightsOutController />
    </section>
  );
}
```

- [ ] **Step 6: Replace the home route**

Replace the entire contents of `app/[locale]/page.tsx` with:

```tsx
import { notFound } from "next/navigation";

import { FeatureBand } from "@/components/home/feature-band";
import { HomeHero } from "@/components/home/home-hero";
import { LightsOutBand } from "@/components/home/lights-out-band";
import { ProductDuo } from "@/components/home/product-duo";
import { ReviewSection } from "@/components/home/review-section";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import site from "@/components/site/site.module.css";
import { isLocale } from "@/i18n/config";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div className={site.page}>
      <SiteHeader locale={locale} overlay />
      <main>
        <HomeHero locale={locale} />
        <ProductDuo locale={locale} />
        <FeatureBand locale={locale} />
        <ReviewSection locale={locale} slug="cervicloud" featuredId="cervicloud-3" tone="day" />
        <LightsOutBand locale={locale} />
        <ReviewSection locale={locale} slug="lumicloud" featuredId="lumicloud-1" tone="night" />
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
```

- [ ] **Step 7: Run the home test**

Run: `npx vitest run components/home/home.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 8: Look at it in the browser**

Start the dev server through the Browser pane (add a `sheepie` entry to `.claude/launch.json` running `npm run dev` on port 3000 if one is missing), then open `http://localhost:3000/id`.

At 1440×900, check:
- the hero fills the screen, with the header transparent over it and solid after scrolling past;
- the sections come in the order hero → products → CerviCloud band → CerviCloud reviews → LumiCloud lights-out → LumiCloud reviews → footer;
- the lights-out band darkens as it scrolls in and stays dark into the reviews and footer.

At 390×844, check:
- `document.documentElement.scrollWidth === document.documentElement.clientWidth`;
- the product cards swipe horizontally;
- the lights band dims without pinning.

Compare against `home-v3.html` from the mockup directory; adjust CSS only.

- [ ] **Step 8a: Check reduced motion**

Toggle "Emulate CSS prefers-reduced-motion: reduce" in devtools (Rendering panel) and reload. Expected:
- every section is visible without scrolling into it;
- the lamb does not breathe;
- the LumiCloud band shows dark and unpinned.

- [ ] **Step 9: Commit**

```bash
git add lib/site/home-copy.ts components/home app/[locale]/page.tsx
git commit -m "feat: rebuild the home page around CerviCloud and LumiCloud"
```

---

### Task 12: Product page buy area

**Files:**
- Create: `lib/site/pdp-copy.ts`
- Create: `components/pdp/pdp.module.css`
- Create: `components/pdp/icons.tsx`
- Create: `components/pdp/option-context.tsx`
- Create: `components/pdp/price-line.tsx`
- Create: `components/pdp/product-gallery.tsx`
- Create: `components/pdp/voucher-line.tsx`
- Create: `components/pdp/buy-box.tsx`
- Create: `components/pdp/sticky-buy-bar.tsx`
- Test: `components/pdp/buy-box.test.ts`

**Interfaces:**
- Consumes:
  - `Product`, `ProductOption`, `findOption`
  - `formatIdr`, `discountPercent`
  - `MarketplaceLink`, `buttonClass`
  - `viewContent`, `sendMetaEvent`
  - `WEBSITE_VOUCHER_CODE`
  - `siteCopy`
- Produces:
  - `pdpCopy: Record<Locale, PdpCopy>`
  - `OptionProvider` props: `{ product: { slug; name; options: ProductOption[] }; children }`
  - `useSelectedOption(): { option: ProductOption; select(key: string): void; slug: ProductSlug; name: string }`
  - `PriceLine` props: `{ option: ProductOption; saveLabel: string }`. The save label contains `{n}`.
  - `ProductGallery` props: `{ images: { src: string; alt: string }[]; name: string }`
  - `BuyBox` props: `{ product: Product; locale: Locale }`. It renders `<div id="buy-ctas">` around the marketplace buttons.
  - `StickyBuyBar` props: `{ locale: Locale }`
  - `ProductIcon` props: `{ name: IconName }`

- [ ] **Step 1: Write the failing test**

```ts
// components/pdp/buy-box.test.ts
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { findOption, getProduct } from "@/lib/catalog";

import { BuyBox } from "./buy-box";
import { OptionProvider } from "./option-context";
import { PriceLine } from "./price-line";

function renderBuyBox(slug: "cervicloud" | "lumicloud" | "calmicloud", locale: "id" | "en" = "id") {
  const product = getProduct(slug, locale);
  return renderToStaticMarkup(
    createElement(OptionProvider, { product, children: createElement(BuyBox, { product, locale }) }),
  );
}

describe("product buy box", () => {
  it("prices the first option with its saving", () => {
    const html = renderBuyBox("cervicloud");
    expect(html).toContain("<h1");
    expect(html).toContain("Rp838.000");
    expect(html).toContain("Rp1.399.000");
    expect(html).toContain("Hemat 40%");
  });

  it("shows no strikethrough or 0% chip when there is nothing to save", () => {
    const cover = findOption(getProduct("cervicloud", "id"), "case");
    const html = renderToStaticMarkup(createElement(PriceLine, { option: cover, saveLabel: "Hemat {n}%" }));
    expect(html).toContain("Rp198.000");
    expect(html).not.toContain("<s>");
    expect(html).not.toContain("Hemat");
  });

  it("offers both marketplaces from the buy box", () => {
    const html = renderBuyBox("lumicloud");
    expect(html).toContain('id="buy-ctas"');
    expect(html).toContain('data-marketplace="shopee"');
    expect(html).toContain('data-marketplace="tokopedia"');
    expect(html).toContain('data-placement="buy-box"');
  });

  it("lists every option as a pressable choice", () => {
    const html = renderBuyBox("lumicloud", "en");
    expect(html).toContain('data-option="blue"');
    expect(html).toContain('data-option="apricot"');
    expect(html).toContain('aria-pressed="true"');
  });

  it("shows the website voucher", () => {
    expect(renderBuyBox("calmicloud")).toContain("SHEEPIEWEB");
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run components/pdp/buy-box.test.ts`
Expected: FAIL, `Cannot find module './buy-box'`.

- [ ] **Step 3: Write the product page copy**

```ts
// lib/site/pdp-copy.ts
import type { Locale } from "@/i18n/config";

export interface PdpCopy {
  home: string;
  products: string;
  save: string;
  voucher: string;
  copy: string;
  copied: string;
  assurances: [string, string];
  fits: string;
  notFit: string;
  reviews: string;
  viewOriginal: string;
  faq: string;
  faqNote: string;
  pair: string;
  gallery: string;
}

export const pdpCopy: Record<Locale, PdpCopy> = {
  id: {
    home: "Beranda",
    products: "Produk",
    save: "Hemat {n}%",
    voucher: "Kode khusus website:",
    copy: "Salin",
    copied: "Tersalin",
    assurances: ["Dikirim dari Indonesia lewat Shopee & Tokopedia", "Pembayaran & retur mengikuti perlindungan marketplace"],
    fits: "Cocok",
    notFit: "Kurang cocok",
    reviews: "Kata mereka tentang {name}",
    viewOriginal: "Lihat ulasan asli",
    faq: "Pertanyaan yang sering muncul",
    faqNote: "Masih ragu? Tanya kami lewat chat Shopee atau Tokopedia.",
    pair: "Lengkapi tidurmu",
    gallery: "Foto produk",
  },
  en: {
    home: "Home",
    products: "Products",
    save: "Save {n}%",
    voucher: "Website-only code:",
    copy: "Copy",
    copied: "Copied",
    assurances: ["Ships from Indonesia via Shopee & Tokopedia", "Payment & returns covered by marketplace protection"],
    fits: "Good fit",
    notFit: "Not ideal",
    reviews: "What people say about {name}",
    viewOriginal: "See original review",
    faq: "Common questions",
    faqNote: "Still unsure? Ask us in Shopee or Tokopedia chat.",
    pair: "Complete your sleep",
    gallery: "Product photos",
  },
};
```

- [ ] **Step 4: Write the product page styles**

```css
/* components/pdp/pdp.module.css */
.crumbs { padding: 22px 0 18px; font-size: 13.5px; opacity: 0.6; }
.crumbs a { color: inherit; text-decoration: none; }

.top { display: grid; grid-template-columns: 1.15fr 1fr; gap: 56px; align-items: start; }

/* Gallery */
.gallery { position: sticky; top: 132px; display: grid; grid-template-columns: 76px 1fr; gap: 14px; }
.thumbs { display: grid; gap: 10px; align-content: start; }
.thumb { position: relative; aspect-ratio: 1; padding: 0; border: 0; border-radius: 12px; overflow: hidden; cursor: pointer; outline: 2px solid transparent; outline-offset: 2px; transition: outline-color 0.2s; }
.thumb[aria-current="true"] { outline-color: var(--sp-ink); }
.main { position: relative; aspect-ratio: 4 / 4.6; border-radius: 26px; overflow: hidden; background: var(--sp-linen); }
.cover { object-fit: cover; }
.track { display: none; }
.dots { display: none; }

/* Buy box */
.buy { padding-bottom: 40px; }
.buy h1 { font: 700 52px/1.02 var(--font-display), serif; letter-spacing: -0.015em; }
.sub { max-width: 470px; margin-top: 12px; font-size: 17.5px; line-height: 1.55; opacity: 0.85; }
.priceRow { display: flex; align-items: baseline; gap: 12px; margin: 22px 0 24px; }
.priceRow b { font: 700 28px var(--font-body), sans-serif; }
.priceRow s { font-size: 17px; opacity: 0.45; }
.off { padding: 5px 10px; border-radius: 999px; background: var(--sp-peach); font-size: 13px; font-weight: 700; }
.icons { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 18px; padding: 20px 0; border-top: 1px solid var(--sp-line); border-bottom: 1px solid var(--sp-line); }
.icons div { display: flex; gap: 10px; align-items: center; font-size: 14.5px; font-weight: 600; line-height: 1.3; }
.icons svg { flex: none; width: 34px; height: 34px; padding: 7px; border-radius: 50%; background: var(--sp-sky-soft); }
.optLabel { margin: 24px 0 10px; font-size: 14px; font-weight: 700; }
.options { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.opt { display: flex; gap: 12px; align-items: center; min-height: 74px; padding: 10px; border-radius: 16px; border: 1.5px solid var(--sp-line); background: none; color: inherit; text-align: left; font: inherit; cursor: pointer; transition: border-color 0.2s; }
.opt[aria-pressed="true"] { border-color: var(--sp-ink); }
.optImg { position: relative; flex: none; width: 54px; height: 54px; border-radius: 10px; overflow: hidden; }
.opt b { display: block; font-size: 14.5px; }
.opt small { font-size: 13px; opacity: 0.7; }
.ctas { display: grid; gap: 10px; margin-top: 24px; }
.mark { width: 20px; height: 20px; display: grid; place-items: center; border-radius: 5px; color: #fff; font: 800 11px var(--font-body), sans-serif; }
.markShopee { background: #ee4d2d; }
.markTokopedia { background: #03ac0e; }
.voucher { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 14px; padding: 12px 16px; border-radius: 14px; background: var(--sp-linen); font-size: 14px; }
.voucher code { font: 700 14px var(--font-body), sans-serif; letter-spacing: 0.04em; }
.voucher button { min-height: 44px; border: 0; background: none; color: inherit; font: 700 13px var(--font-body), sans-serif; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
.assure { display: grid; gap: 10px; margin: 22px 0 6px; font-size: 14.5px; }
.assure div { display: flex; gap: 10px; align-items: center; }
.assure svg { flex: none; width: 18px; height: 18px; }

.acc { border-bottom: 1px solid var(--sp-line); }
.acc:first-of-type { margin-top: 22px; border-top: 1px solid var(--sp-line); }
.acc summary { display: flex; justify-content: space-between; align-items: center; min-height: 56px; list-style: none; font-size: 16px; font-weight: 700; cursor: pointer; }
.acc summary::-webkit-details-marker { display: none; }
.acc summary::after { content: "+"; font-size: 22px; font-weight: 500; transition: transform 0.25s var(--sp-ease-out); }
.acc[open] summary::after { transform: rotate(45deg); }
.accBody { padding: 0 0 20px; font-size: 15px; line-height: 1.65; opacity: 0.85; }
.accBody ul { margin: 0; padding-left: 18px; }

/* Lower sections */
.block { padding-top: 110px; }
.block h2 { max-width: 720px; font: 700 46px/1.05 var(--font-display), serif; letter-spacing: -0.015em; }
.intro { max-width: 560px; margin-top: 14px; font-size: 18px; line-height: 1.6; opacity: 0.85; }

.anatomy { position: relative; margin-top: 44px; border-radius: 30px; overflow: hidden; background: var(--sp-sky-soft); }
.anatIn { position: relative; display: grid; grid-template-columns: 1fr 1.3fr 1fr; gap: 24px; align-items: center; padding: 60px 48px; }
.stage { position: relative; aspect-ratio: 1; border-radius: 22px; overflow: hidden; }
.pin { position: absolute; width: 24px; height: 24px; margin: -12px 0 0 -12px; display: grid; place-items: center; border-radius: 50%; background: var(--sp-cream); color: var(--sp-ink); font-size: 12px; font-weight: 700; box-shadow: 0 0 0 6px rgba(255, 253, 245, 0.3); }
.call { display: grid; gap: 34px; margin: 0; padding: 0; list-style: none; }
.call li { font-size: 14.5px; line-height: 1.5; }
.call b { display: flex; gap: 8px; align-items: center; margin-bottom: 4px; font-size: 16px; }
.call i { width: 22px; height: 22px; display: grid; place-items: center; border-radius: 50%; background: var(--sp-ink); color: var(--sp-cream); font-size: 12px; font-style: normal; }

.fit { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 40px; }
.fitCard { min-height: 170px; display: flex; flex-direction: column; justify-content: space-between; padding: 24px; border-radius: 22px; background: var(--sp-linen); }
.fitCard[data-fits="false"] { background: transparent; border: 1.5px dashed var(--sp-line); }
.fitCard b { font: 700 19px var(--font-display), serif; }
.fitCard p { margin-top: 8px; font-size: 14.5px; line-height: 1.5; opacity: 0.8; }
.fitMark { font-size: 13px; font-weight: 700; }

.compare { width: 100%; margin-top: 40px; border-collapse: separate; border-spacing: 0; border: 1px solid var(--sp-line); border-radius: 26px; overflow: hidden; font-size: 15px; }
.compare th, .compare td { padding: 18px 24px; border-top: 1px solid var(--sp-line); text-align: left; }
.compare thead th { border-top: 0; background: var(--sp-linen); font-weight: 700; }
.compare thead th:nth-child(2) { background: var(--sp-ink); color: var(--sp-cream); }
.compare tbody td:nth-child(2) { background: var(--sp-sky-soft); font-weight: 600; }
.compare tbody th { font-weight: 500; }

.rvGrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 40px; }
.rv { display: flex; flex-direction: column; justify-content: space-between; gap: 20px; margin: 0; padding: 28px; border-radius: 22px; background: var(--sp-linen); }
.rv blockquote { margin: 0; font: 600 19px/1.45 var(--font-display), serif; }
.rv figcaption { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; font-size: 14px; }
.rv figcaption a { margin-left: auto; min-height: 44px; display: inline-flex; align-items: center; color: inherit; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; }

.faq { display: grid; grid-template-columns: 1fr 1.4fr; gap: 60px; }

.pair { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 40px; }
.pair a { display: grid; grid-template-columns: 150px 1fr; gap: 22px; align-items: center; padding: 14px; border-radius: 22px; background: var(--sp-linen); color: inherit; text-decoration: none; }
.pairImg { position: relative; width: 150px; height: 150px; border-radius: 16px; overflow: hidden; }
.pair h3 { font: 700 24px var(--font-display), serif; }
.pair p { margin: 6px 0 10px; font-size: 14.5px; line-height: 1.45; opacity: 0.75; }
.pair b { font-size: 15px; }

.end { height: 120px; }

/* Sticky buy bar (phones) */
.sticky { display: none; }

@media (max-width: 760px) {
  .crumbs { display: none; }
  .top { grid-template-columns: 1fr; gap: 22px; }
  .gallery { position: relative; top: 0; display: block; margin: 0 calc(var(--sp-gutter) * -1); }
  .thumbs, .main { display: none; }
  .track { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; }
  .track::-webkit-scrollbar { display: none; }
  .slide { position: relative; flex: 0 0 100%; aspect-ratio: 1 / 1.08; scroll-snap-align: start; }
  .dots { display: flex; justify-content: center; gap: 6px; margin-top: 12px; }
  .dots i { width: 6px; height: 6px; border-radius: 50%; background: var(--sp-line); transition: width 0.2s; }
  .dots i[data-on="true"] { width: 18px; border-radius: 3px; background: var(--sp-ink); }
  .buy h1 { font-size: 38px; }
  .sub { font-size: 16px; }
  .priceRow b { font-size: 24px; }
  .icons div { font-size: 13.5px; }
  .optImg { width: 44px; height: 44px; }
  .opt { gap: 10px; padding: 8px; }

  .block { padding-top: 72px; }
  .block h2 { font-size: 32px; }
  .intro { font-size: 16px; }
  .anatIn { grid-template-columns: 1fr; gap: 22px; padding: 28px 20px 32px; }
  .stage { order: -1; }
  .call { gap: 16px; }
  .fit { grid-template-columns: 1fr 1fr; gap: 10px; }
  .fitCard { min-height: 150px; padding: 18px; }
  .fitCard b { font-size: 17px; }
  .fitCard p { font-size: 13.5px; }
  .compare th, .compare td { padding: 14px 12px; font-size: 13.5px; }
  .rvGrid { display: flex; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory; margin: 32px calc(var(--sp-gutter) * -1) 0; padding: 0 var(--sp-gutter); scrollbar-width: none; }
  .rv { flex: 0 0 84%; scroll-snap-align: start; padding: 22px; }
  .rv blockquote { font-size: 17px; }
  .faq { grid-template-columns: 1fr; gap: 24px; }
  .pair { grid-template-columns: 1fr; gap: 12px; }
  .pair a { grid-template-columns: 96px 1fr; gap: 14px; padding: 10px; }
  .pairImg { width: 96px; height: 96px; }
  .pair h3 { font-size: 20px; }
  .end { height: 80px; }

  .sticky { position: fixed; left: 0; right: 0; bottom: 0; z-index: 30; display: flex; gap: 12px; align-items: center; padding: 10px 14px calc(10px + env(safe-area-inset-bottom)); background: rgba(255, 253, 245, 0.97); border-top: 1px solid var(--sp-line); transform: translateY(110%); transition: transform 0.35s var(--sp-ease-out); }
  .sticky[data-show="true"] { transform: none; }
  .sticky div { flex: 1; font-size: 13px; line-height: 1.3; }
  .sticky b { display: block; font-size: 16px; }
  .sticky a { min-height: 48px; padding: 0 20px; font-size: 15px; }
}
```

- [ ] **Step 5: Write the components**

```tsx
// components/pdp/icons.tsx
import type { IconName } from "@/lib/catalog/types";

const paths: Record<IconName, string> = {
  neck: "M4 15c3-4 13-4 16 0M6 15v3h12v-3M12 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6z",
  cool: "M12 2v20M4 6l16 12M20 6L4 18",
  foam: "M7 8h10a4 4 0 0 1 0 9H7a4 4 0 0 1 0-9zM8 8c0 2 8 2 8 0",
  wash: "M4 7h16l-1.5 12h-13zM4 7c2 2 4 2 6 0s4-2 6 0 4 2 4 0",
  dark: "M20 14A8 8 0 1 1 10 4a6 6 0 0 0 10 10z",
  eye: "M3 12c4-6 14-6 18 0M7 13l-1 2M12 14v2M17 13l1 2",
  hair: "M5 20c0-9 3-15 7-15s7 6 7 15M9 20c0-6 1-10 3-10s3 4 3 10",
  travel: "M3 14l18-7-6 13-3-5z",
  ear: "M8 10a4 4 0 1 1 8 0c0 3-3 4-3 7a2 2 0 0 1-4 0",
  mold: "M6 14c0-4 3-8 6-8s6 4 6 8-3 5-6 5-6-1-6-5z",
  case: "M4 8h16v10H4zM4 11h16",
  reuse: "M4 12a8 8 0 0 1 14-5l2 2M20 12a8 8 0 0 1-14 5l-2-2M18 4v5h-5M6 20v-5h5",
};

export function ProductIcon({ name }: { name: IconName }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}
```

```tsx
// components/pdp/option-context.tsx
"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import type { ProductOption, ProductSlug } from "@/lib/catalog/types";
import { sendMetaEvent } from "@/lib/meta/client";
import { viewContent } from "@/lib/meta/events";

type OptionContext = { slug: ProductSlug; name: string; option: ProductOption; select: (key: string) => void };

const Context = createContext<OptionContext | null>(null);

type ProductRef = { slug: ProductSlug; name: string; options: ProductOption[] };

function pick(options: ProductOption[], key: string | null): ProductOption {
  return options.find((o) => o.key === key) ?? options[0];
}

/**
 * Shares the selected option between the buy box and the sticky bar.
 * Honors ?option= after mount (keeps the page static) and records a
 * ViewContent for the first resolved option and each later change.
 */
export function OptionProvider({ product, children }: { product: ProductRef; children: ReactNode }) {
  const [key, setKey] = useState<string | null>(null);
  const option = pick(product.options, key);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("option");
    setKey(pick(product.options, requested).key);
  }, [product.options]);

  useEffect(() => {
    if (key === null) return;
    const current = pick(product.options, key);
    sendMetaEvent(viewContent({ slug: product.slug, optionKey: current.key, value: current.price }));
  }, [key, product.slug, product.options]);

  const select = useCallback((next: string) => setKey(pick(product.options, next).key), [product.options]);

  return <Context.Provider value={{ slug: product.slug, name: product.name, option, select }}>{children}</Context.Provider>;
}

export function useSelectedOption(): OptionContext {
  const value = useContext(Context);
  if (!value) throw new Error("useSelectedOption must be used inside <OptionProvider>");
  return value;
}
```

```tsx
// components/pdp/price-line.tsx
import { discountPercent, formatIdr } from "@/lib/catalog/price";
import type { ProductOption } from "@/lib/catalog/types";

import styles from "./pdp.module.css";

export function PriceLine({ option, saveLabel }: { option: ProductOption; saveLabel: string }) {
  const saving = discountPercent(option.price, option.originalPrice);

  return (
    <div className={styles.priceRow}>
      <b>{formatIdr(option.price)}</b>
      {saving !== null && option.originalPrice !== null && (
        <>
          <s>{formatIdr(option.originalPrice)}</s>
          <span className={styles.off}>{saveLabel.replace("{n}", String(saving))}</span>
        </>
      )}
    </div>
  );
}
```

```tsx
// components/pdp/product-gallery.tsx
"use client";

import Image from "next/image";
import { useState, type UIEvent } from "react";

import styles from "./pdp.module.css";

export function ProductGallery({ images, name }: { images: { src: string; alt: string }[]; name: string }) {
  const [index, setIndex] = useState(0);

  const onScroll = (event: UIEvent<HTMLDivElement>) => {
    const track = event.currentTarget;
    setIndex(Math.round(track.scrollLeft / Math.max(1, track.clientWidth)));
  };

  return (
    <div className={styles.gallery} aria-label={name}>
      <div className={styles.thumbs}>
        {images.map((image, i) => (
          <button key={image.src} type="button" className={styles.thumb} aria-current={i === index} aria-label={image.alt} onClick={() => setIndex(i)}>
            <Image src={image.src} alt="" fill sizes="76px" className={styles.cover} />
          </button>
        ))}
      </div>
      <div className={styles.main}>
        <Image key={images[index].src} src={images[index].src} alt={images[index].alt} fill priority={index === 0} sizes="(max-width: 760px) 100vw, 640px" className={styles.cover} />
      </div>
      <div className={styles.track} onScroll={onScroll}>
        {images.map((image, i) => (
          <div key={image.src} className={styles.slide}>
            <Image src={image.src} alt={image.alt} fill priority={i === 0} sizes="100vw" className={styles.cover} />
          </div>
        ))}
      </div>
      <div className={styles.dots} aria-hidden="true">
        {images.map((image, i) => (
          <i key={image.src} data-on={i === index} />
        ))}
      </div>
    </div>
  );
}
```

```tsx
// components/pdp/voucher-line.tsx
"use client";

import { useState } from "react";

import styles from "./pdp.module.css";

export function VoucherLine({ code, label, copy, copied }: { code: string; label: string; copy: string; copied: string }) {
  const [done, setDone] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {
      // Clipboard blocked: the code is visible to copy by hand.
    }
  };

  return (
    <div className={styles.voucher}>
      <span>{label} <code>{code}</code></span>
      <button type="button" onClick={onCopy} aria-live="polite">{done ? copied : copy}</button>
    </div>
  );
}
```

```tsx
// components/pdp/buy-box.tsx
"use client";

import Image from "next/image";

import { buttonClass } from "@/components/site/button";
import { MarketplaceLink } from "@/components/site/marketplace-link";
import type { Locale } from "@/i18n/config";
import type { Product } from "@/lib/catalog/types";
import { WEBSITE_VOUCHER_CODE } from "@/lib/site/config";
import { siteCopy } from "@/lib/site/copy";
import { pdpCopy } from "@/lib/site/pdp-copy";

import { ProductIcon } from "./icons";
import { useSelectedOption } from "./option-context";
import styles from "./pdp.module.css";
import { PriceLine } from "./price-line";
import { VoucherLine } from "./voucher-line";

export function BuyBox({ product, locale }: { product: Product; locale: Locale }) {
  const t = pdpCopy[locale];
  const buy = siteCopy[locale].buy;
  const { option, select } = useSelectedOption();

  return (
    <div className={styles.buy}>
      <h1>{product.name}</h1>
      <p className={styles.sub}>{product.sub}</p>
      <PriceLine option={option} saveLabel={t.save} />

      <div className={styles.icons}>
        {product.icons.map((item) => (
          <div key={item.label}><ProductIcon name={item.icon} />{item.label}</div>
        ))}
      </div>

      <div className={styles.optLabel}>{product.optionLabel}</div>
      <div className={styles.options}>
        {product.options.map((o) => (
          <button key={o.key} type="button" className={styles.opt} data-option={o.key} aria-pressed={o.key === option.key} onClick={() => select(o.key)}>
            <span className={styles.optImg}><Image src={o.image} alt="" fill sizes="54px" style={{ objectFit: "cover" }} /></span>
            <span><b>{o.label}</b><small>{o.note}</small></span>
          </button>
        ))}
      </div>

      <div id="buy-ctas" className={styles.ctas}>
        <MarketplaceLink slug={product.slug} optionKey={option.key} value={option.price} marketplace="shopee" href={option.shopeeUrl} placement="buy-box" className={buttonClass("ink", true)}>
          <span className={`${styles.mark} ${styles.markShopee}`}>S</span>{buy.shopee}
        </MarketplaceLink>
        <MarketplaceLink slug={product.slug} optionKey={option.key} value={option.price} marketplace="tokopedia" href={option.tokopediaUrl} placement="buy-box" className={buttonClass("line", true)}>
          <span className={`${styles.mark} ${styles.markTokopedia}`}>T</span>{buy.tokopedia}
        </MarketplaceLink>
      </div>

      <VoucherLine code={WEBSITE_VOUCHER_CODE} label={t.voucher} copy={t.copy} copied={t.copied} />

      <div className={styles.assure}>
        <div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="17.5" r="1.6" /><circle cx="17.5" cy="17.5" r="1.6" /></svg>
          {t.assurances[0]}
        </div>
        <div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true"><path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" /><path d="M9 12l2 2 4-4" /></svg>
          {t.assurances[1]}
        </div>
      </div>

      {product.accordions.map((section, i) => (
        <details key={section.title} className={styles.acc} open={i === 0}>
          <summary>{section.title}</summary>
          <div className={styles.accBody}>
            {section.body.length > 1 ? (
              <ul>{section.body.map((line) => <li key={line}>{line}</li>)}</ul>
            ) : (
              <p>{section.body[0]}</p>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
```

```tsx
// components/pdp/sticky-buy-bar.tsx
"use client";

import { useEffect, useState } from "react";

import { buttonClass } from "@/components/site/button";
import { MarketplaceLink } from "@/components/site/marketplace-link";
import type { Locale } from "@/i18n/config";
import { formatIdr } from "@/lib/catalog/price";
import { siteCopy } from "@/lib/site/copy";

import { useSelectedOption } from "./option-context";
import styles from "./pdp.module.css";

/** Phones only (CSS): appears once the buy-box buttons have scrolled away. */
export function StickyBuyBar({ locale }: { locale: Locale }) {
  const { slug, name, option } = useSelectedOption();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const target = document.getElementById("buy-ctas");
    if (!target) return;
    const io = new IntersectionObserver(([entry]) => setShow(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return (
    <div className={styles.sticky} data-show={show} aria-hidden={!show}>
      <div><b>{formatIdr(option.price)}</b>{name}</div>
      <MarketplaceLink slug={slug} optionKey={option.key} value={option.price} marketplace="shopee" href={option.shopeeUrl} placement="sticky-bar" className={buttonClass("ink")}>
        {siteCopy[locale].buy.shopee}
      </MarketplaceLink>
    </div>
  );
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx vitest run components/pdp/buy-box.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 7: Commit**

```bash
git add lib/site/pdp-copy.ts components/pdp
git commit -m "feat: add the product buy box, gallery and sticky buy bar"
```

---

### Task 13: Product page sections and route

**Files:**
- Create: `components/pdp/details.tsx`
- Create: `components/pdp/social.tsx`
- Modify: `app/[locale]/products/[slug]/page.tsx` (replace the whole file)
- Test: `components/pdp/product-page.test.ts`

**Interfaces:**
- Consumes:
  - Task 12 components
  - `getProduct`, `isProductSlug`, `productPath`
  - `getReviews`
  - `locales`, `PRODUCT_SLUGS`
  - `SiteHeader`, `SiteFooter`, `Mendung`, `FadeIn`
- Produces:
  - the product route, with `dynamicParams = false`, `generateStaticParams()` and `generateMetadata()`
  - sections carrying `data-section` with one of: `buy`, `anatomy`, `fit`, `compare`, `reviews`, `faq`, `pair`
  - `AnatomyPanel`, `FitGrid` and `CompareTable` props: `{ product: Product; locale: Locale }`
  - `ReviewGrid`, `FaqList` and `PairWith` props: `{ product: Product; locale: Locale }`

- [ ] **Step 1: Write the failing test**

```ts
// components/pdp/product-page.test.ts
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ProductPage, { dynamicParams, generateMetadata, generateStaticParams } from "@/app/[locale]/products/[slug]/page";

async function render(locale: string, slug: string) {
  const element = await ProductPage({ params: Promise.resolve({ locale, slug }) });
  return renderToStaticMarkup(element);
}

describe("product page", () => {
  it("prebuilds every product in every locale and nothing else", async () => {
    const params = await generateStaticParams();
    expect(params).toHaveLength(6);
    expect(params).toContainEqual({ locale: "id", slug: "cervicloud" });
    expect(params).toContainEqual({ locale: "en", slug: "calmicloud" });
    expect(dynamicParams).toBe(false);
  });

  it("lays out the sections in order", async () => {
    const html = await render("id", "cervicloud");
    const order = [...html.matchAll(/data-section="([^"]+)"/g)].map((m) => m[1]).filter((s) => s !== "footer");
    expect(order).toEqual(["buy", "anatomy", "fit", "compare", "reviews", "faq", "pair"]);
  });

  it("is honest about who CerviCloud is not for", async () => {
    const html = await render("id", "cervicloud");
    expect(html).toContain("Tidur tengkurap");
    expect(html).toContain('data-fits="false"');
  });

  it("shows three full-text reviews with screenshot links", async () => {
    const html = await render("id", "lumicloud");
    expect((html.match(/Lihat ulasan asli/g) ?? []).length).toBe(3);
    expect(html).toContain("silent velcro nya");
    expect(html).not.toContain("…”");
  });

  it("pairs with the other products", async () => {
    const html = await render("en", "lumicloud");
    expect(html).toContain('href="/en/products/cervicloud"');
    expect(html).toContain('href="/en/products/calmicloud"');
  });

  it("titles the page after the product", async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ locale: "id", slug: "lumicloud" }) });
    expect(meta.title).toBe("LumiCloud | Sheepie.");
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run components/pdp/product-page.test.ts`
Expected: FAIL. `dynamicParams` is not exported and the old page renders different markup.

- [ ] **Step 3: Write the lower sections**

```tsx
// components/pdp/details.tsx
import Image from "next/image";

import { FadeIn } from "@/components/site/fade-in";
import { Mendung } from "@/components/site/mendung";
import type { Locale } from "@/i18n/config";
import type { Product } from "@/lib/catalog/types";
import { pdpCopy } from "@/lib/site/pdp-copy";

import styles from "./pdp.module.css";

export function AnatomyPanel({ product }: { product: Product; locale: Locale }) {
  const { anatomy } = product;
  const left = anatomy.points.slice(0, 2);
  const right = anatomy.points.slice(2);

  return (
    <section className={styles.block} data-section="anatomy">
      <FadeIn>
        <h2>{anatomy.title}</h2>
        <p className={styles.intro}>{anatomy.intro}</p>
      </FadeIn>
      <FadeIn index={1} className={styles.anatomy}>
        <Mendung tone="white" />
        <div className={styles.anatIn}>
          <ol className={styles.call}>
            {left.map((point, i) => (
              <li key={point.title}><b><i>{i + 1}</i>{point.title}</b>{point.body}</li>
            ))}
          </ol>
          <div className={styles.stage}>
            <Image src={anatomy.image} alt={product.name} fill sizes="(max-width: 760px) 90vw, 460px" className={styles.cover} />
            {anatomy.points.map((point, i) => (
              <span key={point.title} className={styles.pin} style={{ left: `${point.x}%`, top: `${point.y}%` }} aria-hidden="true">{i + 1}</span>
            ))}
          </div>
          <ol className={styles.call} start={3}>
            {right.map((point, i) => (
              <li key={point.title}><b><i>{i + 3}</i>{point.title}</b>{point.body}</li>
            ))}
          </ol>
        </div>
      </FadeIn>
    </section>
  );
}

export function FitGrid({ product, locale }: { product: Product; locale: Locale }) {
  const t = pdpCopy[locale];

  return (
    <section className={styles.block} data-section="fit">
      <FadeIn><h2>{product.fit.title}</h2></FadeIn>
      <div className={styles.fit}>
        {product.fit.items.map((item, i) => (
          <FadeIn key={item.title} index={i}>
            <div className={styles.fitCard} data-fits={String(item.fits)}>
              <span className={styles.fitMark}>{item.fits ? `✓ ${t.fits}` : `— ${t.notFit}`}</span>
              <div>
                <b>{item.title}</b>
                <p>{item.body}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

export function CompareTable({ product }: { product: Product; locale: Locale }) {
  return (
    <section className={styles.block} data-section="compare">
      <FadeIn><h2>{product.compare.title}</h2></FadeIn>
      <FadeIn index={1}>
        <table className={styles.compare}>
          <thead>
            <tr><th scope="col"><span hidden>—</span></th><th scope="col">{product.name}</th><th scope="col">{product.compare.theirs}</th></tr>
          </thead>
          <tbody>
            {product.compare.rows.map((row) => (
              <tr key={row.label}><th scope="row">{row.label}</th><td>{row.ours}</td><td>{row.theirs}</td></tr>
            ))}
          </tbody>
        </table>
      </FadeIn>
    </section>
  );
}
```

```tsx
// components/pdp/social.tsx
import Image from "next/image";
import Link from "next/link";

import { FadeIn } from "@/components/site/fade-in";
import type { Locale } from "@/i18n/config";
import { getProduct, productPath } from "@/lib/catalog";
import { formatIdr } from "@/lib/catalog/price";
import { getReviews } from "@/lib/catalog/reviews";
import type { Product } from "@/lib/catalog/types";
import { pdpCopy } from "@/lib/site/pdp-copy";

import styles from "./pdp.module.css";

export function ReviewGrid({ product, locale }: { product: Product; locale: Locale }) {
  const t = pdpCopy[locale];

  return (
    <section className={styles.block} data-section="reviews">
      <FadeIn><h2>{t.reviews.replace("{name}", product.name)}</h2></FadeIn>
      <div className={styles.rvGrid}>
        {getReviews(product.slug).map((review) => (
          <figure key={review.id} className={styles.rv}>
            <blockquote>“{review.quote}”</blockquote>
            <figcaption>
              <b>{review.author}</b> · {review.marketplace === "shopee" ? "Shopee" : "Tokopedia"}
              <a href={review.screenshot} target="_blank" rel="noopener noreferrer">{t.viewOriginal}</a>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function FaqList({ product, locale }: { product: Product; locale: Locale }) {
  const t = pdpCopy[locale];

  return (
    <section className={`${styles.block} ${styles.faq}`} data-section="faq">
      <FadeIn>
        <h2>{t.faq}</h2>
        <p className={styles.intro}>{t.faqNote}</p>
      </FadeIn>
      <div>
        {product.faq.map((item) => (
          <details key={item.q} className={styles.acc}>
            <summary>{item.q}</summary>
            <div className={styles.accBody}><p>{item.a}</p></div>
          </details>
        ))}
      </div>
    </section>
  );
}

export function PairWith({ product, locale }: { product: Product; locale: Locale }) {
  const t = pdpCopy[locale];

  return (
    <section className={styles.block} data-section="pair">
      <FadeIn><h2>{t.pair}</h2></FadeIn>
      <div className={styles.pair}>
        {product.pairWith.map((slug, i) => {
          const other = getProduct(slug, locale);
          return (
            <FadeIn key={slug} index={i}>
              <Link href={productPath(locale, slug)}>
                <div className={styles.pairImg}><Image src={other.card.image} alt="" fill sizes="150px" className={styles.cover} /></div>
                <div>
                  <h3>{other.name}</h3>
                  <p>{other.card.line}</p>
                  <b>{formatIdr(other.options[0].price)}</b>
                </div>
              </Link>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Replace the product route**

Replace the entire contents of `app/[locale]/products/[slug]/page.tsx` with:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BuyBox } from "@/components/pdp/buy-box";
import { AnatomyPanel, CompareTable, FitGrid } from "@/components/pdp/details";
import { OptionProvider } from "@/components/pdp/option-context";
import styles from "@/components/pdp/pdp.module.css";
import { ProductGallery } from "@/components/pdp/product-gallery";
import { FaqList, PairWith, ReviewGrid } from "@/components/pdp/social";
import { StickyBuyBar } from "@/components/pdp/sticky-buy-bar";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import site from "@/components/site/site.module.css";
import { isLocale, locales } from "@/i18n/config";
import { getProduct, isProductSlug } from "@/lib/catalog";
import { PRODUCT_SLUGS } from "@/lib/catalog/types";
import { localeHref } from "@/lib/site/copy";
import { pdpCopy } from "@/lib/site/pdp-copy";

type Params = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return locales.flatMap((locale) => PRODUCT_SLUGS.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isProductSlug(slug)) return {};
  const product = getProduct(slug, locale);
  return {
    title: `${product.name} | Sheepie.`,
    description: product.sub,
    openGraph: { images: [product.gallery[0].src] },
  };
}

export default async function ProductPage({ params }: Params) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isProductSlug(slug)) notFound();

  const product = getProduct(slug, locale);
  const t = pdpCopy[locale];

  return (
    <div className={site.page}>
      <SiteHeader locale={locale} />
      <OptionProvider product={{ slug: product.slug, name: product.name, options: product.options }}>
        <main className={site.shell}>
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            <Link href={localeHref(locale, "/")}>{t.home}</Link> / <Link href={localeHref(locale, "/products")}>{t.products}</Link> / {product.name}
          </nav>
          <section className={styles.top} data-section="buy">
            <ProductGallery images={product.gallery} name={t.gallery} />
            <BuyBox product={product} locale={locale} />
          </section>
          <AnatomyPanel product={product} locale={locale} />
          <FitGrid product={product} locale={locale} />
          <CompareTable product={product} locale={locale} />
          <ReviewGrid product={product} locale={locale} />
          <FaqList product={product} locale={locale} />
          <PairWith product={product} locale={locale} />
          <div className={styles.end} />
        </main>
        <StickyBuyBar locale={locale} />
      </OptionProvider>
      <SiteFooter locale={locale} />
    </div>
  );
}
```

The product page has no `#hero`, so it uses the default sticky, in-flow header (no `overlay`).

- [ ] **Step 5: Run the tests**

Run: `npx vitest run components/pdp`
Expected: PASS.

- [ ] **Step 6: Look at it in the browser**

Open `http://localhost:3000/id/products/cervicloud`, `/id/products/lumicloud`, `/en/products/calmicloud` and `/id/products/cervicloud?option=case`.

At 1440×900:
- the gallery stays put while the buy box scrolls;
- clicking an option changes the price;
- the cover option has no strikethrough;
- the anatomy pins sit on the pillow features, the LumiCloud mask and strap, and the CalmiCloud earplugs and case.

If a pin is off its feature, adjust that point's `x`/`y` in `lib/catalog/content.ts` and re-run `npx vitest run lib/catalog`.

At 390×844:
- the gallery swipes;
- the sticky bar appears after the main buttons scroll away;
- there is no horizontal overflow.

Also open `/id/products/bantal` and confirm the 404 page.

- [ ] **Step 7: Commit**

```bash
git add components/pdp app/[locale]/products/[slug]/page.tsx lib/catalog/content.ts
git commit -m "feat: rebuild product pages with anatomy, fit, comparison and reviews"
```

---

### Task 14: Products index

**Files:**
- Modify: `app/[locale]/products/page.tsx` (replace the whole file)
- Delete: `app/[locale]/products/products-client.tsx`
- Test: `components/site/products-index.test.ts`

**Interfaces:**
- Consumes: `getProducts`, `ProductCard`, `SiteHeader`, `SiteFooter`, `siteCopy`.
- Produces: the `/[locale]/products` route, which lists all three product cards.

- [ ] **Step 1: Write the failing test**

```ts
// components/site/products-index.test.ts
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ProductsPage from "@/app/[locale]/products/page";

describe("products index", () => {
  it("lists every product as a card", async () => {
    const html = renderToStaticMarkup(await ProductsPage({ params: Promise.resolve({ locale: "id" }) }));
    for (const slug of ["cervicloud", "lumicloud", "calmicloud"]) {
      expect(html).toContain(`data-product-card="${slug}"`);
    }
    expect(html).toContain("<h1");
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run components/site/products-index.test.ts`
Expected: FAIL. The current page does not accept `params` or render `data-product-card`.

- [ ] **Step 3: Replace the page and delete the old client**

```tsx
// app/[locale]/products/page.tsx
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/site/product-card";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import site from "@/components/site/site.module.css";
import { isLocale } from "@/i18n/config";
import { getProducts } from "@/lib/catalog";
import { siteCopy } from "@/lib/site/copy";

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div className={site.page}>
      <SiteHeader locale={locale} />
      <main className={site.shell} style={{ padding: "56px var(--sp-gutter) 120px" }}>
        <h1 style={{ font: "700 46px/1.05 var(--font-display), serif", letterSpacing: "-0.015em", marginBottom: 36 }}>
          {siteCopy[locale].nav.allProducts}
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))", gap: 24 }}>
          {getProducts(locale).map((product, i) => (
            <ProductCard key={product.slug} product={product} locale={locale} index={i} />
          ))}
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
```

Run: `git rm app/[locale]/products/products-client.tsx`

- [ ] **Step 4: Run tests and typecheck**

Run: `npx vitest run components/site && npm run typecheck`
Expected: PASS, exit 0.

- [ ] **Step 5: Commit**

```bash
git add app/[locale]/products/page.tsx components/site/products-index.test.ts
git commit -m "feat: restyle the products index with the new cards"
```

---

### Task 15: Remove claims the positioning rules forbid

**Files:**
- Modify: `data/faqs.json`, `data/products.json`, `data/blog.json`, `messages/en.json`, `messages/id.json`
- Create: `scripts/fix-claims.mjs` (one-off, deleted in Step 5)
- Test: `lib/site/claims.test.ts`

**Interfaces:**
- Produces: no claim text matching the banned list anywhere in site copy.

- [ ] **Step 1: Write the failing test**

```ts
// lib/site/claims.test.ts
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const FILES = [
  "data/faqs.json",
  "data/products.json",
  "data/blog.json",
  "messages/en.json",
  "messages/id.json",
  "lib/catalog/content.ts",
  "lib/site/copy.ts",
  "lib/site/home-copy.ts",
  "lib/site/pdp-copy.ts",
  "app/[locale]/layout.tsx",
];

const BANNED: Array<[string, RegExp]> = [
  ["decibel claim", /\b\d+\s?dB\b/i],
  ["medical-grade", /medical[- ]grade|kelas medis/i],
  ["absolute blackout", /100% ?blackout|blackout 100%|total blackout|kegelapan total/i],
  ["3D eye cavities", /eye cavit|rongga mata/i],
  ["bamboo cover", /\bbamboo\b|\bbambu\b/i],
];

describe("positioning claims", () => {
  it.each(FILES)("%s avoids banned claims", (file) => {
    // URLs carry marketplace slugs (e.g. "...-medical-grade-...") that are not our copy.
    const text = readFileSync(join(process.cwd(), file), "utf8").replace(/https?:\/\/[^\s"')]+/g, "");
    for (const [label, pattern] of BANNED) {
      expect(text.match(pattern)?.[0], `${label} in ${file}`).toBeUndefined();
    }
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run lib/site/claims.test.ts`
Expected: FAIL on `data/faqs.json`, `data/products.json`, `data/blog.json`, `messages/en.json` and `messages/id.json`.

- [ ] **Step 3: Write and run the replacement script**

```js
// scripts/fix-claims.mjs (one-off; deleted after running)
import { readFileSync, writeFileSync } from "node:fs";

function edit(file, pairs) {
  let text = readFileSync(file, "utf8");
  for (const [from, to, expected = 1] of pairs) {
    const count = text.split(from).length - 1;
    if (count !== expected) throw new Error(`${file}: expected ${expected}× "${from.slice(0, 60)}…", found ${count}`);
    text = text.split(from).join(to);
  }
  writeFileSync(file, text);
}

const calmiAlarmEn = "Yes. CalmiCloud is engineered to reduce background noise (like snoring or traffic) by approximately 28dB. Important alert sounds, such as alarms or phone ringtones, remain audible for your safety.";
const calmiAlarmEnNew = "CalmiCloud reduces background noise such as snoring, AC hum or traffic, but it does not block every sound. Keep your alarm at a volume you can still hear.";
const lumiEyesEn = "Not at all. The mask features deep 3D contoured eye cavities that allow you to blink freely. It provides total blackout isolation without any pressure on your eyes.";
const lumiEyesEnNew = "No. LumiCloud is shaped to block light without pressing on your eyelids, so it stays comfortable all night.";
const coverEn = "Yes. The cooling bamboo outer cover is removable and machine washable.";
const coverEnNew = "Yes. The cooling ice-silk cover is removable and washable.";
const lumiDescEn = "Engineered for the heat, crafted for the soul. LumiCloud combines premium Soft Cotton Fabric with 3D contoured eye cavities to deliver 100% blackout isolation without pressure. Breathable, adjustable, and featherlight—it's not just a mask, it's a signal to your brain that it's time to rest.";
const lumiDescEnNew = "LumiCloud is a light, soft cotton eye mask shaped to block light for most sleepers without pressing on the eyes. Breathable, adjustable and easy to pack for nights, naps and travel.";
const calmiDescEn = "Achieve profound silence without the invasive pressure. CalmiCloud is crafted from medical-grade, moldable silicone that seals your outer ear canal perfectly. Water-resistant and reusable, it blocks out snoring, traffic, and distraction—whether you're sleeping, swimming, or seeking deep focus.";
const calmiDescEnNew = "CalmiCloud earplugs are made from soft, moldable silicone that covers the outer ear instead of pushing in. Reusable and comfortable for side sleepers, they help quiet snoring, AC hum and traffic.";

edit("data/faqs.json", [
  [calmiAlarmEn, calmiAlarmEnNew],
  [lumiEyesEn, lumiEyesEnNew],
  [coverEn, coverEnNew],
]);

edit("data/products.json", [
  [lumiDescEn, lumiDescEnNew],
  ['"100% Blackout engineering"', '"Blackout for most sleepers"'],
  ['"Zero-pressure 3D eye cavities"', '"No pressure on the eyelids"'],
  [calmiDescEn, calmiDescEnNew],
]);

edit("messages/en.json", [
  ["Light pollution triggers micro-arousals that fragment your REM cycles. Our 100% blackout engineering signals your pineal gland to produce melatonin instantly.", "Light from lamps and windows can make sleep feel shallower. A mask that blocks light for most sleepers helps the room feel like night."],
  ["Your brain processes sound even while asleep. We dampen ambient noise by 28dB, smoothing the sonic landscape to prevent cortisol spikes during the night.", "Snoring, AC hum and traffic can wake light sleepers. Soft earplugs help the room feel quieter without blocking every sound."],
  [calmiAlarmEn, calmiAlarmEnNew],
  [lumiEyesEn, lumiEyesEnNew],
  [coverEn, coverEnNew],
  [lumiDescEn, lumiDescEnNew],
  ['"100% Blackout engineering"', '"Blackout for most sleepers"'],
  ['"Zero-pressure 3D eye cavities"', '"No pressure on the eyelids"'],
  [calmiDescEn, calmiDescEnNew],
  ["or the total darkness of the <strong3>", "or the darkness of the <strong3>"],
]);

edit("messages/id.json", [
  ["atau, lebih baik lagi, kegelapan total.", "atau, lebih baik lagi, matikan lampu."],
  ["kami, atau kegelapan total dari <strong3>", "kami, atau gelapnya <strong3>"],
  ["Polusi cahaya memicu rangsangan mikro yang memecah siklus REM Anda. Rekayasa 100% blackout kami memberi sinyal pada kelenjar pineal untuk memproduksi melatonin secara instan.", "Cahaya dari lampu dan jendela bisa membuat tidur terasa kurang dalam. Masker yang menutup cahaya untuk kebanyakan orang membantu kamar terasa seperti malam."],
  ["Otak Anda memproses suara bahkan saat tidur. Kami meredam kebisingan hingga 28dB, memperhalus lanskap sonik untuk mencegah lonjakan kortisol di malam hari.", "Dengkuran, suara AC, dan jalan bisa membangunkan orang yang mudah terjaga. Earplug lembut membantu kamar terasa lebih tenang tanpa menghapus semua suara."],
  ["Ya. CalmiCloud dirancang untuk mengurangi kebisingan latar belakang (seperti dengkuran atau lalu lintas) sekitar 28dB. Suara peringatan penting, seperti alarm atau nada dering telepon, tetap terdengar demi keamanan Anda.", "CalmiCloud mengurangi suara sekitar seperti dengkuran, AC, atau lalu lintas, tapi tidak menghapus semua suara. Pasang alarm dengan volume yang tetap terdengar."],
  ["Tidak sama sekali. Masker ini memiliki rongga mata berkontur 3D yang dalam yang memungkinkan Anda berkedip bebas. Memberikan isolasi kegelapan total tanpa tekanan pada mata Anda.", "Tidak. LumiCloud dibuat untuk menutup cahaya tanpa menekan kelopak mata, jadi tetap nyaman dipakai semalaman."],
  ["Ya. Sarung luar bambu yang sejuk dapat dilepas dan dicuci dengan mesin.", "Ya. Sarung ice-silk yang sejuk bisa dilepas dan dicuci."],
  ["Direkayasa untuk panas, dibuat untuk jiwa. LumiCloud menggabungkan Kain Katun Lembut premium dengan rongga mata berkontur 3D untuk memberikan isolasi blackout 100% tanpa tekanan. Bernapas, dapat disesuaikan, dan seringan bulu—ini bukan sekadar masker, ini adalah sinyal bagi otak Anda bahwa sudah waktunya untuk istirahat.", "LumiCloud adalah masker mata katun yang ringan dan lembut, dibuat untuk menutup cahaya bagi kebanyakan orang tanpa menekan mata. Bernapas, bisa diatur, dan mudah dibawa untuk tidur malam, tidur siang, dan perjalanan."],
  ['"Rekayasa Blackout 100%"', '"Blackout untuk kebanyakan orang"'],
  ['"Rongga mata 3D tanpa tekanan"', '"Tidak menekan kelopak mata"'],
  ["Capai keheningan mendalam tanpa tekanan invasif. CalmiCloud dibuat dari silikon kelas medis yang dapat dibentuk yang menyegel saluran telinga luar Anda dengan sempurna. Tahan air dan dapat digunakan kembali, ia memblokir dengkuran, lalu lintas, dan gangguan—baik Anda sedang tidur, berenang, atau mencari fokus yang mendalam.", "Earplug CalmiCloud dibuat dari silikon lembut yang bisa dibentuk dan menutup telinga dari luar, bukan didorong ke dalam. Bisa dipakai ulang dan nyaman untuk tidur miring, membantu meredam dengkuran, suara AC, dan lalu lintas."],
]);

const blog = "data/blog.json";
let blogText = readFileSync(blog, "utf8");
const blackoutCount = blogText.split("total blackout").length - 1;
if (blackoutCount !== 8) throw new Error(`${blog}: expected 8× "total blackout", found ${blackoutCount}`);
blogText = blogText.split("total blackout").join("blackout yang rapat");
writeFileSync(blog, blogText);
edit(blog, [
  ["memakai medical-grade moldable silicone yang", "memakai silikon lembut yang"],
  ["menggunakan medical-grade moldable silicone yang", "menggunakan silikon lembut yang"],
  ["CalmiCloud membantu meredam suara sampai sekitar 28dB. Artinya,", "CalmiCloud membantu meredam suara di sekitar. Artinya,"],
  ["CalmiCloud membantu meredam suara sampai sekitar 28dB, tapi", "CalmiCloud membantu meredam suara, tapi"],
]);

console.log("Claims fixed.");
```

Run: `node scripts/fix-claims.mjs`
Expected: `Claims fixed.`

If a count assertion fails, the file differs from what this plan saw. Open the reported line with `grep -n` and adjust that one pair's `from` string to the current text. Keep the replacement text as written.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run lib/site/claims.test.ts && node -e "for (const f of ['data/faqs.json','data/products.json','data/blog.json','messages/en.json','messages/id.json']) JSON.parse(require('fs').readFileSync(f,'utf8'))" && echo json-ok`
Expected: PASS and `json-ok`.

- [ ] **Step 5: Delete the one-off script and commit**

```bash
rm scripts/fix-claims.mjs
git add data/faqs.json data/products.json data/blog.json messages/en.json messages/id.json lib/site/claims.test.ts
git commit -m "fix: remove decibel, medical-grade, absolute blackout and bamboo claims"
```

---

### Task 16: Remove replaced code

**Files:**
- Delete: `components/sections/` (all files)
- Delete: `components/product/` (all files)
- Delete: `components/ui/background-clouds.tsx`
- Delete: `components/layout/language-modal.tsx`
- Delete: `lib/lenis.tsx`
- Delete: `lib/product-page-content.ts`, only if unreferenced after the above (checked in Step 1)
- Modify: `messages/en.json`, `messages/id.json` (drop namespaces that only the deleted components used)
- Modify: `package.json` (uninstall `lenis`)

**Interfaces:**
- Produces: no new interfaces. The codebase builds with no references to removed modules.

- [ ] **Step 1: Confirm nothing outside the deleted set imports them**

Run:

```bash
grep -rn -E "components/(sections|product)/|background-clouds|language-modal|lib/lenis|product-page-content" app components lib --include='*.ts' --include='*.tsx' | grep -v -E "^(components/sections|components/product)/"
```

Expected: no output. If `lib/product-page-content.ts` is listed only from `components/product/*`, it is safe to delete. If any Phase 2 page appears, keep that module and remove it from the deletion list.

- [ ] **Step 2: Delete the files and the dependency**

```bash
git rm -r components/sections components/product components/ui/background-clouds.tsx components/layout/language-modal.tsx lib/lenis.tsx
git rm lib/product-page-content.ts
npm uninstall lenis
```

- [ ] **Step 3: Drop unused message namespaces**

For each namespace, run `grep -rn "'<Name>'\|\"<Name>\"" app components lib` and delete it from both `messages/en.json` and `messages/id.json` only when the grep shows no remaining `useTranslations`/`getTranslations` use. The namespaces to check are:
- `Hero`
- `TrustBar`
- `ScienceScroll`
- `ProductShowcase`
- `SleepAcademy`
- `UGCStrip`
- `FAQPreview`
- `ProductsPage`
- `ProductDetails`
- `Products`
- `LanguageModal`

```bash
node -e "
const fs=require('fs');
const names=process.argv.slice(1);
for (const f of ['messages/en.json','messages/id.json']) {
  const m=JSON.parse(fs.readFileSync(f,'utf8'));
  for (const n of names) delete m[n];
  fs.writeFileSync(f, JSON.stringify(m,null,2)+'\n');
}" Hero TrustBar ScienceScroll ProductShowcase SleepAcademy UGCStrip FAQPreview ProductsPage ProductDetails Products LanguageModal
```

Before running it, remove from that argument list any name the grep showed is still used.

- [ ] **Step 4: Verify**

Run: `npm test && npm run typecheck && npm run lint && npm run build`
Expected: all pass, and the build lists `/[locale]/products/[slug]` with 6 prerendered paths.

- [ ] **Step 5: Commit**

```bash
git add -A components lib messages package.json package-lock.json
git commit -m "chore: remove the old home sections, product components and Lenis"
```

---

### Task 17: Final verification

**Files:**
- No code changes expected. Fix and commit any issue found under the task it belongs to.

- [ ] **Step 1: Full checks**

Run: `npm test && npm run typecheck && npm run lint && npm run build`
Expected: all pass.

- [ ] **Step 2: Browser pass, desktop (1440×900)**

Run `npm run start` (production build) via the Browser pane and open each page:
- `/id`
- `/en`
- `/id/products/cervicloud`
- `/id/products/lumicloud`
- `/id/products/calmicloud`
- `/id/products`
- `/id/about` (a Phase 2 page; it must show the new header and footer)

Check:
- no console errors;
- the header turns solid after the hero;
- the Belanja panel opens and closes with Escape;
- the language switch goes to the same page in the other language;
- the cookie notice appears once and stays gone after "Oke".

- [ ] **Step 3: Browser pass, mobile (390×844)**

On every page above, run in the console:

```js
document.documentElement.scrollWidth === document.documentElement.clientWidth
```

Expected: `true`.

Check:
- the menu sheet opens;
- the product cards and reviews swipe;
- the sticky buy bar shows on product pages after the buy buttons scroll away.

- [ ] **Step 4: Reduced motion**

In devtools Rendering, set "prefers-reduced-motion: reduce" and reload `/id`. Expected:
- all content is visible without scrolling into it;
- the lamb does not breathe;
- the LumiCloud band is dark and not pinned.

- [ ] **Step 5: Tracking**

With `NEXT_PUBLIC_META_PIXEL_ID`, `META_PIXEL_ID`, `META_CAPI_TOKEN` and `META_TEST_EVENT_CODE` set in `.env.local`, open `/id/products/lumicloud`. Then:
1. Switch the colour.
2. Click "Beli di Shopee".

In Meta Events Manager → Test events, expect:
- `PageView`, `ViewContent` (twice: Blue, then Apricot) and `InitiateCheckout`;
- each event shown as "Browser" and "Server" with "Deduplicated".

The Shopee tab must open even with DevTools network throttled to "Offline" for `/api/meta-events`.

- [ ] **Step 6: Lighthouse (mobile)**

Run:

```bash
npx --yes lighthouse@12 http://localhost:3000/id --only-categories=performance --form-factor=mobile --screenEmulation.mobile --quiet --chrome-flags="--headless=new" --output=json --output-path=./lh-home.json
npx --yes lighthouse@12 http://localhost:3000/id/products/cervicloud --only-categories=performance --form-factor=mobile --screenEmulation.mobile --quiet --chrome-flags="--headless=new" --output=json --output-path=./lh-pdp.json
node -e "for (const f of ['lh-home.json','lh-pdp.json']) { const r=require('./'+f); console.log(f, Math.round(r.categories.performance.score*100), 'LCP', r.audits['largest-contentful-paint'].displayValue, 'CLS', r.audits['cumulative-layout-shift'].displayValue); }"
rm lh-home.json lh-pdp.json
```

Expected: performance ≥ 90, LCP < 2.5 s and CLS < 0.05 on both. If LCP misses, check that the hero/gallery first image has `priority` and that `sizes` matches the rendered width.

- [ ] **Step 7: Hand off**

Push the branch and open a pull request with a Vercel preview, so the owner can review on a real phone before merging (spec section 13).
