import Image from "next/image";
import Link from "next/link";

import { ButtonLink } from "@/components/site/button";
import site from "@/components/site/site.module.css";
import type { Locale } from "@/i18n/config";
import { localeHref } from "@/lib/site/copy";
import { homeCopy } from "@/lib/site/home-copy";

import styles from "./home.module.css";

/**
 * Full-bleed editorial hero: the photo runs edge to edge and a cream wash
 * carries the type on the left, in the voice of the original sheepiesleep.com hero.
 */
export function HomeHero({ locale }: { locale: Locale }) {
  const t = homeCopy[locale].hero;

  return (
    <section id="hero" className={styles.hero} data-section="hero">
      <Image src="/images/hero/home-hero.webp" alt={t.alt} fill preload fetchPriority="high" sizes="100vw" className={styles.heroImg} />
      <div className={styles.heroWash} aria-hidden="true" />
      <div className={`${site.shell} ${styles.heroIn}`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{t.eyebrow}</p>
          <h1>
            {t.title[0]}
            <em>{t.title[1]}</em>
          </h1>
          <p className={styles.heroSub}>
            {t.sub} <b>{t.subStrong}</b>
          </p>
          <div className={styles.ctas}>
            <ButtonLink href="#products" variant="ink">{t.explore}</ButtonLink>
            <Link className={styles.textLink} href={localeHref(locale, "/about")}>{t.story}</Link>
          </div>
        </div>
      </div>
      <a className={styles.scrollCue} href="#products" aria-label={t.scroll}>
        <span>{t.scroll}</span>
        <i aria-hidden="true" />
      </a>
    </section>
  );
}
