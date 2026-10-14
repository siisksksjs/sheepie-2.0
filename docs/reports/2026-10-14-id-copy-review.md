# Bahasa Indonesia copy review (2026-10-14)

Four parallel reviewers went through every Indonesian string on the site. They changed only `id` text; English strings, keys, prices and facts are untouched.

| Area | Files | Changes | Flags |
|---|---|---|---|
| Site UI and FAQ | messages/id.json, pdp-copy.ts (copy.ts, cookie notice and 404 already fine) | 52 | 7 |
| Product catalog | lib/catalog/content.ts (products.json has no ID text) | 28 | 7 |
| Home, About, Contact, FAQ, Blog, earplug guide | home-copy.ts, pages-copy.ts, guide-copy.ts | 33 | 5 |
| /bio + Yoga Spin | data/bio.ts, app/bio/page.tsx, sheepie-x-yoga-spin/* | 12 | 7 |
| **Total** | | **125** | |

Also changed: `/` now always opens in Indonesian. Browser-language detection is off (`localeDetection: false` in middleware.ts), and EN appears only when the visitor picks it.

## Biggest problems found and fixed

1. **Mixed "Anda" and "kamu".** The FAQ and older UI text used "Anda". Everything now uses "kamu".
2. **Words with the wrong meaning:**
   - "menggelapkan" (About page) usually reads as *to embezzle*. It is now "menghalau cahaya".
   - "Sebaiknya cuci tangan" said *wash your hands*. The intended meaning is *hand-wash it*, so it is now "Sebaiknya dicuci dengan tangan".
   - "landai" means *sloping*, not *lower*.
   - "lengket" suggests *sticky/messy*. It is now "menempel".
3. **Earplug instructions.** Step 3 said to stick it "di lubang telinga" (in the ear hole). It now says "di atas lubang telinga", and "liang telinga" is used consistently for the ear canal ("Jangan didorong masuk ke liang telinga").
4. **Medical / overclaim wording removed:**
   - "Silikon kelas medis" (bio page) is now "Silikon lembut".
   - "gelap menyeluruh" (a total-blackout claim) is now "gelap yang nyaman".
   - "Pakar tidur" is now "tim kami".
   - "meredakan" is now "mengurangi".
5. **Translated-from-English structure:**
   - "Bersiaplah untuk esok…" is now "Sambut esok dengan lebih segar."
   - "tingkat pantulan" is now "daya lenting".
   - "Direkayasa", "presisi servikal", "menjembatani kesenjangan" and "Busa memori kepadatan tinggi lambat memantul" were all rewritten.
   - "Memory foam kembali ke bentuk" is now "…ke bentuk semula".
   - "Ringan untuk dibawa" is now "Ringan, mudah dibawa".
6. **English left in Indonesian lines:**
   - "side & back sleeper" is now "tidur telentang dan miring".
   - "Slow-rebound" is now "Mengembang perlahan".
   - "Polypropylene" is now "Polipropilena".
7. **Spelling (KBBI/EYD):**
   - pondasi → fondasi
   - Respon → Dibalas
   - 64cm → 64 cm
   - anti debu → antidebu
   - "Kode QR" word order fixed
   - English Title Case → sentence case
8. **Term consistency:**
   - "masker tidur" and "Sleep Mask" in Indonesian lines are now "masker mata".
   - "earplug", "case" and "memory foam" are now used the same way across files.

## Needs your decision (not changed)

1. **"masker mata" vs "penutup mata tidur".** "Masker mata" often means a skincare eye mask in Indonesia. Your Tokopedia listing uses "penutup mata tidur". Switching is a site-wide change.
2. **Yoga Spin page is mostly English.** Examples: "Let's Spin the Wheel", "Spin Now", "Rp10k Discount", "Better Luck Next Time". Suggested ID: "Putar Sekarang", "Potongan Rp10.000", "Belum beruntung", "Semoga harimu tetap selembut awan". Is the campaign still running?
3. **LumiCloud material conflict.** An FAQ answer says the mask contains memory foam, but the product copy says cotton. This conflict exists in both languages. Which is correct?
4. **"medical-grade" in the CalmiCloud Tokopedia URL.** This can only be fixed by renaming the listing on Tokopedia.
5. **Medical-adjacent claims still in place:**
   - "titik tekan" (pressure points)
   - "7–14 malam … posisi alami yang benar"
   - "Zona penopang tulang belakang"
   - the English FAQ still says "sleep experts"
6. **"Ruang mata 3D"** (bio page) may conflict with the claims rule against "3D eye cavities".
7. **Store labels.** Shopee says "toko resmi", Tokopedia says "toko". Confirm the official status of each store.
8. **Small naming choices:**
   - "butterfly" is kept in English everywhere.
   - "CalmiCloud Earplugs" is kept as the product name.
   - "Kegelapan" (bio eyebrow) could be "Gelap".
9. **Customer testimonials.** Typos like "recomended" and "disini" are left as written, because they match the review screenshots.
10. **Possibly unused copy in messages/id.json.** The Navbar, Footer, AboutPage, ContactPage and Products sections are not rendered by any page. They were fixed anyway.
