import Image from "next/image";
import { getLocale } from "next-intl/server";

import styles from "@/components/pages/pages.module.css";
import { buttonClass, ButtonLink } from "@/components/site/button";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import site from "@/components/site/site.module.css";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { localeHref } from "@/lib/site/copy";
import { whatsappGreeting, whatsappUrl } from "@/lib/site/whatsapp";

const COPY: Record<Locale, { eyebrow: string; title: [string, string]; body: string; home: string; products: string; chat: string }> = {
  id: {
    eyebrow: "404",
    title: ["Halaman ini", "sedang tidur."],
    body: "Halaman yang kamu cari sudah pindah atau tidak ada. Coba mulai dari beranda atau lihat produk kami.",
    home: "Ke beranda",
    products: "Lihat produk",
    chat: "Tanya di WhatsApp",
  },
  en: {
    eyebrow: "404",
    title: ["This page", "is fast asleep."],
    body: "The page you're looking for has moved or doesn't exist. Start from the home page or browse our products.",
    home: "Go home",
    products: "See products",
    chat: "Ask on WhatsApp",
  },
};

export default async function NotFound() {
  const current = await getLocale();
  const locale: Locale = isLocale(current) ? current : defaultLocale;
  const t = COPY[locale];

  return (
    <div className={site.page}>
      <SiteHeader locale={locale} />
      <main>
        <section className={`${site.shell} ${styles.intro} ${styles.notFound}`} data-section="not-found">
          <Image src="/brand/lamb-blue.webp" alt="" width={120} height={120} className={site.breathe} />
          <p className={styles.eyebrow}>{t.eyebrow}</p>
          <h1 className={styles.title}>
            {t.title[0]}
            <em>{t.title[1]}</em>
          </h1>
          <p className={styles.lede}>{t.body}</p>
          <div className={styles.btnRow}>
            <ButtonLink href={localeHref(locale, "/")} variant="ink">{t.home}</ButtonLink>
            <ButtonLink href={localeHref(locale, "/products")} variant="line">{t.products}</ButtonLink>
            <a className={buttonClass("line")} href={whatsappUrl(whatsappGreeting(locale))} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon size={18} /> {t.chat}
            </a>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
