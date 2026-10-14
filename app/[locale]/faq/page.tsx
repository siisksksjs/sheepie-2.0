import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageIntro } from "@/components/pages/page-intro";
import styles from "@/components/pages/pages.module.css";
import { buttonClass } from "@/components/site/button";
import { FadeIn } from "@/components/site/fade-in";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import site from "@/components/site/site.module.css";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { isLocale } from "@/i18n/config";
import { pagesCopy } from "@/lib/site/pages-copy";
import { whatsappGreeting, whatsappUrl } from "@/lib/site/whatsapp";

/** Question keys per category, in display order (copy lives in messages: FAQs.<cat>.<key>.q/a). */
const GROUPS = [
  { id: "cervi", items: ["firmness", "adjustment", "cover"] },
  { id: "lumi", items: ["eyelashes", "strap", "washable"] },
  { id: "calmi", items: ["reusable", "sizes", "alarm"] },
  { id: "shipping", items: ["returns", "duration"] },
] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "FAQPage" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const t = pagesCopy[locale].faq;
  const page = await getTranslations({ locale, namespace: "FAQPage" });
  const faqs = await getTranslations({ locale, namespace: "FAQs" });

  return (
    <div className={site.page}>
      <SiteHeader locale={locale} />
      <main>
        <PageIntro eyebrow={t.eyebrow} title={t.title} intro={t.intro} />

        <section className={`${site.shell} ${styles.block}`} data-section="faq">
          <div className={styles.faqLayout}>
            <nav className={styles.faqNav} aria-label={page("categories")}>
              {GROUPS.map((group) => (
                <a key={group.id} href={`#faq-${group.id}`}>{page(`cats.${group.id}`)}</a>
              ))}
            </nav>

            <div>
              {GROUPS.map((group, gi) => (
                <FadeIn key={group.id} index={gi} className={styles.faqGroup}>
                  <h2 id={`faq-${group.id}`}>{page(`cats.${group.id}`)}</h2>
                  {group.items.map((item, i) => (
                    <details key={item} className={styles.qa} open={gi === 0 && i === 0}>
                      <summary>{faqs(`${group.id}.${item}.q`)}</summary>
                      <p>{faqs(`${group.id}.${item}.a`)}</p>
                    </details>
                  ))}
                </FadeIn>
              ))}
            </div>

            <aside className={`${styles.card} ${styles.cardWa} ${styles.faqAside}`}>
              <span className={styles.waMark}><WhatsAppIcon size={30} /></span>
              <div>
                <h2>{t.asideTitle}</h2>
                <p>{t.asideBody}</p>
              </div>
              <a className={buttonClass("cream")} href={whatsappUrl(whatsappGreeting(locale))} target="_blank" rel="noopener noreferrer" data-whatsapp="faq">
                <WhatsAppIcon size={18} /> {t.asideCta}
              </a>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
