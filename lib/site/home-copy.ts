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
      eyebrow: "Standar Baru Istirahat",
      title: ["Tidur adalah", "Fondasi."],
      sub: "Kami tidak sekadar menjual bantal. Kami merancang keheningan, kegelapan, dan topangan untuk tidurmu.",
      subStrong: "Sambut esok dengan lebih segar.",
      explore: "Jelajahi Koleksi",
      story: "Filosofi Kami",
      marquee: "SLEEP ·",
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
      lead: "Bentuk butterfly menopang leher saat telentang dan miring. Ada lekukan untuk menaruh tangan, jadi main HP sebelum tidur pun tetap nyaman.",
      features: [
        ["Miring & telentang", "Kontur berbeda untuk tiap posisi tidur."],
        ["Sarung ice-silk", "Terasa sejuk di kulit, bisa dilepas."],
        ["Memory foam", "Mengembang perlahan, tidak cepat kempes."],
        ["64 × 35 × 12 cm", "Cukup lebar untuk ganti posisi."],
      ],
      cta: "Lihat CerviCloud",
    },
    lumi: {
      title: "LumiCloud. Matikan lampu, tanpa menekan mata.",
      lead: "Penutup mata tidur blackout yang ringan dan lembut. Tidak menekan kelopak mata, jadi nyaman dipakai semalaman, saat tidur siang, atau di perjalanan.",
      features: [
        ["Blackout", "Menghalangi cahaya bagi kebanyakan orang."],
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
      marquee: "SLEEP ·",
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
