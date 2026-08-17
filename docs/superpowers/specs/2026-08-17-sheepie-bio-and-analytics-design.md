# Sheepie Bio Page and Analytics Design

**Date:** 2026-08-17  
**Status:** Approved  
**Public app:** `sheepie` at `https://sheepiesleep.com`  
**Dashboard app:** `dashboard-sheepie` at `https://dashboard.sheepiesleep.com`

## 1. Objective

Build an owned, mobile-first social bio page at `https://sheepiesleep.com/bio` and a protected analytics experience at `https://dashboard.sheepiesleep.com/bio-analytics`.

The public page will use Cartiera's bio page as a structural reference only: a product-led, conversion-oriented catalog with direct marketplace actions. Its visual language, typography, colors, motion, imagery, and copy will follow Sheepie's existing brand system.

The analytics system will measure detailed visitor behavior through the outbound marketplace click. Confirmed purchases and revenue attribution are explicitly outside the first version.

## 2. Product Principles

- Make the path from social profile to relevant product and marketplace obvious.
- Preserve Sheepie's calm, premium, cloud-like brand character.
- Optimize for mobile and embedded Instagram/TikTok browsers first.
- Never delay or block an outbound click because analytics is unavailable.
- Collect enough detail to explain visitor intent without collecting personal identity.
- Keep public page content code-configured in the first version.

## 3. Scope

### Included

- Public `/bio` route in the existing Sheepie website.
- Product-led structure featuring CerviCloud, LumiCloud, and CalmiCloud.
- Direct Shopee, Tokopedia, official website, WhatsApp, Instagram, and TikTok actions.
- Existing Sheepie product data and optimized product imagery.
- Existing Umami integration for aggregate traffic analytics.
- Supabase custom event collection for detailed behavioral analytics.
- Protected `/bio-analytics` page in the separate Sheepie dashboard app.
- Detailed filtering, funnels, journeys, charts, tables, and CSV export.
- Database migration, indexes, retention support, validation, and automated tests.

### Excluded

- Visual content editing from the dashboard.
- Drag-and-drop link or product management.
- Purchase confirmation from Shopee or Tokopedia.
- Revenue or ROAS attribution.
- Personally identifiable visitor profiles.
- Video-heavy page sections.

## 4. Public Bio Experience

### 4.1 Visual Direction

The page is a calm "bedside storefront," not a generic link hub. It reuses Sheepie's existing brand tokens and conventions:

- Playfair Display for expressive editorial headings.
- Quicksand for readable interface and body copy.
- Sheepie blue, cream, white, and soft neutral colors.
- Rounded forms, cloud layers, soft depth, and restrained motion.
- Premium sleep-product photography.
- Generous space and clear hierarchy rather than a dense marketplace grid.

The page must feel native to the main Sheepie website while being more compact and conversion-focused.

### 4.2 Page Structure

1. **Brand header**
   - Sheepie logo and a concise, sleep-focused message.
   - Instagram, TikTok, official website, and share actions.

2. **Sleep-system introduction**
   - A strong visual that positions Sheepie's products as a coordinated sleep system.

3. **Featured product stories**
   - CerviCloud Pillow.
   - LumiCloud Eye Mask.
   - CalmiCloud Earplugs.
   - Each story contains imagery, benefit-led headline, short description, current price, and direct Shopee/Tokopedia actions.

4. **Marketplace and assistance hub**
   - Official website.
   - Official Shopee store.
   - Official Tokopedia store.
   - WhatsApp assistance.

5. **Trust section**
   - Existing Sheepie reviews, proof, or trust content suitable for the compact page.

6. **Final conversion section**
   - Repeated buying actions for visitors who reach the bottom.

### 4.3 Content and Localization

- Indonesian is the primary language because the target social and marketplace traffic is Indonesian.
- Content is defined in a focused, typed code configuration rather than a CMS or dashboard editor.
- Existing product data remains the source of truth for product names, prices, images, and marketplace URLs where practical.
- Each rendered section and CTA receives a stable analytics identifier independent of its visible label.

### 4.4 Performance and Accessibility

- Use optimized existing images and responsive image sizes.
- Avoid autoplay video and large animation dependencies beyond those already used by the site.
- Keep important content and links functional without client-side analytics.
- Provide semantic headings, descriptive image alternatives, keyboard access, visible focus, adequate contrast, and reduced-motion behavior.
- Validate the layout on common mobile sizes and in embedded social browsers.

## 5. Hybrid Analytics Architecture

### 5.1 Umami Responsibilities

Umami remains responsible for aggregate traffic information:

- Page views, unique visitors, and sessions.
- Referrers and UTM campaign dimensions.
- Country and region.
- Device category, browser, and operating system.
- Traffic and session trends.

The dashboard will query Umami through server-only credentials. A missing or unavailable Umami response must not prevent Supabase analytics from rendering.

### 5.2 Supabase Responsibilities

Supabase stores Sheepie-specific behavioral events:

- Bio page loaded.
- Section viewed.
- Scroll milestones reached.
- Product card viewed.
- Product CTA clicked.
- Marketplace CTA clicked.
- Website, WhatsApp, Instagram, TikTok, and share action clicked.

Each accepted event can include:

- Event name, schema version, event time, and sequence number.
- Anonymous visitor ID and session ID.
- Stable section ID, product slug, CTA ID, CTA position, destination category, and marketplace.
- Landing path, referrer category, and approved UTM values.
- Elapsed time since page load.
- New or returning visitor flag.
- Screen category, preferred language, and timezone.

Arbitrary client properties are not stored. The event ingestion service maps a small, versioned input schema into approved database fields.

### 5.3 Identity and Session Model

- Generate a random anonymous visitor identifier in the browser and persist it for returning-visitor analysis.
- Generate a new random session identifier after the configured inactivity boundary.
- Do not derive identity from IP address, fingerprinting, email, phone number, marketplace account, or advertising identifiers.
- Do not store raw IP addresses.
- Treat visitor and session counts from the custom store as behavioral aids; Umami remains the primary source for aggregate visitor reporting.

### 5.4 Event Ingestion

The main website exposes a same-origin server endpoint for custom events. The endpoint:

- Accepts only known event names and property values.
- Enforces payload size and field length limits.
- Normalizes timestamps and server-controlled fields.
- Applies rate limiting and basic automated-traffic filtering.
- Deduplicates retried events using a client event identifier.
- Writes through server-only Supabase credentials.
- Returns quickly and never participates in outbound navigation.

Client tracking uses non-blocking delivery. Outbound actions navigate immediately even if tracking fails.

### 5.5 Storage and Query Model

- A raw event table stores validated custom events.
- Unique constraints support idempotent retries.
- Indexes cover event time, event name, visitor, session, product, marketplace, source, and campaign filters.
- SQL views or RPC functions provide aggregate time series, product performance, marketplace splits, funnel stages, source breakdowns, heatmaps, and common journey sequences.
- Dashboard code does not download the full raw event set to calculate top-level metrics.

Raw custom events are retained for 13 months. Daily aggregates may remain longer for historical comparison. Retention is implemented as configurable database maintenance rather than destructive logic in the dashboard.

## 6. Bio Analytics Dashboard

### 6.1 Location and Access

- Add a protected `/bio-analytics` route to the existing `dashboard-sheepie` app.
- Add the route to the existing dashboard sidebar.
- Reuse current dashboard authentication and Supabase server-client patterns.
- No public or anonymous access is permitted to analytics queries.

### 6.2 Global Filters

- Date presets: today, 7 days, 30 days, and 90 days.
- Custom start and end date.
- Product.
- Marketplace or destination.
- Source and campaign.
- Device category.
- Country.
- New versus returning visitor.
- All time interpretation and bucketing uses Asia/Jakarta unless the view explicitly states otherwise.

### 6.3 Dashboard Sections

1. **Summary KPIs**
   - Visitors.
   - Sessions.
   - Engaged sessions.
   - Outbound clicks.
   - Outbound click-through rate.
   - Average engagement time.
   - Returning visitor share.

2. **Traffic trend**
   - Visitors, sessions, and outbound clicks over time.

3. **Acquisition**
   - Instagram, TikTok, direct, referral, and UTM campaign breakdowns.

4. **Product performance**
   - Product views, outbound clicks, CTR, marketplace split, and CTA-position performance.

5. **Marketplace comparison**
   - Shopee versus Tokopedia clicks and CTR.

6. **Behavior funnel**
   - Bio visit to engaged visit to product view to outbound click.

7. **Section and scroll engagement**
   - Section reach and configured scroll-depth milestones.

8. **Audience technology and location**
   - Device, browser, operating system, country, and region.

9. **Time heatmap**
   - Hour of day by day of week in Asia/Jakarta.

10. **Visitor journeys**
    - Common ordered event paths such as Instagram landing to CerviCloud view to Shopee click.

11. **Detailed event stream**
    - Paginated anonymous events for debugging and granular analysis.

12. **CSV export**
    - Export the currently filtered custom event set with safe, approved fields.

### 6.4 Metric Definitions

- **Outbound click:** a click leading away from the bio page to a product, marketplace, website, WhatsApp, or social destination.
- **Engaged session:** a session that reaches a configured engagement threshold through time, depth, product view, or interaction.
- **Outbound CTR:** sessions with at least one outbound click divided by eligible bio sessions for the same filter set.
- **Product CTR:** sessions clicking a product destination divided by sessions that viewed that product section.
- **Returning visitor:** an anonymous visitor identifier observed before the current reporting session.

The interface must expose definitions through concise help text so the dashboard does not imply that outbound clicks are purchases.

## 7. Failure Handling

- Public links remain usable if JavaScript, Umami, the event endpoint, or Supabase is unavailable.
- Client tracking failures are quiet and do not show visitor-facing errors.
- Invalid, malformed, duplicate, oversized, automated, or rate-limited events are rejected safely.
- The dashboard displays a scoped data-source status when Umami or Supabase is unavailable and continues to show data from the healthy source.
- Empty states distinguish no traffic from a data-source error.
- Export errors do not discard the active dashboard filters.

## 8. Security and Privacy

- Keep Umami API credentials and Supabase service credentials server-only.
- Use existing authenticated dashboard access for reporting.
- Validate all event input on the server and avoid dynamic table or column selection from client input.
- Store no raw IP address or direct personal identifier.
- Limit referrer and URL storage to approved, normalized fields to avoid accidental sensitive query-string capture.
- Provide a retention mechanism for raw events.
- Document the anonymous analytics behavior in the site's privacy disclosure as part of deployment readiness.

## 9. Verification Strategy

### Public app

- Unit tests for event construction, session boundaries, UTM normalization, and destination classification.
- Endpoint tests for valid, invalid, duplicate, oversized, and rate-limited events.
- Component tests for stable tracking IDs and correct destination URLs.
- Responsive and accessibility verification for the public page.
- Manual verification in Instagram/TikTok-like mobile viewports.
- Production build and lint/type checks.

### Dashboard app

- Query and metric tests for KPIs, funnels, CTR, time bucketing, filters, journeys, and empty states.
- Component tests for filters, source-status behavior, pagination, and CSV export.
- Authorization verification for the new route and server data functions.
- Performance verification against a realistic event volume.
- Production build, lint, type checks, and existing test suite.

### Cross-application acceptance flow

1. Open `/bio` with Instagram-style UTM parameters.
2. View multiple product sections and cross configured scroll milestones.
3. Click one product's Shopee CTA.
4. Confirm navigation is immediate.
5. Confirm the validated events appear in Supabase once, in the correct order and session.
6. Confirm the dashboard includes the activity under the correct source, campaign, product, marketplace, CTA position, device class, and Jakarta-time bucket.
7. Confirm Umami traffic information renders alongside the custom behavior data without double-counting custom events as purchases.

## 10. Deployment and Configuration

The implementation will define and document environment variables for:

- Existing Umami public website tracking.
- Server-only Umami reporting access in the dashboard.
- Main-site Supabase event ingestion.
- Dashboard Supabase reporting access.
- Configurable session and retention boundaries where needed.

Database migrations will live with the dashboard's existing Supabase migrations because that application already owns the shared operational schema. The public page and event endpoint will live in the main Sheepie app. Dashboard analytics UI, aggregation access, and export will live in `dashboard-sheepie`.

## 11. Success Criteria

- The public page is recognizably Sheepie and follows the approved curated conversion-catalog structure.
- All three core products and their current marketplace destinations are represented correctly.
- Outbound actions work independently of analytics availability.
- Umami reports aggregate traffic and Supabase reports detailed approved behavior.
- The protected dashboard can explain acquisition, engagement, product interest, marketplace preference, and the path to outbound click using the agreed filters.
- The system never labels an outbound click as a purchase or revenue event.
- Both applications pass their proportionate automated and production-build checks.
