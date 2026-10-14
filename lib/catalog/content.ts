import type { ProductCopy, ProductSlug } from "./types";

const cervicloud: ProductCopy = {
  slug: "cervicloud",
  name: "CerviCloud Pillow",
  role: "hero",
  card: {
    image: "/images/photoshoot/DSC01110.JPG",
    hoverImage: "/images/edited/DSC01187.JPG",
    chip: { id: "Sarung ice-silk", en: "Ice-silk cover" },
    line: {
      id: "Bantal ergonomis berbentuk butterfly yang menopang leher, untuk tidur telentang dan miring.",
      en: "A butterfly-shaped ergonomic pillow that supports the neck, for side and back sleepers.",
    },
  },
  sub: {
    id: "Bantal ergonomis berbentuk butterfly yang menopang leher saat tidur telentang maupun miring, dengan sarung ice-silk yang terasa sejuk.",
    en: "A butterfly-shaped ergonomic pillow that supports your neck on your back and side, with an ice-silk cover that feels cool.",
  },
  gallery: [
    { src: "/images/products/cervicloud/gallery-01.webp", alt: { id: "CerviCloud, bantal ergonomis untuk leher", en: "CerviCloud, an ergonomic pillow for the neck" } },
    { src: "/images/products/cervicloud/gallery-02.webp", alt: { id: "Masalah tidur yang sering dialami", en: "Common sleep problems" } },
    { src: "/images/products/cervicloud/gallery-03.webp", alt: { id: "Tidur telentang di CerviCloud", en: "Sleeping on the back on CerviCloud" } },
    { src: "/images/products/cervicloud/gallery-04.webp", alt: { id: "CerviCloud dibandingkan bantal biasa", en: "CerviCloud compared with a regular pillow" } },
    { src: "/images/products/cervicloud/gallery-05.webp", alt: { id: "Lekukan CerviCloud yang menopang leher", en: "CerviCloud's neck-supporting contours" } },
    { src: "/images/products/cervicloud/gallery-06.webp", alt: { id: "Inti memory foam CerviCloud", en: "CerviCloud's memory foam core" } },
    { src: "/images/products/cervicloud/gallery-07.webp", alt: { id: "Empat zona CerviCloud", en: "CerviCloud's four zones" } },
    { src: "/images/products/cervicloud/gallery-08.webp", alt: { id: "Sarung ice-silk CerviCloud", en: "CerviCloud's ice-silk cover" } },
    { src: "/images/products/cervicloud/gallery-09.webp", alt: { id: "Ulasan pelanggan CerviCloud", en: "CerviCloud customer reviews" } },
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
          id: "Lepas sarungnya, lalu cuci dengan air dingin. Inti memory foam jangan dicuci, cukup diangin-anginkan.",
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
      id: "Bentuk butterfly-nya dirancang untuk dua posisi tidur sekaligus, plus ruang untuk lengan.",
      en: "The butterfly shape is made for two sleeping positions at once, plus room for your arm.",
    },
    image: "/images/products/cervicloud/anatomy-cutout.webp",
    cutout: true,
    points: [
      {
        x: 55,
        y: 56,
        title: { id: "Zona penopang tulang belakang", en: "Spine support zone" },
        body: { id: "Bagian tengah membantu leher dan punggung atas tetap lurus.", en: "The centre helps keep your neck and upper back in line." },
      },
      {
        x: 51,
        y: 46,
        title: { id: "Zona relaksasi kepala", en: "Head relief zone" },
        body: { id: "Cekungan di tengah menampung kepala saat tidur telentang.", en: "The hollow cradles your head when you sleep on your back." },
      },
      {
        x: 71,
        y: 37,
        title: { id: "Zona penopang tidur miring", en: "Side-sleep support zone" },
        body: { id: "Sayap yang lebih tinggi mengisi jarak bahu ke telinga saat tidur miring.", en: "Higher wings fill the gap from shoulder to ear when you sleep on your side." },
      },
      {
        x: 33,
        y: 57,
        title: { id: "Zona sandaran lengan", en: "Arm rest zone" },
        body: { id: "Lekukan di sisi memberi tempat untuk lengan saat tidur miring.", en: "Cut-outs at the sides give your arm a place to rest." },
      },
    ],
  },
  fit: {
    title: { id: "Cocok untuk siapa?", en: "Who is it for?" },
    items: [
      { title: { id: "Tidur miring", en: "Side sleepers" }, body: { id: "Sayap samping mengisi jarak bahu ke kepala.", en: "The side wings fill the gap from shoulder to head." }, fits: true },
      { title: { id: "Tidur telentang", en: "Back sleepers" }, body: { id: "Cekungan tengah menjaga leher tetap tertopang.", en: "The center cradle keeps the neck supported." }, fits: true },
      { title: { id: "Sering ganti posisi", en: "Combination sleepers" }, body: { id: "Lebarnya 64 cm, cukup leluasa untuk berguling.", en: "64 cm wide, room to roll over." }, fits: true },
      { title: { id: "Tidur tengkurap", en: "Stomach sleepers" }, body: { id: "Bagian tengah yang lebih rendah menjaga kepala agar tidak terlalu terangkat.", en: "The low centre keeps your head from tilting up too far." }, fits: true },
    ],
  },
  compare: {
    title: { id: "Bedanya dengan bantal biasa", en: "How it differs from a regular pillow" },
    theirs: { id: "Bantal biasa", en: "Regular pillow" },
    rows: [
      { label: { id: "Topangan leher", en: "Neck support" }, ours: { id: "Konturnya mengikuti leher", en: "Contour follows the neck" }, theirs: { id: "Rata, sering terlalu tinggi", en: "Flat, often too high" } },
      { label: { id: "Setelah dipakai lama", en: "After months of use" }, ours: { id: "Memory foam kembali ke bentuk semula", en: "Memory foam returns to shape" }, theirs: { id: "Mudah kempes", en: "Goes flat" } },
      { label: { id: "Rasa di kulit", en: "On the skin" }, ours: { id: "Sarung ice-silk sejuk", en: "Cool ice-silk cover" }, theirs: { id: "Kain biasa, cepat hangat", en: "Regular fabric, warms up fast" } },
      { label: { id: "Tidur miring", en: "Side sleeping" }, ours: { id: "Ada ruang untuk tangan", en: "Has arm space" }, theirs: { id: "Tangan sering kesemutan", en: "Arm often goes numb" } },
    ],
  },
  faq: [
    { q: { id: "Bantalnya keras atau empuk?", en: "Is it firm or soft?" }, a: { id: "Medium-firm. Cukup menopang leher, tapi tetap nyaman dan tidak kaku.", en: "Medium-firm. Supportive enough for the neck, yet comfortable and never stiff." } },
    { q: { id: "Perlu waktu adaptasi?", en: "Is there an adjustment period?" }, a: { id: "Ya, umumnya sekitar 7–14 malam kalau sebelumnya pakai bantal biasa.", en: "Yes, usually about 7–14 nights if you're used to a regular pillow." } },
    { q: { id: "Sarungnya bisa dicuci?", en: "Is the cover washable?" }, a: { id: "Bisa. Sarung ice-silk-nya bisa dilepas dan dicuci, tapi inti memory foam jangan dicuci.", en: "Yes. The ice-silk cover comes off and can be washed. Don't wash the memory foam core." } },
    { q: { id: "Bisa beli sarung cadangan?", en: "Can I buy a spare cover?" }, a: { id: "Bisa, sarung CerviCloud dijual terpisah.", en: "Yes, the CerviCloud cover is sold separately." } },
  ],
  pairWith: ["lumicloud", "calmicloud"],
};

const lumicloud: ProductCopy = {
  slug: "lumicloud",
  name: "LumiCloud Eye Mask",
  role: "hero",
  card: {
    image: "/images/edited/DSC01278.JPG",
    hoverImage: "/images/edited/DSC01225.JPG",
    chip: { id: "Blue · Apricot", en: "Blue · Apricot" },
    line: {
      id: "Masker mata blackout yang ringan dan tidak menekan mata, untuk tidur malam, tidur siang, dan perjalanan.",
      en: "A light blackout eye mask that doesn't press on your eyes, for nights, naps and travel.",
    },
  },
  sub: {
    id: "Masker mata blackout yang ringan dan lembut, tidak menekan kelopak mata, untuk tidur malam, tidur siang, dan perjalanan.",
    en: "A light, soft blackout eye mask that doesn't press on your eyelids, for nights, naps and travel.",
  },
  gallery: [
    { src: "/images/products/lumicloud/gallery-01.webp", alt: { id: "LumiCloud, masker mata tidur", en: "LumiCloud, a sleep eye mask" } },
    { src: "/images/products/lumicloud/gallery-02.webp", alt: { id: "Masalah tidur yang sering dialami", en: "Common sleep problems" } },
    { src: "/images/products/lumicloud/gallery-03.webp", alt: { id: "Tidur memakai LumiCloud", en: "Sleeping in LumiCloud" } },
    { src: "/images/products/lumicloud/gallery-04.webp", alt: { id: "LumiCloud dibandingkan masker mata lain", en: "LumiCloud compared with other eye masks" } },
    { src: "/images/products/lumicloud/gallery-05.webp", alt: { id: "Ruang mata dan penyangga hidung LumiCloud", en: "LumiCloud's eye space and nose support" } },
    { src: "/images/products/lumicloud/gallery-06.webp", alt: { id: "Tali LumiCloud yang bisa diatur", en: "LumiCloud's adjustable strap" } },
    { src: "/images/products/lumicloud/gallery-07.webp", alt: { id: "LumiCloud mudah dibawa bepergian", en: "LumiCloud is easy to travel with" } },
    { src: "/images/products/lumicloud/gallery-08.webp", alt: { id: "LumiCloud di mobil, kantor, pesawat dan saat meditasi", en: "LumiCloud in the car, office, plane and meditation" } },
    { src: "/images/products/lumicloud/gallery-09.webp", alt: { id: "Ulasan pelanggan LumiCloud", en: "LumiCloud customer reviews" } },
  ],
  icons: [
    { icon: "dark", label: { id: "Blackout", en: "Blackout" } },
    { icon: "eye", label: { id: "Tidak menekan mata", en: "No pressure on the eyes" } },
    { icon: "hair", label: { id: "Velcro halus, aman untuk rambut", en: "Soft velcro, hair-friendly" } },
    { icon: "travel", label: { id: "Ringan, mudah dibawa", en: "Light to carry" } },
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
        { id: "Kain lembut yang terasa ringan di wajah", en: "Soft fabric that feels light on the face" },
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
      id: "Dibuat untuk menghalangi cahaya, tapi tetap nyaman di wajah sepanjang malam.",
      en: "Made to block light while staying comfortable on your face all night.",
    },
    image: "/images/edited/DSC01334.JPG",
    points: [
      {
        x: 38,
        y: 20,
        title: { id: "Menutup cahaya", en: "Blocks light" },
        body: { id: "Menutup area mata dengan rapat, pas untuk kebanyakan orang.", en: "Covers the eye area closely for most sleepers." },
      },
      {
        x: 22,
        y: 27,
        title: { id: "Tidak menekan", en: "No pressure" },
        body: { id: "Kelopak mata tetap bebas, tidak terasa tertekan.", en: "Your eyelids stay free, with no pressing." },
      },
      {
        x: 61,
        y: 47,
        title: { id: "Velcro halus", en: "Soft velcro" },
        body: { id: "Mudah diatur dan tidak menyangkut rambut.", en: "Easy to adjust and doesn't catch hair." },
      },
      {
        x: 55,
        y: 38,
        title: { id: "Ringan", en: "Light" },
        body: { id: "Gampang dilipat dan dibawa saat bepergian.", en: "Easy to fold and take when you travel." },
      },
    ],
  },
  fit: {
    title: { id: "Kapan LumiCloud paling membantu?", en: "When does LumiCloud help most?" },
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
      { label: { id: "Cahaya", en: "Light" }, ours: { id: "Menghalangi cahaya bagi kebanyakan orang", en: "Blocks light for most sleepers" }, theirs: { id: "Sering bocor di tepi", en: "Often leaks at the edges" } },
      { label: { id: "Di mata", en: "On the eyes" }, ours: { id: "Tidak menekan kelopak", en: "No pressure on the eyelids" }, theirs: { id: "Menempel di mata", en: "Sits on the eyes" } },
      { label: { id: "Tali", en: "Strap" }, ours: { id: "Velcro halus", en: "Soft velcro" }, theirs: { id: "Karet yang menarik rambut", en: "Elastic that pulls hair" } },
      { label: { id: "Dipakai lama", en: "Worn all night" }, ours: { id: "Ringan & lembut", en: "Light and soft" }, theirs: { id: "Bikin pegal belakang kepala", en: "Aches at the back of the head" } },
    ],
  },
  faq: [
    { q: { id: "Apakah menekan mata atau bulu mata?", en: "Does it press on my eyes or lashes?" }, a: { id: "Tidak. LumiCloud dibuat supaya kelopak mata tetap bebas.", en: "No. LumiCloud is made so your eyelids stay free." } },
    { q: { id: "Talinya aman untuk rambut?", en: "Is the strap hair-friendly?" }, a: { id: "Ya, velcro-nya halus dan tidak menyangkut rambut.", en: "Yes, the velcro is soft and doesn't catch hair." } },
    { q: { id: "Bisa dicuci?", en: "Can I wash it?" }, a: { id: "Sebaiknya dicuci dengan tangan. Kalau pakai mesin, gunakan kantong laundry dan siklus lembut.", en: "Hand washing is best. In a machine, use a laundry bag and a gentle cycle." } },
    { q: { id: "Ada pilihan warna?", en: "Which colours are there?" }, a: { id: "Ada dua: Blue dan Apricot.", en: "Two: Blue and Apricot." } },
  ],
  pairWith: ["cervicloud", "calmicloud"],
};

const calmicloud: ProductCopy = {
  slug: "calmicloud",
  name: "CalmiCloud Earplugs",
  role: "companion",
  card: {
    image: "/images/edited/DSC01313.JPG",
    hoverImage: "/images/edited/DSC01249.JPG",
    chip: { id: "Isi 3 pasang", en: "3 pairs" },
    line: {
      id: "Earplug silikon lembut untuk meredam dengkuran, dengung AC, dan suara jalan.",
      en: "Soft silicone earplugs for snoring, AC hum and street noise.",
    },
  },
  sub: {
    id: "Earplug silikon lembut yang bisa dibentuk untuk menutup bagian luar telinga, membantu meredam dengkuran, dengung AC, dan suara jalan.",
    en: "Soft, moldable silicone earplugs that cover the outer ear and help quiet snoring, AC hum and traffic.",
  },
  gallery: [
    { src: "/images/products/calmicloud/gallery-01-open.webp", alt: { id: "CalmiCloud, earplug silikon yang bisa dibentuk", en: "CalmiCloud, moldable silicone earplugs" } },
    { src: "/images/products/calmicloud/gallery-02.webp", alt: { id: "Membentuk CalmiCloud sesuai telinga", en: "Shaping CalmiCloud to fit your ear" } },
    { src: "/images/products/calmicloud/gallery-03.webp", alt: { id: "CalmiCloud dibandingkan earplug lain", en: "CalmiCloud compared with other earplugs" } },
    { src: "/images/products/calmicloud/gallery-04.webp", alt: { id: "Suara yang diredam CalmiCloud", en: "Sounds CalmiCloud helps quiet" } },
    { src: "/images/products/calmicloud/gallery-05.webp", alt: { id: "Cara memakai CalmiCloud", en: "How to wear CalmiCloud" } },
    { src: "/images/products/calmicloud/gallery-06.webp", alt: { id: "CalmiCloud bisa dicuci dan dipakai ulang", en: "CalmiCloud is washable and reusable" } },
    { src: "/images/products/calmicloud/gallery-07.webp", alt: { id: "CalmiCloud untuk belajar, kerja, perjalanan dan tidur", en: "CalmiCloud for study, work, travel and sleep" } },
    { src: "/images/products/calmicloud/gallery-08.webp", alt: { id: "Case CalmiCloud yang kecil dan praktis", en: "CalmiCloud's small travel case" } },
    { src: "/images/products/calmicloud/gallery-09.webp", alt: { id: "Ulasan pelanggan CalmiCloud", en: "CalmiCloud customer reviews" } },
  ],
  icons: [
    { icon: "ear", label: { id: "Mengurangi suara sekitar", en: "Quiets the room" } },
    { icon: "mold", label: { id: "Silikon bisa dibentuk", en: "Moldable silicone" } },
    { icon: "reuse", label: { id: "Bisa dipakai ulang", en: "Reusable" } },
    { icon: "case", label: { id: "Lengkap dengan case", en: "Comes with a case" } },
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
        { id: "Case penyimpanan", en: "A storage case" },
      ],
    },
    {
      title: { id: "Cara pakai", en: "How to use" },
      body: [
        {
          id: "Bentuk silikon dengan jari, lalu tempelkan untuk menutup lubang telinga dari luar. Jangan didorong masuk ke liang telinga.",
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
    title: { id: "Lembut, mengikuti bentuk telingamu.", en: "Soft, and shaped to your ear." },
    intro: {
      id: "Tidak dimasukkan ke dalam telinga, tapi menutup dari luar.",
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
        body: { id: "Tempat menyimpan agar earplug tetap bersih.", en: "Keeps them clean between nights." },
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
    { q: { id: "Ada pilihan ukuran?", en: "Do they come in sizes?" }, a: { id: "Tidak perlu. Silikonnya dibentuk mengikuti telingamu.", en: "No need. You shape the silicone to your ear." } },
    { q: { id: "Apakah semua suara hilang?", en: "Will I hear nothing at all?" }, a: { id: "Tidak. Earplug mengurangi suara sekitar, jadi atur alarm dengan volume yang cukup keras.", en: "No. Earplugs reduce surrounding noise, so keep your alarm loud enough." } },
    { q: { id: "Nyaman untuk tidur miring?", en: "Comfortable for side sleeping?" }, a: { id: "Ya, karena menutup dari luar dan tidak didorong ke dalam.", en: "Yes, because it seals from the outside instead of being pushed in." } },
  ],
  pairWith: ["cervicloud", "lumicloud"],
};

export const productCopy: Record<ProductSlug, ProductCopy> = { cervicloud, lumicloud, calmicloud };
