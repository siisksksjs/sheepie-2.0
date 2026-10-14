import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { PageIntro } from "@/components/pages/page-intro";
import styles from "@/components/pages/pages.module.css";
import { buttonClass, ButtonLink } from "@/components/site/button";
import { FadeIn } from "@/components/site/fade-in";
import { Mendung } from "@/components/site/mendung";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import site from "@/components/site/site.module.css";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { isLocale } from "@/i18n/config";
import { getProduct, productPath } from "@/lib/catalog";
import { localeHref } from "@/lib/site/copy";
import { pagesCopy } from "@/lib/site/pages-copy";
import { whatsappGreeting, whatsappUrl } from "@/lib/site/whatsapp";

const MOSAIC = [
  "/images/hero/sleep-mask-pillow.webp",
  "/images/edited/DSC01263.JPG",
  "/images/edited/DSC01313.JPG",
  "/images/edited/DSC01148.JPG",
  "/images/edited/DSC01225.JPG",
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = pagesCopy[locale].about;
  return { title: t.metaTitle, description: t.metaDescription };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const t = pagesCopy[locale].about;

  return (
    <div className={site.page}>
      <SiteHeader locale={locale} />
      <main>
        <PageIntro eyebrow={t.eyebrow} title={t.title} intro={t.intro} />

        <div className={site.shell}>
          <div className={styles.mosaic}>
            {MOSAIC.map((src, i) => (
              <div key={src}>
                <Image src={src} alt="" fill sizes={i === 0 ? "(max-width: 760px) 100vw, 40vw" : "(max-width: 760px) 50vw, 28vw"} className={styles.cover} preload={i === 0} />
              </div>
            ))}
          </div>
        </div>

        <section className={`${site.shell} ${styles.block}`} data-section="story">
          <div className={styles.story}>
            <FadeIn><h2 className={styles.h2}>{t.storyTitle}</h2></FadeIn>
            <FadeIn index={1}>
              {t.story.map((p) => <p key={p}>{p}</p>)}
            </FadeIn>
          </div>
        </section>

        <section className={`${site.shell} ${styles.block}`} data-section="pillars">
          <FadeIn><h2 className={styles.h2}>{t.pillarsTitle}</h2></FadeIn>
          <div className={styles.pillars}>
            {t.pillars.map((pillar, i) => {
              const product = getProduct(pillar.slug, locale);
              return (
                <FadeIn key={pillar.slug} index={i}>
                  <Link className={styles.pillar} href={productPath(locale, pillar.slug)}>
                    <span className={styles.pillarImg}>
                      <Image src={product.card.hoverImage} alt="" fill sizes="(max-width: 760px) 90vw, 30vw" className={styles.cover} />
                    </span>
                    <b>{pillar.word}</b>
                    <span>{pillar.line}</span>
                    <small>{product.name} →</small>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        </section>

        <section className={`${site.shell} ${styles.block}`} data-section="closing">
          <FadeIn className={styles.closing}>
            <Mendung tone="sky" />
            <h2>{t.closingTitle}</h2>
            <div className={styles.closingCtas}>
              <ButtonLink href={localeHref(locale, "/products")} variant="cream">{t.closingCta}</ButtonLink>
              <a className={buttonClass("lineLight")} href={whatsappUrl(whatsappGreeting(locale))} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={18} /> {t.chat}
              </a>
            </div>
          </FadeIn>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
