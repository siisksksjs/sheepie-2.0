import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  CheckCircle2,
  Droplets,
  Ear,
  Hand,
  MoonStar,
  PackageOpen,
  ShieldAlert,
  Sparkles,
  SunDim,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import siteData from "@/data/site.json";

export const metadata: Metadata = {
  title: "CalmiCloud Earplug Guide | Sheepie.",
  description:
    "Official CalmiCloud Earplug usage, care, and safety instructions from Sheepie.",
};

export default async function CalmiCloudEarplugGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Products" });
  const isId = locale === "id";

  const features = isId
    ? [
        "Lembut dan Fleksibel: Nyaman dipakai dalam waktu lama.",
        "Mengurangi Kebisingan: Memblokir suara yang mengganggu dengan nyaman.",
        "Dapat Digunakan Ulang dan Dicuci: Perawatan mudah dan ramah lingkungan.",
        "Pas Ergonomis: Tetap aman sepanjang malam.",
        "Dengan Kotak Anti Debu: Tetap bersih dan praktis dibawa.",
      ]
    : [
        "Soft and Flexible: Gentle for long wear.",
        "Noise-Reducing: Blocks unwanted sound comfortably.",
        "Reusable and Washable: Easy, eco-friendly care.",
        "Ergonomic Fit: Secure all night.",
        "With Dustproof Case: Clean and portable.",
      ];

  const howToUse = isId
    ? [
        "Pastikan tangan dan earplug bersih.",
        "Gulung dan tekan sedikit ujung earplug.",
        "Masukkan perlahan ke saluran telinga lalu putar sedikit hingga pas.",
        "Sesuaikan agar nyaman dan jangan memasukkan terlalu dalam.",
        "Untuk melepas, putar perlahan lalu tarik dengan lembut.",
      ]
    : [
        "Make sure your hands and earplugs are clean.",
        "Roll and slightly compress the earplug tip.",
        "Gently insert into your ear canal and twist slightly until snug.",
        "Adjust for comfort and do not insert too deep.",
        "To remove, slowly twist and pull out gently.",
      ];

  const care = isId
    ? [
        "Cuci dengan sabun lembut dan air hangat setelah setiap pemakaian.",
        "Keringkan secara alami (hindari sinar matahari langsung atau panas).",
        "Simpan di dalam kotak bawaan agar tetap bersih dan bebas debu.",
        "Ganti setiap 3-6 bulan untuk kebersihan terbaik.",
      ]
    : [
        "Wash with mild soap and warm water after each use.",
        "Air-dry naturally (avoid direct sunlight or heat).",
        "Store in the included case to keep clean and dust-free.",
        "Replace every 3-6 months for best hygiene.",
      ];

  const precautions = isId
    ? [
        "Jangan berbagi earplug dengan orang lain.",
        "Hentikan penggunaan jika muncul rasa sakit atau iritasi.",
        "Jauhkan dari anak-anak untuk mencegah risiko tersedak.",
      ]
    : [
        "Do not share earplugs with others.",
        "Stop using if you experience pain or irritation.",
        "Keep away from children to prevent choking hazard.",
      ];

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-white to-white pointer-events-none" />
        <div className="container mx-auto px-4 py-10 md:py-16 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <p className="text-xs tracking-[0.24em] uppercase text-primary/70 font-semibold">
                {isId ? "Panduan Earplug CalmiCloud" : "CalmiCloud Earplug Guide"}
              </p>
              <h1 className="font-display text-4xl md:text-6xl text-primary leading-[0.95] tracking-tight">
                {isId ? "Malam Tenang, Pagi Lebih Segar." : "Quiet Nights, Clear Mornings."}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                {isId
                  ? "Terima kasih telah memilih Sheepie. Halaman ini menggantikan kertas instruksi dengan panduan resmi lengkap untuk "
                  : "Thank you for choosing Sheepie. This page replaces your paper insert with the full, official instruction guide for your "}
                {t("calmicloud.name")}
                {isId ? "." : "."}
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2 text-sm text-primary bg-white/90">
                  <MoonStar className="w-4 h-4" />
                  {isId ? "Tidur" : "Sleep"}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2 text-sm text-primary bg-white/90">
                  <Sparkles className="w-4 h-4" />
                  {isId ? "Fokus" : "Focus"}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2 text-sm text-primary bg-white/90">
                  <CheckCircle2 className="w-4 h-4" />
                  {isId ? "Perjalanan" : "Travel"}
                </span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border border-primary/10">
                <Image
                  src="/images/edited/DSC01313.JPG"
                  alt="CalmiCloud Silicone Earplugs"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 via-transparent to-white/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16 md:pb-24">
        <div className="grid lg:grid-cols-12 gap-6">
          <article className="lg:col-span-8 rounded-3xl border border-border bg-white p-6 md:p-8 shadow-sm">
            <h2 className="font-display text-2xl md:text-3xl text-primary">
              {isId ? "Gambaran Produk" : "Product Overview"}
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              {isId
                ? "CalmiCloud Silicone Earplugs adalah earplug lembut yang dapat digunakan ulang, dirancang untuk mengurangi kebisingan dan membantu Anda tidur, fokus, atau bepergian dengan lebih tenang. Dibuat dari silikon kelas medis, earplug ini lembut, fleksibel, dan menyesuaikan bentuk telinga untuk kenyamanan tahan lama."
                : "CalmiCloud Silicone Earplugs are soft, reusable earplugs designed to reduce noise and help you sleep, focus, or travel peacefully. Made from medical-grade silicone, they are gentle, flexible, and adapt to your ear shape for long-lasting comfort."}
            </p>
          </article>

          <article className="lg:col-span-4 rounded-3xl border border-border bg-muted/50 p-6 md:p-8">
            <h2 className="font-display text-2xl text-primary">
              {isId ? "Material" : "Materials"}
            </h2>
            <ul className="mt-4 space-y-3 text-sm md:text-base text-foreground/90">
              <li>
                <span className="font-semibold text-primary">{isId ? "Utama:" : "Main:"}</span>{" "}
                {isId ? "Silikon lembut (bebas BPA, tidak beracun)" : "Soft silicone (BPA-free, non-toxic)"}
              </li>
              <li>
                <span className="font-semibold text-primary">{isId ? "Kotak:" : "Case:"}</span>{" "}
                Polypropylene (PP)
              </li>
            </ul>
          </article>

          <article className="lg:col-span-6 rounded-3xl border border-border bg-white p-6 md:p-8">
            <h2 className="font-display text-2xl md:text-3xl text-primary">
              {isId ? "Fitur dan Manfaat" : "Features and Benefits"}
            </h2>
            <ul className="mt-4 space-y-3">
              {features.map((item) => (
                <li key={item} className="flex items-start gap-3 text-foreground/90">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="lg:col-span-6 rounded-3xl border border-border bg-white p-6 md:p-8">
            <h2 className="font-display text-2xl md:text-3xl text-primary">
              {isId ? "Cara Penggunaan" : "How to Use"}
            </h2>
            <ol className="mt-4 space-y-3 text-foreground/90 list-decimal pl-5">
              {howToUse.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>

            <div className="mt-6 rounded-2xl border border-primary/10 bg-secondary/20 p-4 md:p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-primary/70 font-semibold">
                {isId ? "Alur Visual Cepat" : "Quick Visual Flow"}
              </p>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl bg-white border border-primary/10 p-3 text-center">
                  <Hand className="w-5 h-5 mx-auto text-primary" />
                  <p className="mt-2 text-xs text-foreground/80">
                    {isId ? "Bersihkan Tangan" : "Clean Hands"}
                  </p>
                </div>
                <div className="rounded-xl bg-white border border-primary/10 p-3 text-center">
                  <CheckCircle2 className="w-5 h-5 mx-auto text-primary" />
                  <p className="mt-2 text-xs text-foreground/80">
                    {isId ? "Tekan Ujung" : "Compress Tip"}
                  </p>
                </div>
                <div className="rounded-xl bg-white border border-primary/10 p-3 text-center">
                  <Ear className="w-5 h-5 mx-auto text-primary" />
                  <p className="mt-2 text-xs text-foreground/80">
                    {isId ? "Masukkan + Putar" : "Insert + Twist"}
                  </p>
                </div>
                <div className="rounded-xl bg-white border border-primary/10 p-3 text-center">
                  <CheckCircle2 className="w-5 h-5 mx-auto text-primary" />
                  <p className="mt-2 text-xs text-foreground/80">
                    {isId ? "Cek Nyaman" : "Comfort Check"}
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article className="lg:col-span-6 rounded-3xl border border-border bg-white p-6 md:p-8">
            <h2 className="font-display text-2xl md:text-3xl text-primary">
              {isId ? "Pembersihan dan Perawatan" : "Cleaning and Care"}
            </h2>
            <ul className="mt-4 space-y-3 text-foreground/90">
              {care.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl border border-primary/10 bg-muted/60 p-4 md:p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-primary/70 font-semibold">
                {isId ? "Diagram Perawatan" : "Care Diagram"}
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-white border border-border p-3 text-center">
                  <Droplets className="w-5 h-5 mx-auto text-primary" />
                  <p className="mt-2 text-xs text-foreground/80">
                    {isId ? "Cuci" : "Wash"}
                  </p>
                </div>
                <div className="rounded-xl bg-white border border-border p-3 text-center">
                  <SunDim className="w-5 h-5 mx-auto text-primary" />
                  <p className="mt-2 text-xs text-foreground/80">
                    {isId ? "Keringkan" : "Air Dry"}
                  </p>
                </div>
                <div className="rounded-xl bg-white border border-border p-3 text-center">
                  <PackageOpen className="w-5 h-5 mx-auto text-primary" />
                  <p className="mt-2 text-xs text-foreground/80">
                    {isId ? "Simpan di Kotak" : "Store Case"}
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article className="lg:col-span-6 rounded-3xl border border-red-200 bg-red-50/70 p-6 md:p-8">
            <h2 className="font-display text-2xl md:text-3xl text-primary flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-red-500" />
              {isId ? "Perhatian" : "Precautions"}
            </h2>
            <ul className="mt-4 space-y-3 text-foreground/90">
              {precautions.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-2 h-2 mt-2 rounded-full bg-red-400 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <div className="mt-8 md:mt-10 rounded-3xl bg-primary text-white p-7 md:p-10">
          <h2 className="font-display text-3xl md:text-4xl">
            {isId ? "Terima Kasih" : "Thank You"}
          </h2>
          <p className="mt-4 text-white/85 leading-relaxed max-w-3xl">
            {isId
              ? "Terima kasih telah memilih Sheepie, brand yang dirancang untuk menghadirkan kenyamanan, ketenangan, dan tidur yang lebih baik dalam keseharian Anda. Tidur nyenyak, bermimpi besar, dan bangun lebih segar bersama Sheepie."
              : "Thank you for choosing Sheepie, a brand designed to bring comfort, calm, and better sleep into your everyday life. Sleep well, dream big, and wake up refreshed with Sheepie."}
          </p>
          <p className="mt-6 text-white/85">
            {isId ? "Ikuti kami untuk konten cozy " : "Follow us for cozy vibes "}
            <a
              href={siteData.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              @sheepiesleep.id
            </a>{" "}
            {isId ? "di Instagram dan TikTok." : "on Instagram and TikTok."}
          </p>
          <p className="mt-6 font-medium">
            {isId ? "Mimpi indah," : "Sweet dreams,"}
            <br />
            {isId ? "Tim Sheepie" : "The Sheepie Team"}
          </p>
          <div className="mt-6">
            <Link
              href={`/${locale}/products/calmicloud`}
              className="inline-flex items-center rounded-full bg-white text-primary px-6 py-3 text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              {isId ? "Lihat CalmiCloud" : "Explore CalmiCloud"}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
