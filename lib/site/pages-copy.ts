import type { Locale } from "@/i18n/config";

/** Copy for the About, Contact, FAQ and Journal pages. */
type PagesCopy = {
  about: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: [string, string];
    intro: string;
    storyTitle: string;
    story: string[];
    pillarsTitle: string;
    pillars: { slug: "cervicloud" | "lumicloud" | "calmicloud"; word: string; line: string }[];
    closingTitle: string;
    closingCta: string;
    chat: string;
  };
  contact: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: [string, string];
    intro: string;
    waTitle: string;
    waBody: string;
    waCta: string;
    ordersTitle: string;
    ordersBody: string;
    emailTitle: string;
    emailBody: string;
    socialTitle: string;
    faqLine: string;
    faqCta: string;
  };
  faq: {
    eyebrow: string;
    title: [string, string];
    intro: string;
    asideTitle: string;
    asideBody: string;
    asideCta: string;
  };
  journal: {
    eyebrow: string;
    title: [string, string];
    intro: string;
    featured: string;
    read: string;
    back: string;
    by: string;
    more: string;
    productTitle: string;
    productCta: string;
    emptyTitle: string;
    emptyBody: string;
  };
};

export const pagesCopy: Record<Locale, PagesCopy> = {
  id: {
    about: {
      metaTitle: "Filosofi Kami | Sheepie.",
      metaDescription: "Hari yang lebih baik dimulai dari malam sebelumnya. Cerita di balik bantal, masker mata, dan earplug Sheepie.",
      eyebrow: "Filosofi Kami",
      title: ["Istirahat bukan kemewahan.", "Itu pondasi."],
      intro:
        "Hari yang lebih baik dimulai dari malam sebelumnya. Sheepie membuat perlengkapan tidur yang menopang, menggelapkan, dan menenangkan, supaya kamu bangun lebih siap.",
      storyTitle: "Dibuat dengan teliti, untuk tidur sehari-hari.",
      story: [
        "Kami menghabiskan berbulan-bulan menguji kepadatan busa, tingkat pantulan, dan sirkulasi udara kain. Setiap lekuk punya alasan.",
        "Bukan untuk satu malam yang istimewa, tapi untuk malam-malam biasa: kamar yang gerah, lampu yang masih menyala, suara AC dan jalan.",
        "Kami tidak sekadar menjual produk tidur. Kami ingin kamu bangun dengan rasa siap.",
      ],
      pillarsTitle: "Tiga hal yang kami jaga",
      pillars: [
        { slug: "cervicloud", word: "Topang", line: "Leher tertopang, telentang maupun miring." },
        { slug: "lumicloud", word: "Gelap", line: "Cahaya tertutup tanpa menekan mata." },
        { slug: "calmicloud", word: "Sunyi", line: "Bising sekitar diredam, pikiran ikut tenang." },
      ],
      closingTitle: "Mulai dari satu malam.",
      closingCta: "Lihat koleksi",
      chat: "Chat kami",
    },
    contact: {
      metaTitle: "Hubungi Kami | Sheepie.",
      metaDescription: "Tanya soal produk, ukuran, atau pesanan Sheepie lewat WhatsApp, email, atau chat toko kami di Shopee dan Tokopedia.",
      eyebrow: "Hubungi Kami",
      title: ["Ada yang bisa", "kami bantu?"],
      intro: "Bingung pilih produk, ukuran, atau paket? Tanya saja. Kami senang membantu memilih yang cocok untuk tidurmu.",
      waTitle: "WhatsApp",
      waBody: "Cara tercepat untuk tanya produk, rekomendasi, dan paket.",
      waCta: "Chat di WhatsApp",
      ordersTitle: "Pesanan marketplace",
      ordersBody: "Untuk status pengiriman atau pengembalian, chat toko kami langsung di aplikasi tempat kamu belanja.",
      emailTitle: "Email",
      emailBody: "Untuk kerja sama dan pertanyaan lainnya.",
      socialTitle: "Ikuti kami",
      faqLine: "Mungkin pertanyaanmu sudah terjawab.",
      faqCta: "Lihat FAQ",
    },
    faq: {
      eyebrow: "Pusat Bantuan",
      title: ["Pertanyaan yang", "sering ditanyakan."],
      intro: "Semua yang perlu kamu tahu tentang produk, perawatan, dan pengiriman.",
      asideTitle: "Masih punya pertanyaan?",
      asideBody: "Chat kami di WhatsApp, kami bantu pilih yang cocok.",
      asideCta: "Chat di WhatsApp",
    },
    journal: {
      eyebrow: "Blog",
      title: ["Catatan tentang", "tidur yang lebih baik."],
      intro: "Panduan praktis soal bantal, cahaya, suara, dan kebiasaan tidur sehari-hari.",
      featured: "Pilihan",
      read: "Baca artikel",
      back: "Semua artikel",
      by: "Ditulis oleh",
      more: "Artikel lainnya",
      productTitle: "Dari artikel ini",
      productCta: "Lihat produk",
      emptyTitle: "Artikel pertama sedang ditulis.",
      emptyBody: "Sambil menunggu, lihat panduan produk kami atau tanya langsung lewat WhatsApp.",
    },
  },
  en: {
    about: {
      metaTitle: "Our Philosophy | Sheepie.",
      metaDescription: "A better day starts the night before. The story behind Sheepie's pillow, eye mask and earplugs.",
      eyebrow: "Our Philosophy",
      title: ["Rest isn't a luxury.", "It's the foundation."],
      intro:
        "A better day starts the night before. Sheepie makes sleep essentials that support, darken and quiet, so you wake up ready.",
      storyTitle: "Made with care, for everyday sleep.",
      story: [
        "We spent months testing foam density, rebound and how fabrics breathe. Every curve is there for a reason.",
        "Not for one special night, but for ordinary ones: a warm room, a light still on, the hum of the AC and the street.",
        "We don't just sell sleep products. We want you to wake up feeling ready.",
      ],
      pillarsTitle: "Three things we care about",
      pillars: [
        { slug: "cervicloud", word: "Support", line: "A supported neck, on your back or your side." },
        { slug: "lumicloud", word: "Dark", line: "Light blocked without pressing on your eyes." },
        { slug: "calmicloud", word: "Quiet", line: "Background noise softened, so your mind settles too." },
      ],
      closingTitle: "Start with one night.",
      closingCta: "See the collection",
      chat: "Chat with us",
    },
    contact: {
      metaTitle: "Contact | Sheepie.",
      metaDescription: "Ask about Sheepie products, sizes or orders on WhatsApp, by email, or through our Shopee and Tokopedia stores.",
      eyebrow: "Contact",
      title: ["How can we", "help?"],
      intro: "Not sure which product, size or bundle? Just ask. We're happy to help you choose what suits your sleep.",
      waTitle: "WhatsApp",
      waBody: "The quickest way to ask about products, recommendations and bundles.",
      waCta: "Chat on WhatsApp",
      ordersTitle: "Marketplace orders",
      ordersBody: "For delivery status or returns, chat with our store directly in the app you ordered from.",
      emailTitle: "Email",
      emailBody: "For partnerships and anything else.",
      socialTitle: "Follow us",
      faqLine: "Your question may already be answered.",
      faqCta: "See the FAQ",
    },
    faq: {
      eyebrow: "Help Centre",
      title: ["Frequently asked", "questions."],
      intro: "Everything you need to know about our products, care and delivery.",
      asideTitle: "Still have a question?",
      asideBody: "Chat with us on WhatsApp and we'll help you choose.",
      asideCta: "Chat on WhatsApp",
    },
    journal: {
      eyebrow: "Blog",
      title: ["Notes on", "sleeping better."],
      intro: "Practical guides on pillows, light, noise and everyday sleep habits. Articles are in Bahasa Indonesia.",
      featured: "Featured",
      read: "Read article",
      back: "All articles",
      by: "Written by",
      more: "More articles",
      productTitle: "From this article",
      productCta: "See the product",
      emptyTitle: "The first article is on its way.",
      emptyBody: "In the meantime, browse our products or ask us anything on WhatsApp.",
    },
  },
};
