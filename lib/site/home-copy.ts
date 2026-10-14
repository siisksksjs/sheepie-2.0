import type { Locale } from "@/i18n/config";

export interface HomeCopy {
  hero: {
    eyebrow: string;
    /** Rendered as two lines; the second is set in italic. */
    title: [string, string];
    /** Meta description and the hero paragraph; `subStrong` follows it in bold. */
    sub: string;
    subStrong: string;
    explore: string;
    story: string;
    /** The slow background marquee behind the type. */
    marquee: string;
    alt: string;
  };
  products: { title: string; all: string; companion: string; coverName: string; coverLine: string };
  cervi: { title: string; lead: string; features: [string, string][]; cta: string };
  lumi: { title: string; lead: string; features: [string, string][]; swatches: string; cta: string };
  reviews: { cervi: string; lumi: string; viewOriginal: string };
}

export const homeCopy: Record<Locale, HomeCopy> = {
  id: {
    hero: {
      eyebrow: "The New Standard of Rest",
      title: ["Sleep is", "The Foundation."],
      sub: "Kami tidak sekadar menjual bantal. Kami merancang keheningan, kegelapan, dan topangan untuk tidurmu.",
      subStrong: "Sambut esok dengan lebih segar.",
      explore: "Jelajahi Koleksi",
      story: "Filosofi Kami",
      marquee: "SHEEPIE SLEEP ·",
      alt: "Perempuan tidur nyenyak memakai LumiCloud di atas bantal CerviCloud",
    },
    products: {
      title: "Koleksi utama",
      all: "Semua produk",
      companion: "Pelengkap",
      coverName: "Sarung CerviCloud",
      coverLine: "Sarung ice-silk cadangan, mudah dilepas dan dicuci.",
    },
    cervi: {
      title: "CerviCloud, bantal yang mengikuti gaya tidurmu.",
      lead: "Bentuk butterfly-nya menopang leher saat tidur telentang maupun miring, dengan lekukan di sisi sebagai tempat lengan bersandar.",
      features: [
        ["Miring & telentang", "Kontur berbeda untuk tiap posisi tidur."],
        ["Sarung ice-silk", "Terasa sejuk di kulit, bisa dilepas."],
        ["Memory foam", "Bentuknya tetap terjaga, tidak cepat kempes."],
        ["64 × 35 × 12 cm", "Cukup lebar untuk ganti posisi."],
      ],
      cta: "Lihat CerviCloud",
    },
    lumi: {
      title: "LumiCloud. Gelap untuk matamu, walau lampu masih menyala.",
      lead: "Penutup mata tidur blackout yang ringan dan lembut. Tidak menekan kelopak mata, jadi nyaman dipakai semalaman, saat tidur siang, atau di perjalanan.",
      features: [
        ["Blackout", "Menghalangi cahaya lampu, layar, dan matahari pagi."],
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
      eyebrow: "The New Standard of Rest",
      title: ["Sleep is", "The Foundation."],
      sub: "We don't just sell pillows. We design for silence, darkness and a supported neck.",
      subStrong: "Prepare for a clearer tomorrow.",
      explore: "Explore the Collection",
      story: "Our Philosophy",
      marquee: "SHEEPIE SLEEP ·",
      alt: "A woman sleeping soundly in LumiCloud on a CerviCloud pillow",
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
      lead: "The butterfly shape supports your neck whether you sleep on your back or your side, with a curved cut-out that gives your arm somewhere to rest.",
      features: [
        ["Side & back sleepers", "A different contour for each position."],
        ["Ice-silk cover", "Feels cool on the skin, removable."],
        ["Memory foam", "Holds its shape, doesn't go flat."],
        ["64 × 35 × 12 cm", "Wide enough to change position."],
      ],
      cta: "See CerviCloud",
    },
    lumi: {
      title: "LumiCloud. Darkness for your eyes, even with the lights on.",
      lead: "A light, soft blackout eye mask. It doesn't press on your eyelids, so it stays comfortable all night, for naps or on the road.",
      features: [
        ["Blackout", "Blocks lamp, screen and morning light."],
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
