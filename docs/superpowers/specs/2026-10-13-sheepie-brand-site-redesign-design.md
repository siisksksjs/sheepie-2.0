# Sheepie Brand Site Redesign (Phase 1) — Design

Date: 2026-10-13
Status: Draft for review
Approved mockups: `.superpowers/brainstorm/26086-1791874327/content/home-v3.html` (home, desktop and mobile) and `pdp-v1.html` (product page, CerviCloud and LumiCloud). These files are local and gitignored; this document is the source of truth.

## 1. Goal

Rebuild the Sheepie website so it reads like a $100M sleep brand (benchmarks: Bearaby, Hatch, Manta Sleep) instead of a template or AI-made site, while staying inside the Sheepie brand book (`/Users/tsth/Downloads/Sheepie_MTS.pdf`).

Each page does its own job. The home page is a brand home, a product page is a product page. No sales-letter pages, no quiz funnels, no pushy conversion tricks. Conversion comes from craft: photography, type, the Mega Mendung identity, honest product information and a clear path to Shopee and Tokopedia.

The site also becomes the measurable bridge for Meta ads: Meta Pixel + Conversions API record product views and clicks out to the marketplaces, and a website-only voucher code lets real marketplace orders be traced back to site traffic.

### Success criteria

- The owner signs off that the site no longer looks AI-made or templated.
- CerviCloud and LumiCloud carry equal weight across the site; CalmiCloud is a companion.
- Mobile (390px) is first-class: no horizontal scroll, sticky buy bar on product pages, every tap target at least 44px.
- Scrolling is smooth on a mid-range Android phone: no continuous per-frame work, Lighthouse mobile performance at least 90 on home and product pages, CLS below 0.05, LCP below 2.5s on simulated 4G.
- Meta Events Manager shows `PageView`, `ViewContent` and `InitiateCheckout` from both browser and server with matching `event_id` (deduplicated).

## 2. Scope

### In Phase 1

- New design system: tokens, type, Mega Mendung tiles, lamb mark, header, footer, buttons and cards.
- Home page (`/[locale]`).
- Product pages (`/[locale]/products/[slug]`): CerviCloud and LumiCloud with full content; CalmiCloud on the same template with lighter content.
- Products index (`/[locale]/products`), restyled with the new cards.
- "Belanja" shop panel opened from the header.
- Meta Pixel + Conversions API, plus the voucher display.
- Removal of the old home sections and product components that the new pages replace.

### Out of Phase 1

- About, FAQ, Journal (blog), Contact and the campaign pages (`calmicloud-earplug-guide`, `sheepie-x-yoga-spin`). They pick up the new header and footer automatically through the shared layout. Their inner content keeps the old styling until Phase 2.
- `/bio` and `/go/[slug]` stay exactly as they are; they have their own layout and analytics.
- AI-generated photos and video. Phase 1 ships with existing photography. Generated assets are a separate, cost-approved task (section 10) and swap in without code changes.

## 3. Visual system

### Color

The brand-book navy `#22336a` reads violet on screens and made the early mockups look AI-made, so text and dark surfaces move to a blue-black ink with no violet cast.

| Token | Value | Use |
|---|---|---|
| `--cream` | `#fffdf5` | Page background |
| `--linen` | `#f3eee4` | Cards, companion tiles, review cards |
| `--sky` | `#a3c1e0` | Brand light blue: accents, swatches |
| `--sky-soft` | `#e4edf5` | Notice bar, CerviCloud band, icon discs |
| `--peach` | `#f6cdb8` | Small highlights only (discount chip) |
| `--ink` | `#1d2b44` | Text, primary buttons |
| `--night` | `#111b2c` | LumiCloud lights-out band, night reviews, footer |
| `--line` | `rgba(29,43,68,.12)` | Hairlines |
| Logo blue | `#7f9fc6` | "Sheepie." wordmark in the header |

Rule: at most three of these colors in any one viewport, which keeps to the brand book's 3–4 color limit.

### Type

- Display: Playfair Display 600/700, via `next/font` (already set up). Used for headings and quotes only.
- Body and UI: Quicksand 500/600/700.
- Scale (desktop / mobile): hero 76/42, section heading 46–58/30–34, product name 52/38, card title 26–30/20–24, body 16–19/14.5–16.
- Headings use tight tracking (`-0.015em` to `-0.02em`) and line height 1.0–1.05.

### Anti-template rules

These apply to every page. They were the specific reasons the owner rejected earlier rounds.

- No uppercase, wide-tracked "eyebrow" label above section headings.
- No italic or mixed-font word inside a headline for emphasis.
- No centered-everything layouts. Headings sit left on the grid; the only centered element is the logo.
- No inset rounded color panels. Width follows the rule below.
- No decorative motion beyond the three effects in section 4.

### Width rule

- Full bleed for immersive scenes: home hero, CerviCloud band, LumiCloud lights-out band and the reviews that follow it, footer.
- Contained grid (max 1320px, 28px gutter desktop, 20px mobile) for things people read or shop: product cards, day reviews, product page body.
- Rounded corners (16–26px) appear only on photos, cards and tiles, never on page-width bands.

### Brand assets

- **Mega Mendung:** the real pattern from brand book page 5, extracted to transparent line art and pre-tinted into three small PNG tiles (`mendung-white`, `mendung-sky`, `mendung-ink`, 26–105KB) used as plain repeating `background-image`. No CSS masks, because masks forced large repaints in v2.
- **Lamb mark:** the sleeping lamb from page 5, with the blue version for light surfaces and a white silhouette for dark ones. The interim PNG has soft edges; replace it with the vector logo when the owner supplies one (open question 4).
- **Wordmark:** "Sheepie." set in Playfair 700 next to the lamb.

## 4. Motion and performance

Exactly three effects:

1. **Breathing lamb:** the header lamb scales about 4–6% on a 5.2s loop, transform only.
2. **Fade-in:** sections and cards fade in once on entering the viewport, using opacity and a 16px translate over 0.6–0.7s with `cubic-bezier(.23,1,.32,1)`, staggered 70ms. One `IntersectionObserver`; each element is unobserved after it fires.
3. **Lights out (LumiCloud):**
   - **Desktop:** the band is 180vh tall with a sticky 100vh stage. As it scrolls in, a night layer fades from 0 to 1, two Mega Mendung layers drift at different speeds, and the content rises in. It stays dark and scrolls away into the night reviews and footer.
   - **Mobile:** no pinning; the band dims in as it arrives.
   - **Implementation:** the scroll listener is attached only while an `IntersectionObserver` reports the band within 20% of the viewport. Updates are batched through one `requestAnimationFrame` per scroll burst and write only `opacity` and `translate3d`.

Also:

- Product card hover cross-fades a lifestyle photo to a product photo, on `(hover: hover)` devices only.
- Header turns from transparent (over the hero) to solid cream, toggled by an `IntersectionObserver` on the hero. The header is `position: fixed` in both states, so there is no layout shift.

Explicitly removed, all tried and rejected:

- blur-in text
- hero parallax
- clip-path image reveals
- review marquee
- header `backdrop-filter`
- the continuous per-frame `requestAnimationFrame` loop

Lenis smooth scrolling (currently in `app/[locale]/layout.tsx`) is removed from the main site. Native scrolling is smoother on phones and keeps `position: sticky` predictable.

`prefers-reduced-motion: reduce` disables all three effects and shows the lights-out band in its final dark state.

### Performance budget

- **Images:** everything through `next/image` with explicit sizes. Hero is `priority`, everything else lazy. Source photos are capped at 2000px on the long edge.
- **Hero LCP image:** under 250KB at 1440px wide (AVIF/WebP served by Next).
- **Client JavaScript:** the home and product pages are server components. Only these islands are client components:
  - header state
  - fade observer
  - lights-out band
  - gallery
  - variant picker
  - shop panel
  - sticky buy bar
  - tracking
- **Fonts:** only the weights in use. Playfair 600/700 and Quicksand 500/600/700, down from the current 9 + 5.

## 5. Shared layout

### Notice bar

36px tall on desktop and 32px on mobile, sky-soft background: "Belanja resmi Sheepie di Shopee & Tokopedia". Over the home hero it becomes a translucent ink strip.

### Header

- Desktop: a three-column grid. Left: Bantal / Masker Mata / Earplug. Center: lamb plus wordmark. Right: Cerita Kami / Jurnal / **Belanja** pill.
- Mobile: menu icon, centered logo and the Belanja pill.
- The menu opens a full-height sheet with the same links plus the language switch.

### Belanja panel

A sheet with three product rows (thumb, name, price). Each row has "Shopee" and "Tokopedia" buttons. Every button goes through the tracked marketplace click (section 8).

### Footer

Night background with a sky Mega Mendung tile. It holds a large "Selamat tidur, sampai besok pagi." with the lamb, and three link columns:
- **Belanja:** product links
- **Sheepie:** Cerita kami, Jurnal, FAQ, Kontak
- **Temukan kami:** Shopee, Tokopedia, Instagram, TikTok

Below the columns: a legal line and the language switch.

## 6. Home page

Order (owner-specified):

1. **Hero (full bleed, 100vh):**
   - Photo: overhead shot `DSC01316`, showing the CerviCloud pillow, LumiCloud mask and a CalmiCloud earplug.
   - Overlay: bottom-up ink gradient with cream text bottom-left.
   - H1: "Leher tertopang, mata tetap gelap."
   - Subline: "CerviCloud dan LumiCloud: bantal ergonomis dan masker mata blackout untuk malam Indonesia yang gerah."
   - Two buttons: "Lihat CerviCloud" (solid cream) and "Lihat LumiCloud" (outline).
   - No quote card.
2. **Products (contained):**
   - Heading: "Koleksi utama", unless the owner has data that supports "Dua yang paling dicari".
   - CerviCloud and LumiCloud as two large 5:5.4 cards with chip, name, price with strikethrough and a one-line description. On mobile they become a horizontal snap row.
   - Below: two companion tiles in a "Pelengkap" row, for CalmiCloud and the CerviCloud cover.
3. **CerviCloud band (full bleed, sky-soft with white Mega Mendung):**
   - Left: a large photo with an overlapping ice-silk swatch photo.
   - Right: "CerviCloud, bantal yang ikut bentuk tidurmu.", a short lead, a 2×2 feature list and a "Lihat CerviCloud" button.
4. **CerviCloud reviews (contained, cream):**
   - "Kata mereka tentang CerviCloud"
   - One large quote plus two smaller ones from `data/bio.ts`, each with a masked author, marketplace and a "Lihat ulasan asli" link to the screenshot.
5. **LumiCloud lights-out band (full bleed, night):**
   - "LumiCloud. Matikan lampu, tanpa menekan mata."
   - Lead copy, 2×2 features, Blue / Apricot swatches and a "Lihat LumiCloud" button.
   - Night photo `DSC01058`.
6. **LumiCloud reviews (full bleed night, contained content):** same layout as the CerviCloud reviews on translucent cards.
7. **Footer.**

The journal teaser and the generic brand quote are dropped from home.

## 7. Product page

The same template serves all products. Content comes from the catalog (section 9).

1. **Breadcrumb** (desktop only).
2. **Top, two columns on desktop:**
   - **Gallery** (sticky, top 132px): vertical thumbnails plus a 4:4.6 main image. On mobile it becomes a full-width swipeable carousel (scroll-snap) with dots.
   - **Buy box:**
     - name (Playfair 52) and a one-line description
     - price, strikethrough price and a peach discount chip
     - 2×2 icon benefits
     - option picker: image cards; changing the option updates the price and the marketplace URLs (CerviCloud: Bantal + sarung / Sarung saja; LumiCloud: Blue / Apricot)
     - "Beli di Shopee" (solid ink) and "Beli di Tokopedia" (outline), each with a small marketplace mark
     - website voucher line with a copy button
     - two assurance lines (shipping from Indonesia via the marketplaces; payment and returns covered by marketplace protection)
     - accordions: size and materials, care, adaptation or usage
3. **Anatomy:** product photo on a sky-soft Mega Mendung panel with four numbered pins and four numbered callouts. The pin coordinates live in the catalog. A purpose-made exploded render (section 10) replaces the photo later.
4. **Fit:** four cards. For CerviCloud, stomach sleepers are honestly marked "Kurang cocok". For LumiCloud, four use cases.
5. **Comparison:** a three-column table, product vs. ordinary alternative.
6. **Reviews:** three full-text reviews from `data/bio.ts` with screenshot links. Horizontal snap on mobile.
7. **FAQ:** heading plus accordions, and the line "Masih ragu? Tanya kami lewat chat Shopee atau Tokopedia."
8. **Lengkapi tidurmu:** the other hero product and CalmiCloud.
9. **Mobile sticky buy bar:** price, name and "Beli di Shopee". It appears once the main buttons scroll out of view and respects the safe-area inset.

The CalmiCloud page uses the same template with anatomy, fit, comparison, reviews and FAQ. Its reviews come from `data/bio.ts`.

## 8. Tracking

### Events

| Event | Where | Payload |
|---|---|---|
| `PageView` | every page | default |
| `ViewContent` | product page load and option change | `content_ids: [slug(-variant)]`, `content_type: product`, `value`, `currency: IDR` |
| `InitiateCheckout` | any marketplace button: buy box, sticky bar, shop panel (home cards link to product pages, not out) | same, plus `marketplace: shopee \| tokopedia`, `placement` |

### Mechanics

- **Browser:** the Meta Pixel base code is loaded once from the root layout through `next/script` (`afterInteractive`).
- **Server:** a new route `app/api/meta-events/route.ts` forwards the same event to the Conversions API.
- **Deduplication:** both sides send the same `event_id`, generated client-side with `crypto.randomUUID()`.
- **Payload hygiene:** the server adds `client_ip_address`, `client_user_agent`, `_fbp` / `_fbc` cookies and `event_source_url`. It hashes nothing and sends no PII because the site collects none.
- **Click handling:** a marketplace click fires both events with `navigator.sendBeacon` / `fetch(..., { keepalive: true })`, then opens the marketplace URL in a new tab. The UTM parameters from `lib/utm.ts` stay.
- **Existing analytics:** Umami, `gtag` and PostHog calls in `lib/analytics.ts` keep firing as they do today.

### Environment

Server-only environment variables: `META_PIXEL_ID`, `META_CAPI_TOKEN`, plus `META_TEST_EVENT_CODE` (optional, for Events Manager testing). The pixel ID is also exposed as `NEXT_PUBLIC_META_PIXEL_ID`.

Failures never block navigation: a shopper always reaches the marketplace even if tracking fails. This follows the same principle as `app/go/[slug]/route.ts`.

### Voucher

The website-only code (placeholder `SHEEPIEWEB`) lives in one config value. The owner creates it as a private shop voucher in Shopee Seller Centre (and optionally Tokopedia). Weekly redemptions ÷ `InitiateCheckout` count gives the true click-to-order rate.

## 9. Content and data

### Languages

Indonesian is primary and written natively, not translated. English mirrors it through the existing `next-intl` setup (`messages/id.json`, `messages/en.json`).

### Single source per fact

| Data | Source |
|---|---|
| Prices, original prices, marketplace URLs per variant, LumiCloud colors | `data/products.json` |
| Page copy per product: sub, icons, options, accordions, anatomy pins and callouts, fit, comparison, FAQ, pairing | new typed module `data/catalog.ts`, keyed by slug, with `id` and `en` strings, read through one accessor `getProductContent(slug, locale)` |
| Reviews | `data/bio.ts` testimonials, shared with `/bio` and used in full text. The home cards may show a shortened excerpt only with an ellipsis marking the cut. |

### Claims

Copy follows `POSITIONING_FINDINGS.md`. That means:
- no treatment or cure language;
- no decibel numbers;
- no "100% blackout" absolute (use "menutup cahaya untuk kebanyakan orang");
- no proprietary-engineering story;
- the adaptation period is stated (7–14 nights, from the current FAQ).

Old copy that breaks these rules is removed from `products.json` and the messages files as part of this work.

## 10. Assets

### Phase 1 (existing)

- Photos come from `public/images/edited` and `public/images/photoshoot`, the `etalase/22.png` studio pillow and the LumiCloud variant images.
- The Mega Mendung tiles and lamb PNGs are generated by a committed script, `scripts/extract-brand-assets.mjs`, from the brand-book PDF images (using `sharp`, already installed) into `public/brand/`.

### Later (separate task)

Generated assets, which need their own plan, a cost quote and owner approval through the ai-video workflow. They must use the owner's own model and product references.

1. A wide hero still and a 6–8s seamless hero loop (Indonesian bedroom at night, both hero products, room on the left for text).
2. Studio product shots on linen or cream, two angles per product.
3. Macro: ice-silk texture and a 4s memory-foam slow-rebound clip.
4. CerviCloud exploded or annotated render, plus a clean LumiCloud studio shot for its anatomy panel.
5. Indonesian lifestyle scenes: an afternoon nap without AC, LumiCloud on a plane, CalmiCloud in a noisy rental room.

## 11. Component units

Each unit has one job and takes plain props. Pages compose them and fetch catalog data on the server.

### Layout

- `SiteHeader`, with the client island `useHeaderOverHero`
- `ShopPanel` (client)
- `SiteFooter`
- `NoticeBar`
- `LambMark`
- `MendungTile`, whose `tone` prop is `white`, `sky` or `ink`

### Home

- `HomeHero`
- `ProductDuo`
- `CompanionRow`
- `FeatureBand` (the CerviCloud day variant)
- `LightsOutBand` (client)
- `ReviewSection`, whose `tone` prop is `day` or `night`

### Product page

- `ProductGallery` (client)
- `BuyBox`
- `OptionPicker` (client)
- `MarketplaceButtons` (client)
- `VoucherLine` (client, copy to clipboard)
- `Assurances`
- `ProductAccordions`
- `AnatomyPanel`
- `FitGrid`
- `CompareTable`
- `ReviewGrid`
- `FaqList`
- `PairWith`
- `StickyBuyBar` (client)

### Shared

- `FadeIn` (client, one shared observer)
- `Button`
- `Chip`

### Tracking

- `lib/meta/events.ts`: builds payloads and `event_id`. It is pure and unit-tested.
- `lib/meta/pixel.tsx`: the pixel script.
- `app/api/meta-events/route.ts`: forwards to the Conversions API.
- `trackMarketplaceClick`: extended to call the Meta helpers.

### Removed

These are replaced by the units above:
- `components/sections/*` (hero, science-scroll, sleep-academy, trust-bar, ugc-strip, faq-preview)
- `components/product/product-hero.tsx`
- `components/product/product-sales-sections.tsx`
- `components/product/product-showcase.tsx`
- `components/ui/background-clouds.tsx`

They are only deleted once nothing in the Phase 2 pages imports them; otherwise they stay until Phase 2.

## 12. Testing and verification

### Unit (vitest, existing setup)

- Every product slug has complete `id` and `en` catalog content.
- Every variant has Shopee and Tokopedia URLs and parseable prices.
- Event payload builders produce the documented shapes.
- The browser and server payloads share `event_id`.
- The CAPI route returns 2xx and swallows Meta errors without throwing.

### Static

`npm run typecheck`, `npm run lint` and `npm run build` all pass.

### Browser

The dev server is checked at 1440×900 and 390×844 for home and each product page. Checks:
- no horizontal overflow (`scrollWidth === clientWidth`)
- the lights-out band at the start, middle and end of its scroll
- the header switch over the hero
- the sticky buy bar
- option switching updates the price and links
- reduced-motion mode

### Tracking

Meta Events Manager "Test events" with `META_TEST_EVENT_CODE` shows browser and server events deduplicated for one view and one click.

### Performance

A Lighthouse mobile run on home and on the CerviCloud page meets the section 1 targets.

## 13. Rollout

Work happens on a feature branch with a Vercel preview deployment. The owner reviews the preview on a real phone before merge. Phase 2 pages keep working throughout because they only inherit the new header and footer.

## 14. Open questions

Each has a current default so work is not blocked.

1. **CerviCloud cover material.** The brand book says ice-silk and the current FAQ says bamboo. Default: ice-silk everywhere.
2. **LumiCloud 3D eye cavities.** The product data claims them. Default: say only "tidak menekan kelopak mata" until confirmed.
3. **Website voucher.** Default placeholder `SHEEPIEWEB`; the real code and discount come from the owner.
4. **Vector logo.** Default: the interim extracted PNG.
5. **Products heading.** Default "Koleksi utama"; "Dua yang paling dicari" only with supporting data.
6. **Cookie or consent notice for the Meta Pixel under Indonesia's PDP law.** Default: a short, dismissible notice in the footer area, with no blocking modal. Confirm if a stricter opt-in is wanted.
