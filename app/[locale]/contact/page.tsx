import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { PageIntro } from "@/components/pages/page-intro";
import styles from "@/components/pages/pages.module.css";
import { buttonClass, ButtonLink } from "@/components/site/button";
import { FadeIn } from "@/components/site/fade-in";
import { MarketplaceLogo } from "@/components/site/marketplace-logo";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import site from "@/components/site/site.module.css";
import { SocialIcon } from "@/components/site/social-icon";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { SHEEPIE_EMAIL } from "@/data/bio";
import { isLocale } from "@/i18n/config";
import { localeHref, storeLinks } from "@/lib/site/copy";
import { pagesCopy } from "@/lib/site/pages-copy";
import { whatsappGreeting, whatsappUrl } from "@/lib/site/whatsapp";
import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbLd, pageMetadata, pageSeo } from "@/lib/site/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata("contact", locale);
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const t = pagesCopy[locale].contact;

  return (
    <div className={site.page}>
      <SiteHeader locale={locale} />
      <main>
        <PageIntro eyebrow={t.eyebrow} title={t.title} intro={t.intro} />

        <section className={`${site.shell} ${styles.channels}`} data-section="channels">
          <div className={styles.contactGrid}>
            <FadeIn className={`${styles.card} ${styles.cardWa}`}>
              <span className={styles.waMark}><WhatsAppIcon size={30} /></span>
              <div>
                <h2>{t.waTitle}</h2>
                <p className={styles.waNumber}>0851-1718-6188</p>
                <p>{t.waBody}</p>
              </div>
              <div className={styles.btnRow}>
                <a className={buttonClass("cream")} href={whatsappUrl(whatsappGreeting(locale))} target="_blank" rel="noopener noreferrer" data-whatsapp="contact">
                  <WhatsAppIcon size={18} /> {t.waCta}
                </a>
              </div>
            </FadeIn>

            <FadeIn index={1} className={styles.card}>
              <h2>{t.ordersTitle}</h2>
              <p>{t.ordersBody}</p>
              <div className={styles.btnRow}>
                <a className={buttonClass("ink")} href={storeLinks.shopee} target="_blank" rel="noopener noreferrer">
                  <MarketplaceLogo marketplace="shopee" size={18} /> Shopee
                </a>
                <a className={buttonClass("line")} href={storeLinks.tokopedia} target="_blank" rel="noopener noreferrer">
                  <MarketplaceLogo marketplace="tokopedia" size={18} /> Tokopedia
                </a>
              </div>
            </FadeIn>

            <FadeIn index={2} className={styles.card}>
              <h2>{t.emailTitle}</h2>
              <p>{t.emailBody}</p>
              <a className={styles.textLink} href={`mailto:${SHEEPIE_EMAIL}`}>{SHEEPIE_EMAIL}</a>
              <h2 className={styles.cardSub}>{t.socialTitle}</h2>
              <div className={styles.socials}>
                <a href={storeLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><SocialIcon name="instagram" /></a>
                <a href={storeLinks.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok"><SocialIcon name="tiktok" /></a>
              </div>
            </FadeIn>
          </div>

          <FadeIn className={styles.faqNote}>
            <span>{t.faqLine}</span>
            <ButtonLink href={localeHref(locale, "/faq")} variant="line">{t.faqCta}</ButtonLink>
          </FadeIn>
        </section>
      </main>
      <JsonLd data={breadcrumbLd(locale, [[t.eyebrow, pageSeo("contact", locale).path]])} />
      <SiteFooter locale={locale} />
    </div>
  );
}
