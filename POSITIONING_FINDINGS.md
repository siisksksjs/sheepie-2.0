# Sheepie Positioning Findings

Date: 2026-03-25

## Purpose

Internal note for future homepage, PDP, and copy decisions.

This document summarizes:
- competitor angle research
- supplier/product-truth context
- what Sheepie can safely claim
- what Sheepie should stop claiming
- homepage and product-page direction

## Source Competitors

- CerviCloud competitor: https://derila-ergo.com/?l=en
- LumiCloud competitor: https://mantasleep.com/
- CalmiCloud competitor: https://www.loopearplugs.com/

## Supplier Baseline From 1688

### CerviCloud

Source page:
- https://detail.1688.com/offer/743087456652.html

Observed supplier baseline:
- dual-direction cervical pillow
- memory foam
- butterfly-shaped contour
- approx. 64 x 35 x 12 cm
- approx. 1300 g
- cover variants include ice-silk / graphene / patterned fabric

Business truth from user:
- Sheepie is selling the same underlying product from supplier
- no material or construction differentiation vs supplier baseline
- best-fit audience:
  - side sleepers
  - back sleepers
  - combination sleepers
  - people with morning neck stiffness
  - office workers with neck tension
- safe promises:
  - helps reduce morning neck discomfort
  - supports neck alignment during sleep
  - feels more supportive than regular pillows

### LumiCloud

Source page:
- https://detail.1688.com/offer/922003983689.html

Observed supplier baseline:
- cotton sleep mask
- blackout positioning
- lightweight, approx. 44 g
- wrap-style construction
- positioned as breathable and not tight on ears

Business truth from user:
- same underlying supplier product
- full blackout for most users
- does not press eyelids
- suitable for:
  - nightly sleep
  - naps
  - travel
- real differentiators vs bulky premium masks:
  - lighter
  - softer wrap feel
  - easier to pack
  - simpler fit
  - lower price / better value
- hair-safe angle:
  - quiet velcro
  - does not snag hair
  - no painful tight strap around ear/head

### CalmiCloud

Source page:
- https://detail.1688.com/offer/888421525219.html

Observed supplier baseline:
- silicone sleep earplugs
- 3 pairs + case
- reusable-style commodity product
- positioned for sleep / dorm / travel / noise reduction

Business truth from user:
- same underlying supplier product
- okay for side sleepers
- does not wrap hair
- helps reduce ambient noise
- helps with snoring / AC / traffic
- helps create a quieter sleep environment
- do not claim decibel reduction
- avoid total isolation / total silence language

## Current Product Roles

- CerviCloud: main push / hero SKU
- LumiCloud: main push / secondary hero
- CalmiCloud: lighter push / add-on product

## Current Price Ladder

Based on current app data:
- CerviCloud: IDR 880.000
- LumiCloud: IDR 198.000
- CalmiCloud: IDR 80.000

Source:
- `sheepie/data/products.json`

Implication:
- CerviCloud should carry the strongest pain-first sales message
- LumiCloud should feel like an easy, practical upgrade
- CalmiCloud should work mainly as an add-on and bundle booster

## Core Strategic Conclusion

Sheepie should borrow competitor angle and conversion structure, but not copy unsupported features or invented technical stories.

Best framing:
- use their market logic
- keep only product claims Sheepie can actually support
- maintain Sheepie’s premium tone, but make the top of page much more concrete and conversion-led

Do not position Sheepie like it engineered a proprietary sleep technology platform if the products are standard supplier products with branding and curation.

Better positioning:
- Sheepie is a curated sleep-problem brand
- each product solves one specific obstacle to sleep
- the site should feel premium, but still sell directly

## Competitor Angle Map

### CerviCloud <- Derila

What Derila sells well:
- morning neck pain relief
- ordinary pillow vs ergonomic pillow contrast
- neck alignment support
- fit by sleep position
- repeated CTA and objection handling

What Sheepie should borrow:
- pain-first framing
- "bangun leher pegal" angle
- comparison against regular pillows
- fit guidance for side / back / combo sleepers
- mention adjustment period

What Sheepie should avoid copying:
- medical or exaggerated recovery claims
- pseudo-scientific certainty
- claims that imply treatment or cure
- proprietary engineering narrative unless real

Recommended Sheepie positioning:
- Bantal cervical memory foam untuk bantu menopang leher lebih stabil saat tidur
- Cocok untuk side sleeper, back sleeper, dan yang sering bangun dengan leher kaku
- Terasa lebih supportive dibanding bantal biasa yang terlalu tinggi atau terlalu kempes

### LumiCloud <- Manta Sleep

What Manta sells well:
- blackout first
- comfort for all-night wear
- no eye pressure
- clear use cases
- practical comparisons
- guarantee / proof / bundles

What Sheepie should borrow:
- blackout as primary promise
- no eyelid pressure
- use-case based selling: sleep, nap, travel
- comfort + portability + fit
- comparison vs generic cloth eye masks

What Sheepie should avoid copying:
- oversized premium-performance claims if not substantiated
- guarantee structure you do not actually offer
- superlative claims like "best in the world"

Recommended Sheepie positioning:
- Masker tidur blackout yang ringan, lembut, dan nyaman dipakai semalaman
- Tidak menekan mata dan aman untuk rambut
- Praktis untuk tidur malam, nap, dan travel
- Simpler fit and better value than bulky premium alternatives

### CalmiCloud <- Loop Dream

What Loop sells well:
- use-case framing
- sleep-specific noise problems
- comparison vs foam plugs
- comfort and fit objections
- shopping by situation

What Sheepie should borrow:
- noise-problem framing: snoring, AC, traffic
- reusable convenience
- side-sleeper comfort angle
- comparison against generic foam earplugs
- FAQ around comfort and use

What Sheepie should avoid copying:
- exact dB reduction numbers
- hearing-alarm certainty unless tested
- total soundproofing language

Recommended Sheepie positioning:
- Earplug silikon lembut yang membantu mengurangi gangguan suara saat tidur
- Cocok untuk dengkuran, AC, dan suara jalan
- Nyaman dipakai semalaman, termasuk untuk banyak side sleeper
- Reusable dan lebih nyaman dibanding foam earplug biasa

## What Sheepie Can Safely Claim

### CerviCloud

- helps reduce morning neck discomfort
- supports neck alignment during sleep
- more supportive feel than regular pillows
- suitable for side sleepers, back sleepers, and combination sleepers
- may need adjustment period if switching from regular pillows

### LumiCloud

- full blackout for most users
- does not press on eyelids
- suitable for nightly sleep, naps, and travel
- lighter and softer feel
- easier to pack
- simpler fit
- lower price / better value angle is valid
- hair-friendly closure / quiet velcro

### CalmiCloud

- helps reduce ambient noise
- helps with snoring / AC / traffic
- helps create a quieter sleep environment
- reusable
- okay for side sleepers

## Claims To Avoid Or Tone Down

These are risky because they overstate product uniqueness, imply testing that may not exist, or conflict with the user’s own source-of-truth.

### Brand / engineering overstatement

Current copy suggests deep in-house product engineering:
- `sheepie/messages/id.json`
- `sheepie/messages/en.json`

Example themes to tone down:
- "kami menghabiskan berbulan-bulan terobsesi ..."
- "every curve is intentional"
- anything implying proprietary R&D unless true

### CerviCloud risky claims

Avoid or soften:
- "opens airways"
- treatment-like claims
- overly technical proprietary naming if not real

Examples present now:
- `sheepie/messages/id.json`
- `sheepie/messages/en.json`
- `sheepie/data/products.json`

### LumiCloud risky claims

Mostly safe if "full blackout for most users" is kept with human phrasing.

Avoid:
- exaggerated technical mystique
- overclaiming scientific signaling to the brain

### CalmiCloud risky claims

Avoid:
- exact `28dB` reduction unless validated
- guaranteed alarm audibility
- "medical-grade" unless you can stand behind it
- swimming / waterproof angles unless intentionally supported

Examples present now:
- `sheepie/messages/id.json`
- `sheepie/messages/en.json`
- `sheepie/data/faqs.json`
- `sheepie/data/products.json`

### Internal consistency problems to fix

There are also inconsistencies in current content:
- CerviCloud cover is described as Ice-Silk in some places
- elsewhere it is described as bamboo

This should be unified before scaling content.

Relevant files:
- `sheepie/data/products.json`
- `sheepie/messages/id.json`

## Homepage Direction

Current issue:
- site leans too far into editorial/luxury mood
- not enough direct sales clarity for cold traffic

Recommended structure:

1. Hero focused on CerviCloud
- say what it is
- say who it is for
- say what problem it solves
- add direct CTA to marketplace/product

2. Trust / purchase reassurance bar above the fold
- fast shipping Indonesia
- available on Shopee and Tokopedia
- local support
- secure checkout through marketplace

3. Shop by problem section
- Bangun leher pegal -> CerviCloud
- Tidur keganggu cahaya -> LumiCloud
- Tidur keganggu suara -> CalmiCloud

4. LumiCloud block as secondary hero
- blackout
- comfort
- no eye pressure
- travel / nap / night sleep

5. CalmiCloud block as add-on / bundle
- noise reduction helper
- compare vs foam
- ideal as sleep kit add-on

6. Bundle block
- Sleep Better Set: CerviCloud + LumiCloud
- Full Sleep Kit: CerviCloud + LumiCloud + CalmiCloud
- use free shipping threshold and bundle savings honestly

## PDP Direction

Each product page should be a mini sales page, not a short catalog entry.

Recommended structure for every PDP:

1. Problem-first headline
2. Short concrete subcopy
3. Benefit bar
4. Why ordinary alternatives fail
5. Why this product helps
6. Who it is for
7. Who it is not for
8. Usage scenarios
9. FAQ for objections
10. CTA + marketplace reassurance
11. Cross-sell or bundle section

### CerviCloud PDP emphasis

- bangun dengan leher kaku / pegal
- regular pillow comparison
- fit for side / back / combo sleepers
- adjustment-period FAQ
- why support matters

### LumiCloud PDP emphasis

- block light without pressing eyes
- soft enough for all-night wear
- hair-friendly closure
- easy for naps and travel
- compare vs generic flight mask

### CalmiCloud PDP emphasis

- reduce sleep-disrupting noise
- comfort for side sleeping
- reusable angle
- compare vs foam earplugs
- FAQ on fit, cleaning, and realistic expectations

## Offer Architecture

Known live/commercial direction from user:
- main push: CerviCloud + LumiCloud
- CalmiCloud should be lighter
- bundle is the preferred offer structure

Recommended bundle logic:
- CerviCloud + LumiCloud = best-value sleep upgrade
- CerviCloud + LumiCloud + CalmiCloud = full sleep kit
- CalmiCloud should mainly function as:
  - add-on
  - bundle sweetener
  - low-friction entry product

## Proof Strategy

Current proof is limited:
- only 1-2 marketplace reviews available
- user does not want dedicated per-product review walls yet

Recommended near-term approach:
- one shared proof strip across site
- overall marketplace trust
- screenshots only if they are real and legible
- emphasize marketplace availability and real shipping, not inflated review volume

## Measurement Recommendations

Any positioning change should be measured.

Track at minimum:
- hero CTA click-through rate
- clicks to Shopee / Tokopedia
- product page to CTA click rate
- bundle CTA click rate
- scroll depth on homepage and PDP
- mobile bounce rate

## Final Positioning Summary

The correct direction is:
- borrow competitor conversion mechanics
- keep Sheepie premium
- remove fake-unique language
- sell by pain point first
- focus homepage on CerviCloud and LumiCloud
- use CalmiCloud as support and bundle driver

The brand should move from:
- beautiful brand presentation

To:
- premium-looking problem-solving storefront
