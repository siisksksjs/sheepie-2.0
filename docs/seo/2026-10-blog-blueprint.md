# Blueprint SEO Blog Sheepie: Oktober 2026 – Januari 2027

Data: DataForSEO, Google Indonesia, bahasa Indonesia, SERP versi mobile, diambil 14 Okt 2026. Ada 564 keyword dan 60 SERP. Data mentah tersimpan di `scripts/seo/out/` dan bisa diambil ulang dengan `scripts/seo/research.mjs`.
Metode: skill keyword-research (seed → expand → cluster → prioritas → peta konten) dan skill seo-content (brief per artikel).

---

## 1. Ringkasan

**Situasi:** sheepie.id adalah domain baru dengan blog yang masih kosong. Kita menjual 3 produk tidur di Shopee dan Tokopedia. Tujuan blog adalah membawa orang yang sedang mencari solusi tidur ke halaman produk, lalu ke marketplace.

**Temuan utama dari data:**

1. **Topik kesehatan bervolume besar tidak bisa kita menangkan, dan memang tidak cocok untuk kita.** Contohnya "insomnia" (33.100/bln), "cara cepat tidur" (18.100), dan "cara tidur nyenyak" (2.400). Top 10 untuk topik ini diisi Alodokter, Halodoc, Siloam, dan puskesmas. Google memperlakukannya sebagai topik kesehatan (YMYL), dan kita juga tidak boleh membuat klaim medis.
2. **Brand kasur dan rumah tangga bisa masuk top 5 untuk topik "bantal" dan "posisi tidur".** Buktinya:
   - Elite Spring Bed ada di #1–2 untuk "posisi tidur yang benar" dan "posisi tidur miring yang benar".
   - Informa, Azko, Yuureco, IKEA, Curble, dan Toko Inoac masuk top 5 untuk "bantal ergonomis", "bantal memory foam adalah", dan "bantal tidur yang bagus".

   Artinya kita bisa bersaing di sini. Topik ini juga paling dekat dengan CerviCloud, produk utama kita.
3. **"sleep mask" (6.600/bln) bukan pasar kita.** SERP-nya 100% skincare (sleeping mask wajah). Untuk LumiCloud, gunakan **"penutup mata tidur"**: 1.900 + 1.300 ("untuk tidur") + 590 ("saat tidur") per bulan.
4. **SERP earplug didominasi marketplace,** ditambah satu listicle my-best dan artikel "amankah?" dari Halodoc dan HelloSehat. Celah kita adalah konten edukasi yang jujur: jenis earplug, keamanan, dan cara pakai yang benar.
5. **Kado punya momen yang jelas.** "kado/hadiah untuk orang tua" (sekitar 2.000/bln dari 6 varian) jatuh tepat sebelum **Hari Ibu (22 Des)** dan Natal. SERP-nya listicle editorial dari Traveloka dan FlowerAdvisor, yang realistis untuk kita kalahkan.

**Catatan soal KD:** hampir semua skor KD bernilai 0 karena data kesulitan DataForSEO untuk Indonesia tipis. Karena itu peluang dinilai dari siapa yang ranking di SERP, bukan dari skor KD.

---

## 2. Pillar dan cluster

| Pillar | Cluster dan volume (/bln) | Produk | Prioritas |
|---|---|---|---|
| **A. Posisi tidur dan bantal** | posisi tidur yang benar 2.400 · cara tidur yang benar 880 · bantal memory foam 1.000 (+390 varian) · bantal kesehatan 590 · bantal ergonomis 320 · posisi tidur miring yang benar 320 · leher sakit setelah bangun tidur 320 · bantal untuk sakit leher 210 · bantal tidur yang bagus 170 · bantal leher* 8.100 | CerviCloud | **P1** |
| **B. Gelap dan cahaya** | penutup mata tidur 1.900 · penutup mata untuk tidur 1.300 · penutup mata saat tidur 590 · tidur dengan lampu menyala 390 (+320 +210) · tidur siang 2.400 · jam tidur siang yang baik 1.000 | LumiCloud | **P1** |
| **C. Sunyi dan bising** | penutup telinga untuk tidur 880 · penutup telinga tidur 260 · suara white noise 260 · earplug untuk tidur 210 · penutup kuping / penyumbat telinga 170 + 170 · earplug tidur 110 | CalmiCloud | **P1** |
| **D. Kebiasaan tidur (hub)** | sleep hygiene 2.900 · sleep hygiene adalah 720 · kualitas tidur 390 · cara meningkatkan kualitas tidur 320 · perlengkapan tidur 170 | Ketiganya | **P2** |
| **E. Kado dan momen** | kado untuk orang tua 720 · hadiah untuk orang tua 590 · kado buat orang tua / ibu / perempuan 210 masing-masing · hadiah untuk lansia 110 · bantal traveling 320 | Bundle | **P1 musiman** |

\* "bantal leher" bercampur intent: sebagian besar mencari bantal U untuk perjalanan (Miniso, mobil). Kita tidak mengejar keyword ini secara langsung. Yang kita tangkap adalah orang yang bingung ("bantal buat leher namanya apa?" muncul di PAA) lewat artikel perbandingan.

### Yang sengaja tidak dikejar

| Keyword | Alasan |
|---|---|
| insomnia, cara cepat tidur, cara menyembuhkan insomnia | YMYL, top 10 seluruhnya situs medis, dan berisiko klaim kesehatan |
| sleep mask, sleeping mask | intent-nya skincare |
| bantal leher miniso, bantal kacang hijau, bantal leher mobil | navigasi ke brand lain, produk bayi, atau produk mobil |
| cara tidur tidak ngorok | intent-nya medis. Sudut pandang "pasangan ngorok, kamu tetap bisa tidur" bisa dipakai nanti di dalam artikel C |

---

## 3. Kalender 12 minggu

Ritme publikasi:
- Minggu 1–6: 2 artikel per minggu, untuk membangun dasar topical authority.
- Minggu 7–12: 1 artikel per minggu, ditambah refresh artikel lama berdasarkan data Google Search Console.

Total 18 artikel.

| Mgg | Tanggal terbit | # | Judul (draf) | Keyword utama · pendukung | Intent · tipe · panjang | Link ke |
|---|---|---|---|---|---|---|
| 1 | Sen 19 Okt | 1 | **Posisi Tidur yang Benar: Telentang, Miring, atau Tengkurap? (Plus Bantal yang Cocok untuk Tiap Posisi)** · *pillar A* | posisi tidur yang benar · cara tidur yang benar, posisi tidur miring yang benar, tidur miring yang benar, posisi tidur terlentang yang benar | info → panduan · Comprehensive (2.200–2.800) | CerviCloud |
| 1 | Kam 22 Okt | 2 | Cara Memilih Bantal Tidur yang Bagus: Tinggi, Bahan, dan Posisi Tidurmu | bantal tidur yang bagus · bantal yang bagus, bantal kesehatan, bantal ergonomis, bantal yang bagus untuk kesehatan | komersial → panduan beli · Standard | CerviCloud, #1 |
| 2 | Sen 26 Okt | 3 | Bantal Leher vs Bantal Cervical: Apa Bedanya dan Mana yang Kamu Butuhkan? | bantal leher · bantal penyangga leher, bantal leher kesehatan, bantal leher yang bagus | komersial → perbandingan · Standard | CerviCloud, #2 |
| 2 | Kam 29 Okt | 4 | Bantal Memory Foam: Kelebihan, Kekurangan, dan Cara Merawatnya | bantal memory foam · memory foam bantal, bantal memory foam adalah, bantal memory foam terbaik | info/komersial · Standard | CerviCloud, #2 |
| 3 | Sen 2 Nov | 5 | **Penutup Mata Tidur: Perlu Nggak? Manfaat dan Cara Memilihnya** · *pillar B* | penutup mata tidur · penutup mata untuk tidur, penutup mata saat tidur | komersial → panduan · Standard–Comprehensive | LumiCloud |
| 3 | Kam 5 Nov | 6 | Tidur dengan Lampu Menyala: Kenapa Kamar Gelap Lebih Baik (dan Solusinya Kalau Pasangan Butuh Lampu) | tidur dengan lampu menyala · tidur lampu menyala, manfaat tidur lampu menyala | info · Standard | LumiCloud, #5 |
| 4 | Sen 9 Nov | 7 | **Penutup Telinga untuk Tidur: Busa, Silikon, atau Lilin? Panduan Memilih** · *pillar C* | penutup telinga untuk tidur · penutup telinga tidur, penutup kuping untuk tidur, penyumbat telinga untuk tidur, earplug silikon | komersial → panduan · Standard–Comprehensive | CalmiCloud |
| 4 | Kam 12 Nov | 8 | Tidur Pakai Earplug Setiap Malam, Aman Nggak? | earplug tidur · earplug untuk tidur, apakah aman memakai penutup telinga (PAA) | info · Compact–Standard | CalmiCloud, #7, guide CalmiCloud |
| 5 | Sen 16 Nov | 9 | **Ide Kado untuk Orang Tua yang Benar-benar Dipakai: Hadiah untuk Tidur Lebih Nyenyak** · *musiman, Hari Ibu dan Natal* | kado untuk orang tua · hadiah untuk orang tua, kado buat orang tua, kado untuk ibu, hadiah untuk lansia | komersial → listicle · Standard | Bundle, ketiga produk |
| 5 | Kam 19 Nov | 10 | Leher Kaku Saat Bangun Tidur? Cek Dulu Bantalmu | leher sakit setelah bangun tidur · bantal untuk sakit leher | info · Standard · **tanpa klaim medis, ada bagian "kapan ke dokter"** | CerviCloud, #1, #2 |
| 6 | Sen 23 Nov | 11 | **Sleep Hygiene: 10 Kebiasaan Sederhana untuk Tidur Lebih Berkualitas** · *hub D* | sleep hygiene · sleep hygiene adalah, cara meningkatkan kualitas tidur, kualitas tidur | info → panduan · Comprehensive | Ketiga produk, semua pillar |
| 6 | Kam 26 Nov | 12 | Tidur Siang yang Efektif: Berapa Lama dan Jam Berapa? | tidur siang · jam tidur siang yang baik, cara agar bisa tidur siang, tidur siang bikin gemuk (PAA) | info · Standard | LumiCloud, CalmiCloud |
| 7 | Sen 30 Nov | 13 | Tidur Pakai Bantal atau Tanpa Bantal, Mana yang Lebih Baik? | lebih bagus tidur pakai bantal atau tidak · tidur bagus pakai bantal atau tidak | info · Compact | CerviCloud, #1 |
| 8 | Sen 7 Des | 14 | Tidur Nyenyak Selama Perjalanan Libur Akhir Tahun: Bawa Apa Saja? | bantal traveling · bantal leher travel | komersial · Compact–Standard | LumiCloud, CalmiCloud, #3 |
| 9 | Sen 14 Des | 15 | Kenapa Bantal Hotel Terasa Nyaman? Rahasianya dan Cara Dapat Rasa yang Sama di Rumah | merk bantal hotel yang bagus · bantal hotel | komersial · Standard | CerviCloud, #4 |
| 10 | Sen 21 Des | 16 | White Noise atau Earplug? Cara Tidur di Kamar yang Bising | white noise untuk tidur · suara white noise, apakah suara AC/kipas termasuk white noise (PAA) | info · Standard | CalmiCloud, #7 |
| 11 | Sen 28 Des | 17 | Perlengkapan Tidur yang Bikin Kamar Lebih Nyaman: Checklist Lengkap | perlengkapan tidur | komersial → checklist · Standard | Ketiga produk, #11 |
| 12 | Sen 4 Jan | 18 | Resolusi 2027: Tidur Lebih Baik dalam 7 Malam | (hipotesis musiman, belum ada data volume) · kualitas tidur | info · Compact | #11, ketiga produk |

**Refresh (minggu 7–12):**
- **Minggu 7:** perbarui artikel #9 (kado) dengan foto bundle terbaru dan promo 12.12. Ini sebelum puncak pencarian Hari Ibu.
- **Minggu 10:** buka Google Search Console. Untuk artikel yang masuk posisi 8–20, tambahkan bagian yang menjawab query yang ternyata muncul.

### Link internal (wajib)
- Setiap artikel pendukung menautkan ke pillar-nya. Setiap pillar menautkan ke semua artikel pendukungnya dan ke 1 PDP.
- **Satu CTA produk per artikel**, dengan bentuk kartu produk di akhir artikel yang sudah ada di template blog. Ditambah maksimal 1 link teks di tengah artikel ketika produk memang relevan. Jangan gunakan banner jualan.
- Artikel #11 (sleep hygiene) menjadi hub yang menautkan ke ketiga pillar.

---

## 4. Brief artikel pertama (#1)

- **Keyword utama:** posisi tidur yang benar (2.400/bln). Pendukung: cara tidur yang benar (880), posisi tidur miring yang benar (320), tidur miring yang benar (210), posisi tidur terlentang yang benar (140), gaya tidur yang benar (90).
- **Intent:** informasional. Pembaca ingin tahu posisi tidur mana yang terbaik untuk dirinya.
- **SERP saat ini:**
  - #1 video YouTube tvOne
  - #2 dan #5 Elite Spring Bed
  - Enesis, Insan Medika, Melinda Hospital
  - Ada AI Overview dan PAA.
- **Celah:** tidak ada yang menghubungkan posisi tidur dengan **tinggi bantal yang dibutuhkan**. Itu sudut pandang unik kita.
- **PAA yang harus dijawab:**
  - Tidur paling bagus posisi apa?
  - Apa akibat tidur terlentang?
  - Posisi tidur yang baik sebaiknya miring ke mana?
  - Apakah tidur tanpa bantal lebih baik?
- **Outline:**
  1. Jawaban singkat di paragraf pertama, untuk snippet.
  2. Tabel 3 posisi tidur: telentang, miring, tengkurap. Kolom: cocok untuk siapa, yang perlu diperhatikan, bantal yang pas.
  3. Telentang: tinggi bantal yang pas.
  4. Miring: kiri atau kanan? Menjaga jarak bahu ke telinga.
  5. Tengkurap: kenapa paling berat untuk leher.
  6. Cara cek posisi leher di cermin, sebagai langkah praktis.
  7. Bagaimana kalau kamu berganti-ganti posisi semalaman? Di sini kita perkenalkan bentuk butterfly CerviCloud.
  8. FAQ dari PAA.
  9. Penutup dan kartu CerviCloud.
- **Panjang:** sekitar 2.400 kata. **CTA:** CerviCloud (Tokopedia).
- **Batasan:** tidak ada klaim medis ("menyembuhkan", "terapi"), dan tidak ada angka kesehatan tanpa sumber.

---

## 5. Sistem hero image ("Mendung Editorial")

Gayanya mengambil semangat seri ilustrasi Manta, tapi dengan identitas Sheepie. Aturannya berlaku untuk semua artikel supaya halaman Blog terlihat seperti satu seri:

- **Gaya:** ilustrasi editorial flat, bentuk sederhana, tanpa gradien yang norak, tanpa teks.
- **Palet tetap:**
  - navy #22336a (malam, bayangan)
  - biru muda #a3c1e0
  - krem #fbf8f1
  - peach hanya untuk 1 aksen kecil
- **Motif tetap:** garis awan Mega Mendung sebagai visual untuk "cahaya", "suara", atau "udara", menggantikan garis zigzag di gaya Manta.
- **Subjek:** satu orang Indonesia di kamar Indonesia, misalnya jendela dengan lampu kota, AC, kipas, atau kamar kos. Produk muncul secara halus.
- **Format:** 4:3, minimal 1600×1200, berupa WebP di `public/images/blog/`.

**Template prompt** (untuk Gemini atau ChatGPT; ganti bagian [ADEGAN]):

> Flat editorial illustration, calm and premium, limited palette: deep navy #22336a, soft sky blue #a3c1e0, warm cream #fbf8f1, one tiny soft-peach accent. Indonesian Mega Mendung batik cloud lines used as the visual for light/sound/air, flowing softly. [ADEGAN]. Simple geometric shapes, gentle grain texture, no gradients, no text, no logos, 4:3, lots of negative space.

**Adegan per pillar:**

| # | Adegan |
|---|---|
| 1 | A woman sleeping on her side on a light-blue butterfly-shaped pillow at night; Mendung cloud lines flow along her neck and shoulder, showing support. |
| 5 | A man asleep wearing a light-blue eye mask while a bedside lamp is still on; the lamp's light is drawn as Mendung clouds that stop softly at the mask. |
| 7 | A woman sleeping peacefully while noise from a window (motorbikes, AC) is drawn as Mendung cloud lines that soften into calm curls before reaching her ear. |
| 9 | An Indonesian grandmother and a grown daughter unwrapping a cream gift box with a light-blue pillow inside, a Mendung pattern on the wrapping. |
| 11 | A calm bedroom at night seen from above: bed, phone set aside, glass of water; Mendung clouds drift across the dark-navy ceiling. |

---

## 6. Prasyarat teknis sebelum artikel #1 terbit

Template blog yang ada baru mendukung blok `p / h2 / h3 / ul`. Supaya artikel bisa bersaing, perlu ditambah:
1. **Blok tabel**, untuk perbandingan dan target featured snippet.
2. **Blok FAQ** dengan **FAQPage JSON-LD**.
3. **Article JSON-LD**: author, datePublished, dateModified, gambar.
4. **dateModified** yang tampil di artikel, karena refresh perlu terlihat.

Semuanya kerja kecil, sekitar 1 sesi.

## 7. Pengukuran

- Daftarkan sheepie.id di **Google Search Console** dan submit sitemap.
- **KPI di bulan ke-3:**
  - 18 artikel ter-index
  - 5 artikel masuk top 20 untuk keyword utamanya
  - klik dari blog ke PDP terlihat di Umami
  - InitiateCheckout dengan placement artikel terlihat di Meta
- **Ulang research setiap kuartal** dengan `node --env-file=.env.local scripts/seo/research.mjs` (biaya sekitar US$0,5).
