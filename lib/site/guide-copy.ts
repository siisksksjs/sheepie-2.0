import type { Locale } from "@/i18n/config";

/** The CalmiCloud instructions page (the QR code on the box insert points here). */
type GuideCopy = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: [string, string];
  intro: string;
  facts: [string, string][];
  wearTitle: string;
  wearIntro: string;
  steps: { title: string; body: string }[];
  outer: string;
  removeTitle: string;
  remove: string;
  careTitle: string;
  care: { title: string; body: string }[];
  replace: string;
  safetyTitle: string;
  safety: string[];
  tipsTitle: string;
  tips: { q: string; a: string }[];
  helpTitle: string;
  helpBody: string;
  chat: string;
  buy: string;
};

export const guideCopy: Record<Locale, GuideCopy> = {
  id: {
    metaTitle: "Panduan CalmiCloud Earplugs | Sheepie.",
    metaDescription: "Cara memakai, merawat, dan menyimpan CalmiCloud Earplugs, earplug silikon yang bisa dibentuk dari Sheepie.",
    eyebrow: "Panduan CalmiCloud",
    title: ["Malam tenang,", "pagi lebih segar."],
    intro: "Terima kasih sudah memilih Sheepie. Ini panduan resmi untuk memakai, merawat, dan menyimpan CalmiCloud Earplugs. Membacanya cukup satu menit.",
    facts: [
      ["Bahan", "Silikon lembut, bebas BPA"],
      ["Case", "Polipropilena (PP), antidebu"],
      ["Dipakai", "Menutup bagian luar telinga"],
      ["Untuk", "Tidur, fokus, perjalanan"],
    ],
    wearTitle: "Cara memakai",
    wearIntro: "Empat langkah, sekitar satu menit.",
    steps: [
      { title: "Bersihkan tangan", body: "Cuci dan keringkan tangan supaya earplug tetap bersih dan bisa menempel dengan baik." },
      { title: "Bentuk jadi bulat", body: "Ambil satu earplug, lalu gulung di antara jari sampai berbentuk bola yang halus." },
      { title: "Tempel di luar telinga", body: "Tempelkan di atas lubang telinga, lalu tekan perlahan dan ratakan sampai lubangnya tertutup." },
      { title: "Rapikan, lalu tidur", body: "Rapikan tepinya sampai terasa pas dan nyaman. Ulangi di telinga sebelahnya." },
    ],
    outer: "CalmiCloud menutup bagian luar telinga. Jangan didorong masuk ke liang telinga.",
    removeTitle: "Cara melepas",
    remove: "Angkat perlahan dari tepinya, lalu simpan kembali di case. Jangan ditarik dari tengah.",
    careTitle: "Cara merawat",
    care: [
      { title: "Cuci", body: "Bilas dengan sabun lembut dan air hangat setelah dipakai." },
      { title: "Keringkan", body: "Angin-anginkan sampai kering. Jauhkan dari sinar matahari langsung dan sumber panas." },
      { title: "Simpan", body: "Simpan di case bawaan supaya tetap bersih dan bebas debu." },
    ],
    replace: "Untuk kebersihan terbaik, ganti setiap 3–6 bulan, atau lebih cepat kalau sudah tidak menempel lagi.",
    safetyTitle: "Perhatian",
    safety: [
      "Jangan berbagi earplug dengan orang lain.",
      "Hentikan pemakaian kalau terasa sakit atau iritasi.",
      "Jauhkan dari jangkauan anak-anak karena ukurannya kecil dan bisa tertelan.",
      "CalmiCloud meredam suara, tidak menghilangkan semuanya. Atur volume alarm cukup keras supaya tetap terdengar.",
    ],
    tipsTitle: "Yang sering ditanyakan",
    tips: [
      { q: "Kenapa kurang menempel?", a: "Biasanya karena tangan atau earplug berminyak. Cuci keduanya, keringkan, lalu bentuk ulang." },
      { q: "Masih terdengar sedikit suara?", a: "Itu normal. Pastikan lubang telinga tertutup rata dan tepinya rapat ke kulit." },
      { q: "Nyaman untuk tidur miring?", a: "Ya. Karena tidak masuk ke liang telinga, tidak ada yang menekan saat kepala di bantal." },
    ],
    helpTitle: "Masih bingung?",
    helpBody: "Chat kami di WhatsApp, kami bantu langkah demi langkah.",
    chat: "Chat di WhatsApp",
    buy: "Lihat CalmiCloud",
  },
  en: {
    metaTitle: "CalmiCloud Earplugs Guide | Sheepie.",
    metaDescription: "How to wear, clean and store CalmiCloud Earplugs, Sheepie's moldable silicone earplugs.",
    eyebrow: "CalmiCloud Guide",
    title: ["Quiet nights,", "clearer mornings."],
    intro: "Thank you for choosing Sheepie. This is the official guide to wearing, cleaning and storing your CalmiCloud Earplugs. It takes a minute to read.",
    facts: [
      ["Material", "Soft, BPA-free silicone"],
      ["Case", "Dustproof polypropylene (PP)"],
      ["Worn", "Over the outer ear"],
      ["For", "Sleep, focus, travel"],
    ],
    wearTitle: "How to wear",
    wearIntro: "Four steps, about a minute.",
    steps: [
      { title: "Clean your hands", body: "Wash and dry your hands so the earplug stays clean and sticks well." },
      { title: "Roll into a ball", body: "Take one earplug and roll it between your fingers into a smooth ball." },
      { title: "Press over the ear", body: "Place it over the ear opening, then press gently and smooth it until the opening is covered." },
      { title: "Smooth, then sleep", body: "Smooth the edges until it feels snug and comfortable. Repeat on the other ear." },
    ],
    outer: "CalmiCloud covers the outer ear. Don't push it into the ear canal.",
    removeTitle: "How to remove",
    remove: "Lift it gently from the edge and put it back in the case. Don't pull from the middle.",
    careTitle: "Care",
    care: [
      { title: "Wash", body: "Rinse with mild soap and warm water after use." },
      { title: "Dry", body: "Let it air-dry. Keep it out of direct sun and heat." },
      { title: "Store", body: "Keep it in the case so it stays clean and dust-free." },
    ],
    replace: "For best hygiene, replace every 3–6 months, or sooner once it stops sticking.",
    safetyTitle: "Please note",
    safety: [
      "Don't share earplugs with others.",
      "Stop using them if you feel pain or irritation.",
      "Keep away from children; they are small and could be swallowed.",
      "CalmiCloud softens sound rather than removing it. Set your alarm loud enough to hear.",
    ],
    tipsTitle: "Common questions",
    tips: [
      { q: "Why isn't it sticking?", a: "Usually oily hands or earplugs. Wash both, dry them, then reshape." },
      { q: "I can still hear a little.", a: "That's normal. Make sure the ear opening is evenly covered and the edges sit flat on your skin." },
      { q: "Is it comfortable for side sleeping?", a: "Yes. Nothing goes into the ear canal, so nothing presses in when your head is on the pillow." },
    ],
    helpTitle: "Still unsure?",
    helpBody: "Message us on WhatsApp and we'll walk you through it.",
    chat: "Chat on WhatsApp",
    buy: "See CalmiCloud",
  },
};
