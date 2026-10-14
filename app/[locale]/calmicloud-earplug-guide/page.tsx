import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import styles from "@/components/pages/pages.module.css";
import { buttonClass, ButtonLink } from "@/components/site/button";
import { FadeIn } from "@/components/site/fade-in";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import site from "@/components/site/site.module.css";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { isLocale } from "@/i18n/config";
import { productPath } from "@/lib/catalog";
import { guideCopy } from "@/lib/site/guide-copy";
import { whatsappGreeting, whatsappUrl } from "@/lib/site/whatsapp";
import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbLd, pageMetadata, pageSeo } from "@/lib/site/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata("guide", locale);
}

/** CalmiCloud instructions: the page the box insert's QR code opens. */
export default async function CalmiGuidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const t = guideCopy[locale];
  const chatHref = whatsappUrl(whatsappGreeting(locale, { name: "CalmiCloud Earplugs" }));

  return (
    <div className={site.page}>
      <SiteHeader locale={locale} />
      <main>
        <section className={`${site.shell} ${styles.intro}`} data-section="intro">
          <div className={styles.guideHead}>
            <div>
              <p className={styles.eyebrow}>{t.eyebrow}</p>
              <h1 className={styles.title}>
                {t.title[0]}
                <em>{t.title[1]}</em>
              </h1>
              <p className={styles.lede}>{t.intro}</p>
            </div>
            <div className={styles.guideImg}>
              <Image src="/images/edited/DSC01313.webp" alt="CalmiCloud Earplugs" fill preload fetchPriority="high" sizes="(max-width: 760px) 100vw, 40vw" className={styles.cover} />
            </div>
          </div>
          <dl className={styles.facts}>
            {t.facts.map(([term, value]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={`${site.shell} ${styles.block}`} data-section="wear">
          <FadeIn>
            <h2 className={styles.h2}>{t.wearTitle}</h2>
            <p className={styles.sectionLede}>{t.wearIntro}</p>
          </FadeIn>
          <ol className={styles.steps}>
            {t.steps.map((step, i) => (
              <FadeIn key={step.title} index={i}>
                <li className={styles.step}>
                  <span className={styles.stepImg}>
                    <Image src={`/images/guide/calmi-step-${i + 1}.webp`} alt="" fill sizes="(max-width: 760px) 45vw, 260px" className={styles.cover} />
                  </span>
                  <span className={styles.stepNo}>{i + 1}</span>
                  <b>{step.title}</b>
                  <span>{step.body}</span>
                </li>
              </FadeIn>
            ))}
          </ol>
          <FadeIn className={styles.callout}>
            <b>!</b>
            <span>{t.outer}</span>
          </FadeIn>
          <FadeIn className={styles.removeRow}>
            <h3>{t.removeTitle}</h3>
            <p>{t.remove}</p>
          </FadeIn>
        </section>

        <section className={`${site.shell} ${styles.block}`} data-section="care">
          <FadeIn><h2 className={styles.h2}>{t.careTitle}</h2></FadeIn>
          <ol className={styles.care}>
            {t.care.map((item, i) => (
              <FadeIn key={item.title} index={i}>
                <li>
                  <span className={styles.stepNo}>{i + 1}</span>
                  <b>{item.title}</b>
                  <span>{item.body}</span>
                </li>
              </FadeIn>
            ))}
          </ol>
          <p className={styles.note}>{t.replace}</p>
        </section>

        <section className={`${site.shell} ${styles.block}`} data-section="safety">
          <div className={styles.guideSplit}>
            <FadeIn className={styles.safety}>
              <h2>{t.safetyTitle}</h2>
              <ul>
                {t.safety.map((line) => <li key={line}>{line}</li>)}
              </ul>
            </FadeIn>
            <FadeIn index={1}>
              <h2 className={styles.h2Small}>{t.tipsTitle}</h2>
              {t.tips.map((tip, i) => (
                <details key={tip.q} className={styles.qa} open={i === 0}>
                  <summary>{tip.q}</summary>
                  <p>{tip.a}</p>
                </details>
              ))}
            </FadeIn>
          </div>
        </section>

        <section className={`${site.shell} ${styles.block}`} data-section="help">
          <FadeIn className={styles.faqNote}>
            <span>
              <b className={styles.emptyTitle}>{t.helpTitle}</b>
              {t.helpBody}
            </span>
            <span className={styles.btnRow}>
              <a className={buttonClass("ink")} href={chatHref} target="_blank" rel="noopener noreferrer" data-whatsapp="guide">
                <WhatsAppIcon size={18} /> {t.chat}
              </a>
              <ButtonLink href={productPath(locale, "calmicloud")} variant="line">{t.buy}</ButtonLink>
            </span>
          </FadeIn>
        </section>
      </main>
      <JsonLd data={breadcrumbLd(locale, [[t.eyebrow, pageSeo("guide", locale).path]])} />
      <SiteFooter locale={locale} />
    </div>
  );
}
